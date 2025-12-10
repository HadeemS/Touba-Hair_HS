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
      // Add cache-busting query parameter to ensure fresh data
      const cacheBuster = `?t=${Date.now()}`
      const data = await galleryAPI.getAll(cacheBuster)
      if (data && Array.isArray(data)) {
        setImages(data)
        setError(null)
      } else {
        setError('Invalid data format received from server.')
        setImages([])
      }
    } catch (err) {
      setError(`Failed to load gallery: ${err.message || 'Unknown error'}. Please check your connection and try again.`)
      setImages([])
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
            {images.map((item) => {
              // Check for placeholder: type is 'placeholder' OR imageUrl is null/empty
              const isPlaceholder = item.type === 'placeholder' || !item.imageUrl || item.imageUrl === null
              const isVideo = !isPlaceholder && (item.type === 'video' || item.videoUrl || (item.imageUrl && item.imageUrl.match(/\.(mp4|webm|ogg)$/i)))
              
              return (
                <div key={item.id} className={`gallery-item ${isVideo ? 'video-item' : ''} ${isPlaceholder ? 'placeholder-item' : ''}`}>
                  <div className="gallery-media-wrapper">
                    {isPlaceholder ? (
                      <div className="gallery-placeholder">
                        <span className="placeholder-emoji">{item.emoji || '📸'}</span>
                      </div>
                    ) : isVideo ? (
                      <video 
                        src={item.videoUrl || item.imageUrl}
                        className="gallery-media"
                        controls
                        preload="metadata"
                        poster={item.posterUrl ? (item.posterUrl.startsWith('http') ? item.posterUrl : `${import.meta.env.VITE_API_URL || 'https://touba-hair-hs.onrender.com'}${item.posterUrl}`) : undefined}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img 
                        src={item.imageUrl.startsWith('http') ? item.imageUrl : `${import.meta.env.VITE_API_URL || 'https://touba-hair-hs.onrender.com'}${item.imageUrl}`}
                        alt={item.title || 'Gallery image'}
                        className="gallery-media"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Failed to load image:', item.imageUrl)
                          // Fallback to placeholder if image fails to load
                          const wrapper = e.target.parentElement
                          if (wrapper) {
                            wrapper.innerHTML = `<div class="gallery-placeholder"><span class="placeholder-emoji">${item.emoji || '📸'}</span></div>`
                          }
                        }}
                      />
                    )}
                    <div className="gallery-overlay">
                      <div className="gallery-info">
                        {isVideo && <span className="video-badge">▶ Video</span>}
                        <h3 className="gallery-title">{item.title}</h3>
                        {item.description && (
                          <p className="gallery-description">{item.description}</p>
                        )}
                        {item.braiderName && (
                          <p className="gallery-braider">Stylist: {item.braiderName}</p>
                        )}
                        {item.serviceType && (
                          <p className="gallery-service">{item.serviceType}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery

