import { useEffect, useState } from 'react';

const PushUpsTracker = (keypoints, reps, setReps, phase, setPhase) => {
  const CONFIDENCE_THRESHOLD = 0.7;
  const [lastShoulderY, setLastShoulderY] = useState(null);

  const getKeypoint = (name) => {
    const keypoint = keypoints?.find(kp => kp.name === name);
    return keypoint?.score >= CONFIDENCE_THRESHOLD ? keypoint : null;
  };

  useEffect(() => {
    if (!keypoints?.length)
      return(console.log("keypoints are null, line 14 pushups tracker"));

    const leftShoulder = getKeypoint('left_shoulder');
    const rightShoulder = getKeypoint('right_shoulder');

    if (!leftShoulder || !rightShoulder) return;

    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2; // Average shoulder height

    if (lastShoulderY === null) {
      setLastShoulderY(shoulderY);
      return;
    }

    const velocity = shoulderY - lastShoulderY; // Positive = moving down, Negative = moving up
    setLastShoulderY(shoulderY);

    // Thresholds for detecting up and down phases
    const VELOCITY_THRESHOLD = 2; // Adjust based on sensitivity

    if (phase === 'up' && velocity > VELOCITY_THRESHOLD) {
      // Moving down
      setPhase('down');
    } else if (phase === 'down' && velocity < -VELOCITY_THRESHOLD) {
      // Moving up
      setPhase('up');
      setReps((prevReps) => prevReps + 1);
    }
  }, [keypoints, phase, setPhase, setReps, lastShoulderY]);

  return null; // No need to return anything since we're updating state directly
};

export default PushUpsTracker;