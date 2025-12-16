// Utility functions for managing bookings in localStorage
// In production, this would connect to a backend API

const STORAGE_KEY = 'touba_hair_bookings'

export const getBookings = () => {
  try {
    const bookings = localStorage.getItem(STORAGE_KEY)
    return bookings ? JSON.parse(bookings) : []
  } catch (error) {
    // Silently fail - return empty array
    return []
  }
}

export const saveBooking = (booking) => {
  try {
    const bookings = getBookings()
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    bookings.push(newBooking)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
    return newBooking
  } catch (error) {
    throw error
  }
}

export const deleteBooking = (bookingId) => {
  try {
    const bookings = getBookings()
    const filtered = bookings.filter(b => b.id !== bookingId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    return false
  }
}

export const getBookingsByDate = (date, braiderId = null) => {
  const bookings = getBookings()
  return bookings.filter(booking => {
    const bookingDate = booking.date
    const matchesDate = bookingDate === date
    const matchesBraider = braiderId ? booking.braiderId === braiderId : true
    return matchesDate && matchesBraider
  })
}

export const isTimeSlotAvailable = (date, timeSlot, braiderId) => {
  const bookings = getBookingsByDate(date, braiderId)
  return !bookings.some(booking => booking.timeSlot === timeSlot)
}

