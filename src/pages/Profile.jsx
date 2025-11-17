// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { getStoredProfile, saveProfile } from '../utils/profileStorage';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const stored = getStoredProfile();
    if (stored) setProfile(stored);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProfile(profile);
    setSavedMessage('Profile saved! Your bookings will be auto-filled.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>My Profile</h1>
        <p>Save your info so booking is faster next time.</p>
      </header>

      <section className="booking-card" style={{ marginTop: '1.25rem' }}>
        {savedMessage && <div className="alert">{savedMessage}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <label className="field">
            <span>Full Name</span>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Phone</span>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Notes / Hair Info</span>
            <textarea
              rows="3"
              name="notes"
              value={profile.notes}
              onChange={handleChange}
              placeholder="Preferred styles, hair length, sensitivities, etc."
            />
          </label>

          <div className="booking-actions">
            <button type="submit" className="btn-primary">
              Save Profile
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Profile;
