import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../config/axios';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box,
} from '@mui/material';
import { format } from 'date-fns'; // For date formatting

const WorkoutHistory = () => {
    const { isAuthenticated, me } = useSelector((state) => state.auth);
    const [repetitions, setRepetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkoutData = async () => {
            if (!isAuthenticated || !me) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axiosInstance.get(`/api/reps/${me._id}`);
                setRepetitions(response.data.repetitions || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching workout data');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkoutData();
    }, [isAuthenticated, me]);

    if (!isAuthenticated) {
        return (
            <Container>
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    Please log in to view your workout history
                </Typography>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" align="center" sx={{ mt: 4 }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Workout History
            </Typography>

            {repetitions.length === 0 ? (
                <Typography variant="body1" align="center">
                    No workout data available yet. Start tracking your workouts!
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Exercise Type</TableCell>
                                <TableCell align="right">Repetitions</TableCell>
                                <TableCell>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {repetitions.map((rep) => (
                                <TableRow key={rep._id}>
                                    <TableCell component="th" scope="row">
                                        {rep.type}
                                    </TableCell>
                                    <TableCell align="right">{rep.repetitions}</TableCell>
                                    <TableCell>
                                        {format(new Date(rep.date), 'MMM dd, yyyy HH:mm')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default WorkoutHistory;