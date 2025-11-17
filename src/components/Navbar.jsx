import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Touba Hair</span>
        </Link>
        
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/book" 
              className={`navbar-link ${isActive('/book') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Book Appointment
            </Link>
          </li>
          <li>
            <Link 
              to="/my-bookings" 
              className={`navbar-link ${isActive('/my-bookings') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Bookings
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
