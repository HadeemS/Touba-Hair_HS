// API utility functions for connecting to backend

// API URL from environment variable or fallback to Render production URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://touba-hair-hs-1.onrender.com';

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

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
    // Only log in development
    if (import.meta.env.DEV) {
      console.log('API Call:', url, options.method || 'GET');
    }
    
    const response = await fetch(url, config);
    
    const responseData = await response.json().catch(() => ({ error: 'Invalid JSON response' }));
    
    if (!response.ok) {
      // Prefer detailed message, then error, then generic message
      const errorMessage = responseData.message || responseData.error || `HTTP error! status: ${response.status}`;
      
      // Only log errors in development
      if (import.meta.env.DEV) {
        console.error('API Error:', errorMessage);
        console.error('Full error response:', responseData);
      }
      
      // Create error with more details
      const error = new Error(errorMessage);
      error.response = responseData;
      error.status = response.status;
      throw error;
    }
    
    return responseData;
  } catch (error) {
    // Only log errors in development
    if (import.meta.env.DEV) {
      console.error('API Call Error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        url: url
      });
    }
    throw error;
  }
}

// Gallery API functions
export const galleryAPI = {
  getAll: (query = '') => apiCall(`/api/gallery${query}`),
  getById: (id) => apiCall(`/api/gallery/${id}`),
  create: (formData) => apiCall('/api/gallery', {
    method: 'POST',
    body: formData,
    // Note: Don't set Content-Type header for FormData, browser will set it with boundary
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

// Auth API functions
export const authAPI = {
  register: (data) => apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  login: (data) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getMe: () => {
    const token = localStorage.getItem('auth_token');
    return apiCall('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  updateProfile: (data) => {
    const token = localStorage.getItem('auth_token');
    return apiCall('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
  },
  changePassword: (data) => {
    const token = localStorage.getItem('auth_token');
    return apiCall('/api/auth/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
  }
};

// Appointments API functions
export const appointmentsAPI = {
  getAll: (params = {}) => {
    const token = localStorage.getItem('auth_token');
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/api/appointments${queryString ? `?${queryString}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getById: (id) => {
    const token = localStorage.getItem('auth_token');
    return apiCall(`/api/appointments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  create: (data) => {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Only add Authorization header if token exists (for logged-in users)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return apiCall('/api/appointments', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
  },
  updateStatus: (id, status) => {
    const token = localStorage.getItem('auth_token');
    return apiCall(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status }),
    });
  },
  cancel: (id) => {
    const token = localStorage.getItem('auth_token');
    return apiCall(`/api/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Rewards API functions
export const rewardsAPI = {
  getMe: () => {
    const token = localStorage.getItem('auth_token');
    return apiCall('/api/rewards/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  getClient: (clientId) => {
    const token = localStorage.getItem('auth_token');
    return apiCall(`/api/rewards/client/${clientId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  adjust: (data) => {
    const token = localStorage.getItem('auth_token');
    return apiCall('/api/rewards/adjust', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
  },
  redeem: (points) => {
    const token = localStorage.getItem('auth_token');
    return apiCall('/api/rewards/redeem', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ points }),
    });
  }
};

