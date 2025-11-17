import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pricesAPI } from '../utils/api'
import './Services.css'

const Services = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      setLoading(true)
      const data = await pricesAPI.getAll()
      setServices(data)
      setError(null)
    } catch (err) {
      console.error('Error loading services:', err)
      // Fallback to default services if API fails
      setServices(getDefaultServices())
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const getDefaultServices = () => {
    return [
      {
        id: '1',
        name: 'Box Braids',
        description: 'Classic box braids with premium hair extensions. Perfect for protective styling and long-lasting wear.',
        price: 150,
        duration: '4-6 hours',
        category: 'Protective Styles',
        icon: '📦',
        features: ['Long-lasting', 'Low maintenance', 'Versatile styling']
      },
      {
        id: '2',
        name: 'Cornrows',
        description: 'Traditional cornrow braiding styles. Elegant patterns that showcase your natural hair texture.',
        price: 80,
        duration: '2-3 hours',
        category: 'Traditional',
        icon: '🌾',
        features: ['Quick installation', 'Versatile patterns', 'Great for all hair types']
      },
      {
        id: '3',
        name: 'Goddess Braids',
        description: 'Elegant goddess braids with decorative elements. A stunning style that combines beauty and sophistication.',
        price: 180,
        duration: '5-7 hours',
        category: 'Specialty',
        icon: '👑',
        features: ['Elegant design', 'Decorative elements', 'Special occasion ready']
      },
      {
        id: '4',
        name: 'Fulani Braids',
        description: 'Traditional Fulani braiding style with unique patterns and accessories. A beautiful cultural expression.',
        price: 160,
        duration: '4-6 hours',
        category: 'Traditional',
        icon: '✨',
        features: ['Cultural significance', 'Unique patterns', 'Accessories included']
      },
      {
        id: '5',
        name: 'Micro Braids',
        description: 'Fine micro braids for a delicate, natural look. Perfect for those who want subtle elegance.',
        price: 200,
        duration: '6-8 hours',
        category: 'Protective Styles',
        icon: '💫',
        features: ['Ultra-fine braids', 'Natural appearance', 'Long-lasting']
      },
      {
        id: '6',
        name: 'Knotless Braids',
        description: 'Gentle knotless braids for maximum hair protection. Reduces tension and promotes healthy hair growth.',
        price: 170,
        duration: '5-7 hours',
        category: 'Protective Styles',
        icon: '🔄',
        features: ['Tension-free', 'Hair-friendly', 'Comfortable wear']
      },
      {
        id: '7',
        name: 'Feed-in Braids',
        description: 'Seamless feed-in braids that look natural and blend beautifully with your hair.',
        price: 140,
        duration: '4-5 hours',
        category: 'Protective Styles',
        icon: '🎯',
        features: ['Natural look', 'Seamless blend', 'Versatile']
      },
      {
        id: '8',
        name: 'Senegalese Twists',
        description: 'Classic Senegalese twists for a sleek, polished look. Perfect for professional settings.',
        price: 130,
        duration: '3-4 hours',
        category: 'Traditional',
        icon: '🌀',
        features: ['Sleek finish', 'Professional look', 'Easy maintenance']
      }
    ]
  }

  // Get unique categories
  const categories = ['all', ...new Set(services.map(s => s.category).filter(Boolean))]

  // Filter services by category
  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory)

  if (loading) {
    return (
      <div className="services-page">
        <div className="container">
          <div className="loading">Loading services...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="services-page">
      <div className="container">
        <div className="services-header">
          <h1 className="page-title">Our Services</h1>
          <p className="page-subtitle">
            Expert braiding services tailored for your natural hair. 
            From traditional styles to modern protective looks, we've got you covered.
          </p>
        </div>

        {categories.length > 1 && (
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Services' : category}
              </button>
            ))}
          </div>
        )}

        {filteredServices.length === 0 ? (
          <div className="empty-services">
            <div className="empty-icon">💇🏾‍♀️</div>
            <h2>No services available</h2>
            <p>Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-card-header">
                  <div className="service-icon">{service.icon || '✨'}</div>
                  <div className="service-header-text">
                    <h3 className="service-name">{service.name}</h3>
                    {service.category && (
                      <span className="service-category">{service.category}</span>
                    )}
                  </div>
                </div>

                <div className="service-card-body">
                  <p className="service-description">{service.description}</p>

                  {service.features && service.features.length > 0 && (
                    <ul className="service-features">
                      {service.features.map((feature, index) => (
                        <li key={index} className="feature-item">
                          <span className="feature-check">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="service-details">
                    <div className="service-price-section">
                      <span className="price-label">Starting at</span>
                      <div className="service-price">
                        <span className="price-currency">$</span>
                        <span className="price-amount">{service.price}</span>
                      </div>
                    </div>

                    {service.duration && (
                      <div className="service-duration">
                        <span className="duration-icon">⏱️</span>
                        <span className="duration-text">{service.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="service-card-footer">
                  <button 
                    className="btn btn-primary service-btn"
                    onClick={() => navigate('/book-appointment')}
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Services

