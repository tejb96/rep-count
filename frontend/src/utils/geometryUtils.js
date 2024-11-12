// utils/geometryUtils.js

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
  