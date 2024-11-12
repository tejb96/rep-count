import { useState, useCallback } from 'react';
import { setupTensorFlowAndPoseDetection } from '../DLModels/PoseDetectionMain';

export const usePoseDetection = () => {
  const [poseDetector, setPoseDetector] = useState(null);
  const [isPoseDetectionActive, setIsPoseDetectionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initializePoseDetection = useCallback(async () => {
    if (!poseDetector) {
      setIsLoading(true);
      try {
        const detector = await setupTensorFlowAndPoseDetection();
        setPoseDetector(detector);
      } catch (error) {
        console.error('Failed to initialize pose detection:', error);
        setIsPoseDetectionActive(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [poseDetector]);

  return {
    poseDetector,
    isPoseDetectionActive,
    setIsPoseDetectionActive,
    isLoading,
    initializePoseDetection
  };
};
