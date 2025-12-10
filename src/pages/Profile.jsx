// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { getStoredProfile, saveProfile } from '../utils/profileStorage';
import { getCurrentUser, isBraider, isCustomer } from '../utils/auth';
import { authAPI, rewardsAPI } from '../utils/api';
import { toast } from '../utils/toast';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [savedMessage, setSavedMessage] = useState('');
  const [rewards, setRewards] = useState(null);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const stored = getStoredProfile();
    if (stored) setProfile(stored);
    
    // Load user profile from API if logged in
    const user = getCurrentUser();
    if (user) {
      loadUserProfile();
      if (isCustomer()) {
        loadRewards();
      }
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.user) {
        setProfile({
          name: response.user.name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          notes: response.user.notes || ''
        });
      }
    } catch (error) {
      // Silently fail - will use localStorage fallback
    }
  };

  const loadRewards = async () => {
    try {
      setLoadingRewards(true);
      const response = await rewardsAPI.getMe();
      if (response.reward) {
        setRewards(response.reward);
      }
    } catch (error) {
      // Silently fail - rewards are optional
    } finally {
      setLoadingRewards(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save to backend API
      const response = await authAPI.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        notes: profile.notes
      });
      
      // Update stored user info if email changed
      if (response.user) {
        const currentAuth = localStorage.getItem('touba_hair_auth');
        if (currentAuth) {
          const authData = JSON.parse(currentAuth);
          authData.email = response.user.email;
          authData.name = response.user.name;
          localStorage.setItem('touba_hair_auth', JSON.stringify(authData));
        }
      }
      
      // Also save to localStorage as backup
      saveProfile(profile);
      setSavedMessage('Profile saved successfully!');
      toast.success('Profile saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.message || 'Error saving profile. Please try again.';
      setSavedMessage(errorMsg);
      toast.error(errorMsg);
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    // Validation
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    // For employees/admins, current password is required
    if ((user?.role === 'employee' || user?.role === 'admin') && !passwordData.currentPassword) {
      setPasswordMessage('Current password is required.');
      return;
    }

    setChangingPassword(true);

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword || undefined,
        newPassword: passwordData.newPassword
      });

      setPasswordMessage('Password changed successfully!');
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
      
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.message || 'Failed to change password. Please try again.';
      setPasswordMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setChangingPassword(false);
    }
  };

  const user = getCurrentUser()
  const braider = isBraider()

  return (
    <div className="page">
      <div className="container">
      <header className="page-header">
        <h1>My Profile</h1>
          <p>
            {braider 
              ? `Welcome, ${user?.name}! Manage your braider profile.`
              : 'Save your info so booking is faster next time.'}
          </p>
          {braider && (
            <Link to="/braider-profile" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
              View My Appointments
            </Link>
          )}
      </header>

      {/* Rewards Section for Clients */}
      {isCustomer() && rewards && (
        <section className="booking-card" style={{ marginTop: '1.25rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>🎁 Your Rewards</h2>
          <div className="rewards-display">
            <div className="rewards-stat">
              <div className="rewards-value">{rewards.totalPoints || 0}</div>
              <div className="rewards-label">Total Points</div>
            </div>
            <div className="rewards-stat">
              <div className="rewards-tier">{rewards.tier || 'bronze'}</div>
              <div className="rewards-label">Current Tier</div>
            </div>
            {rewards.pointsToNextReward > 0 && (
              <div className="rewards-next">
                <p>🎯 {rewards.pointsToNextReward} points until your next reward!</p>
                {rewards.nextRewardThreshold && (
                  <p className="rewards-threshold">
                    Next reward: {rewards.nextRewardThreshold.reward} at {rewards.nextRewardThreshold.points} points
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

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
              placeholder="your.email@example.com"
            />
            <small className="field-hint">You can change your email address</small>
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

      {/* Password Change Section */}
      <section className="booking-card" style={{ marginTop: '1.25rem' }}>
        <div className="password-change-header">
          <h2>🔒 Change Password</h2>
          <button
            type="button"
            className="btn-toggle"
            onClick={() => {
              setShowPasswordChange(!showPasswordChange);
              setPasswordMessage('');
              if (!showPasswordChange) {
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
              }
            }}
          >
            {showPasswordChange ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordChange && (
          <form onSubmit={handlePasswordChange} className="password-change-form">
            {passwordMessage && (
              <div className={`password-message ${passwordMessage.includes('successfully') ? 'success' : 'error'}`}>
                {passwordMessage}
              </div>
            )}

            <label className="field">
              <span>Current Password {user?.role === 'employee' || user?.role === 'admin' ? '*' : '(if you have one)'}</span>
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder={user?.role === 'client' ? "Leave empty if you don't have a password" : "Enter your current password"}
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {user?.role === 'client' && (
                <small className="field-hint">If you don't have a password yet, leave this empty to set one</small>
              )}
            </label>

            <label className="field">
              <span>New Password *</span>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <small className="field-hint">Must be at least 6 characters</small>
            </label>

            <label className="field">
              <span>Confirm New Password *</span>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  placeholder="Re-enter your new password"
                  className="password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </label>

            <div className="booking-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={changingPassword}
              >
                {changingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </section>
      </div>
    </div>
  );
};

export default Profile;
