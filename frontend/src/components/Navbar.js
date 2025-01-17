import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { logOutUser } from '../store/authSlice';

const Navbar = ({ children }) => { // Accept children as a prop
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogOut = (event) => {
        event.preventDefault();
        dispatch(logOutUser({ navigate })); // Pass the navigate function as an argument
    };

    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: 'darkblue', paddingLeft: '30px', paddingRight: '10px', height: '60px' }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'white', margin: 0, whiteSpace: 'nowrap' }}>
                        Workout Tracker
                    </Typography>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        {auth.isAuthenticated ? (
                            <>
                                <Button color="inherit" component={Link} to="/users">Users</Button>
                                <Button color="inherit" component={Link} to={`/${auth.me.username}`}>Profile</Button>
                                {auth.me?.role === 'ADMIN' && (
                                    <Button color="inherit" component={Link} to="/admin">Admin</Button>
                                )}
                                <img
                                    src={auth.me.avatar}
                                    alt="User Avatar"
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        marginLeft: '20px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <IconButton color="inherit" onClick={onLogOut}>
                                    Log out
                                </IconButton>
                            </>
                        ) : (
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <div>
                {children} {/* Render the children here */}
            </div>
        </div>
    );
};

export default Navbar;
