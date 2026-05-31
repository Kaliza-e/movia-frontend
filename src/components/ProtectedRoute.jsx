import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({
  children,
  allowedRoles,
}) => {
  const { user, token } = useAuth();

 
  if (!token) {
    return <Navigate to="/login" replace />;
  }

 
  if (
    allowedRoles &&
    (!user || !allowedRoles.includes(user.role))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};