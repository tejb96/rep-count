import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Container, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useDispatch, useSelector } from 'react-redux';

import { GOOGLE_AUTH_LINK } from '../constants/index';
import { logInUserWithOauth } from '../store/authSlice';

const Login = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for existing OAuth cookie and dispatch login action if available
        const cookieJwt = Cookies.get('x-auth-cookie');
        if (cookieJwt) {
            Cookies.remove('x-auth-cookie'); // Remove the cookie once it's used
            dispatch(logInUserWithOauth()); // Trigger login with OAuth
        }
        if (auth.isAuthenticated) {
            navigate('/'); // Redirect to the root if authenticated
        }
    }, [dispatch, auth.isAuthenticated, navigate]);

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" gutterBottom>
                Log In
            </Typography>
            <Typography variant="h6" gutterBottom>
                Log in with Google
            </Typography>
            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<GoogleIcon />}
                    href={GOOGLE_AUTH_LINK} // Redirect to Google login
                    sx={{
                        backgroundColor: '#4285F4',
                        '&:hover': { backgroundColor: '#357ae8' },
                    }}
                >
                    Login with Google
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
