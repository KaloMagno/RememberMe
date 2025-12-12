export interface Child {
  id: string;
  name: string;
  age: string;
}

export type ContactFrequency = 'weekly' | 'monthly' | 'quarterly' | 'bi-annually' | 'yearly' | '';

export type TierLevel = 'Close Friend/Family' | 'Friend/Colleague' | 'Acquaintance' | '';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  birthday: string; // YYYY-MM-DD
  partnerName: string;
  children: Child[];
  education: string;
  occupation: string;
  interests: string; // Comma separated or long text
  notes: string;
  avatarColor: string;
  lastContactedDate: string;
  contactFrequency: ContactFrequency;
  tier: TierLevel;
}

export type ViewState = 'LIST' | 'CREATE' | 'EDIT';

export interface ViewManager {
  currentView: ViewState;
  selectedContactId: string | null;
}

export const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500', 
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 
  'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 
  'bg-pink-500', 'bg-rose-500'
];