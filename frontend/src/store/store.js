// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import workoutReducer from './workoutSlice';
import cameraReducer from './cameraSlice';
import poseReducer from './poseSlice';

export const store = configureStore({
  reducer: {
    workout: workoutReducer,
    camera: cameraReducer,
    pose: poseReducer
  }
});
