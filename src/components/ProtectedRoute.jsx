import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute ensures the user is authenticated and has one of the allowedRoles.
 * If not authenticated, redirects to /login.
 * If authenticated but role not allowed, redirects to the appropriate dashboard based on actual role.
 * If children are provided, renders them; otherwise renders an <Outlet/> for nested routes.
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role || 'PASSENGER';
  if (!allowedRoles.includes(role)) {
    const target = role === 'ADMIN' ? '/admin' : role === 'DRIVER' ? '/driver' : '/dashboard';
    return <Navigate to={target} replace />;
  }

  // Role matches – render children if supplied, otherwise render nested outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;