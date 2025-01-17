import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: false,
    me: null,
    error: null,
    appLoaded: false,
};

// Function to attach token to headers
const attachTokenToHeaders = (getState) => {
    const token = getState().auth.token;

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return config;
};

// Async thunk for logging in with OAuth
export const logInUserWithOauth = createAsyncThunk('auth/logInUserWithOauth', async (token, { getState, rejectWithValue }) => {
    try {
        const headers = attachTokenToHeaders(getState); // Use the function to get headers
        const response = await axios.get('/api/users/me', headers); // Use the headers in the request
        localStorage.setItem('token', token);
        return { me: response.data.me, token };
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

// Async thunk for logging out
export const logOutUser = createAsyncThunk('auth/logOutUser', async ({ navigate }, { rejectWithValue }) => {
    try {
        await axios.get('/auth/logout');
        localStorage.removeItem('token');
        navigate('/'); // Use the navigate function to redirect the user
    } catch (err) {
        return rejectWithValue(err.message);
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
                state.token = action.payload.token;
                state.me = action.payload.me;
                state.error = null;
            })
            .addCase(logInUserWithOauth.rejected, (state, action) => {
                localStorage.removeItem('token');
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
                state.token = null;
                state.me = null;
                state.isAuthenticated = false;
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
