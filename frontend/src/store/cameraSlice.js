// src/store/cameraSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const requestCameraPermissions = createAsyncThunk(
  'camera/requestPermissions',
  async () => {
    await navigator.mediaDevices.getUserMedia({ video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter(({ kind }) => kind === 'videoinput');
    return videoInputs;
  }
);

const cameraSlice = createSlice({
  name: 'camera',
  initialState: {
    devices: [],
    selectedDeviceId: null,
    permissionStatus: 'pending'
  },
  reducers: {
    setDevices: (state, action) => {
      state.devices = action.payload;
      if (action.payload.length > 0 && !state.selectedDeviceId) {
        state.selectedDeviceId = action.payload[0].deviceId;
      }
    },
    setSelectedDeviceId: (state, action) => {
      state.selectedDeviceId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestCameraPermissions.fulfilled, (state, action) => {
        state.permissionStatus = 'granted';
        state.devices = action.payload;
        if (action.payload.length > 0 && !state.selectedDeviceId) {
          state.selectedDeviceId = action.payload[0].deviceId;
        }
      })
      .addCase(requestCameraPermissions.rejected, (state) => {
        state.permissionStatus = 'denied';
      });
  }
});

export const { setDevices, setSelectedDeviceId } = cameraSlice.actions;
export default cameraSlice.reducer;
