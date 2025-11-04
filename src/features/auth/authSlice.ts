import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  roles: Array<{
    id: number;
    nom: string;
    slug: string;
  }>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
  const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string; password_confirmation: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
  await api.post('/auth/logout');
      localStorage.removeItem('token');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const getCurrentUser = createAsyncThunk<User>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/user');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload as User;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;