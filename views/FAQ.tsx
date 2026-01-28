
import React, { useState } from 'react';
import { useApp } from '../context/Store';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQView: React.FC = () => {
    const { faqs, t, navigate } = useApp();
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => setOpenId(openId === id ? null : id);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pb-20 animate-fade-in">
            <div className="bg-white dark:bg-dark-900 p-4 shadow-sm flex items-center gap-2 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => navigate('SETTINGS')} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-200">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="font-bold text-lg text-slate-900 dark:text-white">{t.faq}</h1>
            </div>

            <div className="p-4 flex flex-col gap-3">
                {faqs.length === 0 ? (
                    <p className="text-center text-slate-400 mt-10">No FAQs available yet.</p>
                ) : (
                    faqs.map(item => (
                        <div key={item.id} className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
                            <button 
                                onClick={() => toggle(item.id)}
                                className="w-full flex justify-between items-center p-4 text-left"
                            >
                                <span className="font-bold text-slate-900 dark:text-white text-sm pr-4">{item.question}</span>
                                {openId === item.id ? <ChevronUp size={20} className="text-brand-600"/> : <ChevronDown size={20} className="text-slate-400"/>}
                            </button>
                            {openId === item.id && (
                                <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-50 dark:border-slate-700 pt-3">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
