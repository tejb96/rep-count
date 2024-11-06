const CameraAngleDetector = () => {
  const detectAngle = (pose) => {
    if (!pose || !pose.keypoints) return { isCorrect: false, message: 'No pose detected' };

    const keypoints = getKeypoints(pose);
    const { leftShoulder, rightShoulder, leftHip, rightHip } = keypoints;

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return { isCorrect: false, message: 'Please ensure your full upper body is visible' };
    }

    // Calculate the angle between shoulders and hips
    const shoulderAngle = Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x);
    const hipAngle = Math.atan2(rightHip.y - leftHip.y, rightHip.x - leftHip.x);
    const angleDifference = Math.abs(shoulderAngle - hipAngle) * (180 / Math.PI);

    // Check if the camera is at roughly a 45-degree angle
    if (angleDifference > 30 && angleDifference < 60) {
      return { isCorrect: true, message: 'Camera angle looks good!' };
    } else if (angleDifference <= 30) {
      return { isCorrect: false, message: 'Please move the camera more to the side' };
    } else {
      return { isCorrect: false, message: 'Please move the camera more to the front' };
    }
  };

  const getKeypoints = (pose) => ({
    leftShoulder: getValidKeypoint(pose.keypoints[5]),
    rightShoulder: getValidKeypoint(pose.keypoints[6]),
    leftHip: getValidKeypoint(pose.keypoints[11]),
    rightHip: getValidKeypoint(pose.keypoints[12]),
  });

  const getValidKeypoint = (keypoint) => (keypoint && keypoint.score > 0.6) ? keypoint : null;

  return { detectAngle };
};

export default CameraAngleDetector;
