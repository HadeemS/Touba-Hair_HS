// Braider profiles data
export const braiders = [
  {
    id: '1',
    name: 'Amina',
    specialty: 'Box Braids & Cornrows',
    experience: '8 years',
    rating: 4.9,
    image: '👩🏾‍🦱',
    bio: 'Specializing in intricate box braids and classic cornrows. Known for precision and attention to detail.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    id: '2',
    name: 'Fatou',
    specialty: 'Goddess Braids & Twists',
    experience: '6 years',
    rating: 4.8,
    image: '👩🏾',
    bio: 'Expert in creating elegant goddess braids and protective styles. Your hair health is my priority.',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    id: '3',
    name: 'Mariama',
    specialty: 'Fulani Braids & Knotless',
    experience: '10 years',
    rating: 5.0,
    image: '👩🏾‍🦰',
    bio: 'Master of traditional Fulani braids and modern knotless styles. Combining tradition with contemporary flair.',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  {
    id: '4',
    name: 'Aissatou',
    specialty: 'Micro Braids & Feed-ins',
    experience: '7 years',
    rating: 4.7,
    image: '👩🏾‍🦳',
    bio: 'Creating stunning micro braids and seamless feed-in styles. Precision and artistry in every braid.',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday']
  }
]

export const getBraiderById = (id) => {
  return braiders.find(braider => braider.id === id)
}

