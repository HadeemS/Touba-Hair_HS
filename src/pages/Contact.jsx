import React, { useState } from 'react'
import { sendBookingEmail } from '../utils/sendBookingEmail'
import { toast } from '../utils/toast'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const locations = [
    {
      name: 'Two Notch Road Location',
      address: '6432 Two Notch Rd',
      city: 'Columbia, SC',
      phone: '(839) 201-3566',
      hours: {
        weekdays: 'Mon - Fri: 9:00 AM - 7:00 PM',
        saturday: 'Saturday: 10:00 AM - 6:00 PM',
        sunday: 'Sunday: Closed'
      }
    },
    {
      name: 'Sandhills Promenade Location',
      address: '6312 Sandhills Promenade',
      city: 'Columbia, SC',
      phone: '(803) 333-0042',
      hours: {
        weekdays: 'Mon - Fri: 9:00 AM - 7:00 PM',
        saturday: 'Saturday: 10:00 AM - 6:00 PM',
        sunday: 'Sunday: Closed'
      }
    }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setSubmitMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Send contact form via email
      await sendBookingEmail({
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        notes: `Subject: ${formData.subject}\n\nMessage: ${formData.message}`,
        serviceName: 'Contact Form Inquiry',
        braiderName: 'General Inquiry',
        dateTimeDisplay: new Date().toLocaleString()
      })

      setSubmitMessage('Thank you! Your message has been sent. We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      const errorMsg = 'Sorry, there was an error sending your message. Please try calling us directly.'
      setSubmitMessage(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">We'd love to hear from you</p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <section className="contact-section">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              {submitMessage && (
                <div className={`submit-message ${submitMessage.includes('error') ? 'error' : 'success'}`}>
                  {submitMessage}
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(839) 201-3566"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </section>

          {/* Contact Information */}
          <section className="contact-section">
            <h2>Get in Touch</h2>
            
            <div className="contact-info">
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div className="info-content">
                  <h3>Phone</h3>
                  <p><a href="tel:8392013566">(839) 201-3566</a></p>
                  <p><a href="tel:8033330042">(803) 333-0042</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📧</div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p><a href="mailto:info@toubahair.com">info@toubahair.com</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <h3>Locations</h3>
                  {locations.map((location, index) => (
                    <div key={index} className="location-info">
                      <p><strong>{location.name}</strong></p>
                      <p>{location.address}</p>
                      <p>{location.city}</p>
                      <p><a href={`tel:${location.phone.replace(/\D/g, '')}`}>{location.phone}</a></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Business Hours */}
          <section className="contact-section">
            <h2>Business Hours</h2>
            <div className="hours-grid">
              <div className="hours-item">
                <strong>Monday - Friday</strong>
                <p>9:00 AM - 7:00 PM</p>
              </div>
              <div className="hours-item">
                <strong>Saturday</strong>
                <p>10:00 AM - 6:00 PM</p>
              </div>
              <div className="hours-item">
                <strong>Sunday</strong>
                <p>Closed</p>
              </div>
            </div>
            <p className="hours-note">
              Appointments are recommended. Walk-ins are welcome based on availability.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Contact

