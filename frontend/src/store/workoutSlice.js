import { createSlice } from '@reduxjs/toolkit';

const workoutSlice = createSlice({
  name: 'workout',
  initialState: {
    selectedWorkoutID: null,
    selectedWorkoutName: null,
    repCount: 0,
    poses: [],
    currentPose: null,
    isLoading: false, // Add a loading state
  },
  reducers: {
    setSelectedWorkout: (state, action) => {
      const { id, name } = action.payload; // Destructure id and name from the payload
      state.selectedWorkoutID = id;        // Update selectedWorkoutID
      state.selectedWorkoutName = name;    // Update selectedWorkoutName
      state.isLoading = false;             // Set isLoading to false when workout is selected
    },
    resetSelectedWorkout: (state) => {
      state.selectedWorkoutID = null;
      state.selectedWorkoutName = null;
      state.isLoading = false;             // Reset isLoading when workout is reset
    },
    updateRepCount: (state, action) => {
      state.repCount = action.payload;
    },
    updatePoses: (state, action) => {
      state.poses = action.payload;
    },
    setCurrentPose: (state, action) => {
      state.currentPose = action.payload;
    },
    resetRepCount: (state) => {
      state.repCount = 0;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload; // Set loading state (true or false)
    }
  }
});

export const {
  setSelectedWorkout,
  updateRepCount,
  resetRepCount,
  updatePoses,
  setCurrentPose,
  resetSelectedWorkout,
  setLoading // Export the setLoading action
} = workoutSlice.actions;

export default workoutSlice.reducer;
