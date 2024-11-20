import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import CameraDisplay from './CameraDisplay';
import WorkoutSelector from './WorkoutSelector';
import DeadliftTracker from '../workouts/conventionalDeadlifts/DeadliftTracker';
import PushUpTracker from '../workouts/pushups/PushupsTracker';
import SitUpTracker from '../workouts/SitUps/SitUpTracker';
import { useCamera } from '../hooks/useCamera';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { 
  setSelectedWorkout, 
  updatePoses, 
  setCurrentPose,
  resetRepCount 
} from '../store/workoutSlice';
import { setPoseDetectionActive } from '../store/poseSlice';
import KeypointDrawer from './KeypointsDrawer';

const Detector = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { devices, permissionStatus } = useSelector(state => state.camera);
  const { isPoseDetectionActive, poseDetector } = useSelector(state => state.pose);
  const { selectedWorkout, currentPose } = useSelector(state => state.workout);

  // Custom hooks (now using Redux internally)
  const { requestCameraPermissions } = useCamera();
  const { initializePoseDetection } = usePoseDetection();

  // Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionRef = useRef(null);
  const keypointDrawerRef = useRef(null);

  const togglePoseDetection = async () => {
    if (!isPoseDetectionActive) {
      await initializePoseDetection();
      dispatch(setPoseDetectionActive(true));
    } else {
      dispatch(setPoseDetectionActive(false));
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
        detectionRef.current = null;
      }
      // Clear the canvas when stopping
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      // Reset current pose and rep count
      dispatch(setCurrentPose(null));
      dispatch(resetRepCount());
    }
  };

  const handleWorkoutSelect = (workoutId, workoutName) => {
    dispatch(setSelectedWorkout({
      id: workoutId,
      name: workoutName
    }));
  };

  // Workout tracker component selector
  const WorkoutTracker = () => {
    switch (selectedWorkout?.id) {
      case 'deadlift':
        return <DeadliftTracker />;
      case 'PushUps':
        return <PushUpTracker />;
      case 'SitUps':
        return <SitUpTracker />;
      default:
        return null;
    }
  };

  const reselectWorkout = () => {
    dispatch(setSelectedWorkout(null));
    resetRepCount();
    if (isPoseDetectionActive) {
      dispatch(setPoseDetectionActive(false));
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

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        try {
          const poses = await poseDetector.estimatePoses(video);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          if (poses.length > 0) {
            const pose = poses[0];
            dispatch(setCurrentPose(pose));
            dispatch(updatePoses(poses));
            
            if (!keypointDrawerRef.current) {
              keypointDrawerRef.current = new KeypointDrawer(ctx);
            }
            
            keypointDrawerRef.current.drawKeypoints(pose.keypoints);
            keypointDrawerRef.current.drawSkeleton(pose.keypoints);
          } else {
            dispatch(setCurrentPose(null));
          }
        } catch (error) {
          console.error('Error during pose detection:', error);
          dispatch(setCurrentPose(null));
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
  }, [isPoseDetectionActive, poseDetector, dispatch]);

  // Handle device changes
  useEffect(() => {
    const handleDeviceChange = async () => {
      if (permissionStatus === 'granted') {
        await requestCameraPermissions();
      }
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    requestCameraPermissions();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [permissionStatus, requestCameraPermissions]);

  if (permissionStatus === 'pending') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Requesting camera permission...</p>
      </div>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Camera permission denied. Please grant permission and reload the page.</p>
      </div>
    );
  }

  if (!selectedWorkout) {
    return <WorkoutSelector onSelectWorkout={handleWorkoutSelect} />;
  }

  return (
    <Box sx={{ position: 'relative', p: 2, minHeight: '100vh', backgroundColor: 'black' }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ fontWeight: 'bold', mb: 3 }}
      >
        {selectedWorkout.name}
      </Typography>
      {devices.length > 0 ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CameraDisplay
              webcamRef={webcamRef}
              canvasRef={canvasRef}
              onTogglePoseDetection={togglePoseDetection}
              isPoseDetectionActive={isPoseDetectionActive}
              onBack={reselectWorkout}
              repCount={currentPose?.repCount || 0}
            />
          </Box>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <WorkoutTracker />
          </Box>
        </>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh' 
        }}>
          <Typography variant="h6" color="textSecondary">
            No video devices found.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Detector;
