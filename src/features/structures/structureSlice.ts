import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface Structure {
  id: number;
  nom: string;
  code: string;
}

interface StructureState {
  structures: Structure[];
  selectedStructure: Structure | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StructureState = {
  structures: [],
  selectedStructure: null,
  isLoading: false,
  error: null,
};

export const fetchStructures = createAsyncThunk(
  'structures/fetchStructures',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/structures');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const createStructure = createAsyncThunk(
  'structures/createStructure',
  async (structureData: Partial<Structure>, { rejectWithValue }) => {
    try {
      const response = await api.post('/structures', structureData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const updateStructure = createAsyncThunk(
  'structures/updateStructure',
  async ({ id, structureData }: { id: number; structureData: Partial<Structure> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/structures/${id}`, structureData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const deleteStructure = createAsyncThunk(
  'structures/deleteStructure',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/structures/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

const structureSlice = createSlice({
  name: 'structures',
  initialState,
  reducers: {
    setSelectedStructure(state, action) {
      state.selectedStructure = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStructures.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStructures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.structures = action.payload;
      })
      .addCase(fetchStructures.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createStructure.fulfilled, (state, action) => {
        state.structures.push(action.payload);
      })
      .addCase(updateStructure.fulfilled, (state, action) => {
        state.structures = state.structures.map((structure) =>
          structure.id === action.payload.id ? action.payload : structure
        );
      })
      .addCase(deleteStructure.fulfilled, (state, action) => {
        state.structures = state.structures.filter((structure) => structure.id !== action.payload);
      });
  },
});

export const { setSelectedStructure } = structureSlice.actions;
export default structureSlice.reducer;
