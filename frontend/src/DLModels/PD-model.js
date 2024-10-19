import * as poseDetection from '@tensorflow-models/pose-detection';
import { TENSORFLOW_CONFIG } from './tf-config';

export const loadPoseDetectionModel = async () => {
  let model, detectorConfig;

  switch (TENSORFLOW_CONFIG.poseDetection.model) {
    case 'movenet':
      model = poseDetection.SupportedModels.MoveNet;
      detectorConfig = {
        modelType: TENSORFLOW_CONFIG.poseDetection.modelType === 'singlepose_lightning' 
          ? poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
          : poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
      };
      break;
    // Add cases for other models (PoseNet, BlazePose) if needed
    default:
      throw new Error('Unsupported pose detection model');
  }
  
  try {
    const detector = await poseDetection.createDetector(model, detectorConfig);
    console.log('Pose detection model loaded successfully');
    return detector;
  } catch (error) {
    console.error('Error loading pose detection model:', error);
    throw error;
  }
};
