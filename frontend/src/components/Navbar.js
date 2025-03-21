import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    createTheme,
    ThemeProvider,
    Box, MenuItem, Menu,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { logOutUser } from '../store/authSlice';
import CssBaseline from '@mui/material/CssBaseline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ children }) => {
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [anchorNav, setAnchorNav] = useState(null);
    const openNav=Boolean(anchorNav);


    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#B89749',
                light: '#F1D698',
                dark: '#8C6F38',
                contrastText: '#1A202C',
            },
            secondary: {
                main: '#0F172A',      // The default color you provided
                light: '#364866',     // Lighter shade of #0F172A
                dark: '#070D15',      // Darker shade of #0F172A
                contrastText: '#FFFFFF' // White for contrast against the dark main color
            },
            background: {
                default: '#F5F5F5',
                paper: '#FFFFFF',
            },
            text: {
                primary: '#1A202C',
                secondary: '#5A6578',
            },
            error: {
                main: '#D9534F',
                light: '#F8E1E0',
            },
            success: {
                main: '#2A9D8F',
            },
        },
        typography: {
            fontFamily: '"Poppins", "Roboto", "Helvetica", sans-serif',
            h6: { fontWeight: 700, letterSpacing: 0.5 },
            button: { textTransform: 'none', fontWeight: 600 },
        },
        shadows: [
            'none',
            ...Array(24).fill('0px 2px 8px rgba(184, 151, 73, 0.15)'),
        ],
        transitions: {
            create: () => 'all 0.3s ease-in-out',
        },
    });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#B89749',
                light: '#F1D698',
                dark: '#8C6F38',
                contrastText: '#0F172A',
            },
            secondary: {
                main: '#6B7280',
                light: '#9CA3AF',
                dark: '#4B5563',
                contrastText: '#1F2937',
            },
            background: {
                default: '#0F172A',
                paper: '#1E293B',
            },
            text: {
                primary: '#E2E8F0',
                secondary: '#94A3B8',
            },
            error: {
                main: '#F28F8F',
                light: '#3C2525',
            },
            success: {
                main: '#4ECDC4',
            },
        },
        typography: {
            fontFamily: '"Poppins", "Roboto", "Helvetica", sans-serif',
            h6: { fontWeight: 700, letterSpacing: 0.5 },
            button: { textTransform: 'none', fontWeight: 600 },
        },
        shadows: [
            'none',
            ...Array(24).fill('0px 2px 10px rgba(184, 151, 73, 0.25)'),
        ],
        transitions: {
            create: () => 'all 0.3s ease-in-out',
        },
    });

    const handleToggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const onLogOut = (event) => {
        event.preventDefault();
        dispatch(logOutUser({ navigate }));
    };

    const handleMenuOpen=(event)=>{
        setAnchorNav(event.target);
    };

    const handleMenuClose=()=>{
        setAnchorNav(null);
    }

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'RepVision';
            case '/workouts': return 'Workout Selection';
            case '/detector': return null;
            case '/login': return 'Login';
            case '/downloadApp': return 'Download RepVision';
            // case '/records': return 'Your Workout Records';
            default: return 'RepVision';
        }
    };

    if (location.pathname === '/detector') {
        return children;
    }

    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <CssBaseline />
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
                <AppBar
                    position="static"
                    sx={{
                        background: theme === 'light'
                            ? 'linear-gradient(90deg, #B89749 30%, #F1D698 100%)' // Light mode: full gradient
                            : 'linear-gradient(90deg, #B89749 30%, #8C6F38 100%)', // Dark mode: darker gold end
                        paddingLeft: '30px',
                        paddingRight: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                        {/* Logo on the left */}
                        <Box sx={{ display:{xs:'none',md:'flex'}, alignItems: 'center' }}>
                            <img
                                src="/logo.jpg"
                                alt="Logo"
                                style={{ height: '60px', marginRight: '10px', borderRadius: '8px' }}
                            />
                        </Box>

                        {/* Centered Title */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'primary.contrastText',
                                fontWeight: 'bold',
                                letterSpacing: 1.5,
                                textAlign: 'center',
                                flexGrow: 1, // Takes available space to center itself
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display:{xs:'none',md:'flex'},
                                justifyContent: 'center',
                            }}
                        >
                            {getPageTitle()}
                        </Typography>

                        {/* Buttons on the right */}
                        <Box sx={{display:{xs:'none',md:'flex'}, alignItems: 'center' }}>
                            {location.pathname ==="/" ? (
                                <Button color="inherit" component={Link} to="/workouts" sx={{ mx: 1 }}>
                                    Workouts
                                </Button>
                            ):(
                                <Button color="inherit" component={Link} to="/" sx={{ mx: 1 }}>
                                    Home
                                </Button>
                            )}

                            {auth.isAuthenticated ? (
                                <>
                                    <Button color="inherit" component={Link} to="/records" sx={{ mx: 1 }}>
                                        Records
                                    </Button>
                                    <IconButton
                                        color="inherit"
                                        component={Link}
                                        to={`/profile`}
                                        sx={{ width: '40px', height: '40px', padding: 0, mx: 1 }}
                                    >
                                        <img
                                            src={auth.me.user.avatar}
                                            alt=""
                                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    </IconButton>
                                    {auth.me?.role === 'ADMIN' && (
                                        <Button color="inherit" component={Link} to="/admin" sx={{ mx: 1 }}>
                                            Admin
                                        </Button>
                                    )}
                                    <Button color="inherit" onClick={onLogOut} sx={{ mx: 1 }}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Button color="inherit" component={Link} to="/login" sx={{ mx: 1 }}>
                                    Login
                                </Button>
                            )}
                            <IconButton color="inherit" onClick={handleToggleTheme} sx={{ mx: 1 }}>
                                {theme === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                        </Box>

                        {/* hamburger menu*/}
                        <Box sx={{display:{xs: 'flex', md:'none'}}}>
                            <IconButton size='large' edge='start' color='inherit' onClick={handleMenuOpen}>
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                anchorNav={anchorNav}
                                open={openNav}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                {location.pathname === "/" ? (
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/workouts">
                                        Workouts
                                    </MenuItem>
                                ) : (
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/">
                                        Home
                                    </MenuItem>
                                )}
                                {auth.isAuthenticated ? (
                                    <>
                                        <MenuItem onClick={handleMenuClose} component={Link} to="/records">
                                            Records
                                        </MenuItem>
                                        <MenuItem onClick={handleMenuClose} component={Link} to={`/profile`}>
                                            Profile
                                        </MenuItem>
                                        {auth.me?.role === 'ADMIN' && (
                                            <MenuItem onClick={handleMenuClose} component={Link} to="/admin">
                                                Admin
                                            </MenuItem>
                                        )}
                                        <MenuItem onClick={(e) => { handleMenuClose(); onLogOut(e); }}>
                                            Logout
                                        </MenuItem>
                                    </>
                                ) : (
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/login">
                                        Login
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => { handleToggleTheme(); }}>
                                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                                </MenuItem>
                            </Menu>
                        </Box>
                        <Box sx={{ display:{xs:'flex',md:'none'}, alignItems: 'center' }}>
                            <img
                                src="/logo.jpg"
                                alt="Logo"
                                style={{ height: '60px', marginRight: '10px', borderRadius: '8px' }}
                            />
                        </Box>

                    </Toolbar>
                </AppBar>
                <Box mt={3} px={2}>{children}</Box>
            </Box>
        </ThemeProvider>
    );
};

export default Navbar;