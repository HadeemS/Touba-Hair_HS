// Utility functions for managing braider settings (availability and specialties)

export const getBraiderAvailability = (braiderName) => {
  try {
    const saved = localStorage.getItem(`braider_${braiderName}_availability`)
    if (saved) {
      return JSON.parse(saved)
    }
    return null
  } catch (error) {
    console.error('Error getting braider availability:', error)
    return null
  }
}

export const getBraiderSpecialties = (braiderName) => {
  try {
    const saved = localStorage.getItem(`braider_${braiderName}_specialties`)
    if (saved) {
      return JSON.parse(saved)
    }
    return null
  } catch (error) {
    console.error('Error getting braider specialties:', error)
    return null
  }
}

export const getBraiderAvailableDays = (braiderName, defaultDays = []) => {
  const availability = getBraiderAvailability(braiderName)
  if (availability) {
    return Object.entries(availability)
      .filter(([_, isAvailable]) => isAvailable)
      .map(([day, _]) => day)
  }
  return defaultDays
}

