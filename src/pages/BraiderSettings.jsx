import React, { useState, useEffect } from 'react'
import { getCurrentUser } from '../utils/auth'
import { getBraiderById } from '../data/braiders'
import { toast } from '../utils/toast'
import './BraiderSettings.css'

const BraiderSettings = () => {
  const user = getCurrentUser()
  
  // Map braider name to ID
  const nameToId = {
    'Amina': '1',
    'Fatou': '2',
    'Mariama': '3',
    'Aissatou': '4'
  }
  
  const braider = getBraiderById(nameToId[user?.name] || null)
  
  const [availability, setAvailability] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false
  })

  const [specialties, setSpecialties] = useState([
    'Box Braids',
    'Cornrows',
    'Goddess Braids',
    'Fulani Braids',
    'Micro Braids',
    'Knotless Braids',
    'Feed-in Braids',
    'Senegalese Twists',
    'Lemonade Braids',
    'Passion Twists',
    'Ghana Braids',
    'Crochet Braids'
  ])

  const [selectedSpecialties, setSelectedSpecialties] = useState([])
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    loadBraiderSettings()
  }, [])

  const loadBraiderSettings = () => {
    try {
      const savedAvailability = localStorage.getItem(`braider_${user?.name}_availability`)
      const savedSpecialties = localStorage.getItem(`braider_${user?.name}_specialties`)
      
      if (savedAvailability) {
        setAvailability(JSON.parse(savedAvailability))
      } else if (braider?.availableDays) {
        // Initialize from braider data
        const initialAvailability = {}
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        days.forEach(day => {
          initialAvailability[day] = braider.availableDays.includes(day)
        })
        setAvailability(initialAvailability)
      }

      if (savedSpecialties) {
        setSelectedSpecialties(JSON.parse(savedSpecialties))
      } else if (braider?.specialty) {
        // Initialize from braider specialty
        setSelectedSpecialties([braider.specialty])
      }
    } catch (error) {
      // Silently fail - will use defaults
    }
  }

  const handleAvailabilityChange = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: !prev[day]
    }))
  }

  const handleSpecialtyToggle = (specialty) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty)
      } else {
        return [...prev, specialty]
      }
    })
  }

  const handleSave = () => {
    try {
      localStorage.setItem(`braider_${user?.name}_availability`, JSON.stringify(availability))
      localStorage.setItem(`braider_${user?.name}_specialties`, JSON.stringify(selectedSpecialties))
      
      setSavedMessage('Settings saved successfully!')
      toast.success('Settings saved successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (error) {
      toast.error('Error saving settings. Please try again.')
    }
  }

  const getAvailableDaysList = () => {
    return Object.entries(availability)
      .filter(([_, isAvailable]) => isAvailable)
      .map(([day, _]) => day)
  }

  return (
    <div className="braider-settings-page">
      <div className="container">
        <div className="settings-header">
          <h1 className="page-title">Braider Settings</h1>
          <p className="page-subtitle">
            Manage your availability and showcase your specialties
          </p>
          {braider && (
            <div className="braider-info">
              <span className="braider-icon">{braider.image}</span>
              <span className="braider-name-display">{user?.name}</span>
            </div>
          )}
        </div>

        {savedMessage && (
          <div className="success-message">
            {savedMessage}
          </div>
        )}

        <div className="settings-content">
          {/* Availability Section */}
          <div className="settings-card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="title-icon">📅</span>
                Availability
              </h2>
              <p className="card-subtitle">Select the days you're available to work</p>
            </div>

            <div className="availability-grid">
              {Object.entries(availability).map(([day, isAvailable]) => (
                <label key={day} className={`availability-day ${isAvailable ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={() => handleAvailabilityChange(day)}
                    className="availability-checkbox"
                  />
                  <span className="day-name">{day}</span>
                  {isAvailable && <span className="check-mark">✓</span>}
                </label>
              ))}
            </div>

            <div className="availability-summary">
              <p className="summary-text">
                <strong>Available Days:</strong> {getAvailableDaysList().join(', ') || 'None selected'}
              </p>
            </div>
          </div>

          {/* Specialties Section */}
          <div className="settings-card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="title-icon">✨</span>
                Specialties
              </h2>
              <p className="card-subtitle">Select the braiding styles you specialize in</p>
            </div>

            <div className="specialties-grid">
              {specialties.map((specialty) => {
                const isSelected = selectedSpecialties.includes(specialty)
                return (
                  <button
                    key={specialty}
                    className={`specialty-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSpecialtyToggle(specialty)}
                  >
                    {specialty}
                    {isSelected && <span className="chip-check">✓</span>}
                  </button>
                )
              })}
            </div>

            {selectedSpecialties.length > 0 && (
              <div className="specialties-summary">
                <p className="summary-text">
                  <strong>Your Specialties ({selectedSpecialties.length}):</strong> {selectedSpecialties.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="settings-actions">
            <button className="btn btn-primary btn-large" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BraiderSettings

