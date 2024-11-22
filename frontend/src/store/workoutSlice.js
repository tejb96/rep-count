import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const selectWorkoutAsync = createAsyncThunk(
  'workout/selectWorkoutAsync',
  async (workout) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!workout?.id || !workout?.name) {
      throw new Error('Invalid workout data');
    }
    
    return {
      id: workout.id,
      name: workout.name
    };
  }
);

const workoutSlice = createSlice({
  name: 'workout',
  initialState: {
    selectedWorkoutID: null,
    selectedWorkoutName: null,
    repCount: 0,
    poses: [],
    currentPose: null,
    isLoading: false,
    status: 'idle',
    error: null
  },
  reducers: {
    resetSelectedWorkout: (state) => {
      state.selectedWorkoutID = null;
      state.selectedWorkoutName = null;
      state.isLoading = false;
      state.status = 'idle';
      state.error = null;
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectWorkoutAsync.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectWorkoutAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.selectedWorkoutID = action.payload.id;
        state.selectedWorkoutName = action.payload.name;
        state.error = null;
      })
      .addCase(selectWorkoutAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const {
  resetSelectedWorkout,
  updateRepCount,
  resetRepCount,
  updatePoses,
  setCurrentPose
} = workoutSlice.actions;

export default workoutSlice.reducer;