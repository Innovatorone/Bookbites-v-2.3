import React, { useState } from 'react';
import { useApp } from '../context/Store';
import { Header, Input, Button } from '../components/Shared';
import { Send, ChevronLeft } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { navigate, sendMessage, t } = useApp();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (name && text) {
        sendMessage(name, text);
        setSent(true);
        setTimeout(() => {
            navigate('SETTINGS');
        }, 1500);
    }
  };

  if (sent) {
      return (
          <div className="min-h-screen bg-white dark:bg-dark-900 flex flex-col items-center justify-center animate-fade-in p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                  <Send size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.messageSent}</h2>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pb-20 animate-fade-in">
        <div className="bg-white dark:bg-dark-900 p-4 shadow-sm flex items-center gap-2 sticky top-0 z-10">
            <button onClick={() => navigate('SETTINGS')} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-200">
                <ChevronLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">{t.contactUs}</h1>
        </div>

        <div className="p-6 flex flex-col gap-6">
            <Input 
                label={t.yourName} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe"
            />
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">{t.yourMessage}</label>
                <textarea 
                    className="w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all h-40"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="..."
                />
            </div>
            <Button onClick={handleSubmit} fullWidth className="mt-4 flex items-center gap-2">
                <Send size={18} /> {t.sendMessage}
            </Button>
        </div>
    </div>
  );
};
