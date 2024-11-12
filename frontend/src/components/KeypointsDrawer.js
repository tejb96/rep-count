// Keypoint.js
const SHOULDER_COLOR = '#00ff00';
const ELBOW_COLOR = '#ffff00';
const WRIST_COLOR = '#00ffff';
const HIP_COLOR = '#ff00ff';
const KNEE_COLOR = '#ff8000';
const ANKLE_COLOR = '#0080ff';

const KEYPOINT_CONNECTIONS = [
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['right_shoulder', 'right_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'],
  ['right_knee', 'right_ankle']
];

const KEYPOINT_COLORS = {
  nose: '#ff0000',
  left_shoulder: SHOULDER_COLOR,
  right_shoulder: SHOULDER_COLOR,
  left_elbow: ELBOW_COLOR,
  right_elbow: ELBOW_COLOR,
  left_wrist: WRIST_COLOR,
  right_wrist: WRIST_COLOR,
  left_hip: HIP_COLOR,
  right_hip: HIP_COLOR,
  left_knee: KNEE_COLOR,
  right_knee: KNEE_COLOR,
  left_ankle: ANKLE_COLOR,
  right_ankle: ANKLE_COLOR
};
  
  class KeypointDrawer {
    constructor(ctx) {
      this.ctx = ctx;
    }
  
    drawKeypoints(keypoints, minConfidence = 0.3) {
      if (!keypoints) return;
      keypoints.forEach(keypoint => {
        if (keypoint.score >= minConfidence) {
          const { x, y } = keypoint;
          this.drawPoint(x, y, KEYPOINT_COLORS[keypoint.name] || '#ffffff');
        }
      });
    }
  
    drawSkeleton(keypoints, minConfidence = 0.3) {
      if (!keypoints) return;
      KEYPOINT_CONNECTIONS.forEach(([startPoint, endPoint]) => {
        const start = keypoints.find(kp => kp.name === startPoint);
        const end = keypoints.find(kp => kp.name === endPoint);
  
        if (start && end && start.score >= minConfidence && end.score >= minConfidence) {
          this.drawLine(start.x, start.y, end.x, end.y);
        }
      });
    }
  
    drawPoint(x, y, color, radius = 4) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }
  
    drawLine(x1, y1, x2, y2, color = '#ffffff') {
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }
  
  export default KeypointDrawer;