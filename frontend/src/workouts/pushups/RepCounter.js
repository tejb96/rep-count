const PushUpCounter = (pushUpThreshold = 90, buffer = 15, minDepth = 30, keypointConfidence = 0.6) => {
  let repCount = 0;
  let isDown = false;
  // let lastValidPose = null;

  const countRep = (pose) => {
    if (!pose || !pose.keypoints) return repCount;
    const keypoints = getKeypoints(pose);

    if (!areAnySideKeypointsVisible(keypoints)) {
      return repCount;
    }

    // lastValidPose = keypoints;

    // Calculate average elbow angle
    const leftElbowAngle = calculateAngle(keypoints.leftShoulder, keypoints.leftElbow, keypoints.leftWrist);
    const rightElbowAngle = calculateAngle(keypoints.rightShoulder, keypoints.rightElbow, keypoints.rightWrist);
    const avgElbowAngle = getAverageAngle(leftElbowAngle, rightElbowAngle);

    // Calculate body lowering (vertical distance between shoulders and wrists)
    const leftBodyLower = keypoints.leftWrist?.y - keypoints.leftShoulder?.y || 0;
    const rightBodyLower = keypoints.rightWrist?.y - keypoints.rightShoulder?.y || 0;
    const avgBodyLower = getAverageAngle(leftBodyLower, rightBodyLower);

    // Push-up down phase
    if (isPushUpDown(avgElbowAngle, avgBodyLower)) {
      isDown = true;
    }
    // Push-up up phase and increment rep count
    else if (isPushUpUp(avgElbowAngle, avgBodyLower)) {
      if (isDown) {
        repCount++;
        isDown = false;
      }
    }

    return repCount;
  };

  const reset = () => {
    repCount = 0;
    isDown = false;
    // lastValidPose = null;
  };

  const getKeypoints = (pose) => ({
    leftShoulder: getValidKeypoint(pose, 5),
    rightShoulder: getValidKeypoint(pose, 6),
    leftElbow: getValidKeypoint(pose, 7),
    rightElbow: getValidKeypoint(pose, 8),
    leftWrist: getValidKeypoint(pose, 9),
    rightWrist: getValidKeypoint(pose, 10),
  });

  const getValidKeypoint = (pose, index) => {
    const keypoint = pose.keypoints[index];
    return keypoint && keypoint.score > keypointConfidence ? keypoint : null;
  };

  const areAnySideKeypointsVisible = (keypoints) => {
    const leftSideVisible = keypoints.leftShoulder && keypoints.leftElbow && keypoints.leftWrist;
    const rightSideVisible = keypoints.rightShoulder && keypoints.rightElbow && keypoints.rightWrist;
    return leftSideVisible || rightSideVisible;
  };

  const calculateAngle = (a, b, c) => {
    if (!a || !b || !c) return null;
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  const getAverageAngle = (leftAngle, rightAngle) => {
    if (leftAngle && rightAngle) return (leftAngle + rightAngle) / 2;
    return leftAngle || rightAngle; // Use whichever angle is available
  };

  const isPushUpDown = (elbowAngle, bodyLower) => 
    elbowAngle < pushUpThreshold && bodyLower > minDepth && !isDown;

  const isPushUpUp = (elbowAngle, bodyLower) => 
    elbowAngle > (pushUpThreshold + buffer) && bodyLower < minDepth && isDown;

  return { countRep, reset };
};

export default PushUpCounter;
