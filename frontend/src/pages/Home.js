import React from 'react';
import { Typography, Link as MuiLink } from '@mui/material';

import CustomLayout from '../components/customLayout';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <CustomLayout>
            {/*<Typography*/}
            {/*    variant="h3"*/}
            {/*    component="h1"*/}
            {/*    gutterBottom*/}
            {/*    sx={{*/}
            {/*        fontWeight: 'bold',*/}
            {/*        color: 'text.secondary',*/}
            {/*        display: 'flex',*/}
            {/*        alignItems: 'center',*/}
            {/*        justifyContent: 'center',*/}
            {/*    }}*/}
            {/*>*/}
            {/*    /!*<img src="/logo.jpg" alt="Logo" style={{ height: '100px', marginRight: '10px' }} />*!/*/}
            {/*    Welcome to RepVision*/}
            {/*</Typography>*/}
            <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
                RepVision serves as your ultimate workout companion, utilizing advanced technology to monitor your movements through your camera. This feature assists in perfecting your form and accurately counting your repetitions.
            </Typography>
            <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
                By logging in with your Google account, your progress and workout history are securely saved, allowing you to track the number of reps you've completed and when. If you prefer not to sign up, you can still explore the Workout Tracker; however, your session data will not be stored.
            </Typography>
            <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
                Please note that the app is a work in progress, with plans to add more workouts, timing features, and real-time feedback to enhance your fitness journey.
            </Typography>

            {isAuthenticated ? (
                <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
                    Select a workout to get started:{" "}
                    <MuiLink
                        component={RouterLink}
                        to="/workouts"
                        sx={{
                            color: 'primary.main',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: 'secondary.main',
                                textDecoration: 'none',
                            },
                        }}
                    >
                        Select workout
                    </MuiLink>
                </Typography>
            ) : (
                <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
                    Not ready to sign up? No problem! You can check out the Workout Tracker without signing in by following this link:{" "}
                    <MuiLink
                        component={RouterLink}
                        to="/workouts"
                        sx={{
                            color: 'primary.main',
                            textDecoration: 'underline',
                            '&:hover': {
                                color: 'secondary.main',
                                textDecoration: 'none',
                            },
                        }}
                    >
                        Select workout
                    </MuiLink>
                </Typography>
            )}

            <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
               Like the app? Install it using Google Chrome:{" "}
                <MuiLink
                    component={RouterLink}
                    to="/downloadApp"
                    sx={{
                        color: 'primary.main',
                        textDecoration: 'underline',
                        '&:hover': {
                            color: 'secondary.main',
                            textDecoration: 'none',
                        },
                    }}
                >
                    Download App
                </MuiLink>
            </Typography>

            <Typography variant="body2" component="p" sx={{ mt: 4, color: 'text.secondary', textAlign: 'center' }}>
                **Disclaimer**: RepVision is intended for informational and educational purposes only. Always consult with a qualified healthcare professional before starting any new exercise program. By using this app, you acknowledge that you are participating in physical activities at your own risk. The developers of RepVision are not responsible for any injuries or damages that may occur as a result of using this app.
            </Typography>

        </CustomLayout>
    );
};

export default HomePage;