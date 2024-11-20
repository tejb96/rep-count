import React, { useState, useEffect } from 'react';

import { calculateAngle } from '../../utils/geometryUtils';
import { useDispatch, useSelector } from 'react-redux';
import { updateRepCount } from '../../store/workoutSlice';

const SitUpTracker = () => {
  const dispatch = useDispatch();
  const keypoints = useSelector((state) => state.pose.keypoints);
  const isPoseDetectionActive = useSelector((state) => state.pose.isPoseDetectionActive);
  const [phase, setPhase] = useState('up'); // Initial phase
  const repCount = useSelector((state) => state.workout.repCount);
  const TORSO_THRESHOLD = 45; // Degrees for "up" position

  const getKeypoint = (name) => keypoints?.find(kp => kp.name === name);

  const CONFIDENCE_THRESHOLD = 0.5;

  const analyzeSitUp = (keypoints) => {
    // Get keypoints for both sides since feet are facing the camera
    const leftHip = getKeypoint('left_hip');
    const leftShoulder = getKeypoint('left_shoulder');
    const leftKnee = getKeypoint('left_knee');
    const rightHip = getKeypoint('right_hip');
    const rightShoulder = getKeypoint('right_shoulder');
    const rightKnee = getKeypoint('right_knee');

    // Check confidence thresholds
    const keypointsToCheck = [leftHip, leftShoulder, leftKnee, rightHip, rightShoulder, rightKnee];
    if (keypointsToCheck.some(kp => !kp || kp.score < CONFIDENCE_THRESHOLD)) return;

    // Calculate angles for both sides of torso
    const leftTorsoAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightTorsoAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    // Use the average angle for more accurate detection
    const torsoAngle = (leftTorsoAngle + rightTorsoAngle) / 2;

    // Phase-based state machine
    if (phase === 'up' && torsoAngle <= TORSO_THRESHOLD) {
      setPhase('down');
    } else if (phase === 'down' && torsoAngle > TORSO_THRESHOLD) {
      setPhase('up');
      dispatch(updateRepCount(repCount + 1));
    }
  };

  useEffect(() => {
    if (isPoseDetectionActive && keypoints?.length) {
      analyzeSitUp(keypoints);
    }
  }, [keypoints, isPoseDetectionActive]);

  return (
    <div className="fixed top-2 right-4 z-10 w-80" />
  );
};

export default SitUpTracker;
