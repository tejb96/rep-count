const PushUpsTracker = (keypoints, reps, setReps, phase, setPhase, lastPose, setLastPose) => {
  const CONFIDENCE_THRESHOLD = 0.5;

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
  const leftEar = getKeypoint('left_ear');
  const rightEar = getKeypoint('right_ear');
  const nose = getKeypoint('nose');

  console.log(leftShoulder, rightShoulder, leftWrist, rightWrist);

  // Check if at least one side is fully visible
  const isLeftSideVisible = leftShoulder && leftWrist;
  const isRightSideVisible = rightShoulder && rightWrist;

  if (!isLeftSideVisible && !isRightSideVisible && !lastPose) {
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

  const updatePhaseAndReps = (newPhase, incrementReps = false) => {
    setPhase(newPhase);
    if (incrementReps) {
      setReps((prevReps) => prevReps + 1);
    }
    setLastPose({
      leftShoulder: leftShoulder,
      rightShoulder: rightShoulder,
      leftWrist: leftWrist,
      rightWrist: rightWrist,
    });
  };

  const checkTransitionToUp = () => {
    return (
        (isLeftSideVisible && leftRatio < 0.5) ||
        (isRightSideVisible && rightRatio < 0.5) ||
        (leftEar?.y && lastPose?.leftWrist?.y && leftEar.y / lastPose.leftWrist.y < 0.35) ||
        (rightEar?.y && lastPose?.rightWrist?.y && rightEar.y / lastPose.rightWrist.y < 0.35) ||
        (nose?.y && lastPose?.leftWrist?.y && nose.y / lastPose.leftWrist.y < 0.4) ||
        (leftShoulder?.y && lastPose?.leftWrist?.y && leftShoulder.y / lastPose.leftWrist.y < 0.5) ||
        (rightShoulder?.y && lastPose?.rightWrist?.y && rightShoulder.y / lastPose.rightWrist.y < 0.5)
    );
  };

  const checkTransitionToDown = () => {
    return (
        (isLeftSideVisible && leftRatio > 0.7) ||
        (isRightSideVisible && rightRatio > 0.7) ||
        (leftEar?.y && lastPose?.leftWrist?.y && leftEar.y / lastPose.leftWrist.y > 0.8) ||
        (rightEar?.y && lastPose?.rightWrist?.y && rightEar.y / lastPose.rightWrist.y > 0.8) ||
        (nose?.y && lastPose?.leftWrist?.y && nose.y / lastPose.leftWrist.y > 0.8) ||
        (leftShoulder?.y && lastPose?.leftWrist?.y && leftShoulder.y / lastPose.leftWrist.y > 0.8) ||
        (rightShoulder?.y && lastPose?.rightWrist?.y && rightShoulder.y / lastPose.rightWrist.y > 0.8)
    );
  };

  if (phase === "Not visible" || phase === '') {
    if (
        (isLeftSideVisible && leftRatio > 0.7) ||
        (isRightSideVisible && rightRatio > 0.7)
    ) {
      updatePhaseAndReps('down');
    }
    if (
        (isLeftSideVisible && leftRatio < 0.6) ||
        (isRightSideVisible && rightRatio < 0.6)
    ) {
      updatePhaseAndReps('up');
    }
  }

  if (phase === 'down' && checkTransitionToUp()) {
    updatePhaseAndReps('up');
  } else if (phase === 'up' && checkTransitionToDown()) {
    updatePhaseAndReps('down', true);
  }
};

export default PushUpsTracker;