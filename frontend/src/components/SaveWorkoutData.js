import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const SaveWorkoutData = ({ workoutID, reps, onSaveComplete }) => {
    const dispatch = useDispatch();
    const { isAuthenticated, me } = useSelector((state) => state.auth);

    useEffect(() => {
        const saveWorkoutData = async () => {
            // Check if reps are greater than 0
            if (isAuthenticated && me && reps > 0) {
                try {
                    const workoutData = {
                        user: me._id, // Assuming the user ID is stored in me._id
                        type: workoutID,
                        repetitions: reps,
                        date: new Date(),
                    };

                    await axios.post('/api/reps', workoutData);
                    console.log('Workout data saved successfully');
                    if (onSaveComplete) {
                        onSaveComplete();
                    }
                } catch (error) {
                    console.error('Error saving workout data:', error);
                }
            } else {
                console.log('Workout data not saved: Reps must be greater than 0.');
                if (onSaveComplete) {
                    onSaveComplete(); // Call onSaveComplete even if reps are 0 to reset the state
                }
            }
        };

        saveWorkoutData();
    }, [isAuthenticated, me, workoutID, reps, onSaveComplete]);

    return null; // This component does not render anything
};

export default SaveWorkoutData;