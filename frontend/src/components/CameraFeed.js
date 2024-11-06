import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DeviceCamera from './DeviceCamera';
import { setupTensorFlowAndPoseDetection } from '../DLModels/PoseDetectionMain';

const CameraFeed = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('pending');
  const [poseDetector, setPoseDetector] = useState(null);

  const videoConstraints = useMemo(() => ({
    width: { ideal: Math.min(1920, window.screen.width * 0.9) },
    height: { ideal: Math.min(1080, window.screen.height * 0.5) },
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
  }), [selectedDeviceId]);

  const handleDevices = useCallback((mediaDevices) => {
    const videoInputs = mediaDevices.filter(({ kind }) => kind === "videoinput");
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

  useEffect(() => {
    const initializePoseDetection = async () => {
      try {
        const detector = await setupTensorFlowAndPoseDetection();
        setPoseDetector(detector);
      } catch (error) {
        console.error('Failed to initialize pose detection:', error);
      }
    };

    requestCameraPermissions();
    initializePoseDetection();

    const handleDeviceChange = () => {
      if (permissionStatus === 'granted') {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
      }
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [requestCameraPermissions, permissionStatus, handleDevices]);

  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
  };

  if (permissionStatus === 'pending') {
    return <p>Requesting camera permission...</p>;
  }

  if (permissionStatus === 'denied') {
    return <p>Camera permission denied. Please grant permission and reload the page.</p>;
  }

  return (
    <div className="camera-feed">
      {devices.length > 0 ? (
        <>
          <select
            onChange={handleDeviceChange}
            value={selectedDeviceId || ''}
            aria-label="Select camera"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
              </option>
            ))}
          </select>
          <div className="camera-display">
            <DeviceCamera
              key={selectedDeviceId}
              deviceId={selectedDeviceId}
              videoConstraints={videoConstraints}
              poseDetector={poseDetector}
            />
          </div>
        </>
      ) : (
        <p>No video input devices found</p>
      )}
    </div>
  );
};

export default CameraFeed;