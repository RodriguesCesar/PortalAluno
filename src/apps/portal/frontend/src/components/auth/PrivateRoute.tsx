import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Perfil } from '../../services/auth';

type Props = {
  children: React.ReactElement;
  perfil?: Perfil;
};

function PrivateRoute({ children, perfil }: Props) {
  const { isAuthenticated, perfil: userPerfil } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (perfil && userPerfil !== perfil) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
