import { format, addDays, isAfter, isBefore, startOfDay, parseISO } from 'date-fns'

// Generate time slots for a day
export const generateTimeSlots = () => {
  const slots = []
  const startHour = 9 // 9 AM
  const endHour = 19 // 7 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`
    slots.push(time)
  }
  
  return slots
}

// Get available dates (next 30 days)
export const getAvailableDates = () => {
  const dates = []
  const today = startOfDay(new Date())
  
  for (let i = 1; i <= 30; i++) {
    const date = addDays(today, i)
    dates.push(date)
  }
  
  return dates
}

// Format date for display
export const formatDateDisplay = (date) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, 'EEEE, MMMM d, yyyy')
}

// Format date for storage (YYYY-MM-DD)
export const formatDateStorage = (date) => {
  if (typeof date === 'string') {
    return date
  }
  return format(date, 'yyyy-MM-dd')
}

// Check if date is in the past
export const isPastDate = (date) => {
  const today = startOfDay(new Date())
  const checkDate = typeof date === 'string' ? parseISO(date) : date
  return isBefore(startOfDay(checkDate), today)
}

// Get day name from date
export const getDayName = (date) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, 'EEEE')
}

