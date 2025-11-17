import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface EtatPaiement {
  id: number;
  periode: string;
  agent_id: number;
  type: string;
  montant_total: number;
  montant_net: number;
  montant_retenu: number;
  fichier?: string;
}

interface EtatPaiementState {
  etatPaiements: EtatPaiement[];
  selectedEtatPaiement: EtatPaiement | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EtatPaiementState = {
  etatPaiements: [],
  selectedEtatPaiement: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchEtatPaiements = createAsyncThunk(
  'etatPaiements/fetchEtatPaiements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/etat-paiements');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des paiements');
    }
  }
);

export const fetchEtatPaiementsByContrat = createAsyncThunk(
  'etatPaiements/fetchEtatPaiementsByContrat',
  async (contratId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contrats/${contratId}/etat-paiements`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des paiements du contrat');
    }
  }
);

export const createEtatPaiement = createAsyncThunk(
  'etatPaiements/createEtatPaiement',
  async (data: Partial<EtatPaiement>, { rejectWithValue }) => {
    try {
      const response = await api.post('/etat-paiements', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création du paiement');
    }
  }
);

export const updateEtatPaiement = createAsyncThunk(
  'etatPaiements/updateEtatPaiement',
  async ({ id, data }: { id: number; data: Partial<EtatPaiement> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/etat-paiements/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour du paiement');
    }
  }
);

export const deleteEtatPaiement = createAsyncThunk(
  'etatPaiements/deleteEtatPaiement',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/etat-paiements/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du paiement');
    }
  }
);

export const changeEtatPaiementState = createAsyncThunk(
  'etatPaiements/changeEtatPaiementState',
  async ({ id, state_etat_paiement_id }: { id: number; state_etat_paiement_id: number }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/etat-paiements/${id}/change-state`, { state_etat_paiement_id });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du changement d\'état du paiement');
    }
  }
);

// Slice
const etatPaiementSlice = createSlice({
  name: 'etatPaiements',
  initialState,
  reducers: {
    setSelectedEtatPaiement: (state, action) => {
      state.selectedEtatPaiement = action.payload;
    },
    clearSelectedEtatPaiement: (state) => {
      state.selectedEtatPaiement = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch EtatPaiements
      .addCase(fetchEtatPaiements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEtatPaiements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.etatPaiements = action.payload;
      })
      .addCase(fetchEtatPaiements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch EtatPaiements by Contrat
      .addCase(fetchEtatPaiementsByContrat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEtatPaiementsByContrat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.etatPaiements = action.payload;
      })
      .addCase(fetchEtatPaiementsByContrat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create EtatPaiement
      .addCase(createEtatPaiement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEtatPaiement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.etatPaiements.push(action.payload);
      })
      .addCase(createEtatPaiement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update EtatPaiement
      .addCase(updateEtatPaiement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEtatPaiement.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.etatPaiements.findIndex(ep => ep.id === action.payload.id);
        if (index !== -1) {
          state.etatPaiements[index] = action.payload;
        }
      })
      .addCase(updateEtatPaiement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete EtatPaiement
      .addCase(deleteEtatPaiement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEtatPaiement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.etatPaiements = state.etatPaiements.filter(ep => ep.id !== action.payload);
      })
      .addCase(deleteEtatPaiement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Change EtatPaiement State
      .addCase(changeEtatPaiementState.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeEtatPaiementState.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.etatPaiements.findIndex(ep => ep.id === action.payload.id);
        if (index !== -1) {
          state.etatPaiements[index] = action.payload;
        }
      })
      .addCase(changeEtatPaiementState.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedEtatPaiement, clearSelectedEtatPaiement, clearError } = etatPaiementSlice.actions;

export default etatPaiementSlice.reducer;