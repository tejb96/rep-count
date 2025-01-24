// utils/geometryUtils.js

/**
 * Calculates the Euclidean distance between two keypoints.
 * @param {Object} kp1 - The first keypoint with `x` and `y` properties.
 * @param {Object} kp2 - The second keypoint with `x` and `y` properties.
 * @returns {number} - The distance between the two keypoints.
 */
export const getDistance = (kp1, kp2) => {
  if (!kp1 || !kp2 || kp1.x === undefined || kp1.y === undefined || kp2.x === undefined || kp2.y === undefined) {
    console.error("Invalid keypoints provided to getDistance");
    return Infinity; // Return a large number to indicate invalid input
  }

  const dx = kp1.x - kp2.x;
  const dy = kp1.y - kp2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Calculate slope of line between two points
export const getSlope = (point1, point2) => {
    if (!point1 || !point2) return null;
    return (point2.y - point1.y) / (point2.x - point1.x);
  };
  
  // Check if lines are approximately parallel
  export const areLinesParallel = (slope1, slope2) => {
    if (slope1 === null || slope2 === null) return false;
    const ALIGNMENT_THRESHOLD = 0.01; // You can adjust this value as needed
    return Math.abs(slope1 - slope2) < ALIGNMENT_THRESHOLD;
  };

  export const calculateAngle = (pointA, pointB, pointC) => {
    const angle =
      (Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
        Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x)) *
      (180 / Math.PI);
    return Math.abs(angle > 180 ? 360 - angle : angle);
  };
  
  