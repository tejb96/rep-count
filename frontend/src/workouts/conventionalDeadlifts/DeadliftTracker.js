import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import { getSlope, areLinesParallel } from '../../utils/geometryUtils';

const DeadliftTracker = ({ keypoints }) => {
  const [repCount, setRepCount] = useState(0);
  const [phase, setPhase] = useState('bottom');
  const lastHipY = useRef(null);
  
  const MOVEMENT_THRESHOLD = 0.15;
  const ALIGNMENT_THRESHOLD = 0.15; // How straight the lines should be (lower = straighter)

  const getKeypoint = (name) => {
    return keypoints?.find(kp => kp.name === name);
  };

  const checkFullLockout = (keypoints) => {
    // Check both sides and use the one with better visibility
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

    if (!shoulder || !hip || !knee || !ankle) {
      return false;
    }

    // Check if torso is vertical
    const isTorsoVertical = shoulder.y < hip.y;

    // Check if back is straight by comparing slopes
    const backSlope = getSlope(shoulder, hip);
    const legSlope = getSlope(hip, knee);
    const lowerLegSlope = getSlope(knee, ankle);

    // For proper lockout:
    // 1. Back should be nearly vertical (close to infinite slope)
    // 2. Leg segments should be nearly vertical too (all slopes should be similar)
    const isBackStraight = Math.abs(backSlope) > 5; // Near vertical
    const areLegsStraight = areLinesParallel(legSlope, lowerLegSlope);

    return isTorsoVertical && isBackStraight && areLegsStraight;
  };

  const analyzeDeadlift = (keypoints) => {
    if (!keypoints?.length) return;

    // Determine which side is more visible
    const leftHip = getKeypoint('left_hip');
    const rightHip = getKeypoint('right_hip');
    
    const hip = leftHip?.score > (rightHip?.score || 0) ? leftHip : rightHip;

    if (!hip) return;

    if (lastHipY.current === null) {
      lastHipY.current = hip.y;
      return;
    }

    const movement = hip.y - lastHipY.current;
    lastHipY.current = hip.y;

    // Check if in full lockout position
    const isLockedOut = checkFullLockout(keypoints);

    // Rep counting state machine
    if (Math.abs(movement) > MOVEMENT_THRESHOLD) {
      switch (phase) {
        case 'bottom':
          if (movement < -MOVEMENT_THRESHOLD) {
            // Moving up from bottom
            setPhase('lifting');
          }
          break;
          
        case 'lifting':
          if (isLockedOut) {
            // Reached proper lockout position
            setPhase('lockout');
          }
          break;
          
        case 'lockout':
          if (movement > MOVEMENT_THRESHOLD) {
            // Starting descent
            setPhase('descending');
          }
          break;
          
        case 'descending':
          if (movement < MOVEMENT_THRESHOLD) {
            // Back to bottom, count the rep
            setPhase('bottom');
            setRepCount(prev => prev + 1);
          }
          break;
      }
    }
  };

  useEffect(() => {
    if (keypoints?.length) {
      analyzeDeadlift(keypoints);
    }
  }, [keypoints]);

  return (
    <div className="fixed top-2 right-4 z-10 w-80">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Deadlift Counter</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Reps:</span>
            <span>{repCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Phase:</span>
            <span className="capitalize">{phase}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeadliftTracker;