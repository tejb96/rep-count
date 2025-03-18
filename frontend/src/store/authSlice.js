import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../config/axios';

const initialState = {
    isAuthenticated: false,
    isLoading: false,
    me: null,
    error: null,
    appLoaded: false,
};

// Async thunk for logging in with OAuth
export const logInUserWithOauth = createAsyncThunk('auth/logInUserWithOauth', async (_, { rejectWithValue }) => {
    try {
        // Fetch the authenticated user's data after successful login
        // console.log('logInUserWithOauth');
        const response = await axiosInstance.get('/api/users/me');
        return { me: response.data };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to log in');
    }
});

// Async thunk for logging out
export const logOutUser = createAsyncThunk('auth/logOutUser', async ({ navigate }, { rejectWithValue }) => {
    try {
        await axiosInstance.get('/auth/logout'); // Clear the  cookie
        navigate('/'); // Redirect to the home page
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to log out');
    }
});

// Create the slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logInUserWithOauth.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logInUserWithOauth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.me = action.payload.me; // Store user data
                state.error = null;
            })
            .addCase(logInUserWithOauth.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.me = null;
                state.error = action.payload; // Set error message
            })
            .addCase(logOutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logOutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.me = null;
                state.error = null; // Clear error on logout
            })
            .addCase(logOutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Set error message if logout fails
            });
    },
});

// Export the actions and reducer
export const { resetError } = authSlice.actions;
export default authSlice.reducer;
