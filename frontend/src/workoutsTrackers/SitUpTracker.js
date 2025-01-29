const SitUpTracker = (keypoints, reps, setReps, phase, setPhase) => {
  const CONFIDENCE_THRESHOLD = 0.5;

  console.log("SitUpTracker called");

  const getKeypoint = (name) => {
    const keypoint = keypoints?.find(kp => kp.name === name);
    return keypoint?.score >= CONFIDENCE_THRESHOLD ? keypoint : null;
  };

  if (!keypoints?.length) {
    console.log("Keypoints are null or empty.");
    return;
  }

  const leftShoulder = getKeypoint('left_shoulder');
  const rightShoulder = getKeypoint('right_shoulder');
  const leftHip = getKeypoint('left_hip');
  const rightHip = getKeypoint('right_hip');

  console.log(leftShoulder, rightShoulder, leftHip, rightHip);

  // Check for missing keypoints and set phase to a message
  if (!leftShoulder) {
    setPhase("Left shoulder not visible");
    return;
  }
  if (!rightShoulder) {
    setPhase("Right shoulder not visible");
    return;
  }
  if (!leftHip) {
    setPhase("Left hip not visible");
    return;
  }
  if (!rightHip) {
    setPhase("Right hip not visible");
    return;
  }

  // Calculate shoulder-to-hip distances for left and right sides
  const leftDistance = Math.sqrt(
      Math.pow(leftShoulder.x - leftHip.x, 2) + Math.pow(leftShoulder.y - leftHip.y, 2)
  );
  const rightDistance = Math.sqrt(
      Math.pow(rightShoulder.x - rightHip.x, 2) + Math.pow(rightShoulder.y - rightHip.y, 2)
  );

  // Average shoulder-to-hip distance
  const avgDistance = (leftDistance + rightDistance) / 2;

  // Thresholds for detecting positions
  const UP_THRESHOLD = 0.5; // User is upright when shoulder-to-hip distance is close to initial distance
  const DOWN_THRESHOLD = 0.5; // User is down when shoulder-to-hip distance is larger than initial distance

  // Detect phase based on position
  if (
      phase === 'down' &&
      (leftDistance < UP_THRESHOLD || rightDistance < UP_THRESHOLD) // Either side is upright
  ) {
    setPhase('up');
  } else if (
      phase === 'up' &&
      (leftDistance > DOWN_THRESHOLD || rightDistance > DOWN_THRESHOLD) // Either side is down
  ) {
    setPhase('down');
    setReps((prevReps) => prevReps + 1);
  }
};

export default SitUpTracker;
