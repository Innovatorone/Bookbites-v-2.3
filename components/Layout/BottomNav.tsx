import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/Store';
import { Home, Search, Library, Shield, Tv, BookOpen, ShoppingBag, Settings } from 'lucide-react';
import { ViewState } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentView, navigate, t, isAdminAuthenticated, triggerAdminLogin, appConfig } = useApp();
  const [logoTaps, setLogoTaps] = useState(0);

  useEffect(() => {
      if (logoTaps >= 7) {
          triggerAdminLogin();
          setLogoTaps(0);
      }
  }, [logoTaps, triggerAdminLogin]);

  const handleLogoTap = () => {
      setLogoTaps(prev => prev + 1);
      // Reset taps if too slow
      setTimeout(() => setLogoTaps(0), 2000);
  };

  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: t.home, icon: <Home size={22} /> },
    { id: 'SEARCH', label: t.search, icon: <Search size={22} /> },
    { id: 'MASTERCLASS_LIST', label: t.masterclass, icon: <Tv size={22} /> },
    { id: 'LIBRARY', label: t.library, icon: <Library size={22} /> },
    { id: 'BOOKSTORE', label: t.bookstore, icon: <ShoppingBag size={22} /> },
    { id: 'SETTINGS', label: t.settings, icon: <Settings size={22} /> },
  ];

  if (isAdminAuthenticated) {
      navItems.push({ id: 'ADMIN', label: t.admin, icon: <Shield size={22} /> });
  }

  return (
    <>
    {/* Mobile Bottom Nav */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-900 border-t border-slate-100 dark:border-slate-800 px-2 py-2 pb-6 z-40 flex justify-around items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors w-16 ${
              isActive ? 'text-brand-600' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-brand-50 dark:bg-brand-900/20 -translate-y-1' : ''}`}>
                {item.icon}
            </div>
            <span className={`text-[9px] font-semibold ${isActive ? 'opacity-100' : 'opacity-70'} truncate w-full text-center`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>

    {/* Desktop Sidebar */}
    <nav className="hidden md:flex flex-col w-64 bg-white dark:bg-dark-900 border-r border-slate-100 dark:border-slate-800 h-full p-6">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer select-none" onClick={handleLogoTap}>
             {appConfig.appLogoUrl ? (
                 <img src={appConfig.appLogoUrl} className="w-10 h-10 rounded-xl object-cover shadow-lg" alt="Logo" />
             ) : (
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <BookOpen size={20} className="text-white" />
                </div>
             )}
            <h1 className="text-xl font-bold font-serif text-slate-900 dark:text-white">{appConfig.appName}</h1>
        </div>

        <div className="flex flex-col gap-2">
            {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        isActive 
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-bold' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800'
                    }`}
                >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                </button>
                );
            })}
        </div>
        
        <div className="mt-auto p-4 bg-slate-50 dark:bg-dark-800 rounded-xl">
             <p className="text-xs text-slate-400 text-center">{appConfig.appSlogan}</p>
        </div>
    </nav>
    </>
  );
};