import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRepCount } from '../../store/workoutSlice';

const SitUpTracker = () => {
  const dispatch = useDispatch();
  const keypoints = useSelector(state => state.keypoints);
  
  // Updated state management
  const [phase, setPhase] = useState('down'); // Start in down position
  const [lastValidAngle, setLastValidAngle] = useState(null);
  
  // More precise angle thresholds
  const UP_THRESHOLD = 120; // Angle when fully up
  const DOWN_THRESHOLD = 45; // Angle when down (laying on back)

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

    // Ensure all keypoints are present
    if (!leftShoulder || !leftHip || !leftKnee || 
        !rightShoulder || !rightHip || !rightKnee) return;

    const leftTorsoAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightTorsoAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    const torsoAngle = (leftTorsoAngle + rightTorsoAngle) / 2;

    // Prevent counting reps if the angle is not changing significantly
    if (lastValidAngle !== null && 
        Math.abs(torsoAngle - lastValidAngle) < 10) return;

    // New rep tracking logic
    if (phase === 'down' && torsoAngle >= UP_THRESHOLD) {
      // Moving from down to up
      setPhase('up');
      setLastValidAngle(torsoAngle);
    } else if (phase === 'up' && torsoAngle <= DOWN_THRESHOLD) {
      // Moving from up to down - count the rep
      setPhase('down');
      dispatch(updateRepCount(1));
      setLastValidAngle(torsoAngle);
    }
  };

  useEffect(() => {
    if (keypoints && keypoints.length > 0) {
      evaluate();
    }
  }, [keypoints]);

  return null; // No visual rendering
};

export default SitUpTracker;