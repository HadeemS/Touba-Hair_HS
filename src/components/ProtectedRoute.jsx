import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated, isBraider } from '../utils/auth'

const ProtectedRoute = ({ children, requireBraider = false }) => {
  const location = useLocation()
  const authenticated = isAuthenticated()
  const braider = isBraider()

  if (!authenticated) {
    // Redirect to login page with return location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireBraider && !braider) {
    // Redirect braiders-only routes if user is not a braider
    return <Navigate to="/my-bookings" replace />
  }

  return children
}

export default ProtectedRoute

