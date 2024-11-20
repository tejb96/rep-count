// src/hooks/useCamera.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestCameraPermissions, setSelectedDeviceId } from '../store/cameraSlice';


export const useCamera = () => {
  const dispatch = useDispatch();
  
  // Get camera state from Redux
  const { 
    devices, 
    selectedDeviceId, 
    permissionStatus 
  } = useSelector(state => state.camera);

  // Request camera permissions on initial mount if pending
  useEffect(() => {
    if (permissionStatus === 'pending') {
      dispatch(requestCameraPermissions());
    }
  }, [dispatch, permissionStatus]);

  // Return the same API as before, but now using Redux
  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId: (deviceId) => dispatch(setSelectedDeviceId(deviceId)),
    permissionStatus,
    // No need for handleDevices as it's handled in the thunk now
    requestCameraPermissions: () => dispatch(requestCameraPermissions())
  };
};
