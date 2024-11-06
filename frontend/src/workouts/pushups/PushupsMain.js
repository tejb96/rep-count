import PushUpCounter from './RepCounter';
import PushUpFormDetector from './FormDetection';
import CameraAngleDetector from './CameraAngleDetector';

const PushUpTracker = (pushUpThreshold = 90, backAngleThreshold = 15, elbowAngleThreshold = 90, minDepth = 30) => {
  const repCounter = PushUpCounter(pushUpThreshold, 15, minDepth);
  const formDetector = PushUpFormDetector(backAngleThreshold, elbowAngleThreshold);
  const angleDetector = CameraAngleDetector();

  const track = (pose) => {
    if (!pose || !pose.keypoints) {
      return { 
        reps: 0, 
        form: { isCorrect: false, message: 'No pose detected' },
        cameraAngle: { isCorrect: false, message: 'No pose detected' }
      };
    }

    const reps = repCounter.countRep(pose);
    const form = formDetector.detectForm(pose);
    const cameraAngle = angleDetector.detectAngle(pose);

    return { reps, form, cameraAngle };
  };

  const reset = () => {
    repCounter.reset();
  };

  return { track, reset };
};

export default PushUpTracker;