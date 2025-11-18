// Authentication utility functions
import { authAPI } from './api.js'

const AUTH_KEY = 'touba_hair_auth'
const TOKEN_KEY = 'auth_token'

// Login with backend API
export const login = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password })
    
    if (response.token && response.user) {
      // Store token and user info
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        ...response.user,
        loggedIn: true,
        loginTime: new Date().toISOString()
      }))
      return { success: true, user: response.user }
    }
    
    return { success: false, error: 'Login failed' }
  } catch (error) {
    return { success: false, error: error.message || 'Login failed. Please try again.' }
  }
}

// Register new user
export const register = async (userData) => {
  try {
    const response = await authAPI.register(userData)
    
    if (response.token && response.user) {
      // Store token and user info
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        ...response.user,
        loggedIn: true,
        loginTime: new Date().toISOString()
      }))
      return { success: true, user: response.user }
    }
    
    return { success: false, error: 'Registration failed' }
  } catch (error) {
    return { success: false, error: error.message || 'Registration failed. Please try again.' }
  }
}

// Logout
export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

// Get current user from localStorage (for quick access)
export const getCurrentUser = () => {
  try {
    const auth = localStorage.getItem(AUTH_KEY)
    if (!auth) return null
    
    const user = JSON.parse(auth)
    return user.loggedIn ? user : null
  } catch (error) {
    return null
  }
}

// Get current user from API (for fresh data)
export const getCurrentUserFromAPI = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return null
    
    const response = await authAPI.getMe()
    if (response.user) {
      // Update localStorage
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        ...response.user,
        loggedIn: true,
        loginTime: new Date().toISOString()
      }))
      return response.user
    }
    return null
  } catch (error) {
    // Token might be invalid, clear auth
    logout()
    return null
  }
}

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

// Check if authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  const user = getCurrentUser()
  return !!(token && user && user.loggedIn)
}

// Check if user is employee/braider
export const isBraider = () => {
  const user = getCurrentUser()
  return user && (user.role === 'employee' || user.role === 'braider')
}

// Check if user is customer/client
export const isCustomer = () => {
  const user = getCurrentUser()
  return user && user.role === 'client'
}

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser()
  return user && user.role === 'admin'
}

export const requireAuth = () => {
  if (!isAuthenticated()) {
    return false
  }
  return true
}

