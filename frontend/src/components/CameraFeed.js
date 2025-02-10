import Webcam from "react-webcam";

const CameraFeed = ({ webcamRef, selectedDeviceId, aspectRatio, setAspectRatio }) => {
    return (
        <Webcam
            ref={webcamRef}
            videoConstraints={{
                deviceId: selectedDeviceId,
                aspectRatio: aspectRatio,
                facingMode: 'user',
            }}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
            }}
            onLoadedMetadata={() => {
                const video = webcamRef.current.video;
                setAspectRatio(video.videoWidth / video.videoHeight);
            }}
            audio={false}
            playsInline
            autoPlay
            muted
        />
    );
};

export default CameraFeed;