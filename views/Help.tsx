import React, { useState } from 'react';
import { useApp } from '../context/Store';
import { Input, Button } from '../components/Shared';
import { Send, ChevronLeft, User } from 'lucide-react';

export const HelpView: React.FC = () => {
  const { navigate, sendMessage, t, messages, user } = useApp();
  const [text, setText] = useState('');
  
  // Filter messages for current user
  const userMessages = messages.filter(m => user && (m.email === user.id || m.name === user.name));

  const handleSubmit = () => {
    if (text.trim()) {
        const userName = user ? user.name || 'Guest' : 'Anonymous';
        sendMessage(userName, text);
        setText('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pb-20 animate-fade-in flex flex-col">
        <div className="bg-white dark:bg-dark-900 p-4 shadow-sm flex items-center gap-2 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
            <button onClick={() => navigate('SETTINGS')} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-200">
                <ChevronLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">{t.help}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {userMessages.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">
                    <p>How can we help you today?</p>
                </div>
            ) : (
                userMessages.map(msg => (
                    <div key={msg.id} className="flex flex-col gap-2">
                        {/* User Message */}
                        <div className="self-end bg-brand-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%]">
                            <p className="text-sm">{msg.text}</p>
                            <span className="text-[10px] opacity-70 block mt-1 text-right">{new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>

                        {/* Admin Replies */}
                        {msg.replies && msg.replies.map((reply, idx) => (
                            <div key={idx} className="self-start bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 p-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                                <p className="text-xs font-bold text-brand-600 mb-1">Support</p>
                                <p className="text-sm">{reply.text}</p>
                                <span className="text-[10px] opacity-50 block mt-1">{new Date(reply.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>

        <div className="p-4 bg-white dark:bg-dark-900 border-t border-slate-100 dark:border-slate-700">
            <div className="flex gap-2">
                <input 
                    className="flex-1 bg-slate-100 dark:bg-dark-800 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <button 
                    onClick={handleSubmit} 
                    className="bg-brand-600 text-white p-3 rounded-xl hover:bg-brand-700 transition-colors"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    </div>
  );
};