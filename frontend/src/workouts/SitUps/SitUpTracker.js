import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateRepCount } from './workoutSlice'; // Import the updateRepCount action
import { usePoseDetection } from './usePoseDetection'; // Import the usePoseDetection hook

const SitUpTracker = () => {
  const dispatch = useDispatch();
  const { keypoints } = usePoseDetection();
  console.log(keypoints);
  const [phase, setPhase] = useState('up'); // Initial phase
  const TORSO_THRESHOLD = 45; // Degrees for "up" position

  const getKeypoint = (name) => keypoints?.find(kp => kp.name === name);

  const calculateAngle = (p1, p2, p3) => {
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const magnitude1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
    const magnitude2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
    const angle = Math.acos(dotProduct / (magnitude1 * magnitude2));
    return angle * 180 / Math.PI;
  };

  const evaluate = () => {
    const leftShoulder = getKeypoint('left_shoulder');
    const leftHip = getKeypoint('left_hip');
    const leftKnee = getKeypoint('left_knee');
    const rightShoulder = getKeypoint('right_shoulder');
    const rightHip = getKeypoint('right_hip');
    const rightKnee = getKeypoint('right_knee');
    console.log(leftShoulder, leftHip, leftKnee, rightShoulder, rightHip, rightKnee,'yo');
    if (!leftShoulder || !leftHip || !leftKnee || !rightShoulder || !rightHip || !rightKnee) return;

    const leftTorsoAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightTorsoAngle = calculateAngle(rightShoulder, rightHip, rightKnee);

    const torsoAngle = (leftTorsoAngle + rightTorsoAngle) / 2;

    if (phase === 'up' && torsoAngle <= TORSO_THRESHOLD) {
      setPhase('down');
    } else if (phase === 'down' && torsoAngle > TORSO_THRESHOLD) {
      setPhase('up');
      dispatch(updateRepCount(1)); // Dispatch an action to update the rep count
    }
  };

  useEffect(() => {
    if (keypoints) {
      evaluate();
    }
  }, [keypoints]);

  return null; // Return null since this component doesn't render anything
};

export default SitUpTracker;
