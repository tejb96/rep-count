// src/store/cameraSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const serializeDeviceInfo = (device) => ({
  deviceId: device.deviceId,
  kind: device.kind,
  label: device.label,
  groupId: device.groupId
});

export const requestCameraPermissions = createAsyncThunk(
    'camera/requestPermissions',
    async () => {
      try {
        // Directly request camera access via getUserMedia
        // This will show the browser permission prompt if not previously denied
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        // Stop the stream immediately after getting permission
        stream.getTracks().forEach(track => track.stop());

        // Get list of available video input devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('Available devices:', devices);
        const videoInputs = devices
            .filter(({ kind }) => kind === 'videoinput')
            .map(serializeDeviceInfo);

        console.log('Video inputs:', videoInputs);

        return {
          status: 'granted',
          devices: videoInputs,
          selectedDeviceId: videoInputs.length > 0 ? videoInputs[0].deviceId : null
        };
      } catch (error) {
        console.error('Camera permission error:', error);
        // Distinguish between different error types
        if (error.name === 'NotAllowedError') {
          throw new Error('Camera permission denied by user');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No camera device found');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('getUserMedia not supported in this browser');
        } else if (error.name === 'SecurityError') {
          throw new Error('Camera access requires secure context (HTTPS)');
        }
        throw new Error(`Camera access failed: ${error.message}`);
      }
    }
);


export const updateAvailableDevices = createAsyncThunk(
  'camera/updateDevices',
  async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter(({ kind }) => kind === 'videoinput')
      .map(serializeDeviceInfo);
  }
);

const cameraSlice = createSlice({
  name: 'camera',
  initialState: {
    devices: [],
    selectedDeviceId: null,
    permissionStatus: 'pending',
    error: null,
    isLoading: false
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
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestCameraPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestCameraPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permissionStatus = action.payload.status;
        state.devices = action.payload.devices;
        state.selectedDeviceId = action.payload.selectedDeviceId;
      })
      .addCase(requestCameraPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.permissionStatus = 'denied';
      })
      .addCase(updateAvailableDevices.fulfilled, (state, action) => {
        state.devices = action.payload;
        if (action.payload.length > 0 && !state.selectedDeviceId) {
          state.selectedDeviceId = action.payload[0].deviceId;
        }
      });
  }
});

export const { setDevices, setSelectedDeviceId, setError, setLoading } = cameraSlice.actions;
export default cameraSlice.reducer;