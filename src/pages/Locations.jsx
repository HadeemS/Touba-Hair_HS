import React from 'react'
import './Locations.css'

const Locations = () => {
  const locations = [
    {
      id: '1',
      name: 'Two Notch Road Location',
      address: '6432 Two Notch Rd',
      city: 'Columbia, SC',
      phone: '(839) 201-3566',
      hours: {
        weekdays: 'Mon - Fri: 9:00 AM - 7:00 PM',
        saturday: 'Saturday: 10:00 AM - 6:00 PM',
        sunday: 'Sunday: Closed'
      },
      features: ['Full-service salon', 'Parking available', 'Wheelchair accessible']
    },
    {
      id: '2',
      name: 'Sandhills Promenade Location',
      address: '6312 Sandhills Promenade',
      city: 'Columbia, SC',
      phone: '(803) 333-0042',
      hours: {
        weekdays: 'Mon - Fri: 9:00 AM - 7:00 PM',
        saturday: 'Saturday: 10:00 AM - 6:00 PM',
        sunday: 'Sunday: Closed'
      },
      features: ['Full-service salon', 'Parking available', 'Wheelchair accessible', 'Shopping center location']
    }
  ]

  return (
    <div className="locations-page">
      <div className="container">
        <div className="locations-header">
          <h1 className="page-title">Our Locations</h1>
          <p className="page-subtitle">
            Visit us at either of our convenient locations in Columbia, SC
          </p>
        </div>

        <div className="locations-grid">
          {locations.map((location) => (
            <div key={location.id} className="location-card">
              <div className="location-card-header">
                <div className="location-icon">📍</div>
                <h2 className="location-name">{location.name}</h2>
              </div>

              <div className="location-card-body">
                <div className="location-address">
                  <div className="address-line">{location.address}</div>
                  <div className="address-city">{location.city}</div>
                </div>

                <div className="location-contact">
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <span className="contact-text">{location.phone}</span>
                  </div>
                </div>

                <div className="location-hours">
                  <h3 className="hours-title">Hours</h3>
                  <ul className="hours-list">
                    <li>{location.hours.weekdays}</li>
                    <li>{location.hours.saturday}</li>
                    <li>{location.hours.sunday}</li>
                  </ul>
                </div>

                {location.features && location.features.length > 0 && (
                  <div className="location-features">
                    <h3 className="features-title">Amenities</h3>
                    <ul className="features-list">
                      {location.features.map((feature, index) => (
                        <li key={index} className="feature-item">
                          <span className="feature-check">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="location-actions">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address + ', ' + location.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary location-btn"
                  >
                    Get Directions
                  </a>
                  <button 
                    className="btn btn-secondary location-btn"
                    onClick={() => window.location.href = `tel:${location.phone.replace(/\D/g, '')}`}
                  >
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="locations-map-section">
          <h2 className="map-section-title">Find Us on the Map</h2>
          <p className="map-section-subtitle">Click on a location above to get directions</p>
        </div>
      </div>
    </div>
  )
}

export default Locations

