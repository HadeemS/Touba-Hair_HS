import React, { useState, useEffect } from 'react'
import { appointmentsAPI, rewardsAPI, authAPI } from '../utils/api'
import { getCurrentUser } from '../utils/auth'
import { formatDateDisplay } from '../utils/timeSlots'
import { toast } from '../utils/toast'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  })
  const [filter, setFilter] = useState('all') // all, upcoming, completed, cancelled
  const [selectedDate, setSelectedDate] = useState('')
  const [braiderCredentials, setBraiderCredentials] = useState([])
  const [showBraiderSection, setShowBraiderSection] = useState(false)
  const [initializingBraiders, setInitializingBraiders] = useState(false)

  const user = getCurrentUser()

  useEffect(() => {
    loadAppointments()
    loadBraiderCredentials()
  }, [filter, selectedDate])

  const loadBraiderCredentials = async () => {
    try {
      const response = await authAPI.getBraiderCredentials()
      setBraiderCredentials(response.credentials || [])
    } catch (error) {
      // Silently fail - credentials might not be loaded yet
    }
  }

  const handleInitializeBraiders = async () => {
    if (!window.confirm('This will create or update braider accounts with pre-set credentials. Continue?')) {
      return
    }

    try {
      setInitializingBraiders(true)
      const response = await authAPI.initializeBraiders()
      toast.success(`Braider accounts initialized! Created: ${response.results.created.length}, Updated: ${response.results.updated.length}`)
      await loadBraiderCredentials()
    } catch (error) {
      toast.error(error.message || 'Failed to initialize braider accounts')
    } finally {
      setInitializingBraiders(false)
    }
  }

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filter !== 'all') {
        params.status = filter
      }
      if (selectedDate) {
        params.date = selectedDate
      }

      const response = await appointmentsAPI.getAll(params)
      const allAppointments = response.appointments || []
      
      // Sort by date/time
      const sorted = allAppointments.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare !== 0) return dateCompare
        return a.timeSlot.localeCompare(b.timeSlot)
      })

      setAppointments(sorted)

      // Calculate stats
      const today = new Date().toISOString().split('T')[0]
      setStats({
        total: allAppointments.length,
        upcoming: allAppointments.filter(a => a.status === 'confirmed' && a.date >= today).length,
        completed: allAppointments.filter(a => a.status === 'completed').length,
        cancelled: allAppointments.filter(a => a.status === 'cancelled').length
      })
    } catch (error) {
      toast.error('Failed to load appointments. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await appointmentsAPI.updateStatus(appointmentId, newStatus)
      await loadAppointments()
      toast.success(`Appointment status updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update status. Please try again.')
    }
  }

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    try {
      await appointmentsAPI.cancel(appointmentId)
      await loadAppointments()
      toast.success('Appointment cancelled successfully')
    } catch (error) {
      toast.error('Failed to cancel appointment. Please try again.')
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-badge confirmed'
      case 'completed':
        return 'status-badge completed'
      case 'cancelled':
        return 'status-badge cancelled'
      case 'pending':
        return 'status-badge pending'
      default:
        return 'status-badge'
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name || 'Admin'}!</p>
        </div>

        {/* Braider Management Section */}
        <div className="admin-section" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>Braider Account Management</h2>
            <button
              className="btn btn-secondary"
              onClick={() => setShowBraiderSection(!showBraiderSection)}
            >
              {showBraiderSection ? 'Hide' : 'Show'} Braider Credentials
            </button>
          </div>
          
          {showBraiderSection && (
            <div>
              <p style={{ marginBottom: '15px', color: '#6c757d' }}>
                Manage pre-set braider credentials. Braiders use these credentials to log in.
              </p>
              
              <button
                className="btn btn-primary"
                onClick={handleInitializeBraiders}
                disabled={initializingBraiders}
                style={{ marginBottom: '20px' }}
              >
                {initializingBraiders ? 'Initializing...' : 'Initialize Braider Accounts'}
              </button>

              {braiderCredentials.length > 0 && (
                <div className="braider-credentials-table" style={{ marginTop: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#e9ecef' }}>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #dee2e6' }}>Braider</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #dee2e6' }}>Email</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #dee2e6' }}>Phone</th>
                        <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #dee2e6' }}>Braider ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {braiderCredentials.map((cred, index) => (
                        <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                          <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{cred.name}</td>
                          <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{cred.email}</td>
                          <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{cred.phone || 'N/A'}</td>
                          <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{cred.braiderId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ marginTop: '15px', fontSize: '14px', color: '#6c757d' }}>
                    <strong>Note:</strong> Passwords are stored securely and not displayed here. 
                    Braiders should contact you for their login credentials.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.total}</h3>
              <p className="stat-label">Total Appointments</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.upcoming}</h3>
              <p className="stat-label">Upcoming</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.completed}</h3>
              <p className="stat-label">Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.cancelled}</h3>
              <p className="stat-label">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-filters">
          <div className="filter-group">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Appointments</option>
              <option value="confirmed">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="date-filter">Filter by Date:</label>
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="filter-input"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="clear-filter-btn"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Appointments List */}
        <div className="appointments-section">
          <h2 className="section-heading">
            Appointments ({appointments.length})
          </h2>

          {appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No appointments found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="appointments-table">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Client</th>
                    <th>Braider</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>
                        <div className="datetime-cell">
                          <div className="date">{formatDateDisplay(appointment.date)}</div>
                          <div className="time">{appointment.timeSlot}</div>
                        </div>
                      </td>
                      <td>
                        <div className="client-cell">
                          <div className="client-name">{appointment.customerName}</div>
                          <div className="client-contact">
                            {appointment.customerEmail}
                          </div>
                          <div className="client-contact">
                            {appointment.customerPhone}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="braider-cell">
                          {appointment.braiderName}
                        </div>
                      </td>
                      <td>
                        <div className="service-cell">
                          {appointment.serviceName || 'Hair Braiding'}
                          {appointment.servicePrice > 0 && (
                            <div className="service-price">
                              ${appointment.servicePrice}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(appointment.status)}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {appointment.status === 'confirmed' && (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                title="Mark as completed"
                              >
                                ✓ Complete
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleCancel(appointment._id)}
                                title="Cancel appointment"
                              >
                                ✕ Cancel
                              </button>
                            </>
                          )}
                          {appointment.status === 'pending' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                              title="Confirm appointment"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

