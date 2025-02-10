import Webcam from "react-webcam";

const CameraFeed = ({ webcamRef, selectedDeviceId}) => {
    return (
        <Webcam
            ref={webcamRef}
            videoConstraints={{
                deviceId: selectedDeviceId,
                // aspectRatio: 16 / 9,
                facingMode: 'user',
            }}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }}
        />


    );
};

export default CameraFeed;