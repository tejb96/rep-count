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

  // Check if shoulders are far from knees (for up position)
  const isUpLeft = isLeftSideVisible && leftWrist.y/leftHip.y>0.85;
  const isUpRight = isRightSideVisible && rightWrist.y/rightHip.y>0.85;

  // Determine the phase based on the ratios and conditions
  if (phase === "Not visible" || phase === '') {
    if (
        (isLeftSideVisible && leftWristAnkleRatio >= 0.8 && isLeftWristBelowKnee) || // Left side is in down position
        (isRightSideVisible && rightWristAnkleRatio >= 0.8 && isRightWristBelowKnee) // Right side is in down position
    ) {
      setPhase('down');
    }
  }

  if (phase === 'down') {
    if (
        (isLeftSideVisible  && isUpLeft) || // Left side is in up position
        (isRightSideVisible && isUpRight) // Right side is in up position
    ) {
      setPhase('up');
      setReps((prevReps) => prevReps + 1);
    }
  } else if (phase === 'up') {
    if (
        (isLeftSideVisible && leftWristAnkleRatio >= 0.8 && leftWristAnkleRatio <= 0.95 && isLeftWristBelowKnee) || // Left side is in down position
        (isRightSideVisible && rightWristAnkleRatio >= 0.8 && rightWristAnkleRatio <= 0.95 && isRightWristBelowKnee) // Right side is in down position
    ) {
      setPhase('down');
    }
  }
};

export default DeadliftTracker;