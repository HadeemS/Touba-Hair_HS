import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { braiders } from '../data/braiders'
import { generateTimeSlots, getAvailableDates, formatDateDisplay, formatDateStorage, getDayName } from '../utils/timeSlots'
import { isTimeSlotAvailable, saveBooking } from '../utils/bookingStorage'
import './BookAppointment.css'
import { getStoredProfile } from '../utils/profileStorage'

const BookAppointment = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedBraider, setSelectedBraider] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableDates = getAvailableDates()
  const timeSlots = generateTimeSlots()

  const storedProfile = getStoredProfile()
  if (storedProfile) {
    setCustomerInfo({
      name: storedProfile.name,
      email: storedProfile.email,
      phone: storedProfile.phone
    })
  }

  const handleBraiderSelect = (braider) => {
    setSelectedBraider(braider)
    setStep(2)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const handleDateSelect = (date) => {
    const dayName = getDayName(date)
    if (selectedBraider.availableDays.includes(dayName)) {
      setSelectedDate(date)
      setSelectedTimeSlot(null)
      setStep(3)
    } else {
      alert(`${selectedBraider.name} is not available on ${dayName}. Please select another date.`)
    }
  }

  const handleTimeSlotSelect = (timeSlot) => {
    if (isTimeSlotAvailable(formatDateStorage(selectedDate), timeSlot, selectedBraider.id)) {
      setSelectedTimeSlot(timeSlot)
      setStep(4)
    } else {
      alert('This time slot is already booked. Please select another time.')
    }
  }

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const booking = {
        braiderId: selectedBraider.id,
        braiderName: selectedBraider.name,
        date: formatDateStorage(selectedDate),
        timeSlot: selectedTimeSlot,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone
      }

      await saveBooking(booking)
      
      alert('Booking confirmed! You will receive a confirmation email shortly.')
      navigate('/my-bookings')
    } catch (error) {
      alert('Error booking appointment. Please try again.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  useEffect(() => {
    const stored = getStoredProfile()
    if (stored) {
      if (!clientName) setClientName(stored.name || '')
      if (!clientEmail) setClientEmail(stored.email || '')
      if (!clientPhone) setClientPhone(stored.phone || '')
      if (!clientNotes) setClientNotes(stored.notes || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  return (
    <div className="book-appointment">
      <div className="container">
        <div className="booking-header">
          <h1 className="page-title">Book Your Appointment</h1>
          <p className="page-subtitle">Choose your stylist, date, and time</p>
        </div>

        <div className="booking-steps">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Choose Stylist</span>
          </div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Select Date</span>
          </div>
          <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Choose Time</span>
          </div>
          <div className={`step-indicator ${step >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Confirm</span>
          </div>
        </div>

        <div className="booking-content">
          {/* Step 1: Select Braider */}
          {step === 1 && (
            <div className="booking-step">
              <h2 className="step-title">Select Your Stylist</h2>
              <div className="braiders-grid">
                {braiders.map(braider => (
                  <div
                    key={braider.id}
                    className="braider-card"
                    onClick={() => handleBraiderSelect(braider)}
                  >
                    <div className="braider-image">{braider.image}</div>
                    <h3 className="braider-name">{braider.name}</h3>
                    <p className="braider-specialty">{braider.specialty}</p>
                    <div className="braider-rating">
                      <span className="rating-stars">⭐</span>
                      <span className="rating-value">{braider.rating}</span>
                    </div>
                    <p className="braider-experience">{braider.experience} experience</p>
                    <p className="braider-bio">{braider.bio}</p>
                    <button className="btn btn-primary">Select</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && (
            <div className="booking-step">
              <button className="back-button" onClick={goBack}>← Back</button>
              <h2 className="step-title">Select Date</h2>
              <p className="selected-braider-info">Stylist: <strong>{selectedBraider.name}</strong></p>
              <div className="dates-grid">
                {availableDates.map((date, index) => {
                  const dayName = getDayName(date)
                  const isAvailable = selectedBraider.availableDays.includes(dayName)
                  const isSelected = selectedDate && formatDateStorage(selectedDate) === formatDateStorage(date)
                  
                  return (
                    <button
                      key={index}
                      className={`date-card ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                      onClick={() => isAvailable && handleDateSelect(date)}
                      disabled={!isAvailable}
                    >
                      <div className="date-day">{dayName.slice(0, 3)}</div>
                      <div className="date-number">{date.getDate()}</div>
                      <div className="date-month">{formatDateDisplay(date).split(',')[1].trim().split(' ')[0]}</div>
                      {!isAvailable && <span className="unavailable-badge">Unavailable</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Select Time Slot */}
          {step === 3 && (
            <div className="booking-step">
              <button className="back-button" onClick={goBack}>← Back</button>
              <h2 className="step-title">Select Time</h2>
              <p className="selected-info">
                Stylist: <strong>{selectedBraider.name}</strong> | 
                Date: <strong>{formatDateDisplay(selectedDate)}</strong>
              </p>
              <div className="time-slots-grid">
                {timeSlots.map((timeSlot, index) => {
                  const isAvailable = isTimeSlotAvailable(
                    formatDateStorage(selectedDate),
                    timeSlot,
                    selectedBraider.id
                  )
                  const isSelected = selectedTimeSlot === timeSlot

                  return (
                    <button
                      key={index}
                      className={`time-slot ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                      onClick={() => isAvailable && handleTimeSlotSelect(timeSlot)}
                      disabled={!isAvailable}
                    >
                      {timeSlot}
                      {!isAvailable && <span className="booked-badge">Booked</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Confirm Booking */}
          {step === 4 && (
            <div className="booking-step">
              <button className="back-button" onClick={goBack}>← Back</button>
              <h2 className="step-title">Confirm Your Booking</h2>
              
              <div className="booking-summary">
                <div className="summary-card">
                  <h3>Booking Details</h3>
                  <div className="summary-item">
                    <span className="summary-label">Stylist:</span>
                    <span className="summary-value">{selectedBraider.name}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Date:</span>
                    <span className="summary-value">{formatDateDisplay(selectedDate)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Time:</span>
                    <span className="summary-value">{selectedTimeSlot}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                  <h3>Your Information</h3>
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-large"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookAppointment

