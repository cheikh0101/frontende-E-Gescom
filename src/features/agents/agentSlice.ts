import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface Agent {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  structure_id: number;
}

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AgentState = {
  agents: [],
  selectedAgent: null,
  isLoading: false,
  error: null,
};

export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/agents');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const createAgent = createAsyncThunk(
  'agents/createAgent',
  async (agentData: Partial<Agent>, { rejectWithValue }) => {
    try {
      const response = await api.post('/agents', agentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const updateAgent = createAsyncThunk(
  'agents/updateAgent',
  async ({ id, agentData }: { id: number; agentData: Partial<Agent> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/agents/${id}`, agentData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

export const deleteAgent = createAsyncThunk(
  'agents/deleteAgent',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/agents/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Une erreur est survenue');
    }
  }
);

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setSelectedAgent(state, action) {
      state.selectedAgent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createAgent.fulfilled, (state, action) => {
        state.agents.push(action.payload);
      })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.agents = state.agents.map((agent) =>
          agent.id === action.payload.id ? action.payload : agent
        );
      })
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.agents = state.agents.filter((agent) => agent.id !== action.payload);
      });
  },
});

export const { setSelectedAgent } = agentSlice.actions;
export default agentSlice.reducer;
