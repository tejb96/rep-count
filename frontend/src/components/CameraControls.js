import React from 'react';

const CameraControls = ({ 
  devices, 
  selectedDeviceId, 
  onCameraSwitch, 
  onTogglePoseDetection,
  isPoseDetectionActive,
  isLoading 
}) => {
  return (
    <div className="controls flex gap-4 mb-4">
      <select
        onChange={onCameraSwitch}
        value={selectedDeviceId || ''}
        aria-label="Select camera"
        className="p-2 border rounded"
        disabled={isPoseDetectionActive}
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
          </option>
        ))}
      </select>
      <button
        onClick={onTogglePoseDetection}
        disabled={isLoading}
        className={`px-4 py-2 rounded ${
          isPoseDetectionActive
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-500 hover:bg-green-600'
        } text-white transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Loading...' : isPoseDetectionActive ? 'Stop Pose Detection' : 'Start Pose Detection'}
      </button>
    </div>
  );
};

export default CameraControls;
