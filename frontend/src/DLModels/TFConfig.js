export const TENSORFLOW_CONFIG = {
  // Preferred TensorFlow.js backends in order of priority
  preferredBackends: ['webgl', 'wasm', 'cpu'],

  // Pose detection model configuration
  poseDetection: {
    model: 'movenet',  // Can be 'movenet', 'posenet', or other supported models
    modelType: 'singlepose_lightning',  // Other option: 'singlepose_thunder'

    // Additional options for model loading and performance (optional)
    inputResolution: { width: 256, height: 256 },  // Resolution of input images (depends on the model type)
    scoreThreshold: 0.5  // Minimum confidence score for a pose to be considered valid
  },

  // Backend-specific options (optional)
  backendOptions: {
    webgl: {
      useFloatTextures: true,  // Improve performance on some devices
    },
    wasm: {
      batchSize: 1,  // Optimized batch size for inference
    },
    cpu: {
      enableMultithreading: true,  // Use multiple threads for better performance
    }
  }
};
