import React from 'react'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1 className="page-title">About Touba Hair</h1>
          <p className="page-subtitle">Celebrating the art of hair braiding</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              Touba Hair Salon was founded with a passion for preserving and celebrating 
              the rich tradition of hair braiding. We believe that every braid tells a story, 
              and we're honored to be part of yours.
            </p>
            <p>
              Our team of expert stylists brings years of experience and a deep appreciation 
              for the cultural significance of braiding. We combine traditional techniques 
              with modern styles to create looks that are both timeless and contemporary.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              To provide exceptional hair braiding services while honoring the cultural heritage 
              of this beautiful art form. We're committed to:
            </p>
            <ul className="mission-list">
              <li>✨ Delivering high-quality, professional braiding services</li>
              <li>✨ Using premium products that protect and nourish your hair</li>
              <li>✨ Creating a welcoming, inclusive environment for all clients</li>
              <li>✨ Preserving traditional braiding techniques while embracing innovation</li>
              <li>✨ Building lasting relationships with our community</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Why Choose Us</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">👑</div>
                <h3>Expert Stylists</h3>
                <p>Our team has years of experience in various braiding techniques</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💎</div>
                <h3>Premium Quality</h3>
                <p>We use only the finest hair extensions and hair care products</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">❤️</div>
                <h3>Hair Health First</h3>
                <p>Your hair's health and protection is our top priority</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⏰</div>
                <h3>Flexible Scheduling</h3>
                <p>Book appointments that fit your busy schedule</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Services</h2>
            <p>
              We offer a wide range of braiding styles, from traditional cornrows and box braids 
              to modern knotless braids and specialty styles. Whether you're looking for a 
              protective style, a special occasion look, or maintenance services, we've got you covered.
            </p>
            <p>
              <a href="/services" className="link-primary">View all our services →</a>
            </p>
          </section>

          <section className="about-section">
            <h2>Visit Us</h2>
            <p>
              We have two convenient locations in Columbia, SC. Stop by or book an appointment 
              online to experience the Touba Hair difference.
            </p>
            <p>
              <a href="/locations" className="link-primary">Find our locations →</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About

