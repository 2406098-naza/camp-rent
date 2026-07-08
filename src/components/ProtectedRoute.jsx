import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="mt-4 text-gray-600 font-medium">Memuat...</span>
        </div>
      </div>
    );
  }
  if (!user) {
    // Redirect to login with previous location state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user dashboard if user tries to access admin, or vice versa
    return user.role === 'admin' 
      ? <Navigate to="/dashboard-admin" replace /> 
      : <Navigate to="/dashboard" replace />;
  }
  return children;
};
