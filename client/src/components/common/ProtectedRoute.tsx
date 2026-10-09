import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLoader } from './BrandLoader';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading, login } = useAuth();
  const location = useLocation();
  const [initializingClient, setInitializingClient] = useState(false);

  useEffect(() => {
    // If accessing the client workspace dashboard without active session, seamlessly initialize client demo session
    if (!loading && !user && !allowedRoles && location.pathname.startsWith('/dashboard')) {
      setInitializingClient(true);
      login({ email: 'client@devcraft.io', password: 'Client@123456' })
        .catch((err) => {
          console.warn('Auto client login error:', err);
        })
        .finally(() => {
          setInitializingClient(false);
        });
    }
  }, [loading, user, allowedRoles, location.pathname, login]);

  if (loading || initializingClient) {
    return <BrandLoader message="Loading DevCraft Client Workspace..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
