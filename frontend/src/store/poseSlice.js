// src/store/poseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setupTensorFlowAndPoseDetection } from '../DLModels/PoseDetectionMain';

export const initializePoseDetection = createAsyncThunk(
  'pose/initialize',
  async (_, { getState }) => {
    const { pose } = getState();
    if (!pose.poseDetector) {
      const detector = await setupTensorFlowAndPoseDetection();
      return detector;
    }
    return pose.poseDetector;
  }
);

const poseSlice = createSlice({
  name: 'pose',
  initialState: {
    poseDetector: null,
    keypoints: [],
    isPoseDetectionActive: false,
    isLoading: false
  },
  reducers: {
    setPoseDetectionActive: (state, action) => {
      state.isPoseDetectionActive = action.payload;
    },
    updateKeypoints: (state, action) => {
      state.keypoints = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializePoseDetection.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializePoseDetection.fulfilled, (state, action) => {
        state.poseDetector = action.payload;
        state.isLoading = false;
      })
      .addCase(initializePoseDetection.rejected, (state) => {
        state.isLoading = false;
        state.isPoseDetectionActive = false;
      });
  }
});

export const { setPoseDetectionActive, updateKeypoints } = poseSlice.actions;
export default poseSlice.reducer;