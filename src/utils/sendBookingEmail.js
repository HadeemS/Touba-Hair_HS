// src/utils/sendBookingEmail.js

// Your Web3Forms access key
const WEB3FORMS_ACCESS_KEY = '4b370dcc-6fd1-4c70-ad6c-98ba1e9a9835'

/**
 * bookingInfo = {
 *   clientName,
 *   clientEmail,
 *   clientPhone,
 *   notes,
 *   serviceName,
 *   braiderName,
 *   dateTimeDisplay
 * }
 */
export async function sendBookingEmail(bookingInfo) {
  const {
    clientName,
    clientEmail,
    clientPhone,
    notes,
    serviceName,
    braiderName,
    dateTimeDisplay
  } = bookingInfo

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: 'New Touba Hair Booking',
    from_name: 'Touba Hair Website',

    // These are special Web3Forms fields
    name: clientName || 'Touba Hair Client',
    email: clientEmail || 'no-email-provided@example.com',

    // Everything in "message" becomes the email body
    message: `
New booking from your website:

Client: ${clientName || 'N/A'}
Phone: ${clientPhone || 'N/A'}
Email: ${clientEmail || 'N/A'}

Service: ${serviceName || 'N/A'}
Braider: ${braiderName || 'N/A'}
Date & Time: ${dateTimeDisplay || 'N/A'}

Notes:
${notes || '(none)'}
    `
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    console.error('Web3Forms error:', data)
    throw new Error(data.message || 'Failed to send booking email')
  }

  return data
}
