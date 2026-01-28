
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/Store';
import { Button, Input } from '../components/Shared';
import { BookOpen, User as UserIcon, Phone, LogIn } from 'lucide-react';

export const AuthView: React.FC = () => {
  const { completeProfile, loginWithTelegram, t, appConfig, triggerAdminLogin, isLoadingAuth } = useApp();
  
  // Try to get Telegram info for pre-filling
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(tgUser?.first_name || '');
  const [error, setError] = useState('');

  // Admin Tap State
  const [logoTaps, setLogoTaps] = useState(0);

  useEffect(() => {
    if (logoTaps >= 7) {
      triggerAdminLogin();
      setLogoTaps(0);
    }
  }, [logoTaps, triggerAdminLogin]);

  const handleLogoTap = () => {
    setLogoTaps(prev => prev + 1);
    setTimeout(() => setLogoTaps(0), 2000);
  };

  const handleSignUp = () => {
      if (!name.trim()) {
          setError('Name is required.');
          return;
      }
      if (!phone.trim()) {
          setError('Phone number is required.');
          return;
      }
      setError('');
      completeProfile(name, phone);
  };

  const handleSignIn = () => {
      setError('');
      const success = loginWithTelegram();
      if (!success) {
          setError('Account not found. Please Sign Up to complete your profile.');
      }
  };

  if (isLoadingAuth) {
      return (
          <div className="min-h-screen bg-slate-50 dark:bg-dark-900 flex items-center justify-center animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Authenticating...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 flex flex-col items-center justify-center p-6 animate-fade-in w-full relative">
        <div className="mb-8 flex flex-col items-center">
            <div 
                className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-brand-500/30 select-none overflow-hidden cursor-pointer active:scale-95 transition-transform"
                onClick={handleLogoTap}
            >
                {appConfig.appLogoUrl ? (
                    <img src={appConfig.appLogoUrl} className="w-full h-full object-cover" alt="App Logo" />
                ) : (
                    <BookOpen size={40} className="text-white" />
                )}
            </div>
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white text-center">{appConfig.appName}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-center mt-2 max-w-xs">{appConfig.appSlogan}</p>
        </div>

        <div className="w-full max-w-sm bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-2 text-center text-slate-900 dark:text-white">
                {t.signUp}
            </h2>
            <p className="text-center text-sm text-slate-500 mb-8">
                Complete your profile to get started
            </p>
            
            <div className="flex flex-col gap-5">
                <Input 
                    label={t.yourName} 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Enter your full name"
                    icon={<UserIcon size={18} />}
                />
                <Input 
                    label={t.phone} 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="+998 90 123 45 67"
                    type="tel"
                    icon={<Phone size={18} />}
                />
                
                {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</p>}

                <Button fullWidth onClick={handleSignUp} size="lg" className="mt-2 shadow-xl shadow-brand-600/20">
                    {t.signUp}
                </Button>
            </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-slate-400 text-sm">Already have an account?</p>
            <button 
                onClick={handleSignIn}
                className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
                <LogIn size={18} /> {t.signIn}
            </button>
        </div>
    </div>
  );
};
