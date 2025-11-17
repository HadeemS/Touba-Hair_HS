// Authentication utility functions
const AUTH_KEY = 'touba_hair_auth'

export const login = (email, password, role = 'customer') => {
  // In a real app, this would verify credentials with a backend
  // For now, we'll use simple demo authentication
  
  // Demo credentials
  const braiderEmails = ['amina@toubahair.com', 'fatou@toubahair.com', 'mariama@toubahair.com', 'aissatou@toubahair.com']
  const isBraider = braiderEmails.includes(email.toLowerCase())
  
  // Simple demo: password is "password123" for all users
  if (password === 'password123' || password === 'demo') {
    const user = {
      email: email.toLowerCase(),
      role: isBraider ? 'braider' : 'customer',
      name: isBraider ? getBraiderNameByEmail(email) : email.split('@')[0],
      loggedIn: true,
      loginTime: new Date().toISOString()
    }
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    return { success: true, user }
  }
  
  return { success: false, error: 'Invalid credentials' }
}

const getBraiderNameByEmail = (email) => {
  const emailMap = {
    'amina@toubahair.com': 'Amina',
    'fatou@toubahair.com': 'Fatou',
    'mariama@toubahair.com': 'Mariama',
    'aissatou@toubahair.com': 'Aissatou'
  }
  return emailMap[email.toLowerCase()] || email.split('@')[0]
}

export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
}

export const getCurrentUser = () => {
  try {
    const auth = localStorage.getItem(AUTH_KEY)
    if (!auth) return null
    
    const user = JSON.parse(auth)
    return user.loggedIn ? user : null
  } catch (error) {
    return null
  }
}

export const isAuthenticated = () => {
  return getCurrentUser() !== null
}

export const isBraider = () => {
  const user = getCurrentUser()
  return user && user.role === 'braider'
}

export const isCustomer = () => {
  const user = getCurrentUser()
  return user && user.role === 'customer'
}

export const requireAuth = () => {
  if (!isAuthenticated()) {
    return false
  }
  return true
}

