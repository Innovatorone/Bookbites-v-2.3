
import React from 'react';
import { useApp } from '../context/Store';
import { ChevronLeft, Phone, Mail, MapPin, Globe, Send, Shield } from 'lucide-react';
import { Button } from '../components/Shared';

export const ContactInfoView: React.FC = () => {
  const { navigate, contactInfo, t } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 pb-20 animate-fade-in flex flex-col">
        <div className="bg-white dark:bg-dark-900 p-4 shadow-sm flex items-center gap-2 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
            <button onClick={() => navigate('SETTINGS')} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-200">
                <ChevronLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white">{t.contactUs}</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {/* Phone Button */}
            <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-4 p-4 bg-white dark:bg-dark-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-transform">
                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                     <Phone size={20} />
                 </div>
                 <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.callUs}</p>
                     <p className="font-bold text-lg text-slate-900 dark:text-white">{contactInfo.phone}</p>
                 </div>
            </a>

            {/* Email Button */}
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-4 p-4 bg-white dark:bg-dark-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-transform">
                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                     <Mail size={20} />
                 </div>
                 <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.email}</p>
                     <p className="font-bold text-lg text-slate-900 dark:text-white">{contactInfo.email}</p>
                 </div>
            </a>

            {/* Address & Map */}
            <div className="bg-white dark:bg-dark-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.address}</p>
                        <p className="font-medium text-slate-900 dark:text-white mb-3">{contactInfo.address}</p>
                        {contactInfo.website && (
                             <a href={`https://${contactInfo.website.replace('https://', '').replace('http://', '')}`} target="_blank" className="flex items-center gap-2 text-brand-600 text-sm font-bold">
                                 <Globe size={16}/> {contactInfo.website}
                             </a>
                        )}
                    </div>
                </div>
                {contactInfo.mapEmbedUrl && (
                    <div className="w-full h-48 bg-slate-100">
                        <iframe 
                            src={contactInfo.mapEmbedUrl} 
                            width="100%" 
                            height="100%" 
                            style={{border:0}} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                )}
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-3">
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t.socials}</h3>
                
                {contactInfo.telegramUrl && (
                    <a href={contactInfo.telegramUrl} target="_blank" className="flex items-center justify-center gap-2 py-3 bg-[#0088cc] text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                        <Send size={18} /> Telegram Channel
                    </a>
                )}
                
                {contactInfo.instagramUrl && (
                    <a href={contactInfo.instagramUrl} target="_blank" className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                        Instagram
                    </a>
                )}

                {contactInfo.telegramAdminUrl && (
                    <a href={contactInfo.telegramAdminUrl} target="_blank" className="flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
                        <Shield size={18} /> {t.adminTelegram}
                    </a>
                )}
            </div>
        </div>
    </div>
  );
};
