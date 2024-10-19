export const TENSORFLOW_CONFIG = {
  preferredBackends: ['webgl', 'wasm', 'cpu'],
  poseDetection: {
    model: 'movenet',
    modelType: 'singlepose_lightning'
  }
};
