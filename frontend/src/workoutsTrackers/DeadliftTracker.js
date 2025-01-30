const DeadliftTracker = (keypoints, reps, setReps, phase, setPhase) => {
  const CONFIDENCE_THRESHOLD = 0.6;

  console.log("DeadliftTracker called");

  const getKeypoint = (name) => {
    const keypoint = keypoints?.find(kp => kp.name === name);
    return keypoint?.score >= CONFIDENCE_THRESHOLD ? keypoint : null;
  };

  if (!keypoints?.length) {
    console.log("Keypoints are null or empty.");
    return;
  }

  const leftWrist = getKeypoint('left_wrist');
  const rightWrist = getKeypoint('right_wrist');
  const leftAnkle = getKeypoint('left_ankle');
  const rightAnkle = getKeypoint('right_ankle');
  const leftKnee = getKeypoint('left_knee');
  const rightKnee = getKeypoint('right_knee');
  const leftHip = getKeypoint('left_hip');
  const rightHip = getKeypoint('right_hip');

  console.log(leftWrist, rightWrist, leftAnkle, rightAnkle, leftKnee, rightKnee, leftHip, rightHip);

  // Check if at least one side is visible for wrists and ankles
  const isLeftSideVisible = leftWrist && leftAnkle;
  const isRightSideVisible = rightWrist && rightAnkle;

  if (!isLeftSideVisible && !isRightSideVisible) {
    setPhase("Not visible");
    return;
  }

  // Calculate ratios for visible sides
  let leftWristAnkleRatio, rightWristAnkleRatio;
  if (isLeftSideVisible) {
    leftWristAnkleRatio = leftWrist.y / leftAnkle.y;
    console.log(`Left Wrist/Ankle Ratio: ${leftWristAnkleRatio}`);
  }
  if (isRightSideVisible) {
    rightWristAnkleRatio = rightWrist.y / rightAnkle.y;
    console.log(`Right Wrist/Ankle Ratio: ${rightWristAnkleRatio}`);
  }

  // Check if wrists are below knees (for down position)
  const isLeftWristBelowKnee = isLeftSideVisible && leftKnee && (leftWrist.y - leftKnee.y) > 0;
  const isRightWristBelowKnee = isRightSideVisible && rightKnee && (rightWrist.y - rightKnee.y) > 0;

  // Check if wrists are close to hips (for up position)
  const isLeftWristCloseToHip = isLeftSideVisible && leftHip && Math.abs(leftWrist.y - leftHip.y) < 0.1;
  const isRightWristCloseToHip = isRightSideVisible && rightHip && Math.abs(rightWrist.y - rightHip.y) < 0.1;

  // Check if shoulders are far from knees (for up position)
  const isLeftShoulderFarFromKnee = isLeftSideVisible && leftKnee && leftHip && Math.abs(leftHip.y - leftKnee.y) > 0.3;
  const isRightShoulderFarFromKnee = isRightSideVisible && rightKnee && rightHip && Math.abs(rightHip.y - rightKnee.y) > 0.3;

  // Determine the phase based on the ratios and conditions
  if (phase === "Not visible" || phase === '') {
    if (
        (isLeftSideVisible && leftWristAnkleRatio >= 0.8 && leftWristAnkleRatio <= 0.95 && isLeftWristBelowKnee) || // Left side is in down position
        (isRightSideVisible && rightWristAnkleRatio >= 0.8 && rightWristAnkleRatio <= 0.95 && isRightWristBelowKnee) // Right side is in down position
    ) {
      setPhase('down');
    }
  }

  if (phase === 'down') {
    if (
        (isLeftSideVisible && isLeftWristCloseToHip && isLeftShoulderFarFromKnee) || // Left side is in up position
        (isRightSideVisible && isRightWristCloseToHip && isRightShoulderFarFromKnee) // Right side is in up position
    ) {
      setPhase('up');
    }
  } else if (phase === 'up') {
    if (
        (isLeftSideVisible && leftWristAnkleRatio >= 0.8 && leftWristAnkleRatio <= 0.95 && isLeftWristBelowKnee) || // Left side is in down position
        (isRightSideVisible && rightWristAnkleRatio >= 0.8 && rightWristAnkleRatio <= 0.95 && isRightWristBelowKnee) // Right side is in down position
    ) {
      setPhase('down');
      setReps((prevReps) => prevReps + 1); // Increment rep count
    }
  }
};

export default DeadliftTracker;