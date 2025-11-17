import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-icon">✨</span>
              Touba Hair
            </h3>
            <p className="footer-description">
              Professional hair braiding services with expert stylists. 
              Book your appointment today and experience the art of beautiful braids.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/book-appointment">Book Appointment</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/locations">Locations</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Locations</h4>
            <ul className="footer-contact">
              <li>📍 6432 Two Notch Rd, Columbia, SC</li>
              <li>📍 6312 Sandhills Promenade, Columbia, SC</li>
              <li>📞 (839) 201-3566</li>
              <li>📞 (803) 333-0042</li>
              <li>✉️ mametouab@gmail.com</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Hours</h4>
            <ul className="footer-hours">
              <li>Mon - Fri: 9:00 AM - 7:00 PM</li>
              <li>Saturday: 10:00 AM - 6:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Touba Hair Salon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

