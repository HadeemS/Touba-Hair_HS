import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { braiders } from '../data/braiders'
import { toast } from '../utils/toast'
import './BraiderRegister.css'

const BraiderRegister = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    braiderId: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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

    // Validation
    if (!formData.braiderId) {
      setError('Please select your braider profile.')
      return
    }

    setIsLoading(true)

    try {
      const selectedBraider = braiders.find(b => b.id === formData.braiderId)
      if (!selectedBraider) {
        setError('Selected braider profile not found.')
        setIsLoading(false)
        return
      }

      // Show instructions for login
      toast.success(`Braider account found! Please contact admin for your login credentials.`, { duration: 5000 })
      navigate('/login', { state: { 
        from: { pathname: '/braider-profile' },
        message: 'Your braider account is managed by the admin. Please use your pre-assigned credentials to log in.'
      } })
    } catch (err) {
      const errorMsg = err.message || 'An error occurred. Please try again.'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="braider-register-page">
      <div className="container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Braider Account Setup</h1>
            <p className="register-subtitle">Select your braider profile to access your account</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="braiderId">Select Your Braider Profile *</label>
              <select
                id="braiderId"
                name="braiderId"
                value={formData.braiderId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Braider --</option>
                {braiders.map(braider => (
                  <option key={braider.id} value={braider.id}>
                    {braider.name} - {braider.specialty}
                  </option>
                ))}
              </select>
              {formData.braiderId && (
                <div className="braider-preview" style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  {braiders.find(b => b.id === formData.braiderId) && (
                    <>
                      <p><strong>Selected Braider:</strong> {braiders.find(b => b.id === formData.braiderId).name}</p>
                      <p><strong>Specialty:</strong> {braiders.find(b => b.id === formData.braiderId).specialty}</p>
                      <p><strong>Experience:</strong> {braiders.find(b => b.id === formData.braiderId).experience}</p>
                      <p style={{ marginTop: '10px', fontSize: '14px', color: '#6c757d' }}>
                        <strong>Note:</strong> Your login credentials are pre-assigned. Please contact the admin for your email and password.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="info-section" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #b3d9ff' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#0066cc' }}>How It Works</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
                <li>Select your braider profile from the list above</li>
                <li>Your account credentials are pre-assigned by the admin</li>
                <li>Contact the admin to receive your login email and password</li>
                <li>Once you have your credentials, you can log in at the login page</li>
              </ul>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={isLoading || !formData.braiderId}
            >
              {isLoading ? 'Processing...' : 'Continue to Login'}
            </button>
          </form>

          <div className="register-footer">
            <p>Already have an account? <a href="/login">Sign in here</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BraiderRegister

