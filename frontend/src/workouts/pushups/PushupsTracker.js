import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRepCount } from '../../store/workoutSlice';

const PushUpsTracker = () => {
  const dispatch = useDispatch();
  const keypoints = useSelector(state => state.keypoints);
  
  // Updated state management
  const [phase, setPhase] = useState('up'); // Start in up position
  
  const CONFIDENCE_THRESHOLD = 0.7;

  const getKeypoint = (name) => {
    const keypoint = keypoints?.find(kp => kp.name === name);
    return keypoint?.score >= CONFIDENCE_THRESHOLD ? keypoint : null;
  };
  

  const calculateAngle = (p1, p2, p3) => {
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const magnitude1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
    const magnitude2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
    const angle = Math.acos(dotProduct / (magnitude1 * magnitude2));
    return angle * 180 / Math.PI;
  };

  const isInUpPosition = (shoulder, elbow, wrist, ear) => {
    // Check if arm is almost straight (close to 180 degrees)
    const armAngle = calculateAngle(shoulder, elbow, wrist);
    
    // Check if ear is above elbow
    const earAboveElbow = ear.y < elbow.y;
    
    return armAngle > 160 && armAngle < 200 && earAboveElbow;
  };

  const isInDownPosition = (shoulder, elbow, wrist, ear) => {
    // Check proximity of shoulders and ears to wrists
    const shoulderToWristDistance = Math.sqrt(
      Math.pow(shoulder.x - wrist.x, 2) + Math.pow(shoulder.y - wrist.y, 2)
    );
    const earToWristDistance = Math.sqrt(
      Math.pow(ear.x - wrist.x, 2) + Math.pow(ear.y - wrist.y, 2)
    );
    
    // Check if shoulders and ears are very close to wrists
    return shoulderToWristDistance < 50 && earToWristDistance < 50;
  };

  const evaluate = () => {
    // Expanded keypoint detection for push-ups
    const leftShoulder = getKeypoint('left_shoulder');
    const leftElbow = getKeypoint('left_elbow');
    const leftWrist = getKeypoint('left_wrist');
    const leftEar = getKeypoint('left_ear');

    const rightShoulder = getKeypoint('right_shoulder');
    const rightElbow = getKeypoint('right_elbow');
    const rightWrist = getKeypoint('right_wrist');
    const rightEar = getKeypoint('right_ear');

    // Ensure all critical keypoints are present
    if (!leftShoulder || !leftElbow || !leftWrist || !leftEar ||
        !rightShoulder || !rightElbow || !rightWrist || !rightEar) return;

    // Check left and right sides
    const leftInUpPosition = isInUpPosition(leftShoulder, leftElbow, leftWrist, leftEar);
    const rightInUpPosition = isInUpPosition(rightShoulder, rightElbow, rightWrist, rightEar);
    
    const leftInDownPosition = isInDownPosition(leftShoulder, leftElbow, leftWrist, leftEar);
    const rightInDownPosition = isInDownPosition(rightShoulder, rightElbow, rightWrist, rightEar);

    // Ensure both sides are in the same position
    const inUpPosition = leftInUpPosition && rightInUpPosition;
    const inDownPosition = leftInDownPosition && rightInDownPosition;

    // Rep counting logic
    if (phase === 'up' && inDownPosition) {
      // Moving from up to down
      setPhase('down');
    } else if (phase === 'down' && inUpPosition) {
      // Moving from down to up - count the rep
      setPhase('up');
      dispatch(updateRepCount(1));
    }
  };

  useEffect(() => {
    if (keypoints && keypoints.length > 0) {
      evaluate();
    }
  }, [keypoints, phase, dispatch]);

  return null; // No visual rendering
};

export default PushUpsTracker;