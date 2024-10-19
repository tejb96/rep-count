import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const DeviceCamera = ({ deviceId, videoConstraints, poseDetector }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    let animationFrameId;

    const detectPose = async () => {
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

        poses.forEach((pose) => {
          if (pose.keypoints) {
            pose.keypoints.forEach((keypoint) => {
              ctx.beginPath();
              ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
              ctx.fillStyle = 'red';
              ctx.fill();
            });
          }
        });
      }

      if (isDetecting) {
        animationFrameId = requestAnimationFrame(detectPose);
      }
    };

    if (poseDetector) {
      setIsDetecting(true);
      detectPose();
    }

    return () => {
      setIsDetecting(false);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [poseDetector, isDetecting]);

  return (
    <div style={{ position: 'relative' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        style={{ position: 'absolute', zIndex: 1 }}
        aria-label={`Camera feed ${deviceId ? deviceId.slice(0, 5) : ''}`}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', zIndex: 2 }}
      />
    </div>
  );
};

export default React.memo(DeviceCamera);