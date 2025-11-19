import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { login, register } from '../utils/auth'
import { isAdmin, isBraider } from '../utils/auth'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from?.pathname || '/my-bookings'

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
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          // Redirect based on user role
          if (isAdmin()) {
            navigate('/admin', { replace: true })
          } else if (isBraider()) {
            navigate('/braider-profile', { replace: true })
          } else {
            navigate(from, { replace: true })
          }
        }, 100)
      } else {
        setError(result.error || 'Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'An error occurred. Please try again.')
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

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                autoComplete="email"
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
                    <span className="password-icon" aria-hidden="true">👁️</span>
                  ) : (
                    <span className="password-icon" aria-hidden="true">👁️‍🗨️</span>
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

          <div className="login-demo">
            <h3>Demo Accounts</h3>
            <div className="demo-accounts">
              <div className="demo-account">
                <strong>👑 Admin:</strong>
                <p>Email: admin@toubahair.com</p>
                <p>Password: Admin123!@#</p>
                <small>Full access to admin dashboard</small>
              </div>
              <div className="demo-account">
                <strong>👨‍💼 Employee (Example):</strong>
                <p>Email: mariama@toubahair.com</p>
                <p>Password: Employee123!</p>
                <small>Access braider dashboard</small>
              </div>
              <div className="demo-account">
                <strong>👤 Client (Example):</strong>
                <p>Email: customer1@example.com</p>
                <p>Password: Customer123!</p>
                <small>Access bookings & rewards</small>
              </div>
              <div className="demo-account-note">
                <small>📋 See DEMO_CREDENTIALS.md for all accounts</small>
              </div>
            </div>
          </div>

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

