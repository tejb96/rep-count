// src/hooks/usePoseDetection.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  initializePoseDetection, 
  setPoseDetectionActive 
} from '../store/poseSlice';

export const usePoseDetection = () => {
  const dispatch = useDispatch();
  
  // Get pose detection state from Redux
  const { 
    poseDetector, 
    isPoseDetectionActive, 
    isLoading 
  } = useSelector(state => state.pose);

  const initializePoseDetectionHandler = useCallback(async () => {
    await dispatch(initializePoseDetection());
  }, [dispatch]);

  // Return the same API as before, but now using Redux
  return {
    poseDetector,
    isPoseDetectionActive,
    setIsPoseDetectionActive: (active) => dispatch(setPoseDetectionActive(active)),
    isLoading,
    initializePoseDetection: initializePoseDetectionHandler
  };
};
