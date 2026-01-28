
import React from 'react';
import { useApp } from '../context/Store';
import { Header } from '../components/Shared';
import { Moon, Bell, HelpCircle, Mail, LogOut, CreditCard, Star, Sun, ToggleLeft, ToggleRight, User as UserIcon, Crown, HelpCircle as FAQIcon } from 'lucide-react';
import { Language } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    navigate, user,
    theme, toggleTheme, language, setLanguage, t, logout,
    notificationsOn, toggleNotifications
  } = useApp();

  const MenuItem = ({ icon, label, onClick, sub, className = '', rightIcon }: any) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 bg-white dark:bg-dark-900 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors ${className}`}>
        <div className="flex items-center gap-4">
            <div className="text-slate-400">{icon}</div>
            <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {sub && <span className="text-slate-400 text-sm">{sub}</span>}
            {rightIcon}
        </div>
    </button>
  );

  const getTierIcon = () => {
      if (user?.subscriptionTier === 'gold') return <Crown size={18} fill="gold" className="text-amber-400" />;
      if (user?.subscriptionTier === 'premium') return <Star size={18} fill="currentColor" className="text-blue-400" />;
      return null;
  };

  // Localized Tier Label
  const tierId = user?.subscriptionTier || 'free';
  const tierLabel = t.plans?.[tierId]?.name || (tierId.charAt(0).toUpperCase() + tierId.slice(1));

  return (
    <div className="pb-24 animate-fade-in bg-slate-50 dark:bg-dark-900 min-h-screen">
      <Header title={t.settings} />
      
      {/* User Info Card */}
      <div className="px-5 mt-4 mb-4">
          <div className="bg-white dark:bg-dark-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 font-bold text-xl">
                 {user?.name ? user.name[0].toUpperCase() : <UserIcon size={24} />}
             </div>
             <div className="flex-1 overflow-hidden">
                 <h3 className="font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Guest'}</h3>
                 <p className="text-xs text-slate-500 truncate">ID: {user?.id}</p>
                 {user?.phone && <p className="text-xs text-slate-500 truncate">{user.phone}</p>}
             </div>
          </div>
      </div>

      {/* Subscription Card */}
      <div className="px-5 mb-2">
         <div 
            onClick={() => navigate('SUBSCRIPTION')}
            className={`rounded-2xl p-5 text-white shadow-xl cursor-pointer relative overflow-hidden group ${user?.subscriptionTier === 'gold' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-slate-900 to-slate-800'}`}
         >
             <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/10 transition-colors"></div>
             <div className="relative z-10 flex justify-between items-center">
                 <div>
                     <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1">Current Plan</p>
                     <p className="text-xl font-bold flex items-center gap-2">
                        {tierLabel}
                        {getTierIcon()}
                     </p>
                 </div>
                 <div className="bg-white/10 p-2 rounded-full">
                     <CreditCard size={24} />
                 </div>
             </div>
             {user?.subscriptionTier === 'free' && <p className="mt-3 text-sm text-slate-300">Upgrade to unlock unlimited reading.</p>}
         </div>
      </div>

      {/* Language Selector */}
      <div className="mt-6 px-5 mb-2">
         <div className="bg-white dark:bg-dark-900 rounded-xl p-2 flex border border-slate-100 dark:border-slate-800">
             {(['uz', 'en', 'ru'] as Language[]).map(lang => (
                 <button 
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold uppercase transition-colors ${
                        language === lang 
                        ? 'bg-brand-600 text-white' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800'
                    }`}
                 >
                     {lang}
                 </button>
             ))}
         </div>
      </div>

      <div className="mt-2 flex flex-col border-y border-slate-200 dark:border-slate-800">
        <MenuItem 
            icon={theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>} 
            label={t.darkMode} 
            onClick={toggleTheme}
            sub={theme === 'dark' ? "On" : "Off"} 
        />
        <MenuItem 
            icon={<Bell size={20}/>} 
            label={t.notifications} 
            onClick={toggleNotifications}
            rightIcon={notificationsOn ? <ToggleRight size={28} className="text-brand-600" /> : <ToggleLeft size={28} className="text-slate-300" />}
        />
      </div>

      <div className="mt-8 flex flex-col border-y border-slate-200 dark:border-slate-800">
         <MenuItem icon={<FAQIcon size={20}/>} label={t.faq} onClick={() => navigate('FAQ')} />
         <MenuItem icon={<HelpCircle size={20}/>} label={t.help} onClick={() => navigate('HELP')} />
         <MenuItem icon={<Mail size={20}/>} label={t.contactUs} onClick={() => navigate('CONTACT_INFO')} />
      </div>

      <div className="mt-8 flex flex-col border-y border-slate-200 dark:border-slate-800">
        <MenuItem 
            icon={<LogOut size={20}/>} 
            label={t.logOut} 
            onClick={logout}
            className="text-red-500" 
        />
      </div>

      <p className="text-center text-xs text-slate-400 mt-10">Version 1.4.1 • BookBites</p>
    </div>
  );
};
