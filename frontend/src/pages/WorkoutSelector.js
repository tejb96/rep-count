import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetRepCount, selectWorkoutAsync } from '../store/workoutSlice';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2 as Grid,
  CardActionArea,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.secondary.contrastText,
  borderRadius: 12,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
  },
}));

const WorkoutSelector = () => {
  const theme = useTheme();
  const workouts = [
    {
      id: 'PushUps',
      name: 'Push Ups',
      instructions: 'Position the camera directly in front of you at wrist level, ensuring it captures your head and upper body.',
      icon: <FitnessCenterIcon sx={{ fontSize: 70, color: theme.palette.secondary.contrastText }} />,
    },
    {
      id: 'SitUps',
      name: 'Sit Ups',
      instructions: 'Place the camera at the foot end of your exercise mat, elevated slightly above ground level.',
      icon: <DirectionsRunIcon sx={{ fontSize: 70, color: theme.palette.secondary.contrastText }} />,
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.workout);

  React.useEffect(() => {
    if (status === 'succeeded') {
      navigate('/detector');
    }
  }, [status, navigate]);

  const handleWorkoutSelect = async (workout) => {
    dispatch(resetRepCount());
    try {
      await dispatch(selectWorkoutAsync(workout)).unwrap();
    } catch (err) {
      console.error('Failed to select workout:', err);
    }
  };

  if (status === 'loading') {
    return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default'
        }}>
          <CircularProgress size={70} thickness={5} sx={{ color: 'secondary.main' }} />
        </Box>
    );
  }

  if (error) {
    return (
        <Box sx={{
          p: 4,
          bgcolor: 'error.light',
          borderRadius: 2,
          m: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 'bold' }}>
            Error: {error}
          </Typography>
        </Box>
    );
  }

  return (
      <Box sx={{ p: 5, bgcolor: 'background.default' }}>
        {/*<Typography*/}
        {/*    variant="h2"*/}
        {/*    gutterBottom*/}
        {/*    sx={{*/}
        {/*      textAlign: 'center',*/}
        {/*      color: 'primary.main',*/}
        {/*      fontWeight: 'bold',*/}
        {/*      mb: 6,*/}
        {/*      textShadow: `2px 2px 4px ${theme.palette.grey[theme.palette.mode === 'light' ? 400 : 800]}`,*/}
        {/*    }}*/}
        {/*>*/}
        {/*  Your Workout Journey*/}
        {/*</Typography>*/}
        <Grid container spacing={4} justifyContent="center">
          {workouts.map((workout) => (
              <Grid item xs={12} sm={6} md={4} key={workout.id}>
                <StyledCard>
                  <CardActionArea
                      onClick={() => handleWorkoutSelect(workout)}
                      sx={{ height: '100%', p: 3 }}
                      disabled={status === 'loading'}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        {workout.icon}
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}
                        >
                          {workout.name}
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                              opacity: 0.95,
                              lineHeight: 1.7,
                              fontSize: '1.1rem'
                            }}
                        >
                          {workout.instructions}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Grid>
          ))}
        </Grid>
      </Box>
  );
};

export default WorkoutSelector;