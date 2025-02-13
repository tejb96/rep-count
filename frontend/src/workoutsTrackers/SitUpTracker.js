const SitUpTracker = (keypoints, reps, setReps, phase, setPhase, lastPose, setLastPose) => {
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
  const leftEar = getKeypoint('left_ear');
  const rightEar = getKeypoint('right_ear');
  const nose = getKeypoint('nose');
  const leftKnee = getKeypoint('left_knee');
  const rightKnee = getKeypoint('right_knee');

  // console.log(leftShoulder, rightShoulder, leftHip, rightHip);

  // Check if at least one side is fully visible
  const isLeftSideVisible = leftShoulder && leftHip;
  const isRightSideVisible = rightShoulder && rightHip;

  if (!isLeftSideVisible && !isRightSideVisible && !lastPose && !leftKnee && !rightKnee) {
    setPhase("Not visible");
    return;
  }

  // Calculate ratios for visible sides
  let leftRatio, rightRatio,leftKneeRatio, rightKneeRatio;
  if (isLeftSideVisible) {
    leftRatio = leftShoulder.y/leftHip.y;
    // console.log(`Left Ratio: ${leftRatio}`);
  }
  if (isRightSideVisible) {
    rightRatio = rightShoulder.y/rightHip.y;
    // console.log(`Right Ratio: ${rightRatio}`);
  }

  if (leftKnee && leftShoulder) {
    leftKneeRatio = leftShoulder.y/leftKnee.y;
    console.log(`Left Ratio: ${leftKneeRatio}`);
  }
  if (rightKnee && rightShoulder) {
    rightKneeRatio = rightShoulder.y/rightKnee.y;
    console.log(`Right Ratio: ${rightKneeRatio}`);
  }


  const updatePhaseAndReps = (newPhase, incrementReps = false) => {
    setPhase(newPhase);
    if (incrementReps) {
      setReps((prevReps) => prevReps + 1);
    }
    setLastPose({
      leftShoulder: leftShoulder,
      rightShoulder: rightShoulder,
      leftHip: leftHip,
      rightHip: rightHip,
      leftKnee: leftKnee,
      rightKnee: rightKnee,
    });
  };

  if (phase === "Not visible" || phase === '') {
    if (
        (isLeftSideVisible && leftRatio < 0.5) || // Left side is in up position
        (isRightSideVisible && rightRatio < 0.5) ||
        (leftKneeRatio <0.9)||
        (rightKneeRatio <0.9)

    ) {
      updatePhaseAndReps('up');
    }

    if (
        (isLeftSideVisible && leftRatio > 0.5) || // Left side is in down position
        (isRightSideVisible && rightRatio > 0.55) ||
        (leftKneeRatio >0.95) ||
        (rightKneeRatio >0.95)
    ) {
      updatePhaseAndReps('down');
    }
  }

  const checkTransitionToUp = () => {
    return (
        (isLeftSideVisible && leftRatio < 0.4) ||
        (isRightSideVisible && rightRatio < 0.4) ||
        // (leftEar?.y && lastPose?.leftHip?.y && leftEar.y / lastPose.leftHip.y < 0.3) ||
        // (rightEar?.y && lastPose?.rightHip?.y && rightEar.y / lastPose.rightHip.y < 0.3) ||
        // (nose?.y && lastPose?.leftHip?.y && nose.y / lastPose.leftHip.y < 0.3) ||
        // (leftShoulder?.y && lastPose?.leftHip?.y && leftShoulder.y / lastPose.leftHip.y < 0.4) ||
        // (rightShoulder?.y && lastPose?.rightHip?.y && rightShoulder.y / lastPose.rightHip.y < 0.4)||
        (leftEar?.y && leftKnee?.y && leftEar.y / leftKnee.y < 0.65) ||
        (rightEar?.y && rightKnee?.y && rightEar.y / rightKnee.y < 0.65) ||
        (nose?.y && leftKnee?.y && nose.y / leftKnee.y < 0.65) ||
        (nose?.y && rightKnee?.y && nose.y / rightKnee.y < 0.65) ||
        (leftShoulder?.y && leftKnee?.y && leftShoulder.y / leftKnee.y < 0.65) ||
        (rightShoulder?.y && rightKnee?.y && rightShoulder.y / rightKnee.y < 0.65)
    );
  };

  const checkTransitionToDown = () => {
    return (
        (isLeftSideVisible && leftRatio > 0.7) ||
        (isRightSideVisible && rightRatio > 0.7) ||
        // (leftEar?.y && lastPose?.leftHip?.y && leftEar.y / lastPose.leftHip.y > 0.8) ||
        // (rightEar?.y && lastPose?.rightHip?.y && rightEar.y / lastPose.rightHip.y > 0.8) ||
        // (nose?.y && lastPose?.leftHip?.y && nose.y / lastPose.leftHip.y > 0.8) ||
        // (leftShoulder?.y && lastPose?.leftHip?.y && leftShoulder.y / lastPose.leftHip.y > 0.8) ||
        // (rightShoulder?.y && lastPose?.rightHip?.y && rightShoulder.y / lastPose.rightHip.y > 0.8)||
        (leftEar?.y && leftKnee?.y && leftEar.y / leftKnee.y > 1.2) ||
        (rightEar?.y && rightKnee?.y && rightEar.y / rightKnee.y > 1.2) ||
        (nose?.y && leftKnee?.y && nose.y / leftKnee.y > 1.2) ||
        (nose?.y && rightKnee?.y && nose.y / rightKnee.y > 1.2) ||
        (leftShoulder?.y && leftKnee?.y && leftShoulder.y / leftKnee.y > 1.2) ||
        (rightShoulder?.y && rightKnee?.y && rightShoulder.y / rightKnee.y > 1.2)
    );
  };

  if (phase === 'down' && checkTransitionToUp()) {
    updatePhaseAndReps('up');
  } else if (phase === 'up' && checkTransitionToDown()) {
    updatePhaseAndReps('down', true);
  }


  // // Determine the phase based on the ratios
  // if (phase === 'down') {
  //   if (
  //       (isLeftSideVisible && leftRatio < 0.3) || // Left side is in up position
  //       (isRightSideVisible && rightRatio < 0.3) // Right side is in up position
  //   ) {
  //     setPhase('up');
  //   }
  // } else if (phase === 'up') {
  //   if (
  //       (isLeftSideVisible && leftRatio > 0.7) || // Left side is in down position
  //       (isRightSideVisible && rightRatio > 0.7) // Right side is in down position
  //   ) {
  //     setPhase('down');
  //     setReps((prevReps) => prevReps + 1);
  //   }
  // }
};

export default SitUpTracker;