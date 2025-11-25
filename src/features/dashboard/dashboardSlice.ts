import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface GeneralStats {
  total_agents: number;
  total_contrats: number;
  total_paiements: number;
  total_structures: number;
}

export interface FinanceStats {
  contrats: {
    montant_total: number;
    montant_net: number;
    montant_retenu: number;
  };
  paiements: {
    montant_total: number;
    montant_net: number;
    montant_retenu: number;
  };
}

export interface StateDistribution {
  state_name: string;
  count: number;
  percentage: number;
}

export interface ExpiringContract {
  id: number;
  agent_name: string;
  fonction: string;
  date_fin: string;
  days_remaining: number;
  montant_total: number;
}

export interface AgentByStructure {
  structure_name: string;
  agent_count: number;
  contrat_count: number;
}

export interface RecentActivity {
  type: string;
  action: string;
  description: string;
  agent_name: string;
  date: string;
  date_human: string;
}

export interface DashboardData {
  general: GeneralStats;
  finances: FinanceStats;
  contrats_by_state: StateDistribution[];
  paiements_by_state: StateDistribution[];
  expiring_contracts: ExpiringContract[];
  agents_by_structure: AgentByStructure[];
  recent_activities: RecentActivity[];
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement des statistiques');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
