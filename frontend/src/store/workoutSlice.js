import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const selectWorkoutAsync = createAsyncThunk(
    'workout/selectWorkoutAsync',
    async (workout) => {

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
    phase: null, // New field to track the current phase of the exercise
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
      state.repCount = action.payload !== undefined
          ? state.repCount += action.payload
          : state.repCount += 1;
    },
    setPhaseWorkout: (state, action) => {
      state.phase = action.payload; // Update the current phase
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
  setPhaseWorkout // Export the new action
} = workoutSlice.actions;

export default workoutSlice.reducer;