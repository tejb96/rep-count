import React, { useState, useEffect } from 'react';

import { calculateAngle } from '../../utils/geometryUtils';
import { useDispatch, useSelector } from 'react-redux';
import { updateRepCount } from '../../store/workoutSlice';

const PushUpTracker = () => {
  const dispatch = useDispatch();
  const keypoints = useSelector((state) => state.pose.keypoints);
  const isPoseDetectionActive = useSelector((state) => state.pose.isPoseDetectionActive);
  const [phase, setPhase] = useState('up'); // Initial phase
  const repCount = useSelector((state) => state.workout.repCount);
  const ARM_THRESHOLD = 90; // Degrees for "low" position

  const getKeypoint = (name) => keypoints?.find(kp => kp.name === name);

  const CONFIDENCE_THRESHOLD = 0.5;

  const analyzePushUp = (keypoints) => {
    // Get keypoints for both sides since we're facing the camera
    const leftElbow = getKeypoint('left_elbow');
    const leftShoulder = getKeypoint('left_shoulder');
    const leftWrist = getKeypoint('left_wrist');
    const rightElbow = getKeypoint('right_elbow');
    const rightShoulder = getKeypoint('right_shoulder');
    const rightWrist = getKeypoint('right_wrist');

    // Check confidence thresholds
    const keypointsToCheck = [leftElbow, leftShoulder, leftWrist, rightElbow, rightShoulder, rightWrist];
    if (keypointsToCheck.some(kp => !kp || kp.score < CONFIDENCE_THRESHOLD)) return;

    // Calculate angles for both arms
    const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

    // Use the average of both arms for more accurate detection
    const armAngle = (leftArmAngle + rightArmAngle) / 2;

    // Phase-based state machine
    if (phase === 'up' && armAngle <= ARM_THRESHOLD) {
      setPhase('down');
    } else if (phase === 'down' && armAngle > ARM_THRESHOLD) {
      setPhase('up');
      dispatch(updateRepCount(repCount + 1));
    }
  };

  useEffect(() => {
    if (isPoseDetectionActive && keypoints?.length) {
      analyzePushUp(keypoints);
    }
  }, [keypoints, isPoseDetectionActive]);

  return (
    <div className="fixed top-2 right-4 z-10 w-80" />
  );
};

export default PushUpTracker;
