import React from 'react';
import Webcam from 'react-webcam';

const CameraDisplay = ({ webcamRef, canvasRef, selectedDeviceId }) => {
  return (
    <div className="camera-display" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Webcam
        key={selectedDeviceId}
        audio={false}
        ref={webcamRef}
        // videoConstraints={videoConstraints}
        style={{
          position: 'absolute',
          zIndex: 1,
          width: '100%',
          height: '70%',
          objectFit: 'cover',
        }}
        aria-label={`Camera feed ${selectedDeviceId ? selectedDeviceId.slice(0, 5) : ''}`}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          zIndex: 2,
          width: '100%',
          height: '70%',
        }}
      />
    </div>
  );
};

export default CameraDisplay;
