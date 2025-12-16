// Pre-set braider credentials
// These credentials are used to create braider accounts automatically
// Admin can manage these through the admin dashboard

export const braiderCredentials = [
  {
    braiderId: '1',
    name: 'Amina',
    email: 'amina@toubahair.com',
    password: 'Amina2024!', // Pre-set password
    phone: '(555) 123-4567',
    role: 'employee'
  },
  {
    braiderId: '2',
    name: 'Fatou',
    email: 'fatou@toubahair.com',
    password: 'Fatou2024!', // Pre-set password
    phone: '(555) 234-5678',
    role: 'employee'
  },
  {
    braiderId: '3',
    name: 'Mariama',
    email: 'mariama@toubahair.com',
    password: 'Mariama2024!', // Pre-set password
    phone: '(555) 345-6789',
    role: 'employee'
  },
  {
    braiderId: '4',
    name: 'Aissatou',
    email: 'aissatou@toubahair.com',
    password: 'Aissatou2024!', // Pre-set password
    phone: '(555) 456-7890',
    role: 'employee'
  }
];

// Admin credentials (hidden from public, only for admin use)
export const adminCredentials = [
  {
    name: 'Admin',
    email: 'admin@toubahair.com',
    password: 'Admin123!@#', // Change this in production!
    role: 'admin'
  }
];

