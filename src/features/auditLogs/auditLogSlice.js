import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Thunk pour récupérer l'historique d'audit d'un enregistrement
export const fetchAuditLogs = createAsyncThunk(
  'auditLogs/fetchAuditLogs',
  async ({ table, recordId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/audit-logs/record-history`,
        {
          params: {
            table,
            record_id: recordId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de l\'historique'
      );
    }
  }
);

const auditLogSlice = createSlice({
  name: 'auditLogs',
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAuditLogs: (state) => {
      state.logs = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data || [];
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuditLogs } = auditLogSlice.actions;
export default auditLogSlice.reducer;
