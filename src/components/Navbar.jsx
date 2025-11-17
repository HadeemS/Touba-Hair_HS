// src/components/Navbar.jsx
import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(prev => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-icon">✨</span>
          <span className="logo-text">Touba Hair</span>
        </Link>
        
        {/* Mobile toggle */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/book"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
            >
              Book Appointment
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
            >
              My Bookings
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
