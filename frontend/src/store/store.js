// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import workoutReducer from './workoutSlice';
import cameraReducer from './cameraSlice';
import keypointsReducer from './keypointsSlice';
import authReducer from "./authSlice";


export const store = configureStore({
  reducer: {
    workout: workoutReducer,
    camera: cameraReducer,
    keypoints: keypointsReducer,
    auth: authReducer,

  }
});
