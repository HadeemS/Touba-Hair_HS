import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '../utils/auth'
import { isAdmin, isBraider, getCurrentUser } from '../utils/auth'
import { healthCheck } from '../utils/api'
import { toast } from '../utils/toast'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [serverStatus, setServerStatus] = useState('checking')

  const from = location.state?.from?.pathname || '/'

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser()
      if (user) {
        // Redirect if already logged in
        if (isAdmin()) {
          navigate('/admin', { replace: true })
        } else if (isBraider()) {
          navigate('/braider-profile', { replace: true })
        } else {
          // For clients, go to home or my-bookings
          const redirectTo = from === '/login' ? '/my-bookings' : from
          navigate(redirectTo, { replace: true })
        }
      }
    }
    
    checkAuth()
    
    // Listen for auth changes (e.g., after registration)
    const handleAuthChange = () => {
      checkAuth()
    }
    window.addEventListener('auth-changed', handleAuthChange)
    
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange)
    }
  }, [navigate, from])

  // Check server health on mount
  const checkServer = async () => {
    setServerStatus('checking')
    setError('')
    try {
      const health = await healthCheck()
      if (health.status === 'ok' && health.database?.isConnected) {
        setServerStatus('online')
        setError('')
      } else {
        setServerStatus('degraded')
        setError('Server is starting up. Please wait a moment and try again.')
      }
    } catch (err) {
      setServerStatus('offline')
      setError('Cannot connect to server. The backend may be starting up. Please wait a moment.')
    }
  }

  useEffect(() => {
    checkServer()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(formData.emailOrUsername, formData.password)
      
      if (result.success) {
        toast.success('Login successful!')
        // Check if password change is required
        if (result.requiresPasswordChange) {
          navigate('/change-password', { replace: true, state: { forced: true } })
          return
        }
        // Wait for next tick to ensure localStorage and state are updated
        requestAnimationFrame(() => {
          // Redirect based on user role
          if (isAdmin()) {
            navigate('/admin', { replace: true })
          } else if (isBraider()) {
            navigate('/braider-profile', { replace: true })
          } else {
            // For clients, redirect to my-bookings or home
            const redirectTo = from === '/login' ? '/my-bookings' : from
            navigate(redirectTo, { replace: true })
          }
        })
      } else {
        const errorMsg = result.error || 'Invalid email or password'
        toast.error(errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred. Please try again.'
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to access your account</p>
          </div>

          {serverStatus === 'offline' && (
            <div className="error-message" style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong>⚠️ Server is offline</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
                    The backend may be starting up. Free Render services sleep after 15 minutes of inactivity and take 30-60 seconds to wake up.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={checkServer}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffc107',
                    color: '#856404',
                    border: '1px solid #ffc107',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {serverStatus === 'checking' ? 'Checking...' : 'Check Server'}
                </button>
              </div>
            </div>
          )}
          {serverStatus === 'degraded' && (
            <div className="error-message" style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffc107', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong>⚠️ Database is connecting</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
                    Please wait a moment and try again.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={checkServer}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffc107',
                    color: '#856404',
                    border: '1px solid #ffc107',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {serverStatus === 'checking' ? 'Checking...' : 'Refresh'}
                </button>
              </div>
            </div>
          )}
          {serverStatus === 'checking' && (
            <div className="error-message" style={{ backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              🔄 Checking server status...
            </div>
          )}
          {serverStatus === 'online' && (
            <div className="error-message" style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.9em' }}>
              ✅ Server is online and ready
            </div>
          )}
          {error && serverStatus === 'online' && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="emailOrUsername">Email or Username</label>
              <input
                type="text"
                id="emailOrUsername"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
                placeholder="your.email@example.com or username"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <span className="password-icon" aria-hidden="true">Hide</span>
                  ) : (
                    <span className="password-icon" aria-hidden="true">Show</span>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Admin login section - only visible to admins */}
          {isAdmin() && (
            <div className="login-admin-section" style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#6c757d' }}>Admin Access</h3>
              <p style={{ fontSize: '12px', color: '#6c757d', margin: 0 }}>
                You are logged in as an administrator.
              </p>
            </div>
          )}

          <div className="login-footer">
            <p>Don't have an account? <a href="/register">Sign up here</a></p>
            <p>Are you a braider? <a href="/braider-register">Create braider account</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

