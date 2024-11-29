import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRepCount } from '../../store/workoutSlice';
import { getSlope, areLinesParallel, calculateAngle } from '../../utils/geometryUtils';

const DeadliftTracker = () => {
  const dispatch = useDispatch();
  const keypoints = useSelector(state => state.keypoints);
  const [phase, setPhase] = useState('bottom');
  const lastHipY = useRef(null);
  const lastBackAngle = useRef(null);
  
  const MOVEMENT_THRESHOLD = 0.15;
  const ALIGNMENT_THRESHOLD = 0.15;
  const BACK_ANGLE_CHANGE_THRESHOLD = 20; // Degrees of back angle change

  const CONFIDENCE_THRESHOLD = 0.7;

  const getKeypoint = (name) => {
    const keypoint = keypoints?.find(kp => kp.name === name);
    return keypoint?.score >= CONFIDENCE_THRESHOLD ? keypoint : null;
  };
  const checkDeadliftForm = (keypoints) => {
    // Determine which side has higher confidence
    const leftConfidence = (
      (getKeypoint('left_shoulder')?.score || 0) +
      (getKeypoint('left_hip')?.score || 0) +
      (getKeypoint('left_knee')?.score || 0) +
      (getKeypoint('left_ankle')?.score || 0)
    );

    const rightConfidence = (
      (getKeypoint('right_shoulder')?.score || 0) +
      (getKeypoint('right_hip')?.score || 0) +
      (getKeypoint('right_knee')?.score || 0) +
      (getKeypoint('right_ankle')?.score || 0)
    );

    const side = leftConfidence > rightConfidence ? 'left' : 'right';

    // Get keypoints for the more confident side
    const shoulder = getKeypoint(`${side}_shoulder`);
    const hip = getKeypoint(`${side}_hip`);
    const knee = getKeypoint(`${side}_knee`);
    const ankle = getKeypoint(`${side}_ankle`);

    // Verify all keypoints are present and have sufficient confidence
    if (!shoulder || !hip || !knee || !ankle || 
        shoulder.score < CONFIDENCE_THRESHOLD || 
        hip.score < CONFIDENCE_THRESHOLD ||
        knee.score < CONFIDENCE_THRESHOLD || 
        ankle.score < CONFIDENCE_THRESHOLD) {
      return false;
    }

    // Calculate back and leg angles
    const backSlope = getSlope(shoulder, hip);
    const legSlope = getSlope(hip, knee);
    const backAngle = calculateAngle(shoulder, hip, knee);

    // Check back alignment and straightness
    const isBackStraight = areLinesParallel(backSlope, legSlope, ALIGNMENT_THRESHOLD);
    
    // Validate back angle range for proper deadlift form
    const isProperBackAngle = backAngle >= 90 && backAngle <= 180;

    // Store back angle for tracking significant changes
    if (lastBackAngle.current === null) {
      lastBackAngle.current = backAngle;
    }

    const backAngleChange = Math.abs(backAngle - lastBackAngle.current);
    lastBackAngle.current = backAngle;

    return isBackStraight && 
           isProperBackAngle && 
           backAngleChange < BACK_ANGLE_CHANGE_THRESHOLD;
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
      // Starting to lift
      setPhase('lifting');
    } else if (phase === 'lifting' && checkDeadliftForm(keypoints)) {
      // Reached full lockout with proper form
      setPhase('lockout');
      dispatch(updateRepCount());
    } else if (phase === 'lockout' && deltaY > MOVEMENT_THRESHOLD) {
      // Returning to starting position
      setPhase('bottom');
    }
  }, [keypoints, phase, dispatch]);

  return null;
};

export default DeadliftTracker;