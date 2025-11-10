import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface StateEtatPaiement {
  id: number;
  code: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
}

interface StateEtatPaiementState {
  stateEtatPaiements: StateEtatPaiement[];
  selectedStateEtatPaiement: StateEtatPaiement | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StateEtatPaiementState = {
  stateEtatPaiements: [],
  selectedStateEtatPaiement: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchStateEtatPaiements = createAsyncThunk(
  'stateEtatPaiements/fetchStateEtatPaiements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/state-etat-paiements');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des états de paiement');
    }
  }
);

export const createStateEtatPaiement = createAsyncThunk(
  'stateEtatPaiements/createStateEtatPaiement',
  async (data: Partial<StateEtatPaiement>, { rejectWithValue }) => {
    try {
      const response = await api.post('/state-etat-paiements', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || error.response?.data?.message || 'Erreur lors de la création de l\'état de paiement');
    }
  }
);

export const updateStateEtatPaiement = createAsyncThunk(
  'stateEtatPaiements/updateStateEtatPaiement',
  async ({ id, data }: { id: number; data: Partial<StateEtatPaiement> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/state-etat-paiements/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || error.response?.data?.message || 'Erreur lors de la mise à jour de l\'état de paiement');
    }
  }
);

export const deleteStateEtatPaiement = createAsyncThunk(
  'stateEtatPaiements/deleteStateEtatPaiement',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/state-etat-paiements/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression de l\'état de paiement');
    }
  }
);

// Slice
const stateEtatPaiementSlice = createSlice({
  name: 'stateEtatPaiements',
  initialState,
  reducers: {
    setSelectedStateEtatPaiement: (state, action) => {
      state.selectedStateEtatPaiement = action.payload;
    },
    clearSelectedStateEtatPaiement: (state) => {
      state.selectedStateEtatPaiement = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch StateEtatPaiements
      .addCase(fetchStateEtatPaiements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStateEtatPaiements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateEtatPaiements = action.payload;
      })
      .addCase(fetchStateEtatPaiements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create StateEtatPaiement
      .addCase(createStateEtatPaiement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStateEtatPaiement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateEtatPaiements.push(action.payload);
      })
      .addCase(createStateEtatPaiement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update StateEtatPaiement
      .addCase(updateStateEtatPaiement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStateEtatPaiement.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.stateEtatPaiements.findIndex(sep => sep.id === action.payload.id);
        if (index !== -1) {
          state.stateEtatPaiements[index] = action.payload;
        }
      })
      .addCase(updateStateEtatPaiement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete StateEtatPaiement
      .addCase(deleteStateEtatPaiement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteStateEtatPaiement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stateEtatPaiements = state.stateEtatPaiements.filter(sep => sep.id !== action.payload);
      })
      .addCase(deleteStateEtatPaiement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedStateEtatPaiement, clearSelectedStateEtatPaiement, clearError } = stateEtatPaiementSlice.actions;

export default stateEtatPaiementSlice.reducer;