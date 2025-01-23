// Updated code for Navbar.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    createTheme,
    ThemeProvider,
    Box,
} from '@mui/material';
import { logOutUser } from '../store/authSlice';
import CssBaseline from '@mui/material/CssBaseline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    // console.log(auth.me.avatar, "navbar line 22");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log(auth);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#1d1d1d',
            },
            text: {
                primary: '#ffffff',
                secondary: '#aaaaaa',
            },
        },
    });

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
            background: {
                default: '#f5f5f5',
                paper: '#ffffff',
            },
            text: {
                primary: '#000000',
                secondary: '#555555',
            },
        },
    });

    const handleToggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const onLogOut = (event) => {
        event.preventDefault();
        dispatch(logOutUser({ navigate }));
    };

    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <CssBaseline />
            <Box>
                <AppBar
                    position="static"
                    sx={{
                        backgroundColor: theme === 'dark' ? 'darkblue' : '#0077BE',
                        paddingLeft: '30px',
                        paddingRight: '10px',
                        height: '60px',
                    }}
                >
                    <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'white',
                                margin: 0,
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                letterSpacing: 1.5,
                            }}
                        >
                            <img src="/logo.jpg" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                            Workout Tracker
                        </Typography>

                        <div style={{ flex: 1 }} />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button color="inherit" component={Link} to="/">
                                Home
                            </Button>
                            {auth.isAuthenticated ? (
                                <>
                                    <Button color="inherit" component={Link} to="/records">
                                        Records
                                    </Button>
                                    <IconButton
                                        color="inherit"
                                        component={Link}
                                        to={`/${auth.me.username}`}
                                        sx={{
                                            width: '40px',
                                            height: '40px',
                                            padding: 0, // Remove padding to keep it circular
                                            marginLeft: '20px',
                                        }}
                                    >
                                        <img
                                            src={auth.me.user.avatar}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </IconButton>
                                    {auth.me?.role === 'ADMIN' && (
                                        <Button color="inherit" component={Link} to="/admin">
                                            Admin
                                        </Button>
                                    )}

                                    <IconButton color="inherit" onClick={onLogOut}>
                                        Log out
                                    </IconButton>
                                </>
                            ) : (
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                            )}
                            <IconButton color="inherit" onClick={handleToggleTheme}>
                                {theme === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <Box mt={2}>{children}</Box>
            </Box>
        </ThemeProvider>
    );
};

export default Navbar;
