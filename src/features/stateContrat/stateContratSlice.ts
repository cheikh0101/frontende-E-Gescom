import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface StateContrat {
  id: number;
  libelle: string;
  description?: string;
}

interface StateContratState {
  stateContrats: StateContrat[];
  selectedStateContrat: StateContrat | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StateContratState = {
  stateContrats: [],
  selectedStateContrat: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchStateContrats = createAsyncThunk(
  'stateContrats/fetchStateContrats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/state-contrats');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des états de contrat');
    }
  }
);

export const createStateContrat = createAsyncThunk(
  'stateContrats/createStateContrat',
  async (data: Partial<StateContrat>, { rejectWithValue }) => {
    try {
      const response = await api.post('/state-contrats', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création de l\'état de contrat');
    }
  }
);

export const updateStateContrat = createAsyncThunk(
  'stateContrats/updateStateContrat',
  async ({ id, data }: { id: number; data: Partial<StateContrat> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/state-contrats/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'état de contrat');
    }
  }
);

export const deleteStateContrat = createAsyncThunk(
  'stateContrats/deleteStateContrat',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/state-contrats/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de l\'état de contrat');
    }
  }
);

// Slice
const stateContratSlice = createSlice({
  name: 'stateContrats',
  initialState,
  reducers: {
    setSelectedStateContrat: (state, action) => {
      state.selectedStateContrat = action.payload;
    },
    clearSelectedStateContrat: (state) => {
      state.selectedStateContrat = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch StateContrats
      .addCase(fetchStateContrats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStateContrats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateContrats = action.payload;
      })
      .addCase(fetchStateContrats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create StateContrat
      .addCase(createStateContrat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStateContrat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateContrats.push(action.payload);
      })
      .addCase(createStateContrat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update StateContrat
      .addCase(updateStateContrat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStateContrat.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.stateContrats.findIndex(sc => sc.id === action.payload.id);
        if (index !== -1) {
          state.stateContrats[index] = action.payload;
        }
      })
      .addCase(updateStateContrat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete StateContrat
      .addCase(deleteStateContrat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteStateContrat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateContrats = state.stateContrats.filter(sc => sc.id !== action.payload);
      })
      .addCase(deleteStateContrat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedStateContrat, clearSelectedStateContrat, clearError } = stateContratSlice.actions;

export default stateContratSlice.reducer;