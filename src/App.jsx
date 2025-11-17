import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BookAppointment from './pages/BookAppointment'
import Profile from './pages/Profile'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import BraiderProfile from './pages/BraiderProfile'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/login" element={<Login />} />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

