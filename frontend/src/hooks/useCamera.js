import { useState, useCallback } from 'react';

export const useCamera = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('pending');

  const handleDevices = useCallback((mediaDevices) => {
    const videoInputs = mediaDevices.filter(({ kind }) => kind === 'videoinput');
    setDevices(videoInputs);
    if (videoInputs.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(videoInputs[0].deviceId);
    }
  }, [selectedDeviceId]);

  const requestCameraPermissions = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionStatus('granted');
      const devices = await navigator.mediaDevices.enumerateDevices();
      handleDevices(devices);
    } catch (error) {
      console.error('Permission denied or error accessing media devices:', error);
      setPermissionStatus('denied');
    }
  }, [handleDevices]);

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    permissionStatus,
    handleDevices,
    requestCameraPermissions
  };
};
