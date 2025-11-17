// src/utils/profileStorage.js

const PROFILE_KEY = 'touba-hair-profile';

export function getStoredProfile() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) {
    return {
      name: '',
      email: '',
      phone: '',
      notes: ''
    };
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {
      name: '',
      email: '',
      phone: '',
      notes: ''
    };
  }
}

export function saveProfile(profile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
