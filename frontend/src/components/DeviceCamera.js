// DeviceCamera.js
import React from 'react';
import Webcam from 'react-webcam';

const DeviceCamera = ({ deviceId, videoConstraints }) => (
  <div>
    <Webcam
      audio={false}
      videoConstraints={videoConstraints}
      aria-label={`Camera feed ${deviceId ? deviceId.slice(0, 5) : ''}`}
    />
  </div>
);

export default React.memo(DeviceCamera);