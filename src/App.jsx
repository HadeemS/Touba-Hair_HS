import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'
import './App.css'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const BookAppointment = lazy(() => import('./pages/BookAppointment'))
const Profile = lazy(() => import('./pages/Profile'))
const MyBookings = lazy(() => import('./pages/MyBookings'))
const Login = lazy(() => import('./pages/Login'))
const ClientRegister = lazy(() => import('./pages/ClientRegister'))
const BraiderRegister = lazy(() => import('./pages/BraiderRegister'))
const BraiderProfile = lazy(() => import('./pages/BraiderProfile'))
const BraiderSettings = lazy(() => import('./pages/BraiderSettings'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Services = lazy(() => import('./pages/Services'))
const Locations = lazy(() => import('./pages/Locations'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const About = lazy(() => import('./pages/About'))
const FAQs = lazy(() => import('./pages/FAQs'))
const Policies = lazy(() => import('./pages/Policies'))
const Contact = lazy(() => import('./pages/Contact'))

// Loading component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    Loading...
  </div>
)

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

// Handle GitHub Pages 404 redirect
const handle404Redirect = () => {
  const search = window.location.search
  if (search.includes('?/')) {
    const hashPath = search.split('?/')[1].split('&')[0].replace(/~and~/g, '&')
    if (hashPath) {
      const newPath = hashPath.startsWith('/') ? hashPath : `/${hashPath}`
      const basePath = getBasename()
      const fullPath = basePath === '/' ? newPath : `${basePath}${newPath}`
      window.history.replaceState(null, '', fullPath + window.location.hash)
    }
  }
}

function App() {
  // Handle GitHub Pages 404 redirect on page load
  React.useEffect(() => {
    handle404Redirect()
  }, [])

  return (
    <Router basename={getBasename()}>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

