import React from 'react';
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
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <BrandLoader message="Verifying your Reliable Info Tech session..." />;
  }

  // Not authenticated: cleanly redirect to login, preserving destination in state.from
  if (!user) {
    // If attempting to access admin route, pass hint to login page
    const isAdminTarget = location.pathname.startsWith('/admin') || (allowedRoles && allowedRoles.includes('ADMIN'));
    const loginPath = isAdminTarget ? '/login?role=admin' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Role authorization check: user lacks required permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

