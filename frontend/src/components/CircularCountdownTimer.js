import React from 'react';
import { Box, keyframes } from '@mui/system';

// Define a pulsating animation for the countdown
const pulsate = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
  100% { transform: translate(-50%, -50%) scale(1); }
`;

const CircularCountdownTimer = ({ countdown }) => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '150px', // Fixed width for the circle
                height: '150px', // Fixed height for the circle
                borderRadius: '50%', // Makes the box circular
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                animation: `${pulsate} 1s infinite ease-in-out`,
                backdropFilter: 'blur(5px)', // Adds a blur effect to the background
                border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border for depth
                transition: 'all 0.3s ease', // Smooth transition for hover effects
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker background on hover
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)', // Enhanced shadow on hover
                },
            }}
        >
            {countdown > 0 && `${countdown}s`}
        </Box>
    );
};

export default CircularCountdownTimer;