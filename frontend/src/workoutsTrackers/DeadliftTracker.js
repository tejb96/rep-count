import { useEffect, useRef } from 'react';
import { getDistance } from '../utils/geometryUtils';

const DeadliftTracker = (keypoints, reps, setReps, phase, setPhase) => {
  const isTrackingStarted = useRef(false); // Track if lifter is in bottom position
  const lastHipY = useRef(null);
  const lastShoulderHipDistance = useRef(null);

  const MOVEMENT_THRESHOLD = 0.1; // Adjusted for better sensitivity
  const ALIGNMENT_THRESHOLD = 0.2; // Adjusted for better alignment detection
  const WRIST_ANKLE_DISTANCE_THRESHOLD = 0.3; // Threshold for wrists and ankles being close
  const CONFIDENCE_THRESHOLD = 0.6;

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

    // Calculate vertical alignment of shoulder, hip, knee, and ankle
    const shoulderHipDistance = Math.abs(shoulder.y - hip.y);
    const hipKneeDistance = Math.abs(hip.y - knee.y);
    const kneeAnkleDistance = Math.abs(knee.y - ankle.y);

    // Check if the lifter is in a proper lockout position
    const isLockedOut = shoulderHipDistance < ALIGNMENT_THRESHOLD && hipKneeDistance < ALIGNMENT_THRESHOLD && kneeAnkleDistance < ALIGNMENT_THRESHOLD;

    // Check symmetry (optional, if both sides are visible)
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderSymmetry = Math.abs(leftShoulder.y - rightShoulder.y) < ALIGNMENT_THRESHOLD;
      const hipSymmetry = Math.abs(leftHip.y - rightHip.y) < ALIGNMENT_THRESHOLD;
      if (!shoulderSymmetry || !hipSymmetry) return false;
    }

    return isLockedOut;
  };

  const checkBottomPhase = (keypoints) => {
    const leftWrist = getKeypoint('left_wrist');
    const leftAnkle = getKeypoint('left_ankle');
    const rightWrist = getKeypoint('right_wrist');
    const rightAnkle = getKeypoint('right_ankle');

    // Use the side with higher confidence
    const leftConfidence = (leftWrist?.score || 0) + (leftAnkle?.score || 0);
    const rightConfidence = (rightWrist?.score || 0) + (rightAnkle?.score || 0);

    const side = leftConfidence > rightConfidence ? 'left' : 'right';

    const wrist = getKeypoint(`${side}_wrist`);
    const ankle = getKeypoint(`${side}_ankle`);

    if (!wrist || !ankle) return false;

    // Check if wrists and ankles are close (bar is on the ground)
    const wristAnkleDistance = getDistance(wrist, ankle);
    return wristAnkleDistance < WRIST_ANKLE_DISTANCE_THRESHOLD;
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

    // Check if the lifter is in the bottom position for the first time
    if (!isTrackingStarted.current && checkBottomPhase(keypoints)) {
      isTrackingStarted.current = true; // Start tracking
      setPhase('bottom'); // Move to the bottom phase
      return;
    }

    // Only proceed with tracking if the lifter is confirmed to be in the bottom position
    if (!isTrackingStarted.current) return;

    if (phase === 'bottom' && deltaY < -MOVEMENT_THRESHOLD) {
      setPhase('lifting');
    } else if (phase === 'lifting' && checkDeadliftForm(keypoints)) {
      setPhase('lockout');
    } else if (phase === 'lockout' && deltaY > MOVEMENT_THRESHOLD) {
      setPhase('dropping');
    } else if (phase === 'dropping' && checkBottomPhase(keypoints)) {
      setPhase('bottom');
      setReps((prevReps) => prevReps + 1); // Increment rep count
    }
  }, [keypoints, phase, setPhase, setReps]);

  return null;
};

export default DeadliftTracker;