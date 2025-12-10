import React, { useState, useEffect } from 'react'
import { getBookings } from '../utils/bookingStorage'
import { getCurrentUser } from '../utils/auth'
import { formatDateDisplay } from '../utils/timeSlots'
import { appointmentsAPI } from '../utils/api'
import { toast } from '../utils/toast'
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

  const loadBookings = async () => {
    try {
      setLoading(true)
      
      // Fetch from backend API - backend automatically filters by employee/braider
      const response = await appointmentsAPI.getAll()
      const apiBookings = response.appointments || []
      
      // Additional client-side filtering to ensure only this braider's appointments
      // (Backend should handle this, but this is a safety check)
      const userBraiderId = user?.braiderId?.toString()
      const userId = user?._id || user?.id
      
      const filteredBookings = apiBookings.filter(booking => {
        // Match by braiderId (primary method - this is what's set when booking is created)
        const bookingBraiderId = booking.braiderId?.toString()
        if (userBraiderId && bookingBraiderId && bookingBraiderId === userBraiderId) {
          return true
        }
        // Match by employeeId if user is the assigned employee
        // Handle both populated object and ID string
        const bookingEmployeeId = booking.employeeId?._id || booking.employeeId
        if (bookingEmployeeId && userId && bookingEmployeeId.toString() === userId.toString()) {
          return true
        }
        // Match by braiderName as fallback (in case braiderId isn't set)
        if (booking.braiderName && user?.name && booking.braiderName === user.name) {
          return true
        }
        return false
      })
      
      // Transform API bookings to match expected format
      const transformedBookings = filteredBookings.map(booking => ({
        id: booking._id,
        braiderId: booking.braiderId,
        braiderName: booking.braiderName,
        date: booking.date,
        timeSlot: booking.timeSlot,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        status: booking.status,
        serviceName: booking.serviceName,
        servicePrice: booking.servicePrice
      }))
      
      // Sort by date and time
      const sorted = transformedBookings.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare !== 0) return dateCompare
        return a.timeSlot.localeCompare(b.timeSlot)
      })
      
      setBookings(sorted)
    } catch (error) {
      // Fallback to localStorage if API fails
      try {
        const allBookings = getBookings()
        const braiderBookings = allBookings.filter(
          booking => booking.braiderName === user?.name || booking.braiderId === getBraiderIdByName(user?.name)
        )
        const sorted = braiderBookings.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date)
          if (dateCompare !== 0) return dateCompare
          return a.timeSlot.localeCompare(b.timeSlot)
        })
        setBookings(sorted)
      } catch (fallbackError) {
        // Silently fail - user will see empty state
      }
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
    return bookings.filter(booking => booking.date < today || booking.status === 'completed').length
  }

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentsAPI.updateStatus(appointmentId, newStatus)
      await loadBookings()
      toast.success(`Appointment marked as ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update appointment status. Please try again.')
    }
  }

  const handleConfirm = async (appointmentId) => {
    try {
      await appointmentsAPI.updateStatus(appointmentId, 'confirmed')
      await loadBookings()
      toast.success('Appointment confirmed successfully!')
    } catch (error) {
      toast.error('Failed to confirm appointment. Please try again.')
    }
  }

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    try {
      await appointmentsAPI.cancel(appointmentId)
      await loadBookings()
      toast.success('Appointment cancelled successfully')
    } catch (error) {
      toast.error('Failed to cancel appointment. Please try again.')
    }
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
                      <span>{booking.serviceName || 'Hair Braiding Service'}</span>
                    </div>
                    {booking.status && (
                      <div className={`status-badge status-${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    )}
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="booking-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleConfirm(booking.id)}
                      >
                        Confirm Appointment
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {booking.status === 'confirmed' && (
                    <div className="booking-actions">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                      >
                        Mark as Completed
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
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

