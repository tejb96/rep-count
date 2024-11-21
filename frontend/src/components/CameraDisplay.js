// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import PropTypes from 'prop-types';
// import { Box, Button, FormControl, Select, MenuItem, Typography } from '@mui/material';
// import Webcam from 'react-webcam';
// import { setSelectedDeviceId } from '../store/cameraSlice';
// import { useEffect } from 'react';

// const CameraDisplay = ({ 
//   webcamRef, 
//   canvasRef,
//   onTogglePoseDetection,
//   onBack,
//   isPoseDetectionActive,
//   isLoading
// }) => {
//   const dispatch = useDispatch();

//   // Get all camera-related state from Redux
//   const { devices, selectedDeviceId } = useSelector(state => state.camera);
//   // Remove state.pose selector since we get these from props now
//   const { repCount } = useSelector(state => state.workout); // Consider moving this to props if workout state is migrated in the future

//   useEffect(() => {
//     const handleDeviceChange = async () => {
//       const devices = await navigator.mediaDevices.enumerateDevices();
//       const videoInputs = devices.filter(device => device.kind === 'videoinput');
//       dispatch({ type: 'camera/updateDevices', payload: videoInputs });
//     };

//     navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
//     return () => {
//       navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
//     };
//   }, [dispatch]);

//   const handleCameraSwitch = async (event) => {
//     try {
//       const newDeviceId = event.target.value;
      
//       // If pose detection is active, stop it before switching
//       if (isPoseDetectionActive) {
//         await onTogglePoseDetection(); // Stop
//       }
      
//       // Switch camera device
//       dispatch(setSelectedDeviceId(newDeviceId));
      
//       // Wait for video element to update with new device
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       // Restart pose detection if it was active
//       if (isPoseDetectionActive) {
//         await onTogglePoseDetection(); // Restart
//       }
//     } catch (error) {
//       console.error('Error switching camera:', error);
//     }
//   };

//   return (
//     <Box 
//       sx={{ 
//         position: 'relative',
//         width: '100%',
//         maxWidth: '1000px',
//         height: { xs: '480px', sm: '600px', md: '720px' },
//         margin: '0 auto',
//         aspectRatio: '4/3'
//       }}
//     >
//       {/* Camera Feed */}
//       <Webcam
//         ref={webcamRef}
//         videoConstraints={{
//           deviceId: selectedDeviceId,
//           aspectRatio: 4/3,
//           facingMode: "user"
//         }}
//         style={{
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',
//           borderRadius: '8px'
//         }}
//       />

//       {/* Pose Detection Canvas */}
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           zIndex: 2
//         }}
//       />

//       {/* Controls Overlay */}
//       <Box 
//         sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           padding: 2,
//           display: 'flex',
//           justifyContent: 'space-between',
//           background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
//           zIndex: 3
//         }}
//       >
//         {/* Camera Selection Dropdown */}
//         <FormControl 
//           size="small" 
//           sx={{ 
//             width: '150px',
//             backgroundColor: 'rgba(255,255,255,0.1)',
//             borderRadius: 1
//           }}
//         >
//           <Select
//             value={selectedDeviceId || ''}
//             onChange={handleCameraSwitch}
//             disabled={isPoseDetectionActive}
//             sx={{ 
//               color: 'white',
//               '.MuiSelect-icon': { color: 'white' }
//             }}
//           >
//             {devices.map((device) => (
//               <MenuItem key={device.deviceId} value={device.deviceId}>
//                 {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Control Buttons */}
//         <Box sx={{ display: 'flex', gap: 1 }}>
//           <Button
//             variant="contained"
//             onClick={onTogglePoseDetection}
//             disabled={isLoading}
//             color={isPoseDetectionActive ? "error" : "success"}
//             size="small"
//           >
//             {isLoading ? 'Loading...' : isPoseDetectionActive ? 'Stop' : 'Start'}
//           </Button>
//           <Button 
//             variant="contained"
//             onClick={onBack}
//             color="secondary"
//             size="small"
//           >
//             Back
//           </Button>
//         </Box>
//       </Box>

//       {/* Rep Counter Overlay */}
//       <Box 
//         sx={{
//           position: 'absolute',
//           bottom: 20,
//           left: '50%',
//           transform: 'translateX(-50%)',
//           padding: '10px 20px',
//           borderRadius: '20px',
//           backgroundColor: 'rgba(0,0,0,0.7)',
//           color: 'white',
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1,
//           zIndex: 3
//         }}
//       >
//         <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
//           {repCount}
//         </Typography>
//         <Typography variant="body1">
//           reps
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// CameraDisplay.propTypes = {
//   webcamRef: PropTypes.object.isRequired,
//   canvasRef: PropTypes.object.isRequired,
//   onTogglePoseDetection: PropTypes.func.isRequired,
//   onBack: PropTypes.func.isRequired,
//   isPoseDetectionActive: PropTypes.bool.isRequired,
//   isLoading: PropTypes.bool.isRequired,
// };

// export default CameraDisplay;
