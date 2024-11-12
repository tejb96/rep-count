import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CardActionArea
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const workouts = [
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    description: 'Track form and count reps for conventional deadlifts',
    icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
  },
  // Add more workouts here as you develop them
  // {
  //   id: 'squat',
  //   name: 'Squats',
  //   description: 'Track form and count reps for squats',
  //   icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
  // },
];

const WorkoutSelector = ({ onSelectWorkout }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Select Workout
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
                onClick={() => onSelectWorkout(workout.id)}
                sx={{ height: '100%' }}
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
                      {workout.description}
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
