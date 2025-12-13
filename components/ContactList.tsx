import React, { useState, useMemo } from 'react';
import { Contact } from '../types';
import { Plus, Search, User } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (id: string) => void;
  onCreateNew: () => void;
}

export const ContactList: React.FC<ContactListProps> = ({ 
  contacts, 
  onSelectContact, 
  onCreateNew 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.occupation.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.firstName.localeCompare(b.firstName));
  }, [contacts, searchTerm]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-slate-800">My Connections</h1>
          <button 
            onClick={onCreateNew}
            className="md:hidden bg-blue-600 text-white p-2 rounded-full shadow-lg"
          >
            <Plus size={24} />
          </button>
          <button 
            onClick={onCreateNew}
            className="hidden md:flex bg-blue-600 text-white px-4 py-2 rounded-lg items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add Contact
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <User size={48} className="mx-auto mb-3 opacity-20" />
            <p>No contacts found.</p>
            {searchTerm && <p className="text-sm">Try a different search term.</p>}
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => onSelectContact(contact.id)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.99] transition-transform cursor-pointer hover:shadow-md"
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${contact.avatarColor}`}>
                {contact.firstName[0]}{contact.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {contact.firstName} {contact.lastName}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {contact.occupation || "No occupation listed"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};