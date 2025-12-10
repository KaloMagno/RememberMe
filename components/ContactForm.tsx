import React, { useState, useEffect } from 'react';
import { Contact, Child, COLORS } from '../types';
import { getRandomColor } from '../services/storageService';
import { Button } from './ui/Button';
import { AIAssistant } from './AIAssistant';
import { 
  ChevronLeft, Save, Trash2, Calendar, 
  Briefcase, GraduationCap, Heart, Users, 
  Sparkles, FileText, Smile 
} from 'lucide-react';

interface ContactFormProps {
  initialData?: Contact;
  onSave: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  onBack: () => void;
}

const EMPTY_CONTACT: Contact = {
  id: '',
  firstName: '',
  lastName: '',
  birthday: '',
  partnerName: '',
  children: [],
  education: '',
  occupation: '',
  interests: '',
  notes: '',
  avatarColor: ''
};

export const ContactForm: React.FC<ContactFormProps> = ({ 
  initialData, 
  onSave, 
  onDelete, 
  onBack 
}) => {
  const [isEditing, setIsEditing] = useState(!initialData);
  const [formData, setFormData] = useState<Contact>(initialData || { ...EMPTY_CONTACT, avatarColor: getRandomColor() });
  const [showAI, setShowAI] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChildChange = (index: number, field: keyof Child, value: string) => {
    const newChildren = [...formData.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { id: Math.random().toString(), name: '', age: '' }]
    }));
  };

  const removeChild = (index: number) => {
    const newChildren = formData.children.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  // --- View Mode Render ---
  if (!isEditing && initialData) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        {showAI && <AIAssistant contact={formData} onClose={() => setShowAI(false)} />}
        
        {/* Header Image/Avatar Area */}
        <div className={`relative h-48 w-full ${formData.avatarColor} flex items-center justify-center shadow-inner`}>
          <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/30 backdrop-blur-md">
            <ChevronLeft />
          </button>
          <div className="text-6xl font-bold text-white/90">
            {formData.firstName[0]}{formData.lastName[0]}
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute bottom-[-24px] right-4 bg-white text-blue-600 px-6 py-2 rounded-full shadow-lg font-medium hover:bg-gray-50 transition"
          >
            Edit Profile
          </button>
        </div>

        <div className="flex-1 p-6 pt-10 max-w-2xl mx-auto w-full space-y-6 pb-24">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h1>
            <p className="text-lg text-gray-500 mt-1">{formData.occupation}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button 
              variant="ai" 
              icon={<Sparkles size={18} />} 
              onClick={() => setShowAI(true)}
              className="w-full"
            >
              Ask AI Assistant
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 font-semibold text-gray-700 bg-gray-50 flex items-center gap-2">
              <Heart size={18} className="text-rose-400" /> Family & Relationships
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase">Partner</label>
                  <p className="text-gray-900">{formData.partnerName || "—"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase">Birthday</label>
                  <p className="text-gray-900 flex items-center gap-2">
                     {formData.birthday || "—"}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase mb-2 block">Children</label>
                {formData.children.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.children.map(child => (
                      <span key={child.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        {child.name} <span className="text-blue-400 ml-1">({child.age})</span>
                      </span>
                    ))}
                  </div>
                ) : <p className="text-gray-400 text-sm">None listed</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 font-semibold text-gray-700 bg-gray-50 flex items-center gap-2">
              <Briefcase size={18} className="text-amber-500" /> Background
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase">Education</label>
                <div className="flex items-center gap-2 mt-1">
                  <GraduationCap size={16} className="text-gray-400" />
                  <p className="text-gray-900">{formData.education || "—"}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 uppercase">Interests</label>
                <div className="flex items-center gap-2 mt-1">
                  <Smile size={16} className="text-gray-400" />
                  <p className="text-gray-900">{formData.interests || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 font-semibold text-gray-700 bg-gray-50 flex items-center gap-2">
              <FileText size={18} className="text-slate-400" /> Notes
            </div>
            <div className="p-4 bg-yellow-50/50 min-h-[100px]">
              <p className="text-gray-700 whitespace-pre-wrap">{formData.notes || "No notes yet."}</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- Edit/Create Mode Render ---
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <button onClick={initialData ? () => setIsEditing(false) : onBack} className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
          <ChevronLeft />
        </button>
        <h1 className="font-bold text-lg">{initialData ? 'Edit Contact' : 'New Contact'}</h1>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6 pb-24">
          
          {/* Section: Basic Info */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Basic Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jane" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Occupation</label>
              <input name="occupation" value={formData.occupation} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Architect" />
            </div>
          </section>

          {/* Section: Family */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Users size={18} /> Family
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Birthday</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Partner's Name</label>
                <input name="partnerName" value={formData.partnerName} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Name" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Children</label>
                <button type="button" onClick={addChild} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium hover:bg-blue-100">
                  + Add Child
                </button>
              </div>
              {formData.children.map((child, idx) => (
                <div key={child.id} className="flex gap-2 items-center">
                  <input 
                    placeholder="Name" 
                    value={child.name} 
                    onChange={(e) => handleChildChange(idx, 'name', e.target.value)}
                    className="flex-1 p-2 border rounded-lg text-sm"
                  />
                  <input 
                    placeholder="Age" 
                    value={child.age} 
                    onChange={(e) => handleChildChange(idx, 'age', e.target.value)}
                    className="w-20 p-2 border rounded-lg text-sm"
                  />
                  <button type="button" onClick={() => removeChild(idx)} className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {formData.children.length === 0 && <p className="text-xs text-gray-400 italic">No children added</p>}
            </div>
          </section>

          {/* Section: Context */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Context</h3>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Education / Studies</label>
              <input name="education" value={formData.education} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Biology at Stanford" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Interests & Hobbies</label>
              <textarea name="interests" value={formData.interests} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20" placeholder="e.g. Tennis, French cooking, Sci-Fi" />
            </div>
             <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 bg-yellow-50" placeholder="Important things to remember..." />
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
             {onDelete && initialData && (
              <Button type="button" variant="danger" onClick={() => onDelete(formData.id)} className="w-full">
                Delete
              </Button>
            )}
            <Button type="submit" className="w-full flex-1">
              <Save size={18} className="mr-2" /> Save Contact
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};