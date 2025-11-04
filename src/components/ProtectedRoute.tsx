import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;