import { useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateKeypoints as updateKeypointsAction, clearKeypoints } from '../store/keypointsSlice';
import { setupPoseDetection } from '../config/PoseDetectionTensorflow';

export const usePoseDetection = () => {
  const dispatch = useDispatch();
  const keypoints = useSelector(state => state.keypoints); // Direct access to keypoints from Redux store
  const [poseDetector, setPoseDetector] = useState(null);
  const [isPoseDetectionActive, setIsPoseDetectionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const isInitialized = useRef(false);

  const initializePoseDetection = useCallback(async () => {
    if (isInitialized.current && poseDetector) {
      return;
    }
    
    setIsLoading(true);
    try {
      const detector = await setupPoseDetection();
      setPoseDetector(detector);
      isInitialized.current = true;
      setError(null);
    } catch (error) {
      console.error('Failed to initialize pose detection:', error);
      setIsPoseDetectionActive(false);
      setPoseDetector(null);
      isInitialized.current = false;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [poseDetector]);

  const pauseDetection = useCallback(() => {
    setIsPoseDetectionActive(false);
    dispatch(clearKeypoints());
  }, [dispatch]);

  const resumeDetection = useCallback(async () => {
    if (!isInitialized.current) {
      await initializePoseDetection();
    }
    setIsPoseDetectionActive(true);
  }, [initializePoseDetection]);

  const cleanup = useCallback(() => {
    if (poseDetector) {
      poseDetector.dispose();
      setPoseDetector(null);
      dispatch(clearKeypoints());
      setError(null);
      isInitialized.current = false;
    }
  }, [poseDetector, dispatch]);

  const updateKeypoints = useCallback((newKeypoints) => {
    dispatch(updateKeypointsAction(newKeypoints));
  }, [dispatch]);

  return {
    poseDetector,
    isPoseDetectionActive,
    setIsPoseDetectionActive,
    isLoading,
    initializePoseDetection,
    pauseDetection,
    resumeDetection,
    cleanup,
    updateKeypoints,
    keypoints, // Expose keypoints from Redux store
    error
  };
};