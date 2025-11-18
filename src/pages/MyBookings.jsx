import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBookings, deleteBooking } from '../utils/bookingStorage'
import { formatDateDisplay } from '../utils/timeSlots'
import { getBraiderById } from '../data/braiders'
import { getCurrentUser } from '../utils/auth'
import { appointmentsAPI } from '../utils/api'
import './MyBookings.css'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const user = getCurrentUser()

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      if (!user) {
        setLoading(false)
        return
      }

      // Fetch from backend API
      const response = await appointmentsAPI.getAll()
      const apiBookings = response.appointments || []
      
      // Transform API bookings to match expected format
      const transformedBookings = apiBookings.map(booking => ({
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
      console.error('Error loading bookings:', error)
      // Fallback to localStorage if API fails
      try {
        const allBookings = getBookings()
        const customerBookings = allBookings.filter(
          booking => booking.customerEmail === user?.email
        )
        const sorted = customerBookings.sort((a, b) => {
          const dateCompare = a.date.localeCompare(b.date)
          if (dateCompare !== 0) return dateCompare
          return a.timeSlot.localeCompare(b.timeSlot)
        })
        setBookings(sorted)
      } catch (fallbackError) {
        console.error('Fallback loading failed:', fallbackError)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await appointmentsAPI.cancel(bookingId)
        // Also remove from localStorage if exists
        try {
          deleteBooking(bookingId)
        } catch (localError) {
          // Ignore localStorage errors
        }
        await loadBookings()
        alert('Booking cancelled successfully.')
      } catch (error) {
        console.error('Cancel error:', error)
        alert(error.message || 'Error cancelling booking. Please try again.')
      }
    }
  }

  const getUpcomingBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter(booking => booking.date >= today)
  }

  const getPastBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    return bookings.filter(booking => booking.date < today)
  }

  if (loading) {
    return (
      <div className="my-bookings">
        <div className="container">
          <div className="loading">Loading your bookings...</div>
        </div>
      </div>
    )
  }

  const upcomingBookings = getUpcomingBookings()
  const pastBookings = getPastBookings()

  return (
    <div className="my-bookings">
      <div className="container">
        <div className="bookings-header">
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">Manage your appointments</p>
          {bookings.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h2>No bookings yet</h2>
              <p>Start by booking your first appointment!</p>
              <Link to="/book-appointment" className="btn btn-primary">
                Book Appointment
              </Link>
            </div>
          )}
        </div>

        {upcomingBookings.length > 0 && (
          <section className="bookings-section">
            <h2 className="section-heading">Upcoming Appointments</h2>
            <div className="bookings-grid">
              {upcomingBookings.map(booking => {
                const braider = getBraiderById(booking.braiderId)
                return (
                  <div key={booking.id} className="booking-card upcoming">
                    <div className="booking-card-header">
                      <div className={`booking-status ${booking.status === 'confirmed' ? 'upcoming-badge' : booking.status === 'completed' ? 'past-badge' : 'cancelled-badge'}`}>
                        {booking.status === 'confirmed' ? 'Upcoming' : booking.status === 'completed' ? 'Completed' : booking.status === 'cancelled' ? 'Cancelled' : booking.status}
                      </div>
                      {booking.status === 'confirmed' && (
                        <button
                          className="cancel-button"
                          onClick={() => handleDelete(booking.id)}
                          aria-label="Cancel booking"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="booking-content">
                      <div className="booking-braider">
                        <span className="braider-emoji">{braider?.image || '👩🏾'}</span>
                        <div>
                          <h3 className="braider-name">{booking.braiderName}</h3>
                          <p className="braider-specialty">{braider?.specialty || 'Hair Braiding'}</p>
                        </div>
                      </div>
                      <div className="booking-details">
                        <div className="detail-item">
                          <span className="detail-icon">📅</span>
                          <span className="detail-text">{formatDateDisplay(booking.date)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">⏰</span>
                          <span className="detail-text">{booking.timeSlot}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">👤</span>
                          <span className="detail-text">{booking.customerName}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">📧</span>
                          <span className="detail-text">{booking.customerEmail}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">📞</span>
                          <span className="detail-text">{booking.customerPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {pastBookings.length > 0 && (
          <section className="bookings-section">
            <h2 className="section-heading">Past Appointments</h2>
            <div className="bookings-grid">
              {pastBookings.map(booking => {
                const braider = getBraiderById(booking.braiderId)
                return (
                  <div key={booking.id} className="booking-card past">
                    <div className="booking-card-header">
                      <div className="booking-status past-badge">Completed</div>
                    </div>
                    <div className="booking-content">
                      <div className="booking-braider">
                        <span className="braider-emoji">{braider?.image || '👩🏾'}</span>
                        <div>
                          <h3 className="braider-name">{booking.braiderName}</h3>
                          <p className="braider-specialty">{braider?.specialty || 'Hair Braiding'}</p>
                        </div>
                      </div>
                      <div className="booking-details">
                        <div className="detail-item">
                          <span className="detail-icon">📅</span>
                          <span className="detail-text">{formatDateDisplay(booking.date)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">⏰</span>
                          <span className="detail-text">{booking.timeSlot}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {bookings.length > 0 && (
          <div className="book-again-section">
            <Link to="/book-appointment" className="btn btn-primary">
              Book Another Appointment
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings

