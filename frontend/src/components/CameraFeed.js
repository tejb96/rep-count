import React, { useState } from 'react';
import DeviceCamera from './DeviceCamera';

const CameraFeed = () => {
  // const webcamRef = React.useRef(null);
  const [devices, setDevices]=React.useState([]);

  const handleDevices = React.useCallback(
    mediaDevices =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );
  console.log(devices);
  React.useEffect(()=>{
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
  },[handleDevices]);

  const videoConstraints = {
    // width: 640,
    // height: 480,
    facingMode: "user"
  };

  return (
    <div className="camera-feed">
      {devices.length > 0 ? (
        devices.map((device, index) => (
          <DeviceCamera 
            key={device.deviceId || index}
            device={device}
            index={index}
            videoConstraints={videoConstraints}
          />
        ))
      ) : (
        <p>No video input devices found</p>
      )}
    </div>
  );
};

export default CameraFeed;
