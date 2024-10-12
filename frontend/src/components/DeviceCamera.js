import Webcam from 'react-webcam';

export const DeviceCamera = ({ device, index, videoConstraints }) => (
    <div key={device.deviceId || index}>
      <Webcam
        audio={false}
        videoConstraints={videoConstraints}
      />
      {device.label || `Device ${index + 1}`}
    </div>
  );
  
  export default DeviceCamera;