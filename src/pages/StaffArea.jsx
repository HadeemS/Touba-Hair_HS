import React, { useState, useEffect } from 'react'
import { getCurrentUser, isAdmin } from '../utils/auth'
import { adminAPI } from '../utils/api'
import { toast } from '../utils/toast'
import './StaffArea.css'

const StaffArea = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const user = getCurrentUser()
  const isAdminUser = isAdmin()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getUsers()
      setUsers(response.users || [])
      
      // Set default location filter for employees
      if (!isAdminUser && user?.location) {
        setSelectedLocation(user.location)
      }
    } catch (error) {
      toast.error('Failed to load staff members')
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = selectedLocation
    ? users.filter(u => u.location === selectedLocation)
    : users

  const usersByLocation = {
    Sandhills: filteredUsers.filter(u => u.location === 'Sandhills'),
    'Two Notch': filteredUsers.filter(u => u.location === 'Two Notch')
  }

  if (loading) {
    return (
      <div className="staff-area">
        <div className="container">
          <div className="loading">Loading staff members...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="staff-area">
      <div className="container">
        <div className="staff-header">
          <h1>Staff Directory</h1>
          {isAdminUser && (
            <div className="location-filter">
              <label>Filter by Location:</label>
              <select
                value={selectedLocation || ''}
                onChange={(e) => setSelectedLocation(e.target.value || null)}
              >
                <option value="">All Locations</option>
                <option value="Sandhills">Sandhills</option>
                <option value="Two Notch">Two Notch</option>
              </select>
            </div>
          )}
        </div>

        {!isAdminUser && user?.location && (
          <div className="location-badge">
            Your Location: <strong>{user.location}</strong>
          </div>
        )}

        <div className="locations-grid">
          {Object.entries(usersByLocation).map(([location, locationUsers]) => {
            if (locationUsers.length === 0) return null

            return (
              <div key={location} className="location-section">
                <h2 className="location-title">{location}</h2>
                <div className="users-grid">
                  {locationUsers.map((staffUser) => (
                    <div key={staffUser.id} className="user-card">
                      <div className="user-info">
                        <h3>{staffUser.fullName || staffUser.name}</h3>
                        <p className="user-username">@{staffUser.username || 'N/A'}</p>
                        <p className="user-role">{staffUser.role}</p>
                        {staffUser.email && (
                          <p className="user-email">{staffUser.email}</p>
                        )}
                      </div>
                      {staffUser.forcePasswordChange && (
                        <span className="password-change-badge">Password Reset Required</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <p>No staff members found{selectedLocation ? ` at ${selectedLocation}` : ''}.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffArea


