// Login.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useSelector } from 'react-redux';
import CustomLayout from '../components/customLayout';
import { GOOGLE_AUTH_LINK } from '../constants/index';

const Login = () => {
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate('/'); // Redirect to home if already authenticated
        }
    }, [auth.isAuthenticated, navigate]);

    return (
        <CustomLayout>
            <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
                <Box>
                    <img src="/logo.jpg" alt="Logo" style={{ height: '200px', marginRight: '10px' }} />
                </Box>
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                    Use your Google account to sign up or log in.
                </Typography>

                <Box mt={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GoogleIcon />}
                        href={GOOGLE_AUTH_LINK}
                        sx={{
                            backgroundColor: 'primary',
                            '&:hover': { backgroundColor: 'secondary' },
                            fontSize: '16px',
                            padding: '12px 24px',
                            textTransform: 'none',
                        }}
                    >
                        Log in / Sign up with Google
                    </Button>
                </Box>
            </Container>
        </CustomLayout>
    );
};

export default Login;
