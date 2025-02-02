import React from 'react';
import { Typography, Link as MuiLink } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CustomLayout from '../components/customLayout';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <CustomLayout>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FitnessCenterIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Welcome to Your Ultimate Workout Companion
            </Typography>
            <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
                Imagine a personal coach that not only guides your workouts but also tracks your progress effortlessly. Our app uses cutting-edge technology to monitor your movements through your camera, helping you perfect your form and count your reps accurately.
            </Typography>
            <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
                Whether you're a fitness enthusiast or just starting, this tracker adapts to your needs, providing insightful feedback and keeping you motivated.
            </Typography>
            <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
                Ready to elevate your fitness journey? Sign up effortlessly by logging in with your Google account. This way, your progress and workout history are securely saved, allowing you to track how many reps you’ve done and when.
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
        </CustomLayout>
    );
};

export default HomePage;