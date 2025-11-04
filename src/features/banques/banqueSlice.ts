import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface Banque {
  id: number;
  nom: string;
  code: string;
  guichet?: string;
  numero_compte: string;
  iban: string;
}

interface BanqueState {
  banques: Banque[];
  selectedBanque: Banque | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BanqueState = {
  banques: [],
  selectedBanque: null,
  isLoading: false,
  error: null,
};

export const fetchBanques = createAsyncThunk(
  'banques/fetchBanques',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/banques');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const createBanque = createAsyncThunk(
  'banques/createBanque',
  async (banqueData: Partial<Banque>, { rejectWithValue }) => {
    try {
      const response = await api.post('/banques', banqueData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const updateBanque = createAsyncThunk(
  'banques/updateBanque',
  async ({ id, banqueData }: { id: number; banqueData: Partial<Banque> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/banques/${id}`, banqueData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const deleteBanque = createAsyncThunk(
  'banques/deleteBanque',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/banques/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

const banqueSlice = createSlice({
  name: 'banques',
  initialState,
  reducers: {
    setSelectedBanque(state, action) {
      state.selectedBanque = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanques.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBanques.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banques = action.payload;
      })
      .addCase(fetchBanques.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBanque.fulfilled, (state, action) => {
        state.banques.push(action.payload);
      })
      .addCase(updateBanque.fulfilled, (state, action) => {
        state.banques = state.banques.map((banque) =>
          banque.id === action.payload.id ? action.payload : banque
        );
      })
      .addCase(deleteBanque.fulfilled, (state, action) => {
        state.banques = state.banques.filter((banque) => banque.id !== action.payload);
      });
  },
});

export const { setSelectedBanque } = banqueSlice.actions;
export default banqueSlice.reducer;
