import React from 'react';
import { Container, Paper, Box } from '@mui/material';

function CustomLayout({ children, ...props }) {
    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', ...props.sx }}>
                <Box sx={{ p: { xs: 3, sm: 4 }, boxShadow: 3 }}>
                    {children}
                </Box>
            </Paper>
        </Container>
    );
}

export default CustomLayout;
