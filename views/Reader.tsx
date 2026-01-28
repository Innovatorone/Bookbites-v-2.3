
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/Store';
import { ChevronLeft, Lock, Settings, X, Minus, Plus, ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '../components/Shared';

type ReaderTheme = 'white' | 'sepia' | 'gray' | 'dark';

export const ReaderView: React.FC = () => {
  const { selectedBook, navigate, canAccess, t } = useApp();
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<ReaderTheme>('white');

  if (!selectedBook) return null;

  const hasAccess = canAccess(selectedBook.accessLevel);
  const isLocked = !hasAccess;
  const isHtml = /<[a-z][\s\S]*>/i.test(selectedBook.summaryText);

  const handleBack = () => {
    navigate('HOME', selectedBook);
  };

  // Determine theme classes
  const getThemeClasses = () => {
      switch(theme) {
          case 'sepia': return 'bg-[#f4ecd8] text-[#5b4636]';
          case 'gray': return 'bg-slate-200 text-slate-800';
          case 'dark': return 'bg-slate-900 text-slate-300';
          default: return 'bg-white text-slate-900';
      }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`fixed inset-0 z-[70] overflow-y-auto animate-fade-in flex flex-col h-screen ${themeClasses} transition-colors duration-300`}>
      
      {/* Reader Header */}
      <div className={`sticky top-0 border-b px-4 py-3 flex justify-between items-center z-10 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : theme === 'gray' ? 'bg-slate-200 border-slate-300' : theme === 'sepia' ? 'bg-[#f4ecd8] border-[#e4dcc8]' : 'bg-white border-slate-100'}`}>
        <button onClick={handleBack} className="flex items-center gap-1 hover:opacity-70">
           <ChevronLeft size={24} /> <span className="text-sm font-medium">{t.aboutBook}</span>
        </button>
        <div className="text-xs font-bold uppercase tracking-wider truncate max-w-[150px] opacity-70">
            {selectedBook.title}
        </div>
        <button onClick={() => setShowSettings(true)} className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <Settings size={22} />
        </button>
      </div>

      {/* Settings Sidebar (Right) */}
      {showSettings && (
          <>
            <div className="fixed inset-0 bg-black/20 z-20" onClick={() => setShowSettings(false)}></div>
            <div className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-dark-800 shadow-2xl z-30 p-6 flex flex-col animate-slide-left border-l border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-lg dark:text-white">Reading Settings</h3>
                    <button onClick={() => setShowSettings(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-dark-700">
                        <X size={24} className="text-slate-500" />
                    </button>
                </div>

                <div className="mb-8">
                    <p className="text-xs font-bold uppercase text-slate-400 mb-3">Text Size</p>
                    <div className="flex items-center justify-between bg-slate-100 dark:bg-dark-700 rounded-xl p-2">
                        <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="p-3 hover:bg-white dark:hover:bg-dark-600 rounded-lg transition-colors">
                            <Minus size={18} className="text-slate-600 dark:text-slate-300" />
                        </button>
                        <span className="font-bold text-slate-900 dark:text-white">{fontSize}px</span>
                        <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="p-3 hover:bg-white dark:hover:bg-dark-600 rounded-lg transition-colors">
                            <Plus size={18} className="text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-slate-400 mb-3">Theme</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => setTheme('white')} 
                            className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${theme === 'white' ? 'border-brand-600 bg-slate-50' : 'border-slate-200 bg-white text-slate-600'}`}
                        >
                            <div className="w-4 h-4 rounded-full bg-white border border-slate-300"></div> White
                        </button>
                        <button 
                            onClick={() => setTheme('sepia')} 
                            className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${theme === 'sepia' ? 'border-brand-600 bg-[#f4ecd8]' : 'border-slate-200 bg-[#f4ecd8] text-[#5b4636]'}`}
                        >
                             <div className="w-4 h-4 rounded-full bg-[#f4ecd8] border border-[#d4ccb8]"></div> Sepia
                        </button>
                        <button 
                            onClick={() => setTheme('gray')} 
                            className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${theme === 'gray' ? 'border-brand-600 bg-slate-200' : 'border-slate-200 bg-slate-200 text-slate-800'}`}
                        >
                             <div className="w-4 h-4 rounded-full bg-slate-200 border border-slate-400"></div> Gray
                        </button>
                        <button 
                            onClick={() => setTheme('dark')} 
                            className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-medium transition-all ${theme === 'dark' ? 'border-brand-600 bg-slate-800' : 'border-slate-700 bg-slate-900 text-white'}`}
                        >
                             <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700"></div> Dark
                        </button>
                    </div>
                </div>
            </div>
          </>
      )}

      {/* Content Area */}
      <div className="flex-1 max-w-xl mx-auto w-full px-6 py-8">
         <h1 className="text-3xl font-bold font-serif mb-2 leading-tight">
             {selectedBook.title}
         </h1>
         <p className={`font-medium mb-8 border-b pb-4 opacity-70 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
             {selectedBook.author}
         </p>

         {isLocked ? (
            <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <Lock size={40} className="text-amber-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">
                    {selectedBook.accessLevel === 'gold' ? t.goldContent : t.premiumContent}
                </h3>
                <p className="mb-6 text-center px-4 opacity-70">Upgrade your plan to read the full summary.</p>
                <Button variant={selectedBook.accessLevel === 'gold' ? 'gold' : 'premium'} onClick={() => navigate('SUBSCRIPTION')}>{t.unlockNow}</Button>
            </div>
         ) : (
            <>
                <div 
                    className={`prose prose-lg max-w-none leading-relaxed select-none ${theme === 'dark' ? 'prose-invert' : ''}`} 
                    style={{ fontSize: `${fontSize}px` }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {isHtml ? (
                         <div dangerouslySetInnerHTML={{ __html: selectedBook.summaryText }} />
                    ) : (
                         <div className="whitespace-pre-wrap font-serif">
                             {selectedBook.summaryText}
                         </div>
                    )}
                </div>

                {/* Buy Button */}
                {selectedBook.buyButtonConfig?.enabled && (
                    <div className={`mt-16 p-6 rounded-2xl border text-center ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <h3 className="font-bold text-lg mb-2">Enjoyed the summary?</h3>
                        <p className="opacity-70 mb-4 text-sm">Support the author by purchasing the full book.</p>
                        <a 
                            href={selectedBook.buyButtonConfig.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-colors"
                        >
                            <ShoppingCart size={18} /> {selectedBook.buyButtonConfig.label} <ExternalLink size={16} className="opacity-70"/>
                        </a>
                    </div>
                )}
            </>
         )}
         
         <div className="h-20"></div> {/* Spacer */}
      </div>
    </div>
  );
};
