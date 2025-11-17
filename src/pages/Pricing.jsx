import React, { useState, useEffect } from 'react'
import { pricesAPI } from '../utils/api'
import './Pricing.css'

const Pricing = () => {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadPrices()
  }, [])

  const loadPrices = async () => {
    try {
      setLoading(true)
      const data = await pricesAPI.getAll()
      setPrices(data)
      setError(null)
    } catch (err) {
      console.error('Error loading prices:', err)
      setError('Failed to load prices. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = ['all', ...new Set(prices.map(p => p.category).filter(Boolean))]

  // Filter prices by category
  const filteredPrices = selectedCategory === 'all'
    ? prices
    : prices.filter(p => p.category === selectedCategory)

  if (loading) {
    return (
      <div className="pricing-page">
        <div className="container">
          <div className="loading">Loading prices...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pricing-page">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="pricing-page">
      <div className="container">
        <div className="pricing-header">
          <h1 className="page-title">Service Pricing</h1>
          <p className="page-subtitle">Transparent pricing for all our braiding services</p>
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

        {filteredPrices.length === 0 ? (
          <div className="empty-pricing">
            <div className="empty-icon">💰</div>
            <h2>No pricing information available</h2>
            <p>Please check back later or contact us for pricing details.</p>
          </div>
        ) : (
          <div className="pricing-grid">
            {filteredPrices.map((service) => (
              <div key={service.id} className="pricing-card">
                <div className="pricing-card-header">
                  <h3 className="service-name">{service.name}</h3>
                  {service.category && (
                    <span className="service-category">{service.category}</span>
                  )}
                </div>
                
                <div className="pricing-card-body">
                  <div className="service-price">
                    <span className="price-currency">$</span>
                    <span className="price-amount">{service.price}</span>
                  </div>
                  
                  {service.description && (
                    <p className="service-description">{service.description}</p>
                  )}
                  
                  {service.duration && (
                    <div className="service-duration">
                      <span className="duration-icon">⏱️</span>
                      <span className="duration-text">{service.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Pricing

