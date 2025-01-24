import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, FormControl, Select, MenuItem, Typography } from '@mui/material';
import Webcam from 'react-webcam';
import { resetRepCount, resetSelectedWorkout } from '../store/workoutSlice';
import { requestCameraPermissions, setSelectedDeviceId, updateAvailableDevices } from '../store/cameraSlice';
import KeypointDrawer from '../components/KeypointsDrawer';
import { useNavigate } from 'react-router-dom';
import Tracker from '../components/Tracker';
import { setupPoseDetection } from '../config/PoseDetectionTensorflow';
import DeadliftTracker from '../workoutsTrackers/DeadliftTracker';
import SitUpTracker from "../workoutsTrackers/SitUpTracker";
import PushUpsTracker from "../workoutsTrackers/PushupsTracker";


const Detector = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state (only for camera and auth)
  const { devices, permissionStatus, error: cameraError, selectedDeviceId } =
      useSelector((state) => state.camera);
  const { selectedWorkoutName } = useSelector((state) => state.workout);

  // console.log(useSelector((state)=>state.camera));

  // Local state for pose detection and rep counting
  const [poseDetector, setPoseDetector] = useState(null);
  const [isPoseDetectionActive, setIsPoseDetectionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keypoints, setKeypoints] = useState([]); // Local state for keypoints
  const [reps, setReps] = useState(0); // Local state for rep count
  const [phase, setPhase] = useState(''); // Local state for workout phase

  // Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionRef = useRef(null);
  const keypointDrawerRef = useRef(null);
  const isInitialized = useRef(false);

  // Initialize pose detection
  const initializePoseDetection = useCallback(async () => {
    if (isInitialized.current && poseDetector) {
      return;
    }

    setIsLoading(true);
    try {
      const detector = await setupPoseDetection();
      setPoseDetector(detector);
      isInitialized.current = true;
      setError(null);
    } catch (error) {
      console.error('Failed to initialize pose detection:', error);
      setIsPoseDetectionActive(false);
      setPoseDetector(null);
      isInitialized.current = false;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [poseDetector]);

  // Pause pose detection
  const pauseDetection = useCallback(() => {
    setIsPoseDetectionActive(false);
    setKeypoints([]); // Clear keypoints on pause
  }, []);

  // Resume pose detection
  const resumeDetection = useCallback(async () => {
    if (!isInitialized.current) {
      await initializePoseDetection();
    }
    setIsPoseDetectionActive(true);
  }, [initializePoseDetection]);

  // Cleanup pose detection
  const cleanup = useCallback(() => {
    if (poseDetector) {
      poseDetector.dispose();
      setPoseDetector(null);
      setKeypoints([]); // Clear keypoints on cleanup
      setError(null);
      isInitialized.current = false;
    }
  }, [poseDetector]);

  // Update keypoints
  const updateKeypoints = useCallback((newKeypoints) => {
    setKeypoints(newKeypoints); // Update local keypoints state
  }, []);

  // Handle rep counting based on workout type
  useEffect(() => {
    if (!isPoseDetectionActive || !keypoints.length) return;

    switch (selectedWorkoutName) {
      case 'situp':
        SitUpTracker(keypoints, reps, setReps, phase, setPhase);
        break;
      case 'pushup':
        PushUpsTracker(keypoints, reps, setReps, phase, setPhase);
        break;
      case 'deadlift':
        DeadliftTracker(keypoints, reps, setReps, phase, setPhase);
        break;
      default:
        return;
    }
  }, [keypoints, isPoseDetectionActive, selectedWorkoutName, reps, setReps, phase, setPhase]);

  // Memoize handleDeviceChange to prevent unnecessary recreations
  const handleDeviceChange = useCallback(async () => {
    dispatch(updateAvailableDevices()); // Use the thunk to update devices
  }, [dispatch]);

  // Initialize camera on mount
  useEffect(() => {
    if (permissionStatus !== 'granted') {
      dispatch(requestCameraPermissions());
    }
  }, [dispatch, permissionStatus]);

  // Handle device changes
  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [handleDeviceChange]); // Add handleDeviceChange as a dependency

  // Handle camera switch
  const handleCameraSwitch = async (event) => {
    try {
      const newDeviceId = event.target.value;

      // If pose detection is active, pause it before switching
      if (isPoseDetectionActive) {
        pauseDetection();
        if (detectionRef.current) {
          cancelAnimationFrame(detectionRef.current);
          detectionRef.current = null;
        }
      }

      // Switch camera device
      dispatch(setSelectedDeviceId(newDeviceId)); // Use the action to set the selected device

      // Wait for video element to update with new device
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Cleanup and reinitialize with new camera
      cleanup(); // Need to reinitialize with new camera
      await resumeDetection();

      // Restart pose detection if it was active
      if (isPoseDetectionActive) {
        await resumeDetection();
      }
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  // Toggle pose detection
  const togglePoseDetection = async () => {
    try {
      if (!isPoseDetectionActive) {
        // Ensure camera permissions are granted
        if (permissionStatus !== 'granted') {
          dispatch(requestCameraPermissions());
          return;
        }

        // Ensure the camera stream is ready
        if (!webcamRef.current?.video?.srcObject) {
          console.error('Camera stream is not available.');
          return;
        }

        // Start or resume pose detection
        await resumeDetection();
      } else {
        // Pause pose detection
        pauseDetection();
        if (detectionRef.current) {
          cancelAnimationFrame(detectionRef.current);
          detectionRef.current = null;
        }
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    } catch (error) {
      console.error('Error toggling pose detection:', error);
      pauseDetection();
    }
  };

  // Reselect workout
  const reselectWorkout = () => {
    dispatch(resetSelectedWorkout());
    dispatch(resetRepCount());
    if (isPoseDetectionActive) {
      pauseDetection();
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
        detectionRef.current = null;
      }
    }
    navigate('/workouts');
  };

  // Main pose detection loop
  useEffect(() => {
    const detectPose = async () => {
      if (
          webcamRef.current?.video?.readyState === 4 &&
          poseDetector &&
          canvasRef.current &&
          isPoseDetectionActive
      ) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        try {
          const poses = await poseDetector.estimatePoses(video);
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (poses.length > 0) {
            const pose = poses[0];
            updateKeypoints(pose.keypoints);
            if (!keypointDrawerRef.current) {
              keypointDrawerRef.current = new KeypointDrawer(ctx);
            }

            keypointDrawerRef.current.drawKeypoints(pose.keypoints);
            keypointDrawerRef.current.drawSkeleton(pose.keypoints);
          }
        } catch (error) {
          console.error('Error during pose detection:', error);
          setIsPoseDetectionActive(false);
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
  }, [isPoseDetectionActive, poseDetector, updateKeypoints]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
        detectionRef.current = null;
      }
      cleanup();
    };
  }, [cleanup]);

  // Error state
  if (error || cameraError) {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
          <Typography variant="h6" color="error">
            {error || cameraError}
          </Typography>
        </Box>
    );
  }

  // Permission states
  if (permissionStatus === 'pending') {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
          <Typography variant="h6">Requesting camera permission...</Typography>
        </Box>
    );
  }

  if (permissionStatus === 'denied') {
    return (
        <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
          <Typography variant="h6">
            Camera permission denied. Please grant permission and reload the page.
          </Typography>
        </Box>
    );
  }

  return (
      <Box sx={{ position: 'relative', p: 2, minHeight: '100vh', backgroundColor: 'black' }}>
        {devices.length > 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1000px',
                    height: { xs: '480px', sm: '600px', md: '720px' },
                    margin: '0 auto',
                    aspectRatio: '4/3',
                  }}
              >
                {/* Camera Feed */}
                <Webcam
                    ref={webcamRef}
                    videoConstraints={{
                      deviceId: selectedDeviceId,
                      aspectRatio: 4 / 3,
                      facingMode: 'user',
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                />
                <Tracker isModelOn={isPoseDetectionActive} />
                {/* Pose Detection Canvas */}
                <canvas
                    ref={canvasRef}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 2,
                    }}
                />

                {/* Controls Overlay */}
                <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      padding: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                      zIndex: 3,
                    }}
                >
                  {/* Camera Selection Dropdown */}
                  <FormControl
                      size="small"
                      sx={{
                        width: '150px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 1,
                      }}
                  >
                    <Select
                        value={selectedDeviceId || ''}
                        onChange={handleCameraSwitch}
                        disabled={isPoseDetectionActive}
                        sx={{
                          color: 'white',
                          '.MuiSelect-icon': { color: 'white' },
                        }}
                    >
                      {devices.map((device) => (
                          <MenuItem key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Display Selected Workout Name */}
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {selectedWorkoutName}
                  </Typography>

                  {/* Control Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        onClick={togglePoseDetection}
                        disabled={isLoading}
                        color={isPoseDetectionActive ? 'error' : 'success'}
                        size="small"
                    >
                      {isLoading ? 'Loading...' : isPoseDetectionActive ? 'Stop' : 'Start'}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={reselectWorkout}
                        color="primary"
                        size="small"
                    >
                      Back
                    </Button>
                  </Box>
                </Box>

                {/* Rep Counter Overlay */}
                <Box
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      zIndex: 3,
                    }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Reps: {reps}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Phase: {phase}
                  </Typography>
                </Box>
              </Box>
            </Box>
        ) : (
            <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100vh',
                }}
            >
              <Typography variant="h6" color="textSecondary">
                No video devices found.
              </Typography>
            </Box>
        )}
      </Box>
  );
};

export default Detector;