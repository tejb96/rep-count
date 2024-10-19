import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-wasm';
import { TENSORFLOW_CONFIG } from './tf-config';

export const loadTensorFlowBackend = async () => {
  for (const backend of TENSORFLOW_CONFIG.preferredBackends) {
    try {
      await tf.setBackend(backend);
      await tf.ready();
      console.log(`Successfully loaded TensorFlow.js backend: ${backend}`);
      return;
    } catch (error) {
      console.warn(`Failed to load ${backend} backend:`, error);
    }
  }
  throw new Error('Unable to load any TensorFlow.js backend');
};
