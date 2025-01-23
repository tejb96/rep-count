import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRepCount, setPhaseWorkout } from '../../store/workoutSlice';

const PushUpsTracker = () => {
  const dispatch = useDispatch();
  const keypoints = useSelector(state => state.keypoints);
  const [phase, setPhase] = useState('up');
  dispatch(setPhaseWorkout(phase));

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

  const isInUpPosition = (shoulder, elbow, wrist) => {
    const armAngle = calculateAngle(shoulder, elbow, wrist);
    return armAngle > 160 && armAngle < 200;
  };

  const isInDownPosition = (shoulder, wrist) => {
    const shoulderToWristDistance = Math.sqrt(
        Math.pow(shoulder.x - wrist.x, 2) + Math.pow(shoulder.y - wrist.y, 2)
    );
    return shoulderToWristDistance < 50;
  };

  const evaluate = () => {
    const leftShoulder = getKeypoint('left_shoulder');
    const leftElbow = getKeypoint('left_elbow');
    const leftWrist = getKeypoint('left_wrist');

    const rightShoulder = getKeypoint('right_shoulder');
    const rightElbow = getKeypoint('right_elbow');
    const rightWrist = getKeypoint('right_wrist');

    if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) return;

    const leftInUpPosition = isInUpPosition(leftShoulder, leftElbow, leftWrist);
    const rightInUpPosition = isInUpPosition(rightShoulder, rightElbow, rightWrist);

    const leftInDownPosition = isInDownPosition(leftShoulder, leftWrist);
    const rightInDownPosition = isInDownPosition(rightShoulder, rightWrist);

    const inUpPosition = leftInUpPosition && rightInUpPosition;
    const inDownPosition = leftInDownPosition && rightInDownPosition;

    if (phase === 'up' && inDownPosition) {
      setPhase('down');
      dispatch(setPhaseWorkout(phase));
    } else if (phase === 'down' && inUpPosition) {
      setPhase('up');
      dispatch(setPhaseWorkout(phase));
      dispatch(updateRepCount(1));
    }
  };

  useEffect(() => {
    if (keypoints && keypoints.length > 0) {
      evaluate();
    }
  }, [keypoints, phase, dispatch]);

  return null;
};

export default PushUpsTracker;