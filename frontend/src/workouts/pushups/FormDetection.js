const PushUpFormDetector = (backAngleThreshold = 15, elbowAngleThreshold = 90, shoulderAlignmentThreshold = 20) => {
  const detectForm = (pose) => {
    if (!pose || !pose.keypoints) return { isCorrect: false, message: 'Pose not detected' };
    
    const keypoints = getKeypoints(pose);

    // Check if at least one side of the body has all necessary keypoints visible
    if (!areKeypointsValidForOneSide(keypoints)) {
      return { isCorrect: false, message: 'Ensure your full body is visible in the camera' };
    }

    // Check back straightness
    const backAngle = calculateBackAngle(keypoints);
    if (Math.abs(backAngle - 180) > backAngleThreshold) {
      return { isCorrect: false, message: 'Keep your back straight' };
    }

    // Check elbow angle
    const elbowAngle = calculateElbowAngle(keypoints);
    if (elbowAngle > elbowAngleThreshold) {
      return { isCorrect: false, message: 'Lower your body more, bend your elbows further' };
    }

    // Check shoulder alignment
    if (!areShouldersAligned(keypoints, shoulderAlignmentThreshold)) {
      return { isCorrect: false, message: 'Keep your shoulders level' };
    }

    return { isCorrect: true, message: 'Good form!' };
  };

  const getKeypoints = (pose) => ({
    leftShoulder: getValidKeypoint(pose, 5),
    rightShoulder: getValidKeypoint(pose, 6),
    leftElbow: getValidKeypoint(pose, 7),
    rightElbow: getValidKeypoint(pose, 8),
    leftWrist: getValidKeypoint(pose, 9),
    rightWrist: getValidKeypoint(pose, 10),
    leftHip: getValidKeypoint(pose, 11),
    rightHip: getValidKeypoint(pose, 12),
    leftKnee: getValidKeypoint(pose, 13),
    rightKnee: getValidKeypoint(pose, 14),
    leftAnkle: getValidKeypoint(pose, 15),
    rightAnkle: getValidKeypoint(pose, 16),
  });

  const getValidKeypoint = (pose, index) => {
    const keypoint = pose.keypoints[index];
    return keypoint && keypoint.score > 0.6 ? keypoint : null;
  };

  const areKeypointsValidForOneSide = (keypoints) => {
    const leftSideVisible = keypoints.leftShoulder && keypoints.leftElbow && keypoints.leftWrist && keypoints.leftHip && keypoints.leftKnee && keypoints.leftAnkle;
    const rightSideVisible = keypoints.rightShoulder && keypoints.rightElbow && keypoints.rightWrist && keypoints.rightHip && keypoints.rightKnee && keypoints.rightAnkle;
    return leftSideVisible || rightSideVisible;
  };

  const calculateBackAngle = (keypoints) => {
    const { leftShoulder, leftHip, leftAnkle, rightShoulder, rightHip, rightAnkle } = keypoints;
    const leftAngle = leftShoulder && leftHip && leftAnkle ? calculateAngle(leftShoulder, leftHip, leftAnkle) : null;
    const rightAngle = rightShoulder && rightHip && rightAnkle ? calculateAngle(rightShoulder, rightHip, rightAnkle) : null;
    if (leftAngle && rightAngle) return (leftAngle + rightAngle) / 2; // Average of both sides if available
    return leftAngle || rightAngle; // Use whichever side is available
  };

  const calculateElbowAngle = (keypoints) => {
    const { leftShoulder, leftElbow, leftWrist, rightShoulder, rightElbow, rightWrist } = keypoints;
    const leftAngle = leftShoulder && leftElbow && leftWrist ? calculateAngle(leftShoulder, leftElbow, leftWrist) : null;
    const rightAngle = rightShoulder && rightElbow && rightWrist ? calculateAngle(rightShoulder, rightElbow, rightWrist) : null;
    return leftAngle && rightAngle ? Math.min(leftAngle, rightAngle) : leftAngle || rightAngle;
  };

  const areShouldersAligned = (keypoints, threshold) => {
    const { leftShoulder, rightShoulder } = keypoints;
    if (!leftShoulder || !rightShoulder) return true; // Can't check alignment if one shoulder is missing
    const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y);
    return shoulderAlignment < threshold;
  };

  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  return { detectForm };
};

export default PushUpFormDetector;
