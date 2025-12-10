// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout, isBraider, isCustomer, isAdmin } from '../utils/auth'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = () => {
      setUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Listen for custom auth events (same-tab login/logout)
    const handleAuthChange = () => {
      setUser(getCurrentUser())
    }
    window.addEventListener('auth-changed', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-changed', handleAuthChange)
    }
  }, [])

  const toggleMenu = () => setIsMenuOpen(prev => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    logout()
    setUser(null)
    closeMenu()
    navigate('/')
  }

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
              to="/book-appointment"
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
              to="/gallery"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
            >
              Gallery
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
            >
              Services
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/locations"
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'active' : ''}`
              }
              onClick={closeMenu}
            >
              Locations
            </NavLink>
          </li>

          {user ? (
            <>
              {isAdmin() && (
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `navbar-link ${isActive ? 'active' : ''}`
                    }
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </NavLink>
                </li>
              )}
              {isBraider() && !isAdmin() ? (
                <>
                  <li>
                    <NavLink
                      to="/braider-profile"
                      className={({ isActive }) =>
                        `navbar-link ${isActive ? 'active' : ''}`
                      }
                      onClick={closeMenu}
                    >
                      My Appointments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/braider-settings"
                      className={({ isActive }) =>
                        `navbar-link ${isActive ? 'active' : ''}`
                      }
                      onClick={closeMenu}
                    >
                      Settings
                    </NavLink>
                  </li>
                </>
              ) : !isAdmin() ? (
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
              ) : null}
              
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
              
              <li>
                <button
                  className="navbar-link logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Sign Up
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/braider-register"
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Braider Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
