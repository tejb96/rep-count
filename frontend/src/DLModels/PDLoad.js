import * as poseDetection from '@tensorflow-models/pose-detection';
import { TENSORFLOW_CONFIG } from './TFConfig';

export const loadPoseDetectionModel = async () => {
  let model;
  let detectorConfig = {};

  switch (TENSORFLOW_CONFIG.poseDetection.model) {
    case 'movenet':
      model = poseDetection.SupportedModels.MoveNet;
      detectorConfig.modelType = 
        TENSORFLOW_CONFIG.poseDetection.modelType === 'singlepose_lightning' 
          ? poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
          : poseDetection.movenet.modelType.SINGLEPOSE_THUNDER;
      break;

    default:
      throw new Error(`Unsupported pose detection model: ${TENSORFLOW_CONFIG.poseDetection.model}`);
  }

  // Add optional configuration parameters
  if (TENSORFLOW_CONFIG.poseDetection.scoreThreshold) {
    detectorConfig.scoreThreshold = TENSORFLOW_CONFIG.poseDetection.scoreThreshold;
  }
  if (TENSORFLOW_CONFIG.poseDetection.inputResolution) {
    detectorConfig.inputResolution = TENSORFLOW_CONFIG.poseDetection.inputResolution;
  }

  try {
    const detector = await poseDetection.createDetector(model, detectorConfig);
    console.log(`Pose detection model (${TENSORFLOW_CONFIG.poseDetection.model}) loaded successfully`);
    return detector;
  } catch (error) {
    console.error(`Error loading pose detection model (${TENSORFLOW_CONFIG.poseDetection.model}):`, error);
    throw error;
  }
};