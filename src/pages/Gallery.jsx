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
            {images.map((item) => {
              const isVideo = item.type === 'video' || item.videoUrl || (item.imageUrl && item.imageUrl.match(/\.(mp4|webm|ogg)$/i))
              const mediaUrl = isVideo 
                ? (item.videoUrl || item.imageUrl)
                : `${import.meta.env.VITE_API_URL || 'https://touba-hair-hs.onrender.com'}${item.imageUrl}`
              
              return (
                <div key={item.id} className={`gallery-item ${isVideo ? 'video-item' : ''}`}>
                  <div className="gallery-media-wrapper">
                    {isVideo ? (
                      <video 
                        src={mediaUrl}
                        className="gallery-media"
                        controls
                        preload="metadata"
                        poster={item.posterUrl ? `${import.meta.env.VITE_API_URL || 'https://touba-hair-hs.onrender.com'}${item.posterUrl}` : undefined}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img 
                        src={mediaUrl}
                        alt={item.title}
                        className="gallery-media"
                        loading="lazy"
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

