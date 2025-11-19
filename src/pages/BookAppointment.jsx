import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { braiders } from '../data/braiders'
import { generateTimeSlots, getAvailableDates, formatDateDisplay, formatDateStorage, getDayName } from '../utils/timeSlots'
import { isTimeSlotAvailable, saveBooking } from '../utils/bookingStorage'
import { appointmentsAPI, pricesAPI } from '../utils/api'
import { getCurrentUser } from '../utils/auth'
import { getBraiderAvailableDays } from '../utils/braiderSettings'
import './BookAppointment.css'
import { getStoredProfile } from '../utils/profileStorage'
import { sendBookingEmail } from '../utils/sendBookingEmail'

const BookAppointment = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedBraider, setSelectedBraider] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedLength, setSelectedLength] = useState(null)
  const [selectedBoho, setSelectedBoho] = useState(null)
  const [services, setServices] = useState([])
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

  // Load stored profile and services on component mount
  useEffect(() => {
    const storedProfile = getStoredProfile()
    if (storedProfile && (storedProfile.name || storedProfile.email || storedProfile.phone)) {
      setCustomerInfo({
        name: storedProfile.name || '',
        email: storedProfile.email || '',
        phone: storedProfile.phone || ''
      })
    }
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const data = await pricesAPI.getAll()
      if (data && Array.isArray(data) && data.length > 0) {
        setServices(data)
      } else {
        // Fallback to default services if API fails
        setServices(getDefaultServices())
      }
    } catch (error) {
      console.error('Error loading services:', error)
      setServices(getDefaultServices())
    }
  }

  const getDefaultServices = () => {
    return [
      { 
        id: '1', 
        name: 'Box Braids', 
        basePrice: 250,
        price: 250, 
        duration: '4-6 hours', 
        category: 'Protective Styles',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 30,
          'Large': 50
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 40,
          'Long (Waist Length)': 80,
          'Extra Long (Hip Length)': 120
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '2', 
        name: 'Cornrows', 
        basePrice: 80,
        price: 80, 
        duration: '2-3 hours', 
        category: 'Traditional',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 20,
          'Large': 35
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 30,
          'Long (Waist Length)': 60,
          'Extra Long (Hip Length)': 90
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '3', 
        name: 'Goddess Braids', 
        basePrice: 180,
        price: 180, 
        duration: '5-7 hours', 
        category: 'Specialty',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 35,
          'Large': 60
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 45,
          'Long (Waist Length)': 90,
          'Extra Long (Hip Length)': 140
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '4', 
        name: 'Fulani Braids', 
        basePrice: 160,
        price: 160, 
        duration: '4-6 hours', 
        category: 'Traditional',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 30,
          'Large': 50
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 40,
          'Long (Waist Length)': 80,
          'Extra Long (Hip Length)': 120
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '5', 
        name: 'Lemonade Braids', 
        basePrice: 165,
        price: 165, 
        duration: '5-6 hours', 
        category: 'Specialty',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 30,
          'Large': 50
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 40,
          'Long (Waist Length)': 80,
          'Extra Long (Hip Length)': 120
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '10', 
        name: 'Marley Twists', 
        basePrice: 120,
        price: 120, 
        duration: '3-4 hours', 
        category: 'Protective Styles',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 25,
          'Large': 40
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 30,
          'Long (Waist Length)': 60,
          'Extra Long (Hip Length)': 90
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '6', 
        name: 'Knotless Braids', 
        basePrice: 170,
        price: 170, 
        duration: '5-7 hours', 
        category: 'Protective Styles',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 30,
          'Large': 55
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 40,
          'Long (Waist Length)': 80,
          'Extra Long (Hip Length)': 120
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '7', 
        name: 'Feed-in Braids', 
        basePrice: 140,
        price: 140, 
        duration: '4-5 hours', 
        category: 'Protective Styles',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 25,
          'Large': 45
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 35,
          'Long (Waist Length)': 70,
          'Extra Long (Hip Length)': 105
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '8', 
        name: 'Micro Braids', 
        basePrice: 200,
        price: 200, 
        duration: '6-8 hours', 
        category: 'Protective Styles',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 40,
          'Large': 70
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 50,
          'Long (Waist Length)': 100,
          'Extra Long (Hip Length)': 150
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '9', 
        name: 'Senegalese Twists', 
        basePrice: 130,
        price: 130, 
        duration: '3-4 hours', 
        category: 'Traditional',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 25,
          'Large': 40
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 30,
          'Long (Waist Length)': 60,
          'Extra Long (Hip Length)': 90
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '10', 
        name: 'Passion Twists', 
        basePrice: 155,
        price: 155, 
        duration: '4-5 hours', 
        category: 'Protective Styles',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 28,
          'Large': 48
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 38,
          'Long (Waist Length)': 75,
          'Extra Long (Hip Length)': 110
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '11', 
        name: 'Ghana Braids', 
        basePrice: 145,
        price: 145, 
        duration: '4-5 hours', 
        category: 'Traditional',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 28,
          'Large': 45
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 35,
          'Long (Waist Length)': 70,
          'Extra Long (Hip Length)': 105
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { 
        id: '12', 
        name: 'Crochet Braids', 
        basePrice: 120,
        price: 120, 
        duration: '2-3 hours', 
        category: 'Protective Styles',
        hasSizeOptions: true,
        hasLengthOptions: true,
        sizeOptions: {
          'Small': 0,
          'Medium': 20,
          'Large': 35
        },
        lengthOptions: {
          'Short (Shoulder Length)': 0,
          'Medium (Mid-Back)': 30,
          'Long (Waist Length)': 60,
          'Extra Long (Hip Length)': 90
        },
        hasBohoOptions: true,
        bohoOptions: {
          'None': 0,
          'Half Pack (Black)': 30,
          'Full Pack (Black)': 60,
          'Half Pack (Other Color)': 40,
          'Full Pack (Other Color)': 70
        }
      },
      { id: '13', name: 'Retwist Service', price: 50, duration: '1-2 hours', category: 'Maintenance' },
      { id: '14', name: 'Eyebrow Shaping', price: 25, duration: '30 minutes', category: 'Beauty' },
      { id: '15', name: 'Hair Wash & Condition', price: 30, duration: '1 hour', category: 'Maintenance' },
      { id: '16', name: 'Haircut', price: 40, duration: '1 hour', category: 'Styling' },
      { id: '17', name: 'Hair Consultation', price: 0, duration: '30 minutes', category: 'Consultation' }
    ]
  }

  const handleBraiderSelect = (braider) => {
    setSelectedBraider(braider)
    setStep(2) // Move to service selection
    setSelectedService(null)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    // If service has size/length/boho options, show those first, otherwise go to date selection
    if (service.hasSizeOptions || service.hasLengthOptions || service.hasBohoOptions) {
      setStep(3) // Move to size/length/boho selection
    } else {
      setStep(4) // Move directly to date selection
    }
    setSelectedSize(null)
    setSelectedLength(null)
    setSelectedBoho(null)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const handleSizeLengthSelect = () => {
    // Move to date selection after size/length is selected
    setStep(4)
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }

  const canProceedFromSizeLength = () => {
    // Check if required options are selected
    if (selectedService?.hasSizeOptions && !selectedSize) return false
    if (selectedService?.hasLengthOptions && !selectedLength) return false
    // Boho is optional (can be "None"), so we don't require it
    return true
  }

  const calculateServicePrice = () => {
    if (!selectedService) return 0
    
    let price = selectedService.basePrice || selectedService.price || 0
    
    // Add size premium
    if (selectedSize && selectedService.sizeOptions) {
      const sizePremium = selectedService.sizeOptions[selectedSize] || 0
      price += sizePremium
    }
    
    // Add length premium
    if (selectedLength && selectedService.lengthOptions) {
      const lengthPremium = selectedService.lengthOptions[selectedLength] || 0
      price += lengthPremium
    }
    
    // Add boho premium
    if (selectedBoho && selectedService.bohoOptions) {
      const bohoPremium = selectedService.bohoOptions[selectedBoho] || 0
      price += bohoPremium
    }
    
    return price
  }

  const handleDateSelect = (date) => {
    const dayName = getDayName(date)
    // Check saved availability first, then fall back to default
    const availableDays = getBraiderAvailableDays(selectedBraider.name, selectedBraider.availableDays)
    
    if (availableDays.includes(dayName)) {
      setSelectedDate(date)
      setSelectedTimeSlot(null)
      setStep(5) // Moved to step 5
    } else {
      alert(`${selectedBraider.name} is not available on ${dayName}. Please select another date.`)
    }
  }

  const handleTimeSlotSelect = (timeSlot) => {
    if (isTimeSlotAvailable(formatDateStorage(selectedDate), timeSlot, selectedBraider.id)) {
      setSelectedTimeSlot(timeSlot)
      setStep(6) // Moved to step 6
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
      // Convert time slot from 24-hour format (09:00) to 12-hour format (9:00 AM)
      const convertTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(':')
        const hour12 = parseInt(hours)
        const period = hour12 >= 12 ? 'PM' : 'AM'
        const displayHour = hour12 === 0 ? 12 : hour12 > 12 ? hour12 - 12 : hour12
        return `${displayHour}:${minutes} ${period}`
      }

      const finalPrice = calculateServicePrice()
      
      const bookingData = {
        braiderId: selectedBraider.id.toString(),
        braiderName: selectedBraider.name,
        date: formatDateStorage(selectedDate),
        timeSlot: convertTo12Hour(selectedTimeSlot),
        customerName: customerInfo.name.trim(),
        customerEmail: customerInfo.email.trim().toLowerCase(),
        customerPhone: customerInfo.phone.trim(),
        serviceName: selectedService?.name || 'Hair Braiding',
        servicePrice: finalPrice,
        serviceSize: selectedSize || null,
        serviceLength: selectedLength || null,
        serviceBoho: selectedBoho || null
      }

      // Save to backend (works for both logged-in users and guests)
      const response = await appointmentsAPI.create(bookingData)
      
      // Also save to localStorage as backup (optional)
      try {
        await saveBooking({
          ...bookingData,
          id: response.appointment._id
        })
      } catch (localError) {
        console.warn('Failed to save to localStorage:', localError)
      }
      
      // Try to send email notification
      try {
        await sendBookingEmail({
          clientName: customerInfo.name,
          clientEmail: customerInfo.email,
          clientPhone: customerInfo.phone,
          notes: '',
          serviceName: selectedService?.name || 'Hair Braiding',
          braiderName: selectedBraider.name,
          dateTimeDisplay: `${formatDateDisplay(selectedDate)} at ${selectedTimeSlot}`
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Don't block the booking if email fails
      }
      
      // Check if user is logged in to determine redirect
      const user = getCurrentUser()
      if (user) {
        alert('Booking confirmed! You will receive a confirmation email shortly.')
        navigate('/my-bookings')
      } else {
        alert('Booking confirmed! You will receive a confirmation email shortly. You can create an account to view and manage your bookings.')
        navigate('/')
      }
    } catch (error) {
      // Extract detailed error message
      let errorMessage = 'Error booking appointment. Please try again.'
      
      if (error.message) {
        errorMessage = error.message
      }
      
      // If there's a response object with validation errors, show those
      if (error.response && error.response.errors) {
        const validationErrors = error.response.errors.map(err => err.msg || err.message).join('\n')
        if (validationErrors) {
          errorMessage = `Validation errors:\n${validationErrors}`
        }
      }
      
      alert(errorMessage)
      console.error('Booking error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.status,
        stack: error.stack
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  

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
            <span className="step-label">Select Service</span>
          </div>
          <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Size, Length & Boho</span>
          </div>
          <div className={`step-indicator ${step >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Select Date</span>
          </div>
          <div className={`step-indicator ${step >= 5 ? 'active' : ''}`}>
            <span className="step-number">5</span>
            <span className="step-label">Choose Time</span>
          </div>
          <div className={`step-indicator ${step >= 6 ? 'active' : ''}`}>
            <span className="step-number">6</span>
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

          {/* Step 2: Select Service */}
          {step === 2 && (
            <div className="booking-step">
              <button className="back-button" onClick={goBack}>← Back</button>
              <h2 className="step-title">Select Your Service</h2>
              <p className="selected-braider-info">Stylist: <strong>{selectedBraider.name}</strong></p>
              <div className="services-grid">
                {services.map(service => {
                  const isSelected = selectedService?.id === service.id
                  return (
                    <div
                      key={service.id}
                      className={`service-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleServiceSelect(service)}
                    >
                      <div className="service-header">
                        <h3 className="service-name">{service.name}</h3>
                        <div className="service-price">
                          ${service.basePrice || service.price}
                          {(service.hasSizeOptions || service.hasLengthOptions || service.hasBohoOptions) && (
                            <span className="price-note">+ options</span>
                          )}
                        </div>
                      </div>
                      {service.duration && (
                        <p className="service-duration">⏱️ {service.duration}</p>
                      )}
                      {service.category && (
                        <span className="service-category">{service.category}</span>
                      )}
                      <button className="btn btn-primary btn-sm">Select</button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Select Size & Length & Boho */}
          {step === 3 && selectedService && (selectedService.hasSizeOptions || selectedService.hasLengthOptions || selectedService.hasBohoOptions) && (
            <div className="booking-step">
              <button className="back-button" onClick={goBack}>← Back</button>
              <h2 className="step-title">Select Size, Length & Boho</h2>
              <p className="selected-info">
                Service: <strong>{selectedService.name}</strong> | 
                Base Price: <strong>${selectedService.basePrice || selectedService.price}</strong>
              </p>
              
              {selectedService.hasSizeOptions && (
                <div className="options-section">
                  <h3 className="options-title">Braid Size</h3>
                  <div className="options-grid">
                    {Object.entries(selectedService.sizeOptions).map(([size, premium]) => (
                      <button
                        key={size}
                        className={`option-card ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <div className="option-name">{size}</div>
                        {premium > 0 && (
                          <div className="option-premium">+${premium}</div>
                        )}
                        {premium === 0 && (
                          <div className="option-premium">No extra charge</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedService.hasLengthOptions && (
                <div className="options-section">
                  <h3 className="options-title">Hair Length</h3>
                  <div className="options-grid">
                    {Object.entries(selectedService.lengthOptions).map(([length, premium]) => (
                      <button
                        key={length}
                        className={`option-card ${selectedLength === length ? 'selected' : ''}`}
                        onClick={() => setSelectedLength(length)}
                      >
                        <div className="option-name">{length}</div>
                        {premium > 0 && (
                          <div className="option-premium">+${premium}</div>
                        )}
                        {premium === 0 && (
                          <div className="option-premium">No extra charge</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedService.hasBohoOptions && (
                <div className="options-section">
                  <h3 className="options-title">Boho Hair (Optional)</h3>
                  <p className="options-description">Add boho hair for a trendy, textured look</p>
                  <div className="options-grid">
                    {Object.entries(selectedService.bohoOptions).map(([boho, premium]) => (
                      <button
                        key={boho}
                        className={`option-card ${selectedBoho === boho ? 'selected' : ''}`}
                        onClick={() => setSelectedBoho(boho)}
                      >
                        <div className="option-name">{boho}</div>
                        {premium > 0 && (
                          <div className="option-premium">+${premium}</div>
                        )}
                        {premium === 0 && (
                          <div className="option-premium">No extra charge</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="price-summary">
                <div className="price-breakdown">
                  <div className="price-item">
                    <span>Base Price:</span>
                    <span>${selectedService.basePrice || selectedService.price}</span>
                  </div>
                  {selectedSize && selectedService.sizeOptions && (
                    <div className="price-item">
                      <span>Size ({selectedSize}):</span>
                      <span>+${selectedService.sizeOptions[selectedSize] || 0}</span>
                    </div>
                  )}
                  {selectedLength && selectedService.lengthOptions && (
                    <div className="price-item">
                      <span>Length ({selectedLength}):</span>
                      <span>+${selectedService.lengthOptions[selectedLength] || 0}</span>
                    </div>
                  )}
                  {selectedBoho && selectedService.bohoOptions && (
                    <div className="price-item">
                      <span>Boho ({selectedBoho}):</span>
                      <span>+${selectedService.bohoOptions[selectedBoho] || 0}</span>
                    </div>
                  )}
                  <div className="price-item total">
                    <span>Total:</span>
                    <span>${calculateServicePrice()}</span>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-large"
                onClick={handleSizeLengthSelect}
                disabled={!canProceedFromSizeLength()}
              >
                Continue to Date Selection
              </button>
            </div>
          )}

          {/* Step 4: Select Date */}
          {step === 4 && (
            <div className="booking-step">
              <button className="back-button" onClick={goBack}>← Back</button>
              <h2 className="step-title">Select Date</h2>
              <p className="selected-info">
                Stylist: <strong>{selectedBraider.name}</strong> | 
                Service: <strong>{selectedService?.name}</strong>
                {selectedSize && <span> | Size: <strong>{selectedSize}</strong></span>}
                {selectedLength && <span> | Length: <strong>{selectedLength}</strong></span>}
                {selectedBoho && selectedBoho !== 'None' && <span> | Boho: <strong>{selectedBoho}</strong></span>}
              </p>
              <div className="dates-grid">
                {availableDates.map((date, index) => {
                  const dayName = getDayName(date)
                  // Check saved availability first, then fall back to default
                  const availableDays = getBraiderAvailableDays(selectedBraider.name, selectedBraider.availableDays)
                  const isAvailable = availableDays.includes(dayName)
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

          {/* Step 5: Select Time Slot */}
          {step === 5 && (
            <div className="booking-step">
              <button className="back-button" onClick={goBack}>← Back</button>
              <h2 className="step-title">Select Time</h2>
              <p className="selected-info">
                Stylist: <strong>{selectedBraider.name}</strong> | 
                Service: <strong>{selectedService?.name}</strong>
                {selectedSize && <span> | Size: <strong>{selectedSize}</strong></span>}
                {selectedLength && <span> | Length: <strong>{selectedLength}</strong></span>}
                {selectedBoho && selectedBoho !== 'None' && <span> | Boho: <strong>{selectedBoho}</strong></span>} | 
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

          {/* Step 6: Confirm Booking */}
          {step === 6 && (
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
                    <span className="summary-label">Service:</span>
                    <span className="summary-value">{selectedService?.name || 'Hair Braiding'}</span>
                  </div>
                  {selectedSize && (
                    <div className="summary-item">
                      <span className="summary-label">Size:</span>
                      <span className="summary-value">{selectedSize}</span>
                    </div>
                  )}
                  {selectedLength && (
                    <div className="summary-item">
                      <span className="summary-label">Length:</span>
                      <span className="summary-value">{selectedLength}</span>
                    </div>
                  )}
                  <div className="summary-item">
                    <span className="summary-label">Price:</span>
                    <span className="summary-value">${calculateServicePrice()}</span>
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
                      placeholder="(839) 201-3566"
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

