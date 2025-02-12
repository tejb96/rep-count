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
  const leftEar=getKeypoint('left_ear');
  const rightEar=getKeypoint('right_ear');
  const nose=getKeypoint('nose');

  console.log(leftShoulder, rightShoulder, leftWrist, rightWrist);

  // Check if at least one side is fully visible
  const isLeftSideVisible = leftShoulder && leftWrist;
  const isRightSideVisible = rightShoulder && rightWrist;

  if (!isLeftSideVisible && !isRightSideVisible && !lastPose) {
    setPhase("Not visible");
    return;
  }

  // Calculate ratios for visible sides
  let leftRatio, rightRatio,deltaRight,deltaLeft;
  if (isLeftSideVisible) {
    leftRatio = leftShoulder.y / leftWrist.y;
    console.log(`Left Ratio: ${leftRatio}`);
  }
  if (isRightSideVisible) {
    rightRatio = rightShoulder.y / rightWrist.y;
    console.log(`Right Ratio: ${rightRatio}`);
  }

  // if (isLeftSideVisible && lastPose) {
  //   deltaLeft = lastPose.leftShoulder.y - leftShoulder.y;
  //   console.log(`Left Distance: ${deltaLeft}`);
  // }
  // if (isRightSideVisible && lastPose) {
  //   deltaRight = lastPose.rightShoulder.y - rightShoulder.y;
  //   console.log(`Right Distance: ${deltaRight}`);
  // }

  if (phase === "Not visible" || phase === '') {
    if (
        ((isLeftSideVisible && leftRatio > 0.7) ||
        (isRightSideVisible && rightRatio > 0.7))
    ) {
      setPhase('down');
    }
    if (
        ((isLeftSideVisible && leftRatio < 0.6) ||
        (isRightSideVisible && rightRatio < 0.6))
    ) {
      setPhase('up');
    }
  }

  // Determine the phase based on the ratios
  if (phase === 'down') {
    if (
        (isLeftSideVisible && leftRatio < 0.6) || // Left side is in up position
        (isRightSideVisible && rightRatio < 0.6) // Right side is in up position
    ) {
      setPhase('up');
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    }
    else if (leftEar.y && lastPose.leftWrist.y && leftEar.y/lastPose.leftWrist.y<0.5) {
      setPhase('up');
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    }
    else if (rightEar.y && lastPose.rightWrist.y && rightEar.y/lastPose.rightWrist.y<0.5) {
      setPhase('up');
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    }
    else if (nose.y && lastPose.leftWrist.y && nose.y/lastPose.leftWrist.y<0.5) {
      setPhase('up');
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    }
    else if (leftShoulder.y && lastPose.leftWrist.y && leftShoulder.y/lastPose.leftWrist.y<0.5) {
      setPhase('up');
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    }

    else if (rightShoulder.y && lastPose.rightWrist.y && rightShoulder.y/lastPose.rightWrist.y<0.5) {
      setPhase('up');
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    }

  } else if (phase === 'up') {
    if (
        (isLeftSideVisible && leftRatio > 0.7) || // Left side is in down position
        (isRightSideVisible && rightRatio > 0.7) // Right side is in down position
    ) {
      setPhase('down');
      setReps((prevReps) => prevReps + 1);
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    } else if (leftEar.y && lastPose.leftWrist.y && leftEar.y / lastPose.leftWrist.y > 0.6) {
      setPhase('down');
      setReps((prevReps) => prevReps + 1);
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    } else if (rightEar.y && lastPose.rightWrist.y && rightEar.y / lastPose.rightWrist.y < 0.6) {
      setPhase('down');
      setReps((prevReps) => prevReps + 1);
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    } else if (nose.y && lastPose.leftWrist.y && nose.y / lastPose.leftWrist.y < 0.6) {
      setPhase('down');
      setReps((prevReps) => prevReps + 1);
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    } else if (leftShoulder.y && lastPose.leftWrist.y && leftShoulder.y / lastPose.leftWrist.y < 0.6) {
      setPhase('down');
      setReps((prevReps) => prevReps + 1);
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    } else if (rightShoulder.y && lastPose.rightWrist.y && rightShoulder.y / lastPose.rightWrist.y < 0.6) {
      setPhase('down');
      setReps((prevReps) => prevReps + 1);
      setLastPose({
        leftShoulder: leftShoulder,
        rightShoulder: rightShoulder,
        leftWrist: leftWrist,
        rightWrist: rightWrist,
      });
    }
  }
};

export default PushUpsTracker;