import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getCurrentUser } from '../utils/auth'
import { authAPI } from '../utils/api'
import { toast } from '../utils/toast'
import './ChangePassword.css'

const ChangePassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isForced, setIsForced] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser()
    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    // Check if password change is forced
    const forced = location.state?.forced || user.forcePasswordChange
    setIsForced(forced)

    // If forced, current password is optional
    if (!forced) {
      // Check if user has a password
      const checkUser = async () => {
        try {
          const response = await authAPI.getMe()
          if (!response.user || !response.user.forcePasswordChange) {
            // User doesn't need to change password, redirect
            navigate('/my-bookings', { replace: true })
          }
        } catch (err) {
          // If error, allow them to try
        }
      }
      checkUser()
    }
  }, [navigate, location])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validatePassword = (password) => {
    if (password.length < 10) {
      return 'Password must be at least 10 characters'
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one letter and one number'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate new password
    const passwordError = validatePassword(formData.newPassword)
    if (passwordError) {
      setError(passwordError)
      return
    }

    // Check passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    // If not forced, require current password
    if (!isForced && !formData.currentPassword) {
      setError('Current password is required')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.changePassword({
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })

      if (response.message) {
        toast.success('Password changed successfully!')
        // Update user in localStorage
        const user = getCurrentUser()
        if (user) {
          user.forcePasswordChange = false
          localStorage.setItem('touba_hair_auth', JSON.stringify(user))
        }
        // Redirect based on role
        setTimeout(() => {
          if (user?.role === 'admin') {
            navigate('/admin', { replace: true })
          } else if (user?.role === 'employee') {
            navigate('/braider-profile', { replace: true })
          } else {
            navigate('/my-bookings', { replace: true })
          }
        }, 1000)
      }
    } catch (err) {
      const errorMessage = err.response?.error || err.message || 'Failed to change password. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="change-password-page">
      <div className="container">
        <div className="change-password-card">
          <div className="change-password-header">
            <h1 className="change-password-title">
              {isForced ? 'Change Your Password' : 'Update Password'}
            </h1>
            {isForced && (
              <p className="change-password-subtitle">
                You must change your password before continuing.
              </p>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="change-password-form">
            {!isForced && (
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required={!isForced}
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    className="password-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password (min 10 characters)"
                  autoComplete="new-password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <small className="form-help">
                Must be at least 10 characters and contain at least one letter and one number
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={isLoading}
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword

