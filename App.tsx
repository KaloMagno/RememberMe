import React, { useState, useEffect } from 'react';
import { ViewManager, Contact } from './types';
import { getContacts, saveContact, deleteContact } from './services/storageService';
import { ContactList } from './components/ContactList';
import { ContactForm } from './components/ContactForm';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewManager>({
    currentView: 'LIST',
    selectedContactId: null
  });
  
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load contacts on mount
  useEffect(() => {
    const loaded = getContacts();
    setContacts(loaded);
  }, []);

  const handleCreateNew = () => {
    setViewState({ currentView: 'CREATE', selectedContactId: null });
  };

  const handleSelectContact = (id: string) => {
    setViewState({ currentView: 'EDIT', selectedContactId: id });
  };

  const handleSaveContact = (contact: Contact) => {
    const updatedList = saveContact(contact);
    setContacts(updatedList);
    // If it was a new creation, go to its edit view (which acts as detail view)
    // If it was an edit, stay on the view (which switches back to read-only in the component)
    setViewState({ currentView: 'EDIT', selectedContactId: contact.id });
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      const updatedList = deleteContact(id);
      setContacts(updatedList);
      setViewState({ currentView: 'LIST', selectedContactId: null });
    }
  };

  const handleBack = () => {
    setViewState({ currentView: 'LIST', selectedContactId: null });
  };

  const getSelectedContact = () => {
    return contacts.find(c => c.id === viewState.selectedContactId);
  };

  return (
    <div className="h-screen w-full flex justify-center bg-gray-100">
      <div className="w-full max-w-md h-full bg-white shadow-2xl overflow-hidden relative">
        {viewState.currentView === 'LIST' && (
          <ContactList 
            contacts={contacts} 
            onCreateNew={handleCreateNew} 
            onSelectContact={handleSelectContact} 
          />
        )}

        {viewState.currentView === 'CREATE' && (
          <ContactForm 
            onSave={handleSaveContact} 
            onBack={handleBack}
          />
        )}

        {viewState.currentView === 'EDIT' && (
          <ContactForm 
            initialData={getSelectedContact()}
            onSave={handleSaveContact}
            onDelete={handleDeleteContact}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default App;