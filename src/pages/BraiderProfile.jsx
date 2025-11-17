import React, { useState, useEffect } from 'react'
import { getBookings } from '../utils/bookingStorage'
import { getCurrentUser } from '../utils/auth'
import { formatDateDisplay } from '../utils/timeSlots'
import './BraiderProfile.css'

const BraiderProfile = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'upcoming', 'past'
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  useEffect(() => {
    loadBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, filter])

  const loadBookings = () => {
    try {
      const allBookings = getBookings()
      // Filter bookings for this braider
      const braiderBookings = allBookings.filter(
        booking => booking.braiderName === user?.name || booking.braiderId === getBraiderIdByName(user?.name)
      )
      
      // Sort by date and time
      const sorted = braiderBookings.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare !== 0) return dateCompare
        return a.timeSlot.localeCompare(b.timeSlot)
      })
      
      setBookings(sorted)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBraiderIdByName = (name) => {
    const nameMap = {
      'Amina': '1',
      'Fatou': '2',
      'Mariama': '3',
      'Aissatou': '4'
    }
    return nameMap[name] || null
  }

  const filterBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    
    let filtered = bookings
    if (filter === 'upcoming') {
      filtered = bookings.filter(booking => booking.date >= today)
    } else if (filter === 'past') {
      filtered = bookings.filter(booking => booking.date < today)
    }
    
    setFilteredBookings(filtered)
  }

  const getUpcomingCount = () => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter(booking => booking.date >= today).length
  }

  const getPastCount = () => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter(booking => booking.date < today).length
  }

  if (loading) {
    return (
      <div className="braider-profile">
        <div className="container">
          <div className="loading">Loading your appointments...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="braider-profile">
      <div className="container">
        <div className="profile-header">
          <div className="header-content">
            <h1 className="page-title">Braider Dashboard</h1>
            <p className="welcome-text">Welcome back, <strong>{user?.name}</strong>!</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
            <div className="stat-card upcoming-stat">
              <div className="stat-value">{getUpcomingCount()}</div>
              <div className="stat-label">Upcoming</div>
            </div>
            <div className="stat-card past-stat">
              <div className="stat-value">{getPastCount()}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button
            className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({getUpcomingCount()})
          </button>
          <button
            className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past ({getPastCount()})
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h2>No appointments found</h2>
            <p>
              {filter === 'upcoming' 
                ? "You don't have any upcoming appointments."
                : filter === 'past'
                ? "You don't have any past appointments."
                : "You don't have any appointments yet."}
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => {
              const isUpcoming = booking.date >= new Date().toISOString().split('T')[0]
              
              return (
                <div key={booking.id} className={`booking-item ${isUpcoming ? 'upcoming' : 'past'}`}>
                  <div className="booking-item-header">
                    <div className="booking-status-badge">
                      {isUpcoming ? '📅 Upcoming' : '✅ Completed'}
                    </div>
                    <div className="booking-date-time">
                      <span className="date">{formatDateDisplay(booking.date)}</span>
                      <span className="time">{booking.timeSlot}</span>
                    </div>
                  </div>
                  
                  <div className="booking-client-info">
                    <h3 className="client-name">{booking.customerName}</h3>
                    <div className="client-details">
                      <div className="detail-row">
                        <span className="detail-icon">📧</span>
                        <span className="detail-text">{booking.customerEmail}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-icon">📞</span>
                        <span className="detail-text">{booking.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="booking-service-info">
                    <div className="service-badge">
                      <span className="service-icon">✨</span>
                      <span>Hair Braiding Service</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BraiderProfile

