import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRepCount } from '../../store/workoutSlice';
import { getSlope, areLinesParallel } from '../../utils/geometryUtils';

const DeadliftTracker = () => {
  const dispatch = useDispatch();
  const keypoints = useSelector(state => state.keypoints);
  const [phase, setPhase] = useState('bottom');
  const lastHipY = useRef(null);
  
  const MOVEMENT_THRESHOLD = 0.15;
  const ALIGNMENT_THRESHOLD = 0.15;
  const CONFIDENCE_THRESHOLD = 0.5;

  const getKeypoint = (name) => {
    return keypoints?.find(kp => kp.name === name);
  };

  const checkFullLockout = (keypoints) => {
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

    const shoulder = getKeypoint(`${side}_shoulder`);
    const hip = getKeypoint(`${side}_hip`);
    const knee = getKeypoint(`${side}_knee`);
    const ankle = getKeypoint(`${side}_ankle`);

    if (!shoulder || !hip || !knee || !ankle || 
        shoulder.score < CONFIDENCE_THRESHOLD || 
        hip.score < CONFIDENCE_THRESHOLD ||
        knee.score < CONFIDENCE_THRESHOLD || 
        ankle.score < CONFIDENCE_THRESHOLD) {
      return false;
    }

    const isTorsoVertical = shoulder.y < hip.y;
    const backSlope = getSlope(shoulder, hip);
    const legSlope = getSlope(hip, knee);

    const isBackStraight = areLinesParallel(backSlope, legSlope, ALIGNMENT_THRESHOLD);
    return isTorsoVertical && isBackStraight;
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
    } else if (phase === 'lifting' && checkFullLockout(keypoints)) {
      setPhase('lockout');
      dispatch(updateRepCount());
    } else if (phase === 'lockout' && deltaY > MOVEMENT_THRESHOLD) {
      setPhase('bottom');
    }
  }, [keypoints, phase, dispatch]);

  return null;
};

export default DeadliftTracker;