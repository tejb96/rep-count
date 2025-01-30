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

  // Check if at least one side is fully visible
  const isLeftSideVisible = leftShoulder && leftHip;
  const isRightSideVisible = rightShoulder && rightHip;

  if (!isLeftSideVisible && !isRightSideVisible) {
    setPhase("Not visible");
    return;
  }

  // Calculate ratios for visible sides
  let leftRatio, rightRatio;
  if (isLeftSideVisible) {
    leftRatio = leftShoulder.y/leftHip.y;
    console.log(`Left Ratio: ${leftRatio}`);
  }
  if (isRightSideVisible) {
    rightRatio = rightShoulder.y/rightHip.y;
    console.log(`Right Ratio: ${rightRatio}`);
  }

  if(phase==="Not visible"|| phase===''){
    if (
        (isLeftSideVisible && leftRatio < 0.3) || // Left side is in up position
        (isRightSideVisible && rightRatio < 0.3) // Right side is in up position
    ) {
      setPhase('up');
    }

    else if (
        (isLeftSideVisible && leftRatio > 0.7) || // Left side is in down position
        (isRightSideVisible && rightRatio > 0.7) // Right side is in down position
    ) {
      setPhase('down');
    }
  }

  // Determine the phase based on the ratios
  if (phase === 'down') {
    if (
        (isLeftSideVisible && leftRatio < 0.3) || // Left side is in up position
        (isRightSideVisible && rightRatio < 0.3) // Right side is in up position
    ) {
      setPhase('up');
    }
  } else if (phase === 'up') {
    if (
        (isLeftSideVisible && leftRatio > 0.7) || // Left side is in down position
        (isRightSideVisible && rightRatio > 0.7) // Right side is in down position
    ) {
      setPhase('down');
      setReps((prevReps) => prevReps + 1);
    }
  }
};

export default SitUpTracker;