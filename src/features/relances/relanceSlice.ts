import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
export interface InactiveUser {
  id: number;
  name: string;
  email: string;
  last_activity_at: string | null;
  jours_inactivite: number;
}

export interface Relance {
  id: number;
  user_id: number;
  jours_inactivite: number;
  type_relance: string;
  message: string;
  statut: 'en_attente_validation' | 'approuve' | 'rejete' | 'envoye' | 'echoue';
  date_approbation: string | null;
  approuve_par: number | null;
  date_envoi: string | null;
  date_lecture: string | null;
  erreur: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  approvedBy?: {
    id: number;
    name: string;
  };
}

export interface InactivityStats {
  total_users: number;
  inactive_7_days: number;
  inactive_15_days: number;
  inactive_30_days: number;
  never_active: number;
  active_users: number;
  activity_rate: number;
}

export interface RelancesStats {
  pending: number;
  approved: number;
  sent: number;
  rejected: number;
  failed: number;
  sent_today: number;
  sent_this_week: number;
}

export interface Statistics {
  inactivity: InactivityStats;
  relances: RelancesStats;
}

interface RelanceState {
  inactiveUsers: InactiveUser[];
  pendingRelances: Relance[];
  relanceHistory: Relance[];
  statistics: Statistics | null;
  loading: boolean;
  error: string | null;
  actionLoading: boolean; // For approve/reject actions
}

const initialState: RelanceState = {
  inactiveUsers: [],
  pendingRelances: [],
  relanceHistory: [],
  statistics: null,
  loading: false,
  error: null,
  actionLoading: false,
};

// Async thunks
export const fetchInactiveUsers = createAsyncThunk(
  'relance/fetchInactiveUsers',
  async (days: number = 7) => {
    const response = await api.get(`/inactive-users?days=${days}`);
    return response.data.data;
  }
);

export const fetchPendingRelances = createAsyncThunk(
  'relance/fetchPendingRelances',
  async () => {
    const response = await api.get('/relances/pending');
    return response.data.data;
  }
);

export const fetchRelanceHistory = createAsyncThunk(
  'relance/fetchRelanceHistory',
  async (filters?: { statut?: string; user_id?: number; date_debut?: string; date_fin?: string }) => {
    const params = new URLSearchParams();
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.user_id) params.append('user_id', filters.user_id.toString());
    if (filters?.date_debut) params.append('date_debut', filters.date_debut);
    if (filters?.date_fin) params.append('date_fin', filters.date_fin);
    
    const response = await api.get(`/relances?${params.toString()}`);
    return response.data.data;
  }
);

export const fetchStatistics = createAsyncThunk(
  'relance/fetchStatistics',
  async () => {
    const response = await api.get('/relances/statistics');
    return response.data.data;
  }
);

export const approveRelance = createAsyncThunk(
  'relance/approveRelance',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/relances/${id}/approve`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve relance');
    }
  }
);

export const rejectRelance = createAsyncThunk(
  'relance/rejectRelance',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/relances/${id}/reject`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject relance');
    }
  }
);

export const createManualRelance = createAsyncThunk(
  'relance/createManualRelance',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/relances/create-manual/${userId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create manual relance');
    }
  }
);

export const fetchUserHistory = createAsyncThunk(
  'relance/fetchUserHistory',
  async (userId: number) => {
    const response = await api.get(`/relances/user-history/${userId}`);
    return response.data.data;
  }
);

// Slice
const relanceSlice = createSlice({
  name: 'relance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRelanceData: (state) => {
      state.inactiveUsers = [];
      state.pendingRelances = [];
      state.relanceHistory = [];
      state.statistics = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch inactive users
    builder
      .addCase(fetchInactiveUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInactiveUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.inactiveUsers = action.payload;
      })
      .addCase(fetchInactiveUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch inactive users';
      });

    // Fetch pending relances
    builder
      .addCase(fetchPendingRelances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRelances.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRelances = action.payload;
      })
      .addCase(fetchPendingRelances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pending relances';
      });

    // Fetch relance history
    builder
      .addCase(fetchRelanceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelanceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.relanceHistory = action.payload;
      })
      .addCase(fetchRelanceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch relance history';
      });

    // Fetch statistics
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch statistics';
      });

    // Approve relance
    builder
      .addCase(approveRelance.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(approveRelance.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove from pending list
        state.pendingRelances = state.pendingRelances.filter(r => r.id !== action.payload.id);
        // Add to history
        state.relanceHistory = [action.payload, ...state.relanceHistory];
      })
      .addCase(approveRelance.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Reject relance
    builder
      .addCase(rejectRelance.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(rejectRelance.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Remove from pending list
        state.pendingRelances = state.pendingRelances.filter(r => r.id !== action.payload.id);
        // Add to history
        state.relanceHistory = [action.payload, ...state.relanceHistory];
      })
      .addCase(rejectRelance.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Create manual relance
    builder
      .addCase(createManualRelance.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createManualRelance.fulfilled, (state, action) => {
        state.actionLoading = false;
        // Add to pending list
        state.pendingRelances = [action.payload, ...state.pendingRelances];
      })
      .addCase(createManualRelance.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user history
    builder
      .addCase(fetchUserHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.relanceHistory = action.payload;
      })
      .addCase(fetchUserHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user history';
      });
  },
});

export const { clearError, clearRelanceData } = relanceSlice.actions;
export default relanceSlice.reducer;
