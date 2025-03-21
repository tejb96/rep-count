// Profile.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Box,
    Typography,
    Avatar,
    Paper,
    Grid2
} from '@mui/material';
import CustomLayout from '../components/customLayout';

const Profile = () => {
    // Get user data from Redux store
    const { me } = useSelector((state) => state.auth);

    // If no user data, show loading or redirect
    if (!me) {
        return (
            <CustomLayout>
                <Container>
                    <Typography>Loading profile...</Typography>
                </Container>
            </CustomLayout>
        );
    }

    return (
        <CustomLayout>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Grid2 container spacing={3}>
                        {/* Avatar Section */}
                        <Grid2 item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Avatar
                                src={me.user.avatar}
                                alt={me.user.name}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    mx: 'auto',
                                    mb: 2,
                                    objectFit: 'cover'
                                }}
                            />
                            <Typography variant="h5" gutterBottom>
                                {me.user.name}
                            </Typography>
                        </Grid2>

                        {/* User Info Section */}
                        <Grid2 item xs={12} md={8}>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Profile Information
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1">
                                        {me.user.email}
                                    </Typography>
                                </Box>

                                {/*<Box sx={{ mb: 2 }}>*/}
                                {/*    <Typography variant="subtitle2" color="text.secondary">*/}
                                {/*        Role*/}
                                {/*    </Typography>*/}
                                {/*    <Typography variant="body1">*/}
                                {/*        {me.user.role}*/}
                                {/*    </Typography>*/}
                                {/*</Box>*/}
                            </Box>
                        </Grid2>
                    </Grid2>
                </Paper>
            </Container>
        </CustomLayout>
    );
};

export default Profile;