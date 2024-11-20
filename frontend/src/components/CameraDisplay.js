import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, FormControl, Select, MenuItem, Typography } from '@mui/material';
import Webcam from 'react-webcam';
import { setSelectedDeviceId } from '../store/cameraSlice';

const CameraDisplay = ({ 
  webcamRef, 
  canvasRef,
  onTogglePoseDetection,
  onBack
}) => {
  const dispatch = useDispatch();

  // Get state from Redux
  const { devices, selectedDeviceId } = useSelector(state => state.camera);
  const { isPoseDetectionActive, isLoading } = useSelector(state => state.pose);
  const { repCount } = useSelector(state => state.workout);

  const handleCameraSwitch = (event) => {
    dispatch(setSelectedDeviceId(event.target.value));
  };

  return (
    <Box 
    sx={{ 
      position: 'relative',
      width: '100%', // Full width of parent container
      maxWidth: '1000px', // Adjust maximum width as needed
      height: { xs: '480px', sm: '600px', md: '720px' }, // Responsive height
      margin: '0 auto',
      aspectRatio: '4/3' // Maintain 4:3 aspect ratio 
      }}>
      <Webcam
        ref={webcamRef}
        videoConstraints={{ deviceId: selectedDeviceId }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '8px'
        }}
      />

      {/* Pose Detection Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Controls Overlay */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 2,
        display: 'flex',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)'
      }}>
        {/* Camera Selection */}
        <FormControl size="small" sx={{ width: '150px' }}>
          <Select
            value={selectedDeviceId || ''}
            onChange={handleCameraSwitch}
            disabled={isPoseDetectionActive}
            sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
          >
            {devices.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Control Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={onTogglePoseDetection}
            disabled={isLoading}
            color={isPoseDetectionActive ? "error" : "success"}
            size="small"
          >
            {isLoading ? 'Loading...' : isPoseDetectionActive ? 'Stop' : 'Start'}
          </Button>
          <Button 
            variant="contained"
            onClick={onBack}
            color="secondary"
            size="small"
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* Rep Counter Overlay */}
      <Box sx={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px 20px',
        borderRadius: '20px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {repCount}
        </Typography>
        <Typography variant="body1">
          reps
        </Typography>
      </Box>
    </Box>
  );
};

export default CameraDisplay;
