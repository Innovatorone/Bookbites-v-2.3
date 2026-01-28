
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/Store';
import { Book } from '../types';
import { Clock, Bookmark, PlayCircle, BookOpen, Check, Lock, Star, Crown, Headphones } from 'lucide-react';

// --- Types ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'premium' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

// --- Button ---
export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', fullWidth = false, className = '', ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20",
    secondary: "bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600",
    outline: "border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-600 hover:text-brand-600 bg-transparent",
    ghost: "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
    danger: "bg-red-500 text-white hover:bg-red-600",
    premium: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20",
    gold: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}
export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">{label}</label>}
      <div className="relative">
        <input 
          className="w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          {...props} 
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Book Card ---
interface BookCardProps {
  book: Book;
  variant?: 'featured' | 'list' | 'compact';
  onClick?: () => void;
}
export const BookCard: React.FC<BookCardProps> = ({ book, variant = 'list', onClick }) => {
  const { isSaved, saveBook, removeBook, canAccess, t } = useApp();
  const saved = isSaved(book.id);
  const isAccessible = canAccess(book.accessLevel);
  const hasAudio = !!book.summaryAudioUrl && book.summaryAudioUrl.trim().length > 0;

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    saved ? removeBook(book.id) : saveBook(book.id);
  };

  const renderBadge = () => {
      if (book.accessLevel === 'free') return null;
      const isGold = book.accessLevel === 'gold';
      const colorClass = isGold ? "bg-amber-400" : "bg-blue-500";
      const Icon = isGold ? Crown : Star;
      
      return (
          <div className={`absolute top-0 right-0 ${colorClass} text-white p-1.5 rounded-bl-xl shadow-md z-10`}>
             {!isAccessible ? <Lock size={12} /> : <Icon size={12} fill="currentColor" />}
          </div>
      );
  };

  if (variant === 'featured') {
    return (
      <div 
        onClick={onClick}
        className="relative min-w-[260px] h-[360px] rounded-2xl overflow-hidden shadow-xl shrink-0 cursor-pointer group bg-slate-900"
      >
        <img src={book.coverImageUrl} alt={book.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        
        {renderBadge()}

        {/* Audio Indicator - Yellow BG, Black Icon */}
        {hasAudio && (
            <div className="absolute bottom-5 right-5 z-10 bg-amber-400 p-2 rounded-full shadow-sm shadow-amber-500/20">
                <Headphones size={18} fill="currentColor" className="text-slate-900" />
            </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
          <span className="inline-block px-2 py-1 bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md w-fit">
            {t.featured}
          </span>
          <h3 className="text-xl font-bold text-white font-serif leading-tight">{book.title}</h3>
          <p className="text-slate-300 text-sm">{book.author}</p>
          <div className="flex items-center gap-3 mt-1">
             <div className="flex items-center gap-1 text-xs text-slate-300">
                <Clock size={12} /> {book.duration} min
             </div>
          </div>
        </div>

        <button 
          onClick={toggleSave}
          className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-md rounded-full text-white border border-white/10"
        >
          {saved ? <Bookmark size={18} fill="currentColor" className="text-brand-400" /> : <Bookmark size={18} />}
        </button>
      </div>
    );
  }

  // List Variant
  return (
    <div 
      onClick={onClick}
      className="flex gap-4 p-3 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
    >
      <div className="relative">
          <img src={book.coverImageUrl} alt={book.title} className="w-20 h-28 object-cover rounded-lg shadow-sm bg-slate-200 dark:bg-slate-700" />
          {book.accessLevel !== 'free' && (
            <div className={`absolute -top-1 -left-1 text-white p-1 rounded-br-lg rounded-tl-lg shadow-sm z-10 ${book.accessLevel === 'gold' ? 'bg-amber-400' : 'bg-blue-500'}`}>
                {!isAccessible ? <Lock size={10} /> : (book.accessLevel === 'gold' ? <Crown size={10} fill="currentColor"/> : <Star size={10} fill="currentColor" />)}
            </div>
          )}
          {/* Audio Indicator - Yellow BG, Black Icon */}
          {hasAudio && (
            <div className="absolute bottom-1 right-1 bg-amber-400 p-1.5 rounded-full shadow-sm">
                <Headphones size={10} strokeWidth={2.5} className="text-slate-900" />
            </div>
          )}
      </div>
      
      <div className="flex flex-col flex-1 justify-center gap-1">
        <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wide">{book.category}</span>
            {saved && <Bookmark size={14} className="text-brand-500" fill="currentColor"/>}
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif line-clamp-2 leading-tight">{book.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{book.author}</p>
        <div className="mt-3 flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Clock size={13} className="text-slate-400" /> {book.duration}m
             </div>
             {!isAccessible ? (
               <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-md ${book.accessLevel === 'gold' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'}`}>
                  <Lock size={12} /> {book.accessLevel === 'gold' ? t.gold : t.premium}
               </div>
             ) : (
                <div className="flex items-center gap-1.5 text-xs text-brand-600 font-medium bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded-md">
                    <BookOpen size={13} /> {t.read}
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

// --- Header ---
interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}
export const Header: React.FC<HeaderProps> = ({ title, subtitle, rightAction }) => {
  const { appConfig, triggerAdminLogin } = useApp();
  const [taps, setTaps] = useState(0);

  useEffect(() => {
    if (taps >= 7) {
      triggerAdminLogin();
      setTaps(0);
    }
  }, [taps, triggerAdminLogin]);

  const handleTap = () => {
    setTaps(p => p + 1);
    setTimeout(() => setTaps(0), 2000);
  };

  return (
    <header className="px-5 pt-8 pb-4 flex justify-between items-end bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-3">
         {/* Logo / Trigger Area */}
         <div onClick={handleTap} className="cursor-pointer select-none active:scale-95 transition-transform">
             {appConfig.appLogoUrl ? (
                 <img src={appConfig.appLogoUrl} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="Logo" />
             ) : (
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-sm shadow-brand-500/20 text-white">
                    <BookOpen size={20} />
                </div>
             )}
         </div>
         
         <div>
            {subtitle && <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{subtitle}</p>}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-serif leading-none">{title}</h1>
        </div>
      </div>
      {rightAction}
    </header>
  );
};

// --- Tabs ---
interface TabProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}
export const Tabs: React.FC<TabProps> = ({ tabs, activeTab, onChange }) => (
  <div className="flex p-1 bg-slate-100 dark:bg-dark-800 rounded-xl">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${
          activeTab === tab.id 
            ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </div>
);
