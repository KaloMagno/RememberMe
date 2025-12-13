import React, { useState, useEffect } from 'react';
import { Contact, Child, Sibling, COLORS, ContactFrequency, TierLevel } from '../types';
import { getRandomColor } from '../services/storageService';
import { Button } from './ui/Button';
import { AIAssistant } from './AIAssistant';
import { 
  ChevronLeft, Save, Trash2, Calendar, 
  Briefcase, GraduationCap, Heart, Users, 
  Sparkles, FileText, Smile, Clock, Activity,
  ChevronDown, Phone, Mail, Instagram, Linkedin, Plus, Minus
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
  partnerNotes: '',
  children: [],
  childrenNotes: '',
  siblings: [],
  education: '',
  occupation: '',
  interests: '',
  notes: '',
  avatarColor: '',
  lastContactedDate: '',
  contactFrequency: '',
  tier: '',
  phoneNumber: '',
  email: '',
  instagram: '',
  linkedin: ''
};

const FREQUENCY_OPTIONS: ContactFrequency[] = ['weekly', 'monthly', 'quarterly', 'bi-annually', 'yearly'];
const TIER_OPTIONS: TierLevel[] = ['1 - Close Friend/Family', '2 - Friend/Colleague', '3 - Acquaintance'];

type QuestionStatus = 'yes' | 'no' | 'unsure' | null;

