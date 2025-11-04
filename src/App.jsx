import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { getCurrentUser } from './features/auth/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Contrats from './pages/Contrats';
import Structures from './pages/Structures';
import Banques from './pages/Banques';
import Login from './pages/Login';
import Register from './pages/Register';
import EtatPaiements from './pages/EtatPaiements';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement de l'application
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser()).finally(() => {
        setIsCheckingAuth(false);
      });
    } else {
      setIsCheckingAuth(false);
    }
  }, [dispatch, isAuthenticated]);

  // Afficher un loader pendant la vérification de l'authentification
  if (isCheckingAuth) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Routes publiques */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      {/* Routes protégées */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Routes imbriquées dans le layout principal */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="structures" element={<Structures />} />
        <Route path="agents" element={<Agents />} />
        <Route path="contrats" element={<Contrats />} />
        <Route path="banques" element={<Banques />} />
        <Route path="paiements" element={<EtatPaiements />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Route 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
