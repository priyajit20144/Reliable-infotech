import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLoader } from './BrandLoader';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  disallowRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  disallowRoles,
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

  // Role disallowed on this route (e.g. ADMIN on client /dashboard)
  if (disallowRoles && disallowRoles.includes(user.role)) {
    if (user.role === 'ADMIN' || user.role === 'TEAM_MEMBER') {
      if (location.pathname.includes('/messages')) {
        return <Navigate to="/admin?tab=messages" replace />;
      }
      if (location.pathname.includes('/requests')) {
        return <Navigate to="/admin?tab=requests" replace />;
      }
      if (location.pathname.includes('/profile')) {
        return <Navigate to="/admin?tab=settings" replace />;
      }
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Role authorization check: user lacks required permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN' || user.role === 'TEAM_MEMBER') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

