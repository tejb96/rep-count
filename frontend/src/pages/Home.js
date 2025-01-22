import React from 'react';
import { Typography, Button, Link } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CustomLayout from '../components/customLayout';

const HomePage = () => {
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
            <Typography variant="h6" component="p" sx={{ mt: 2, color: 'text.secondary' }}>
                Not ready to sign up? No problem! You can check out the Workout Tracker without signing in by following this link: <Link to="/workouts" sx={{ textDecoration: 'underline' }}>Select workout</Link>.
            </Typography>
        </CustomLayout>
    );
};

export default HomePage;
