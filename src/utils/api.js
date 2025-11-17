// API utility functions for connecting to backend

// Change this to your Render API URL when deployed
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Remove Content-Type for FormData (multer needs it)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Gallery API functions
export const galleryAPI = {
  getAll: () => apiCall('/api/gallery'),
  getById: (id) => apiCall(`/api/gallery/${id}`),
  create: (formData) => apiCall('/api/gallery', {
    method: 'POST',
    body: formData,
  }),
  update: (id, data) => apiCall(`/api/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/api/gallery/${id}`, {
    method: 'DELETE',
  }),
};

// Prices API functions
export const pricesAPI = {
  getAll: () => apiCall('/api/prices'),
  getById: (id) => apiCall(`/api/prices/${id}`),
  create: (data) => apiCall('/api/prices', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/api/prices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/api/prices/${id}`, {
    method: 'DELETE',
  }),
};

// Health check
export const healthCheck = () => apiCall('/api/health');

