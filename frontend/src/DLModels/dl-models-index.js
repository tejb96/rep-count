import { loadTensorFlowBackend } from './tf-setup';
import { loadPoseDetectionModel } from './PD-model';

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
