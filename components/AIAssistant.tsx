import React, { useState } from 'react';
import { Contact } from '../types';
import { generateGiftIdeas, generateIcebreaker } from '../services/geminiService';
import { Button } from './ui/Button';
import { Gift, MessageCircle, Sparkles, X } from 'lucide-react';

interface AIAssistantProps {
  contact: Contact;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ contact, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'GIFT' | 'MESSAGE' | null>(null);

  const handleAction = async (actionMode: 'GIFT' | 'MESSAGE') => {
    setLoading(true);
    setMode(actionMode);
    setResult(null);

    try {
      let response = '';
      if (actionMode === 'GIFT') {
        response = await generateGiftIdeas(contact);
      } else {
        response = await generateIcebreaker(contact);
      }
      setResult(response);
    } catch (e) {
      setResult("Something went wrong with the AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
          <div className="flex items-center gap-2 text-indigo-900">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-lg">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/50 rounded-full transition">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {!result && !loading && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                What can I help you with regarding <strong>{contact.firstName}</strong>?
              </p>
              
              <button 
                onClick={() => handleAction('GIFT')}
                className="w-full p-4 border rounded-xl flex items-center gap-4 hover:border-purple-300 hover:bg-purple-50 transition group text-left"
              >
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
                  <Gift size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Suggest Gift Ideas</h3>
                  <p className="text-sm text-gray-500">Based on interests and family status</p>
                </div>
              </button>

              <button 
                onClick={() => handleAction('MESSAGE')}
                className="w-full p-4 border rounded-xl flex items-center gap-4 hover:border-indigo-300 hover:bg-indigo-50 transition group text-left"
              >
                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Draft Catch-up Message</h3>
                  <p className="text-sm text-gray-500">Casual or warm conversation starters</p>
                </div>
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500 animate-pulse">Consulting the oracle...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-gray-800">
                {mode === 'GIFT' ? 'Gift Recommendations' : 'Draft Messages'}
              </h3>
              <div 
                className="prose prose-sm prose-indigo bg-gray-50 p-4 rounded-xl border border-gray-100"
                dangerouslySetInnerHTML={{ __html: result }}
              />
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" onClick={() => setResult(null)} className="flex-1">
                  Ask Something Else
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};