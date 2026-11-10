// Single source of truth for every name, date, time and venue on the invitation.
// Values are exactly as provided by the family — do not change spellings.

export const groom = {
  name: 'Pawan Mishra',
  firstName: 'Pawan',
  father: 'Shree Ram Pratap Mishra',
  mother: 'Asha Mishra',
};

export const bride = {
  name: 'Ankita Diwedi',
  firstName: 'Ankita',
  father: 'Late Jagat Narayan Diwedi',
  mother: 'Archana Diwedi',
  address: 'Alipur Mitchlaula.',
};

export const groomSide = {
  date: '26 November',
  events: [
    { name: 'Engagement Ceremony', time: '6:00 PM', sketch: 'rings' },
    { name: 'Tilak Ceremony', time: '8:00 PM', sketch: 'diya' },
  ],
  venue: {
    name: 'Neelkanth Lawn',
    lines: ['Near Awagojha Chauraha,', 'Pathakpur, Unnao.'],
    mapQuery: 'Neelkanth Lawn, Near Awagojha Chauraha, Pathakpur, Unnao',
  },
};

export const wedding = {
  day: '3',
  month: 'December',
  date: '3 December',
  venue: {
    name: 'Swarnim Lawn and Banquet Hall',
    lines: ['Chaugda Kheda,', 'Hasanganj, Unnao.'],
    mapQuery: 'Swarnim Lawn and Banquet Hall, Chaugda Kheda, Hasanganj, Unnao',
  },
};

export const mapUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
