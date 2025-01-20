import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Container>
            <Box sx={{ my: 4, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2, p: 4, boxShadow: 3 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    <FitnessCenterIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Welcome to Your Ultimate Workout Companion
                </Typography>
                <Typography variant="h6" component="p" sx={{ mt: 2, color: '#555' }}>
                    Imagine a personal coach that not only guides your workouts but also tracks your progress effortlessly. Our app uses cutting-edge technology to monitor your movements through your camera, helping you perfect your form and count your reps accurately.
                </Typography>
                <Typography variant="h6" component="p" sx={{ mt: 2, color: '#555' }}>
                    Whether you're a fitness enthusiast or just starting, this tracker adapts to your needs, providing insightful feedback and keeping you motivated.
                </Typography>
                <Typography variant="h6" component="p" sx={{ mt: 2, color: '#555' }}>
                    Ready to elevate your fitness journey? Sign up effortlessly with your Google account for FREE. This way, your progress and workout history are securely saved, allowing you to track how many reps you’ve done and when.
                </Typography>
                <Button variant="contained" color="primary" component={Link} to="/signup" sx={{ mt: 3, px: 4 }}>
                    Sign Up with Google
                </Button>
                <Typography variant="h6" component="p" sx={{ mt: 2, color: '#555' }}>
                    Not ready to sign up? No problem! You can check out the wWorkout Tracker without signing in: <Link to="/workouts" sx={{ color: '#1976d2', textDecoration: 'underline' }}>Select workout</Link>.
                </Typography>
            </Box>
        </Container>
    );
};

export default HomePage;