export const ContactForm: React.FC<ContactFormProps> = ({ 
  initialData, 
  onSave, 
  onDelete, 
  onBack 
}) => {
  const [isEditing, setIsEditing] = useState(!initialData);
  const [formData, setFormData] = useState<Contact>(initialData || { ...EMPTY_CONTACT, avatarColor: getRandomColor() });
  const [showAI, setShowAI] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(
    !!(initialData?.phoneNumber || initialData?.email || initialData?.instagram || initialData?.linkedin)
  );

  // Initialize hasChildren based on whether children exist in the data
  const [hasChildren, setHasChildren] = useState<QuestionStatus>(
    (initialData?.children && initialData.children.length > 0) ? 'yes' : null
  );

  // Initialize hasSiblings based on whether siblings exist in the data
  const [hasSiblings, setHasSiblings] = useState<QuestionStatus>(
    (initialData?.siblings && initialData.siblings.length > 0) ? 'yes' : null
  );

  // Initialize hasPartner based on whether partner name exists in the data
  const [hasPartner, setHasPartner] = useState<QuestionStatus>(
    (initialData?.partnerName && initialData.partnerName.length > 0) ? 'yes' : null
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChildChange = (index: number, field: keyof Child, value: string) => {
    const newChildren = [...formData.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const handleSiblingChange = (index: number, field: keyof Sibling, value: string) => {
    const newSiblings = [...formData.siblings];
    newSiblings[index] = { ...newSiblings[index], [field]: value };
    setFormData(prev => ({ ...prev, siblings: newSiblings }));
  };

  const handleChildCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent explicitly entering '0' when hasChildren is yes
    if (hasChildren === 'yes' && e.target.value === '0') return;

    const count = parseInt(e.target.value) || 0;
    // Limit to reasonable number to prevent UI explosion
    if (count < 0 || count > 20) return;

    const currentCount = formData.children.length;
    
    if (count === currentCount) return;

    if (count > currentCount) {
      // Add new children
      const toAdd = count - currentCount;
      const newChildren = [...formData.children];
      for (let i = 0; i < toAdd; i++) {
        newChildren.push({ 
          id: Math.random().toString(), 
          name: '', 
          age: '', 
          birthRank: String(currentCount + i + 1)
        });
      }
      setFormData(prev => ({ ...prev, children: newChildren }));
    } else {
      // Remove from end
      setFormData(prev => ({ ...prev, children: formData.children.slice(0, count) }));
    }
  };

  const handleSiblingCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    // Limit to reasonable number to prevent UI explosion
    if (count < 0 || count > 20) return;

    const currentCount = formData.siblings.length;
    
    if (count === currentCount) return;

    if (count > currentCount) {
      // Add new siblings
      const toAdd = count - currentCount;
      const newSiblings = [...formData.siblings];
      for (let i = 0; i < toAdd; i++) {
        newSiblings.push({ 
          id: Math.random().toString(), 
          name: '',
          relation: ''
        });
      }
      setFormData(prev => ({ ...prev, siblings: newSiblings }));
    } else {
      // Remove from end
      setFormData(prev => ({ ...prev, siblings: formData.siblings.slice(0, count) }));
    }
  };

  const handleHasChildrenChange = (value: QuestionStatus) => {
    setHasChildren(value);
    if (value !== 'yes') {
      setFormData(prev => ({ ...prev, children: [], childrenNotes: '' }));
    } else if (formData.children.length === 0) {
      // Default to 1 child when switching to yes
      setFormData(prev => ({ 
        ...prev, 
        children: [{ 
          id: Math.random().toString(), 
          name: '', 
          age: '', 
          birthRank: '1' 
        }] 
      }));
    }
  };

  const handleHasSiblingsChange = (value: QuestionStatus) => {
    setHasSiblings(value);
    if (value !== 'yes') {
      setFormData(prev => ({ ...prev, siblings: [] }));
    }
  };

  const handleHasPartnerChange = (value: QuestionStatus) => {
    setHasPartner(value);
    if (value !== 'yes') {
      setFormData(prev => ({ ...prev, partnerName: '', partnerNotes: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up data before saving based on the visible state
    const cleanData = { ...formData };
    
    if (hasPartner !== 'yes') {
      cleanData.partnerName = '';
      cleanData.partnerNotes = '';
    }
    
    if (hasChildren !== 'yes') {
      cleanData.children = [];
      cleanData.childrenNotes = '';
    }
    
    if (hasSiblings !== 'yes') {
      cleanData.siblings = [];
    }
    
    onSave(cleanData);
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
            {formData.occupation && <p className="text-lg text-gray-500 mt-1">{formData.occupation}</p>}
            {formData.tier && (
               <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium uppercase tracking-wide">
                 {formData.tier}
               </span>
            )}
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

          {(formData.phoneNumber || formData.email || formData.instagram || formData.linkedin) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50 font-semibold text-gray-700 bg-gray-50 flex items-center gap-2">
                <Phone size={18} className="text-green-500" /> Contact Info
              </div>
              <div className="p-4 space-y-3">
                {formData.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-900">{formData.phoneNumber}</span>
                  </div>
                )}
                {formData.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400" />
                    <a href={`mailto:${formData.email}`} className="text-blue-600 hover:underline">{formData.email}</a>
                  </div>
                )}
                {formData.instagram && (
                  <div className="flex items-center gap-3">
                    <Instagram size={16} className="text-gray-400" />
                    <span className="text-gray-900">{formData.instagram}</span>
                  </div>
                )}
                {formData.linkedin && (
                  <div className="flex items-center gap-3">
                    <Linkedin size={16} className="text-gray-400" />
                    <span className="text-gray-900">{formData.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 font-semibold text-gray-700 bg-gray-50 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" /> Contact Rhythm
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase">Last Contact</label>
                  <p className="text-gray-900 font-medium">{formData.lastContactedDate || "Not set"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase">Target Frequency</label>
                  <p className="text-blue-600 font-medium bg-blue-50 inline-block px-2 py-0.5 rounded-md mt-1 capitalize">
                    {formData.contactFrequency || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 font-semibold text-gray-700 bg-gray-50 flex items-center gap-2">
              <Heart size={18} className="text-rose-400" /> Family & Relationships
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase">Partner</label>
                  <p className="text-gray-900 font-medium">{formData.partnerName || "—"}</p>
                  {formData.partnerNotes && <p className="text-xs text-gray-500 mt-1 italic">{formData.partnerNotes}</p>}
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
                  <div className="flex flex-col gap-2">
                    {formData.children.map(child => (
                      <div key={child.id} className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-900">{child.name}</span>
                        {(child.age || child.birthRank) && (
                           <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                             {[child.age, child.birthRank ? `#${child.birthRank}` : null].filter(Boolean).join(' • ')}
                           </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-400 text-sm">None listed</p>}
                
                {formData.childrenNotes && (
                  <p className="text-xs text-gray-500 mt-2 italic border-l-2 border-gray-200 pl-2">
                    {formData.childrenNotes}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 uppercase mb-2 block">Siblings</label>
                {formData.siblings.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.siblings.map(sibling => (
                      <div key={sibling.id} className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        <span className="font-medium">{sibling.name}</span>
                        {sibling.relation && (
                          <span className="text-xs text-gray-500 uppercase">
                            ({sibling.relation})
                          </span>
                        )}
                      </div>
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
          
          {/* Section: Contact Tact / Rhythm */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
               <Activity size={18} /> Contact Rhythm
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  When was the last time you contacted them?
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input 
                    type="date" 
                    name="lastContactedDate" 
                    value={formData.lastContactedDate} 
                    onChange={handleChange} 
                    className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Desired contact frequency
                </label>
                <div className="relative">
                  <select 
                    name="contactFrequency" 
                    value={formData.contactFrequency} 
                    onChange={handleChange}
                    className="w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" className="text-gray-500">Select frequency...</option>
                    {FREQUENCY_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="capitalize text-gray-900">{opt}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Primary Details */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">Primary Details</h3>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tier Level</label>
              <div className="relative">
                <select 
                  name="tier" 
                  value={formData.tier} 
                  onChange={handleChange}
                  className="w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-500">Select tier...</option>
                  {TIER_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className="text-gray-900">{opt}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

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
              <label className="text-sm font-medium text-gray-700">Birthday</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Contact Information Toggle Section */}
            <div className="pt-2">
              <button 
                type="button" 
                onClick={() => setShowContactInfo(!showContactInfo)}
                className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-700 transition"
              >
                {showContactInfo ? <Minus size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
                {showContactInfo ? "Hide contact information" : "Add contact information"}
              </button>

              {showContactInfo && (
                <div className="mt-4 space-y-4 pl-2 border-l-2 border-blue-50">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                       <Phone size={14} /> Phone Number
                    </label>
                    <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1 555-0000" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 block border-b pb-1">Socials</label>
                    
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400 min-w-[16px]" />
                      <input name="email" value={formData.email || ''} onChange={handleChange} className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Email Address" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Instagram size={16} className="text-gray-400 min-w-[16px]" />
                      <input name="instagram" value={formData.instagram || ''} onChange={handleChange} className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Instagram Handle" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Linkedin size={16} className="text-gray-400 min-w-[16px]" />
                      <input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="LinkedIn Profile" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section: Family */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Users size={18} /> Family
            </h3>
            
            {/* Partner Question */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">Do they have a partner?</label>
              <div className="grid grid-cols-3 gap-3">
                {['yes', 'no', 'unsure'].map((option) => (
                  <label 
                    key={option}
                    className={`flex items-center justify-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all ${
                      hasPartner === option 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hasPartner"
                      checked={hasPartner === option}
                      onChange={() => handleHasPartnerChange(option as QuestionStatus)}
                      className="hidden"
                    />
                    <span className="text-sm font-medium capitalize">
                      {option === 'unsure' ? 'Not Sure' : option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {hasPartner === 'yes' && (
              <div className="space-y-3 mt-4 pl-4 border-l-2 border-blue-100 transition-all duration-300">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Partner's Name</label>
                  <input 
                    name="partnerName" 
                    value={formData.partnerName} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="Name" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Comments</label>
                  <textarea 
                    name="partnerNotes" 
                    value={formData.partnerNotes || ''} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20 text-sm" 
                    placeholder="Anniversary, occupation, shared interests..." 
                  />
                </div>
              </div>
            )}

            {/* Children Question */}
            <div className="space-y-3 pt-2 border-t border-gray-50 mt-2">
              <label className="text-sm font-medium text-gray-700 block">Do they have children?</label>
              <div className="grid grid-cols-3 gap-3">
                {['yes', 'no', 'unsure'].map((option) => (
                  <label 
                    key={option}
                    className={`flex items-center justify-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all ${
                      hasChildren === option 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hasChildren"
                      checked={hasChildren === option}
                      onChange={() => handleHasChildrenChange(option as QuestionStatus)}
                      className="hidden"
                    />
                    <span className="text-sm font-medium capitalize">
                      {option === 'unsure' ? 'Not Sure' : option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {hasChildren === 'yes' && (
              <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-100 transition-all duration-300">
                
                {/* How many question */}
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">How many children?</label>
                   <input 
                     type="number" 
                     min="1"
                     max="20"
                     value={formData.children.length === 0 ? '' : formData.children.length}
                     onChange={handleChildCountChange}
                     placeholder="1"
                     className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>

                {/* New Comment Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">General Remarks</label>
                  <textarea 
                    name="childrenNotes" 
                    value={formData.childrenNotes || ''} 
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-16 text-sm" 
                    placeholder="Shared interests, parenting style, etc..." 
                  />
                </div>

                {/* List */}
                <div className="space-y-3">
                  {formData.children.map((child, idx) => (
                    <div key={child.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                       <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Child {idx + 1}</div>
                       <div className="space-y-2">
                         <div className="space-y-1">
                           <label className="text-xs font-medium text-gray-500">Name</label>
                           <input 
                              placeholder="Name" 
                              value={child.name} 
                              onChange={(e) => handleChildChange(idx, 'name', e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                           />
                         </div>
                         <div className="flex gap-3">
                            <div className="flex-1 space-y-1">
                              <label className="text-xs font-medium text-gray-500">Age / Birth Year</label>
                              <input 
                                placeholder="e.g. 2018 or 5" 
                                value={child.age} 
                                onChange={(e) => handleChildChange(idx, 'age', e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                              />
                            </div>
                            <div className="w-24 space-y-1">
                              <label className="text-xs font-medium text-gray-500">Birth Rank</label>
                              <input 
                                placeholder="#" 
                                value={child.birthRank || ''} 
                                onChange={(e) => handleChildChange(idx, 'birthRank', e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                              />
                            </div>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Siblings Question */}
            <div className="space-y-3 pt-2 border-t border-gray-50 mt-2">
              <label className="text-sm font-medium text-gray-700 block">Do they have siblings?</label>
              <div className="grid grid-cols-3 gap-3">
                {['yes', 'no', 'unsure'].map((option) => (
                  <label 
                    key={option}
                    className={`flex items-center justify-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-all ${
                      hasSiblings === option 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hasSiblings"
                      checked={hasSiblings === option}
                      onChange={() => handleHasSiblingsChange(option as QuestionStatus)}
                      className="hidden"
                    />
                    <span className="text-sm font-medium capitalize">
                      {option === 'unsure' ? 'Not Sure' : option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {hasSiblings === 'yes' && (
              <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-100 transition-all duration-300">
                <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">How many siblings?</label>
                   <input 
                     type="number" 
                     min="0"
                     max="20"
                     value={formData.siblings.length === 0 ? '' : formData.siblings.length}
                     onChange={handleSiblingCountChange}
                     placeholder="0"
                     className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>

                <div className="space-y-3">
                  {formData.siblings.map((sibling, idx) => (
                    <div key={sibling.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                       <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sibling {idx + 1}</div>
                       <div className="space-y-2">
                         <div className="space-y-1">
                           <label className="text-xs font-medium text-gray-500">Name</label>
                           <input 
                              placeholder="Name" 
                              value={sibling.name} 
                              onChange={(e) => handleSiblingChange(idx, 'name', e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                           />
                         </div>
                         <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">Relation</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleSiblingChange(idx, 'relation', 'older')}
                                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition ${sibling.relation === 'older' ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Older
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSiblingChange(idx, 'relation', 'younger')}
                                    className={`flex-1 py-2 text-xs font-medium rounded-lg border transition ${sibling.relation === 'younger' ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Younger
                                </button>
                            </div>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          <div className="flex flex-col gap-3 pt-6 border-t mt-6">
            <Button type="submit" className="w-full shadow-md py-3 justify-center text-lg">
              <Save size={20} className="mr-2" /> Save Contact
            </Button>
            
            {onDelete && initialData && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onDelete(formData.id)} 
                className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} className="mr-2" /> Delete from connections
              </Button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};