import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-wasm';
import { TENSORFLOW_CONFIG } from './TFConfig';

export const loadTensorFlowBackend = async () => {
  const { preferredBackends } = TENSORFLOW_CONFIG;

  for (const backend of preferredBackends) {
    try {
      // Skip if the backend is already loaded
      if (tf.getBackend() === backend) {
        console.log(`TensorFlow.js backend already set to: ${backend}`);
        return;
      }

      // Attempt to set the backend and wait for it to be ready
      await tf.setBackend(backend);
      await tf.ready();

      console.log(`Successfully loaded TensorFlow.js backend: ${backend}`);
      return; // Exit if the backend is successfully set
    } catch (error) {
      console.warn(`Failed to load ${backend} backend:`, error.message || error);
    }
  }

  // If no backend was successfully loaded, throw an error
  throw new Error(`Unable to load any TensorFlow.js backend. Tried: ${preferredBackends.join(', ')}`);
};
