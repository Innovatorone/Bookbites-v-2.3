
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/Store';
import { Book } from '../types';
import { Button, Tabs } from '../components/Shared';
import { ChevronLeft, Bookmark, Share2, Play, Pause, BookOpen, Headphones, Clock, Lock, Star, Folder, Check, Crown } from 'lucide-react';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ book, onClose }) => {
  const { saveBookToShelf, removeBook, isSaved, canAccess, navigate, bookshelves, t } = useApp();
  const [activeTab, setActiveTab] = useState('read');
  const [showShelfModal, setShowShelfModal] = useState(false);
  
  // Audio State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const saved = isSaved(book.id);
  const hasAccess = canAccess(book.accessLevel);
  const isLocked = !hasAccess;

  useEffect(() => {
      // Reset audio state when book changes
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      if(audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.load();
      }
  }, [book]);

  const handleSaveClick = () => {
      if (saved) {
          removeBook(book.id);
      } else {
          setShowShelfModal(true);
      }
  };

  const onShelfSelect = (shelfId: string) => {
      saveBookToShelf(book.id, shelfId);
      setShowShelfModal(false);
  };

  const handleUnlock = () => {
      navigate('SUBSCRIPTION');
  };

  const handleStartReading = () => {
      navigate('READER', book);
  };

  const togglePlay = () => {
      if (!audioRef.current) return;
      
      if (isPlaying) {
          audioRef.current.pause();
      } else {
          audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
      if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
      }
  };

  const onLoadedMetadata = () => {
      if (audioRef.current) {
          setDuration(audioRef.current.duration);
      }
  };

  const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const newTime = pct * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
      if (isNaN(time)) return "00:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-center sm:items-center sm:bg-black/50 sm:backdrop-blur-sm animate-fade-in">
        <div className="w-full h-full sm:h-[90%] sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white dark:bg-dark-900 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up relative">
          
          {/* Top Bar */}
          <div className="sticky top-0 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 z-10">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-full transition-colors">
                <ChevronLeft size={24} className="text-slate-700 dark:text-slate-200"/>
            </button>
            <div className="flex gap-2">
                <button onClick={handleSaveClick} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-full transition-colors">
                    <Bookmark size={22} className={saved ? "text-brand-600 fill-brand-600" : "text-slate-700 dark:text-slate-200"} />
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-full transition-colors">
                    <Share2 size={22} className="text-slate-700 dark:text-slate-200"/>
                </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-32 sm:pb-10">
            {/* Cover Section */}
            <div className="p-6 flex flex-col items-center text-center">
                <div className="w-40 h-56 rounded-xl shadow-2xl mb-6 overflow-hidden relative group">
                    <img src={book.coverImageUrl} className="w-full h-full object-cover" alt="Cover" />
                    {book.accessLevel !== 'free' && (
                    <div className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md z-10 ${book.accessLevel === 'gold' ? 'bg-amber-400' : 'bg-blue-500'}`}>
                        {book.accessLevel === 'gold' ? <Crown size={16} fill="white" className="text-white"/> : <Star size={16} fill="white" className="text-white"/>}
                    </div>
                    )}
                </div>
                <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2 leading-tight">{book.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mb-4">{book.author}</p>
                
                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <span className="flex items-center gap-1.5"><Clock size={16}/> {book.duration} min</span>
                    <span className="flex items-center gap-1.5"><BookOpen size={16}/> Summary</span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase">{book.category}</span>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="px-6">
                <Tabs 
                    activeTab={activeTab} 
                    onChange={(id) => { setActiveTab(id); }} 
                    tabs={[
                        { id: 'read', label: t.read, icon: <BookOpen size={18}/> },
                        { id: 'listen', label: t.listen, icon: <Headphones size={18}/> }
                    ]}
                />
            </div>

            {/* Content Body */}
            <div className="px-6 py-8 relative">
                
                {/* Locked Overlay */}
                {isLocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center pt-20 px-6 bg-gradient-to-b from-white/0 via-white/90 to-white dark:from-dark-900/0 dark:via-dark-900/90 dark:to-dark-900">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${book.accessLevel === 'gold' ? 'bg-amber-100 text-amber-500' : 'bg-blue-100 text-blue-500'}`}>
                            <Lock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {book.accessLevel === 'gold' ? t.goldContent : t.premiumContent}
                        </h3>
                        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Unlock this summary and full audio access by upgrading your plan.</p>
                        <Button variant={book.accessLevel === 'gold' ? 'gold' : 'premium'} fullWidth onClick={handleUnlock}>{t.unlockNow}</Button>
                    </div>
                )}

                <div className={`${isLocked ? "blur-sm select-none opacity-50 h-[300px] overflow-hidden" : ""}`}>
                    {/* About Section - Present in both tabs now */}
                    <div className="mb-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-900/30">
                        <h4 className="text-brand-800 dark:text-brand-400 font-bold mb-1 text-sm uppercase tracking-wide">{t.aboutBook}</h4>
                        <p className="text-brand-700 dark:text-brand-300 text-sm leading-normal m-0">{book.about}</p>
                    </div>

                    {activeTab === 'read' ? (
                        <div className="text-center py-6">
                            {!isLocked && (
                                <>
                                    <p className="text-slate-500 dark:text-slate-400 mb-6">Ready to dive into the key insights?</p>
                                    <Button onClick={handleStartReading} size="lg" className="w-full sm:w-auto">{t.startReading}</Button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-4">
                            {/* Audio Player UI */}
                            {book.summaryAudioUrl ? (
                                <>
                                    <audio 
                                        ref={audioRef}
                                        src={book.summaryAudioUrl}
                                        onTimeUpdate={onTimeUpdate}
                                        onLoadedMetadata={onLoadedMetadata}
                                        onEnded={onEnded}
                                    />
                                    
                                    <div 
                                        className="w-full bg-slate-100 dark:bg-dark-800 rounded-full h-2 mb-4 relative overflow-hidden cursor-pointer group"
                                        onClick={handleSeek}
                                    >
                                        <div 
                                            className="absolute left-0 top-0 bottom-0 bg-brand-500 transition-all duration-100 group-hover:bg-brand-600" 
                                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between w-full text-xs text-slate-400 font-mono mb-8">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>

                                    <button 
                                        onClick={() => !isLocked && togglePlay()}
                                        className="w-20 h-20 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                                        disabled={isLocked}
                                    >
                                        {isPlaying ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor" className="ml-1"/>}
                                    </button>
                                    <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium mb-4">{isPlaying ? 'Playing...' : t.listen}</p>
                                </>
                            ) : (
                                <div className="text-center text-slate-400 py-10">
                                    <Headphones size={48} className="mx-auto mb-4 opacity-50"/>
                                    <p>{t.noAudio}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Shelf Selection Modal - Nested properly */}
          {showShelfModal && (
              <div className="absolute inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
                  <div className="bg-white dark:bg-dark-800 w-full max-w-sm rounded-2xl p-5 shadow-2xl animate-slide-up">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.saveTo}</h3>
                      <div className="flex flex-col gap-2 mb-4 max-h-[50vh] overflow-y-auto">
                          {bookshelves.map(shelf => (
                              <button 
                                key={shelf.id}
                                onClick={() => onShelfSelect(shelf.id)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-700 transition-colors text-left"
                              >
                                  <div className="p-2 bg-brand-50 dark:bg-brand-900/30 rounded-lg text-brand-600 dark:text-brand-400">
                                      <Folder size={20} />
                                  </div>
                                  <span className="font-medium text-slate-700 dark:text-slate-200">{shelf.name}</span>
                                  {shelf.bookIds.includes(book.id) && <Check size={16} className="ml-auto text-brand-500" />}
                              </button>
                          ))}
                      </div>
                      <Button variant="outline" fullWidth onClick={() => setShowShelfModal(false)}>{t.cancel}</Button>
                  </div>
              </div>
          )}
        </div>
    </div>
  );
};
