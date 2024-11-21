import { useState, useCallback, useRef } from 'react';
import { setupPoseDetection } from '../utils/PoseDetectionTensorflow';

export const usePoseDetection = () => {
  const [poseDetector, setPoseDetector] = useState(null);
  const [isPoseDetectionActive, setIsPoseDetectionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keypoints, setKeypoints] = useState([]);
  const [error, setError] = useState(null);
  
  // Use ref to track initialization state to avoid unnecessary reinits
  const isInitialized = useRef(false);

  const initializePoseDetection = useCallback(async () => {
    // If already initialized, just return
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
    setKeypoints([]);
  }, []);

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
      setKeypoints([]);
      setError(null);
      isInitialized.current = false;
    }
  }, [poseDetector]);

  const updateKeypoints = useCallback((newKeypoints) => {
    setKeypoints(newKeypoints);
  }, []);

  return {
    poseDetector,
    isPoseDetectionActive,
    setIsPoseDetectionActive,
    isLoading,
    initializePoseDetection,
    pauseDetection,
    resumeDetection,
    keypoints,
    updateKeypoints,
    error,
    setError,
    cleanup
  };
};