import { Contact, COLORS } from '../types';

const STORAGE_KEY = 'kinship_contacts_v1';

const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_DATA: Contact[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Rivera',
    birthday: '1990-05-15',
    partnerName: 'Carlos',
    children: [{ id: 'c1', name: 'Mia', age: '5' }],
    childrenNotes: 'Mia loves dinosaurs and space.',
    siblings: [],
    siblingsNotes: 'Has a twin sister living in Madrid.',
    education: 'Masters in Art History, NYU',
    occupation: 'Gallery Curator',
    interests: 'Modern art, hiking, ceramic pottery',
    notes: 'Remember she is allergic to peanuts.',
    avatarColor: 'bg-indigo-500',
    lastContactedDate: '2023-10-15',
    contactFrequency: 'monthly',
    tier: '1 - Close Friend/Family',
    phoneNumber: '555-0123',
    email: 'alice.rivera@example.com',
    instagram: '@alicerivera_art'
  },
  {
    id: '2',
    firstName: 'David',
    lastName: 'Chen',
    birthday: '1988-11-20',
    partnerName: 'Sarah',
    children: [],
    siblings: [],
    education: 'BS Computer Science',
    occupation: 'Software Engineer',
    interests: 'Sci-fi novels, mechanical keyboards, coffee roasting',
    notes: 'Met at the conference in 2022.',
    avatarColor: 'bg-emerald-500',
    lastContactedDate: '2023-12-01',
    contactFrequency: 'quarterly',
    tier: '2 - Friend/Colleague',
    linkedin: 'david-chen-dev'
  }
];

export const getContacts = (): Contact[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Initialize with mock data for first-time user experience
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }
  return JSON.parse(data);
};

export const saveContact = (contact: Contact): Contact[] => {
  const contacts = getContacts();
  const existingIndex = contacts.findIndex(c => c.id === contact.id);
  
  let newContacts;
  if (existingIndex >= 0) {
    newContacts = [...contacts];
    newContacts[existingIndex] = contact;
  } else {
    // New contact
    newContacts = [...contacts, { ...contact, id: contact.id || generateId() }];
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
  return newContacts;
};

export const deleteContact = (id: string): Contact[] => {
  const contacts = getContacts();
  const newContacts = contacts.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
  return newContacts;
};

export const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];