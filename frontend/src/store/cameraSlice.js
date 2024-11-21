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
      // Request camera permissions and get initial stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Clean up the stream after getting permissions
      stream.getTracks().forEach(track => track.stop());
      
      // Get list of available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices
        .filter(({ kind }) => kind === 'videoinput')
        .map(serializeDeviceInfo);
      
      return {
        status: 'granted',
        devices: videoInputs
      };
    } catch (error) {
      throw new Error('Camera permission denied');
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
        if (action.payload.devices.length > 0 && !state.selectedDeviceId) {
          state.selectedDeviceId = action.payload.devices[0].deviceId;
        }
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