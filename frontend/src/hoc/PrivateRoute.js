import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    console.log('Redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Outlet renders the child routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;