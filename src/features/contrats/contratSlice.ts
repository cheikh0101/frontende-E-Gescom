import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface Contrat {
  id: number;
  type: string;
  date_debut: string;
  date_fin: string;
  montant_total: number;
  montant_net: number;
  montant_retenu: number;
  fonction: string;
  fichier?: string;
  date_resiliation?: string;
  agent_id: number;
}

interface ContratState {
  contrats: Contrat[];
  selectedContrat: Contrat | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContratState = {
  contrats: [],
  selectedContrat: null,
  isLoading: false,
  error: null,
};

export const fetchContrats = createAsyncThunk(
  'contrats/fetchContrats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contrats');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const createContrat = createAsyncThunk(
  'contrats/createContrat',
  async (contratData: Partial<Contrat>, { rejectWithValue }) => {
    try {
      const response = await api.post('/contrats', contratData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const updateContrat = createAsyncThunk(
  'contrats/updateContrat',
  async ({ id, contratData }: { id: number; contratData: Partial<Contrat> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contrats/${id}`, contratData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const deleteContrat = createAsyncThunk(
  'contrats/deleteContrat',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/contrats/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

const contratSlice = createSlice({
  name: 'contrats',
  initialState,
  reducers: {
    setSelectedContrat(state, action) {
      state.selectedContrat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContrats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContrats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contrats = action.payload;
      })
      .addCase(fetchContrats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createContrat.fulfilled, (state, action) => {
        state.contrats.push(action.payload);
      })
      .addCase(updateContrat.fulfilled, (state, action) => {
        state.contrats = state.contrats.map((contrat) =>
          contrat.id === action.payload.id ? action.payload : contrat
        );
      })
      .addCase(deleteContrat.fulfilled, (state, action) => {
        state.contrats = state.contrats.filter((contrat) => contrat.id !== action.payload);
      });
  },
});

export const { setSelectedContrat } = contratSlice.actions;
export default contratSlice.reducer;
