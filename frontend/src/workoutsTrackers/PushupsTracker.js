const PushUpsTracker = (keypoints, reps, setReps, phase, setPhase, lastPose, setLastPose) => {
  const CONFIDENCE_THRESHOLD = 0.5;
  const VELOCITY_THRESHOLD = 0.0;
  const VELOCITY_TOLERANCE = 10;

  console.log("PushUpsTracker called");

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
  const leftWrist = getKeypoint('left_wrist');
  const rightWrist = getKeypoint('right_wrist');

  console.log(leftShoulder, rightShoulder, leftWrist, rightWrist);

  // Check if at least one side is fully visible
  const isLeftSideVisible = leftShoulder && leftWrist;
  const isRightSideVisible = rightShoulder && rightWrist;

  if (!isLeftSideVisible && !isRightSideVisible) {
    setPhase("Not visible");
    return;
  }

  // Calculate ratios for visible sides
  let leftRatio, rightRatio;
  if (isLeftSideVisible) {
    leftRatio = leftShoulder.y / leftWrist.y;
    console.log(`Left Ratio: ${leftRatio}`);
  }
  if (isRightSideVisible) {
    rightRatio = rightShoulder.y / rightWrist.y;
    console.log(`Right Ratio: ${rightRatio}`);
  }

  // Calculate velocity if lastPose is available
  let velocity = 0;
  if (lastPose.leftShoulderY && isLeftSideVisible) {
    const currentY = leftShoulder.y;
    const lastY = lastPose.leftShoulderY;
    velocity = currentY - lastY;
    console.log(`Left Shoulder Velocity: ${velocity}`);
  }
  if (lastPose.rightShoulderY && isRightSideVisible) {
    const currentY = rightShoulder.y;
    const lastY = lastPose.rightShoulderY;
    velocity = currentY - lastY;
    console.log(`Right Shoulder Velocity: ${velocity}`);
  }

  // Update lastPose with the current shoulder positions
  if (isLeftSideVisible) {
    setLastPose({ leftShoulderY: leftShoulder.y });
  } else if (isRightSideVisible) {
    setLastPose({ rightShoulderY: rightShoulder.y });
  }

  if (phase === "Not visible" || phase === '') {
    if (
        (isLeftSideVisible && leftRatio > 0.7) || // Left side is in down position
        (isRightSideVisible && rightRatio > 0.7) // Right side is in down position
    ) {
      setPhase('down');
    }
  }

  // Determine the phase based on the ratios and velocity
  if (phase === 'down') {
    if (
        (isLeftSideVisible && leftRatio < 0.4) || // Left side is in up position
        (isRightSideVisible && rightRatio < 0.4) // Right side is in up position
    ) {
      if (velocity >= VELOCITY_THRESHOLD - VELOCITY_TOLERANCE && velocity <= VELOCITY_THRESHOLD + VELOCITY_TOLERANCE) { // Shoulders are moving upward
        setPhase('up');
        setReps((prevReps) => prevReps + 1);
      }
    }
  } else if (phase === 'up') {
    if (
        (isLeftSideVisible && leftRatio > 0.6) || // Left side is in down position
        (isRightSideVisible && rightRatio > 0.6) // Right side is in down position
    ) {
      if (velocity >= VELOCITY_THRESHOLD - VELOCITY_TOLERANCE && velocity <= VELOCITY_THRESHOLD + VELOCITY_TOLERANCE) { // Shoulders are moving downward
        setPhase('down');
      }
    }
  }
};

export default PushUpsTracker;