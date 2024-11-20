// src/store/workoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const workoutSlice = createSlice({
  name: 'workout',
  initialState: {
    selectedWorkout: null,
    repCount: 0,
    poses: [],
    currentPose: null
  },
  reducers: {
    setSelectedWorkout: (state, action) => {
      state.selectedWorkout = action.payload;
    },
    updateRepCount: (state, action) => {
      state.repCount = action.payload;
    },
    updatePoses: (state, action) => {
      state.poses = action.payload;
    },
    setCurrentPose: (state, action) => {
      state.currentPose = action.payload;
    },
    resetRepCount: (state) => {
      state.repCount = 0;
    }
  }
});

export const {
  setSelectedWorkout,
  updateRepCount,
  resetRepCount,
  updatePoses,
  setCurrentPose
} = workoutSlice.actions;

export default workoutSlice.reducer;
