import React, { useState, useEffect, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { setupTensorFlowAndPoseDetection } from '../DLModels/PoseDetectionMain';
import KeypointDrawer from './KeypointsDrawer';

const Detector = () => {
  // State declarations
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('pending');
  const [poseDetector, setPoseDetector] = useState(null);
  const [isPoseDetectionActive, setIsPoseDetectionActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [formMessage, setFormMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keypointDrawer, setKeypointDrawer] = useState(null);
  
  // Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionRef = useRef(null); // To track detection loop

  // Video constraints with proper initialization
  const videoConstraints = {
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
    width: 640,  // Added fixed dimensions to ensure consistency
    height: 480,
    facingMode: "user"
  };

  // Handle available devices
  const handleDevices = useCallback((mediaDevices) => {
    const videoInputs = mediaDevices.filter(({ kind }) => kind === 'videoinput');
    setDevices(videoInputs);
    if (videoInputs.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(videoInputs[0].deviceId);
    }
  }, [selectedDeviceId]);

  // Request camera permissions
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

  // Initialize pose detection model
  const initializePoseDetection = useCallback(async () => {
    if (!poseDetector) {
      setIsLoading(true);
      try {
        const detector = await setupTensorFlowAndPoseDetection();
        setPoseDetector(detector);
      } catch (error) {
        console.error('Failed to initialize pose detection:', error);
        setIsPoseDetectionActive(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [poseDetector]);

  // Handle camera device changes
  useEffect(() => {
    const handleDeviceChange = async () => {
      if (permissionStatus === 'granted') {
        const devices = await navigator.mediaDevices.enumerateDevices();
        handleDevices(devices);
      }
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    requestCameraPermissions();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [permissionStatus, handleDevices, requestCameraPermissions]);

  // Handle pose detection toggle
  const togglePoseDetection = async () => {
    if (!isPoseDetectionActive) {
      await initializePoseDetection();
      setIsPoseDetectionActive(true);
    } else {
      setIsPoseDetectionActive(false);
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
        detectionRef.current = null;
      }
    }
  };

  // Main pose detection loop
  useEffect(() => {
    const detectPose = async () => {
      if (
        webcamRef.current?.video?.readyState === 4 &&
        poseDetector &&
        canvasRef.current
      ) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        try {
          const poses = await poseDetector.estimatePoses(video);
          
          // Clear previous frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (poses.length > 0) {
            const pose = poses[0];
            // Draw pose keypoints here if needed
            // You can add keypoint visualization logic here
            if (!keypointDrawer) {
              setKeypointDrawer(new KeypointDrawer(ctx));
            }
            // Use KeypointDrawer to draw the keypoints and skeleton
            keypointDrawer.drawKeypoints(pose.keypoints);
            keypointDrawer.drawSkeleton(pose.keypoints);
          }
        } catch (error) {
          console.error('Error during pose detection:', error);
        }
      }
    };

    const runDetection = async () => {
      if (isPoseDetectionActive && poseDetector) {
        await detectPose();
        detectionRef.current = requestAnimationFrame(runDetection);
      }
    };

    if (isPoseDetectionActive && poseDetector) {
      runDetection();
    }

    return () => {
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
        detectionRef.current = null;
      }
    };
  }, [isPoseDetectionActive, poseDetector]);

  // Handle camera switch
  const handleCameraSwitch = (e) => {
    // Stop current detection if active
    if (isPoseDetectionActive) {
      setIsPoseDetectionActive(false);
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
        detectionRef.current = null;
      }
    }
    setSelectedDeviceId(e.target.value);
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
          <div className="controls flex gap-4 mb-4">
            <select
              onChange={handleCameraSwitch}
              value={selectedDeviceId || ''}
              aria-label="Select camera"
              className="p-2 border rounded"
              disabled={isPoseDetectionActive}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
            <button
              onClick={togglePoseDetection}
              disabled={isLoading}
              className={`px-4 py-2 rounded ${
                isPoseDetectionActive
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Loading...' : isPoseDetectionActive ? 'Stop Pose Detection' : 'Start Pose Detection'}
            </button>
          </div>
          <div className="camera-display" style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <Webcam
              key={selectedDeviceId}
              audio={false}
              ref={webcamRef}
              videoConstraints={videoConstraints}
              style={{
                position: 'absolute',
                zIndex: 1,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              aria-label={`Camera feed ${selectedDeviceId ? selectedDeviceId.slice(0, 5) : ''}`}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                zIndex: 2,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </>
      ) : (
        <p>No video devices found.</p>
      )}
    </div>
  );
};

export default Detector;