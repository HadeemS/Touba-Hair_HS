import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated, isBraider, isAdmin } from '../utils/auth'

const ProtectedRoute = ({ children, requireBraider = false, requireAdmin = false }) => {
  const location = useLocation()
  const authenticated = isAuthenticated()
  const braider = isBraider()
  const admin = isAdmin()

  if (!authenticated) {
    // Redirect to login page with return location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !admin) {
    // Redirect admin-only routes if user is not an admin
    return <Navigate to="/my-bookings" replace />
  }

  if (requireBraider && !braider && !admin) {
    // Redirect braiders-only routes if user is not a braider or admin
    return <Navigate to="/my-bookings" replace />
  }

  return children
}

export default ProtectedRoute

