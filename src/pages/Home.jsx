import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Touba African Hairbraiding</span>
            </h1>
            <p className="hero-subtitle">
              Experience the art of professional hair braiding. 
              Book your appointment with our talented stylists and transform your look.
            </p>
            <div className="hero-buttons">
              <Link to="/book-appointment" className="btn btn-primary">
                Book Now
              </Link>
              <Link to="/services" className="btn btn-secondary">
                Our Services
              </Link>
              <Link to="/gallery" className="btn btn-outline">
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Touba Hair?</h2>
          <p className="section-subtitle">
            We bring together expertise, creativity, and care to give you the perfect braiding experience.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Expert Stylists</h3>
              <p className="feature-description">
                Our team consists of highly skilled and experienced braiding professionals.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3 className="feature-title">Flexible Scheduling</h3>
              <p className="feature-description">
                Book appointments that fit your schedule with our easy online booking system.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3 className="feature-title">Premium Quality</h3>
              <p className="feature-description">
                We use only the finest products and techniques for long-lasting, beautiful results.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Personalized Service</h3>
              <p className="feature-description">
                Each appointment is tailored to your unique style and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Look?</h2>
            <p className="cta-subtitle">
              Book your appointment today and let our expert stylists create the perfect braids for you.
            </p>
            <Link to="/book-appointment" className="btn btn-primary btn-large">
              Schedule Your Appointment
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

