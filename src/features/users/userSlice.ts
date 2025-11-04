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

interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

// Initial state
const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number = 1, { rejectWithValue }) => {
    try {
  const response = await api.get(`/users?page=${page}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
  const response = await api.post('/users', userData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: Partial<User> }, { rejectWithValue }) => {
    try {
  const response = await api.put(`/users/${id}`, userData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
  await api.delete(`/users/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.totalPages = action.payload.meta.last_page;
        state.currentPage = action.payload.meta.current_page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export const { setSelectedUser, clearError } = userSlice.actions;
export default userSlice.reducer;