// Authentication utility functions
import { authAPI } from './api.js'

const AUTH_KEY = 'touba_hair_auth'
const TOKEN_KEY = 'auth_token'

// Login with backend API
export const login = async (email, password) => {
  try {
    // Validate inputs
    if (!email || !email.trim()) {
      return { success: false, error: 'Email is required.' }
    }

    const response = await authAPI.login({ email: email.trim(), password: password || '' })
    
    if (response.token && response.user) {
      // Store token and user info
      localStorage.setItem(TOKEN_KEY, response.token)
      localStorage.setItem(AUTH_KEY, JSON.stringify({
        ...response.user,
        loggedIn: true,
        loginTime: new Date().toISOString()
      }))
      // Dispatch custom event for same-tab auth updates
      window.dispatchEvent(new Event('auth-changed'))
      return { success: true, user: response.user }
    }
    
    return { success: false, error: 'Login failed - invalid response from server' }
  } catch (error) {
    // Extract error message from the error
    let errorMessage = 'Login failed. Please try again.'
    
    // Check error response for detailed message
    if (error.response) {
      errorMessage = error.response.error || error.response.message || errorMessage
      
      // Check for database status in response
      if (error.response.databaseStatus) {
        errorMessage = `Database ${error.response.databaseStatus}. Please wait a moment and try again.`
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    
    // Check for specific error types
    if (errorMessage.includes('Database connection unavailable') || 
        errorMessage.includes('Database connection error') ||
        errorMessage.includes('503') ||
        errorMessage.includes('disconnected') ||
        errorMessage.includes('connecting')) {
      errorMessage = 'Server is connecting to database. Please wait a moment and try again.'
    } else if (errorMessage.includes('Failed to fetch') || 
               errorMessage.includes('NetworkError') || 
               errorMessage.includes('CORS') ||
               errorMessage.includes('Network request failed')) {
      errorMessage = 'Cannot connect to server. The backend may be starting up. Please try again in a moment.'
    } else if (errorMessage.includes('Invalid email or password') || 
               errorMessage.includes('401') ||
               errorMessage.includes('Password is required')) {
      // Keep original message for auth errors
      errorMessage = errorMessage
    } else if (errorMessage.includes('Too many') || errorMessage.includes('rate limit')) {
      errorMessage = 'Too many login attempts. Please wait 15 minutes and try again.'
    }
    
    return { success: false, error: errorMessage }
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
      // Dispatch custom event for same-tab auth updates
      window.dispatchEvent(new Event('auth-changed'))
      return { success: true, user: response.user }
    }
    
    return { success: false, error: 'Registration failed' }
  } catch (error) {
    let errorMessage = 'Registration failed. Please try again.'
    
    if (error.response) {
      errorMessage = error.response.error || error.response.message || errorMessage
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return { success: false, error: errorMessage }
  }
}

// Logout
export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(TOKEN_KEY)
  // Dispatch custom event for same-tab auth updates
  window.dispatchEvent(new Event('auth-changed'))
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

