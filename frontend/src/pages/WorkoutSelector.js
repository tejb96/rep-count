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
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WorkoutSelector = () => {
  const workouts = [
    // {
    //   id: 'deadlift',
    //   name: 'Conventional Deadlift',
    //   description: 'Track form and count reps for conventional deadlifts',
    //   icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
    // },
    {
      id: 'PushUps',
      name: 'Push Ups',
      instructions: 'Position the camera directly in front of you at wrist level, ensuring it captures your head and upper body as you perform the push-ups. This angle will provide a clear view of your form and technique.'
    },
    {
      id: 'SitUps',
      name: 'Sit Ups',
      instructions: 'Place the camera at the foot end of your exercise mat, elevated slightly above ground level. This angle will allow for a clear view of your movements as you perform the sit-ups, ensuring proper alignment and technique.'
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
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
      variant="h4" 
      gutterBottom 
      sx={{ textAlign: 'center', color: 'text.primary', fontWeight: 'bold' }}
    >
      Select A Workout
    </Typography>
      <Grid container spacing={3}>
        {workouts.map((workout) => (
          <Grid item xs={12} sm={6} md={4} key={workout.id}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleWorkoutSelect(workout)}
                sx={{ height: '100%' }}
                disabled={status === 'loading'}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    {workout.icon}
                    <Typography variant="h6" component="div">
                      {workout.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {workout.instructions}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WorkoutSelector;