import React, { useEffect, useRef, useState } from 'react';
import { useCamera } from '../hooks/useCamera';
import { usePoseDetection } from '../hooks/usePoseDetection';
import CameraControls from './CameraControls';
import CameraDisplay from './CameraDisplay';
import KeypointDrawer from './KeypointsDrawer';
import WorkoutSelector from './WorkoutSelector';
import DeadliftTracker from '../workouts/conventionalDeadlifts/DeadliftTracker';

const Detector = () => {
  // Custom hooks
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    permissionStatus,
    requestCameraPermissions
  } = useCamera();

  const {
    poseDetector,
    isPoseDetectionActive,
    setIsPoseDetectionActive,
    isLoading,
    initializePoseDetection
  } = usePoseDetection();

  // State
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [currentPose, setCurrentPose] = useState(null);

  // Refs
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionRef = useRef(null);
  const keypointDrawerRef = useRef(null);

  // // Video constraints
  // const videoConstraints = {
  //   deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
  //   width: 640,
  //   height: 480,
  //   facingMode: "user"
  // };

  const handleCameraSwitch = (e) => {
    if (isPoseDetectionActive) {
      setIsPoseDetectionActive(false);
      if (detectionRef.current) {
        cancelAnimationFrame(detectionRef.current);
        detectionRef.current = null;
      }
    }
    setSelectedDeviceId(e.target.value);
  };

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
      // Clear the canvas when stopping
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      // Reset current pose
      setCurrentPose(null);
    }
  };

  const handleWorkoutSelect = (workoutId) => {
    setSelectedWorkout(workoutId);
    // Automatically start pose detection when workout is selected
    // if (!isPoseDetectionActive) {
    //   togglePoseDetection();
    // }
  };

  // Workout tracker component selector
  const WorkoutTracker = ({ pose }) => {
    if (!pose) return null;

    switch (selectedWorkout) {
      case 'deadlift':
        return <DeadliftTracker keypoints={pose.keypoints} />;
      // Add other workout cases here
      default:
        return null;
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
            
            // Update current pose state
            setCurrentPose(pose);
            
            // Initialize keypointDrawer if it doesn't exist
            if (!keypointDrawerRef.current) {
              keypointDrawerRef.current = new KeypointDrawer(ctx);
            }
            
            // Draw keypoints and skeleton
            keypointDrawerRef.current.drawKeypoints(pose.keypoints);
            keypointDrawerRef.current.drawSkeleton(pose.keypoints);
          } else {
            setCurrentPose(null);
          }
        } catch (error) {
          console.error('Error during pose detection:', error);
          setCurrentPose(null);
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
    return <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Requesting camera permission...</p>
    </div>;
  }

  if (permissionStatus === 'denied') {
    return <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Camera permission denied. Please grant permission and reload the page.</p>
    </div>;
  }

  if (!selectedWorkout) {
    return <WorkoutSelector onSelectWorkout={handleWorkoutSelect} />;
  }

  return (
    <div className="relative">
      {devices.length > 0 ? (
        <>
          <CameraControls
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            onCameraSwitch={handleCameraSwitch}
            onTogglePoseDetection={togglePoseDetection}
            isPoseDetectionActive={isPoseDetectionActive}
            isLoading={isLoading}
          />
          <CameraDisplay
            webcamRef={webcamRef}
            canvasRef={canvasRef}
            // videoConstraints={videoConstraints}
            selectedDeviceId={selectedDeviceId}
          />
          <WorkoutTracker pose={currentPose} />
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">No video devices found.</p>
        </div>
      )}
    </div>
  );
};

export default Detector;