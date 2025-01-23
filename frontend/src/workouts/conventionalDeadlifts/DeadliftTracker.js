import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRepCount, setPhaseWorkout } from '../../store/workoutSlice';
import { getSlope, areLinesParallel, calculateAngle } from '../../utils/geometryUtils';

const DeadliftTracker = () => {
  const dispatch = useDispatch();
  const keypoints = useSelector(state => state.keypoints);
  const [phase, setPhase] = useState('bottom');
  const lastHipY = useRef(null);
  const lastBackAngle = useRef(null);
  dispatch(setPhaseWorkout(phase));
  const MOVEMENT_THRESHOLD = 0.1; // Adjusted for better sensitivity
  const ALIGNMENT_THRESHOLD = 0.2; // Adjusted for better alignment detection
  const BACK_ANGLE_CHANGE_THRESHOLD = 15; // Degrees of back angle change

  const CONFIDENCE_THRESHOLD = 0.7;

  const getKeypoint = (name) => {
    const keypoint = keypoints?.find(kp => kp.name === name);
    return keypoint?.score >= CONFIDENCE_THRESHOLD ? keypoint : null;
  };

  const checkDeadliftForm = (keypoints) => {
    const leftShoulder = getKeypoint('left_shoulder');
    const leftHip = getKeypoint('left_hip');
    const leftKnee = getKeypoint('left_knee');
    const leftAnkle = getKeypoint('left_ankle');

    const rightShoulder = getKeypoint('right_shoulder');
    const rightHip = getKeypoint('right_hip');
    const rightKnee = getKeypoint('right_knee');
    const rightAnkle = getKeypoint('right_ankle');

    // Use the side with higher confidence
    const leftConfidence = (leftShoulder?.score || 0) + (leftHip?.score || 0) + (leftKnee?.score || 0) + (leftAnkle?.score || 0);
    const rightConfidence = (rightShoulder?.score || 0) + (rightHip?.score || 0) + (rightKnee?.score || 0) + (rightAnkle?.score || 0);

    const side = leftConfidence > rightConfidence ? 'left' : 'right';

    const shoulder = getKeypoint(`${side}_shoulder`);
    const hip = getKeypoint(`${side}_hip`);
    const knee = getKeypoint(`${side}_knee`);
    const ankle = getKeypoint(`${side}_ankle`);

    if (!shoulder || !hip || !knee || !ankle) return false;

    // Calculate back and leg angles
    const backSlope = getSlope(shoulder, hip);
    const legSlope = getSlope(hip, knee);
    const backAngle = calculateAngle(shoulder, hip, knee);

    // Check back alignment and straightness
    const isBackStraight = areLinesParallel(backSlope, legSlope, ALIGNMENT_THRESHOLD);
    const isProperBackAngle = backAngle >= 90 && backAngle <= 180;

    // Store back angle for tracking significant changes
    if (lastBackAngle.current === null) {
      lastBackAngle.current = backAngle;
    }

    const backAngleChange = Math.abs(backAngle - lastBackAngle.current);
    lastBackAngle.current = backAngle;

    return isBackStraight && isProperBackAngle && backAngleChange < BACK_ANGLE_CHANGE_THRESHOLD;
  };

  useEffect(() => {
    if (!keypoints?.length) return;

    const hip = getKeypoint('left_hip') || getKeypoint('right_hip');
    if (!hip || hip.score < CONFIDENCE_THRESHOLD) return;

    if (lastHipY.current === null) {
      lastHipY.current = hip.y;
      return;
    }

    const deltaY = hip.y - lastHipY.current;
    lastHipY.current = hip.y;

    if (phase === 'bottom' && deltaY < -MOVEMENT_THRESHOLD) {
      setPhase('lifting');
      dispatch(setPhaseWorkout(phase));
    } else if (phase === 'lifting' && checkDeadliftForm(keypoints)) {
      setPhase('lockout');
      dispatch(setPhaseWorkout(phase));
      dispatch(updateRepCount());
    } else if (phase === 'lockout' && deltaY > MOVEMENT_THRESHOLD) {
      setPhase('bottom');
      dispatch(setPhaseWorkout(phase));
    }
  }, [keypoints, phase, dispatch]);

  return null;
};

export default DeadliftTracker;