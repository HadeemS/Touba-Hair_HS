import React, { useState, useEffect } from 'react'
import { galleryAPI } from '../utils/api'
import './Gallery.css'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      setLoading(true)
      const data = await galleryAPI.getAll()
      setImages(data)
      setError(null)
    } catch (err) {
      console.error('Error loading gallery:', err)
      setError('Failed to load gallery. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="container">
          <div className="loading">Loading gallery...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gallery-page">
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="gallery-page">
      <div className="container">
        <div className="gallery-header">
          <h1 className="page-title">Our Work</h1>
          <p className="page-subtitle">Beautiful braids created by our expert stylists</p>
        </div>

        {images.length === 0 ? (
          <div className="empty-gallery">
            <div className="empty-icon">📸</div>
            <h2>No images yet</h2>
            <p>Check back soon to see our beautiful work!</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {images.map((image) => (
              <div key={image.id} className="gallery-item">
                <div className="gallery-image-wrapper">
                  <img 
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${image.imageUrl}`}
                    alt={image.title}
                    className="gallery-image"
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <div className="gallery-info">
                      <h3 className="gallery-title">{image.title}</h3>
                      {image.description && (
                        <p className="gallery-description">{image.description}</p>
                      )}
                      {image.braiderName && (
                        <p className="gallery-braider">Stylist: {image.braiderName}</p>
                      )}
                      {image.serviceType && (
                        <p className="gallery-service">{image.serviceType}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery

