// Import required TensorFlow.js packages
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-wasm';
import * as poseDetection from '@tensorflow-models/pose-detection';

// Configuration object for TensorFlow.js and pose detection
const TENSORFLOW_CONFIG = {
  // Preferred TensorFlow.js backends in order of priority
  preferredBackends: ['webgl', 'wasm', 'cpu'],

  // Pose detection model configuration
  poseDetection: {
    model: 'movenet',
    modelType: 'singlepose_lightning',  // Alternative: 'singlepose_thunder'
    inputResolution: { width: 256, height: 256 },
    scoreThreshold: 0.5
  },

  // Backend-specific options
  backendOptions: {
    webgl: { useFloatTextures: true },
    wasm: { batchSize: 1 },
    cpu: { enableMultithreading: true }
  }
};

/**
 * Attempts to load and initialize a TensorFlow.js backend from the preferred list
 * @throws {Error} If no backend could be loaded
 */
const loadTensorFlowBackend = async () => {
  const { preferredBackends } = TENSORFLOW_CONFIG;

  for (const backend of preferredBackends) {
    try {
      // Skip if the backend is already loaded
      if (tf.getBackend() === backend) {
        console.log(`TensorFlow.js backend already set to: ${backend}`);
        return;
      }

      // Set up and initialize the backend
      await tf.setBackend(backend);
      await tf.ready();
      console.log(`Successfully loaded TensorFlow.js backend: ${backend}`);
      return;
    } catch (error) {
      console.warn(`Failed to load ${backend} backend:`, error.message || error);
    }
  }

  throw new Error(`Unable to load any TensorFlow.js backend. Tried: ${preferredBackends.join(', ')}`);
};

/**
 * Creates and configures the pose detection model
 * @returns {Promise<poseDetection.PoseDetector>} The configured pose detector
 * @throws {Error} If the model cannot be loaded or is unsupported
 */
const loadPoseDetectionModel = async () => {
  const { poseDetection: config } = TENSORFLOW_CONFIG;
  let model;
  let detectorConfig = {};

  switch (config.model) {
    case 'movenet':
      model = poseDetection.SupportedModels.MoveNet;
      detectorConfig.modelType = 
        config.modelType === 'singlepose_lightning'
          ? poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
          : poseDetection.movenet.modelType.SINGLEPOSE_THUNDER;
      break;

    default:
      throw new Error(`Unsupported pose detection model: ${config.model}`);
  }

  // Add optional configuration parameters
  if (config.scoreThreshold) {
    detectorConfig.scoreThreshold = config.scoreThreshold;
  }
  if (config.inputResolution) {
    detectorConfig.inputResolution = config.inputResolution;
  }

  try {
    const detector = await poseDetection.createDetector(model, detectorConfig);
    console.log(`Pose detection model (${config.model}) loaded successfully`);
    return detector;
  } catch (error) {
    console.error(`Error loading pose detection model (${config.model}):`, error);
    throw error;
  }
};

/**
 * Main setup function that initializes TensorFlow.js and loads the pose detection model
 * @returns {Promise<poseDetection.PoseDetector>} The configured pose detector
 * @throws {Error} If setup fails
 */
export const setupPoseDetection = async () => {
  try {
    await loadTensorFlowBackend();
    const poseDetector = await loadPoseDetectionModel();
    return poseDetector;
  } catch (error) {
    console.error('Error setting up TensorFlow and pose detection:', error);
    throw error;
  }
};

// Example usage:
// const detector = await setupPoseDetection();
// const poses = await detector.estimatePoses(imageElement);