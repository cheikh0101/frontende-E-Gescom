import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import structureReducer from '../features/structures/structureSlice';
import agentReducer from '../features/agents/agentSlice';
import contratReducer from '../features/contrats/contratSlice';
import banqueReducer from '../features/banques/banqueSlice';
import stateContratReducer from '../features/stateContrat/stateContratSlice';
import stateEtatPaiementReducer from '../features/stateEtatPaiement/stateEtatPaiementSlice';
import etatPaiementReducer from '../features/etatPaiement/etatPaiementSlice';
import auditLogReducer from '../features/auditLogs/auditLogSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import relanceReducer from '../features/relances/relanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    structures: structureReducer,
    agents: agentReducer,
    contrats: contratReducer,
    banques: banqueReducer,
    stateContrats: stateContratReducer,
    stateEtatPaiements: stateEtatPaiementReducer,
    etatPaiements: etatPaiementReducer,
    auditLogs: auditLogReducer,
    dashboard: dashboardReducer,
    relances: relanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore ces types d'action qui peuvent contenir des données non-sérialisables
        ignoredActions: [
          'auth/login/fulfilled',
          'auth/logout/fulfilled',
          'auth/register/fulfilled',
          'structures/uploadLogo/fulfilled'
        ],
      },
    }),
});

// Types pour le store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;