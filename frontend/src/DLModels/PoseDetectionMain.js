import { loadTensorFlowBackend } from './TFSetup';
import { loadPoseDetectionModel } from './PDLoad';

export const setupTensorFlowAndPoseDetection = async () => {
  try {
    await loadTensorFlowBackend();
    const poseDetector = await loadPoseDetectionModel();
    return poseDetector;
  } catch (error) {
    console.error('Error setting up TensorFlow and pose detection:', error);
    throw error;
  }
};
