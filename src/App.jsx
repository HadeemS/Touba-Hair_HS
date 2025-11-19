import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BookAppointment from './pages/BookAppointment'
import Profile from './pages/Profile'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import ClientRegister from './pages/ClientRegister'
import BraiderRegister from './pages/BraiderRegister'
import BraiderProfile from './pages/BraiderProfile'
import BraiderSettings from './pages/BraiderSettings'
import Gallery from './pages/Gallery'
import Services from './pages/Services'
import Locations from './pages/Locations'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import FAQs from './pages/FAQs'
import Policies from './pages/Policies'
import Contact from './pages/Contact'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'
import './App.css'

// Get base path for GitHub Pages
const getBasename = () => {
  // Check if we're on GitHub Pages (has /repo-name/ in path)
  const path = window.location.pathname
  const match = path.match(/^(\/[^\/]+)/)
  if (match && match[1] !== '/') {
    return match[1]
  }
  return '/'
}

function App() {
  return (
    <Router basename={getBasename()}>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/services" element={<Services />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/about" element={<About />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<ClientRegister />} />
            <Route path="/braider-register" element={<BraiderRegister />} />
            <Route 
              path="/my-bookings" 
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/braider-profile" 
              element={
                <ProtectedRoute requireBraider={true}>
                  <BraiderProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/braider-settings" 
              element={
                <ProtectedRoute requireBraider={true}>
                  <BraiderSettings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

