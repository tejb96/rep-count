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
        const permissionStatus = await navigator.permissions.query({ name: 'camera' });

        // Request permissions if not already granted
        if (permissionStatus.state !== 'granted') {
          await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
          });
        }

        // Get list of available video input devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const videoInputs = devices
            .filter(({ kind }) => kind === 'videoinput')
            .map(serializeDeviceInfo);

        console.log(videoInputs);

        return {
          status: 'granted',
          devices: videoInputs,
          selectedDeviceId: videoInputs.length > 0 ? videoInputs[0].deviceId : null
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