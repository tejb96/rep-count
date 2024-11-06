import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import PushUpTracker from '../workouts/pushups/PushupsMain.js';

const DeviceCamera = ({ videoConstraints, poseDetector }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [formMessage, setFormMessage] = useState('');
  const pushUpTrackerRef = useRef(null);

  useEffect(() => {
    pushUpTrackerRef.current = PushUpTracker();
  }, []);

  const detectPose = useCallback(async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      poseDetector &&
      canvasRef.current
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const poses = await poseDetector.estimatePoses(video);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (poses.length > 0) {
        const pose = poses[0];

        pose.keypoints.forEach((keypoint) => {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        });

        const { reps, form } = pushUpTrackerRef.current.track(pose);
        setRepCount(reps);
        setFormMessage(form.message);
      }
    }
  }, [poseDetector]);

  useEffect(() => {
    let animationFrameId;

    const runDetection = async () => {
      await detectPose();
      if (isDetecting) {
        animationFrameId = requestAnimationFrame(runDetection);
      }
    };

    if (poseDetector) {
      setIsDetecting(true);
      runDetection();
    }

    return () => {
      setIsDetecting(false);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [poseDetector, isDetecting, detectPose]);

  return (
    <div style={{ position: 'relative' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        style={{ position: 'absolute', zIndex: 1 }}
        aria-label={`Camera feed ${videoConstraints.deviceId?.exact ? videoConstraints.deviceId.exact.slice(0, 5) : ''}`}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', zIndex: 2 }}
      />
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 3, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px' }}>
        Push-up Count: {repCount}
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 3, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px' }}>
        {formMessage}
      </div>
    </div>
  );
};

export default React.memo(DeviceCamera);