
import React, { useState } from 'react';
import { useApp } from '../context/Store';
import { Header, Button } from '../components/Shared';
import { Play, Clock, ChevronLeft, Lock, Star, Video } from 'lucide-react';

// Helper to extract YouTube ID - Robust Regex
const getYoutubeId = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = cleanUrl.match(regExp);
    return match ? match[1] : null;
};

// Helper to extract Vimeo ID
const getVimeoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    const match = url.trim().match(regExp);
    return match ? match[5] : null;
};

export const MasterclassListView: React.FC = () => {
    const { masterclasses, masterclassCategories, navigate, t } = useApp();
    const [selectedCat, setSelectedCat] = useState('All');

    const filtered = masterclasses.filter(mc => selectedCat === 'All' || mc.category === selectedCat);

    return (
        <div className="pb-24 animate-fade-in">
            <Header title={t.masterclass} />
            
            {/* Category Filter */}
            <div className="px-5 mb-6 flex gap-2 overflow-x-auto hide-scrollbar">
                <button 
                    onClick={() => setSelectedCat('All')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCat === 'All' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}
                >
                    All
                </button>
                {masterclassCategories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCat(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCat === cat ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(mc => {
                    const ytId = getYoutubeId(mc.videoUrl);
                    // Use uploaded thumbnail, or fallback to YouTube thumb, or fallback to generic placeholder
                    const displayThumb = mc.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 'https://via.placeholder.com/400x225?text=No+Cover');

                    return (
                        <div 
                            key={mc.id} 
                            onClick={() => navigate('MASTERCLASS_DETAIL', mc)}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900 mb-3 shadow-md">
                                <img src={displayThumb} alt={mc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                                        <Play size={20} fill="white" className="text-white ml-1" />
                                    </div>
                                </div>
                                {mc.accessLevel !== 'free' && (
                                    <div className="absolute top-2 right-2 bg-amber-400 p-1.5 rounded-lg">
                                        <Star size={14} fill="white" className="text-white"/>
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-white text-xs font-bold flex items-center gap-1">
                                    <Clock size={10} /> {mc.duration}m
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-brand-600 uppercase mb-1">{mc.category}</p>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{mc.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{mc.instructor}</p>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center py-10 text-slate-400">
                        <Video size={48} className="mx-auto mb-2 opacity-50"/>
                        <p>No masterclasses found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const MasterclassDetailView: React.FC = () => {
    const { selectedMasterclass, navigate, canAccess, t } = useApp();

    if (!selectedMasterclass) return null;
    
    const isLocked = !canAccess(selectedMasterclass.accessLevel);
    
    const ytId = getYoutubeId(selectedMasterclass.videoUrl);
    const vimeoId = getVimeoId(selectedMasterclass.videoUrl);
    const isEmbed = !!(ytId || vimeoId);
    
    const displayThumb = selectedMasterclass.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : '');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <div className="fixed inset-0 z-[60] flex justify-center sm:items-center sm:bg-black/60 sm:backdrop-blur-sm animate-fade-in">
             <div className="w-full h-full sm:h-[90%] sm:max-w-4xl bg-white dark:bg-dark-900 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-up relative">
                 <div className="sticky top-0 bg-white dark:bg-dark-900 z-20 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button onClick={() => navigate('MASTERCLASS_LIST')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800">
                        <ChevronLeft size={24} className="text-slate-700 dark:text-slate-200" />
                    </button>
                    <h2 className="font-bold text-lg dark:text-white truncate">{selectedMasterclass.title}</h2>
                 </div>
                
                 <div className="overflow-y-auto flex-1">
                     <div className="relative aspect-video bg-black w-full">
                         {isLocked ? (
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
                                 <Lock size={40} className="text-amber-500 mb-4" />
                                 <p className="text-white font-bold mb-4">{t.premiumContent}</p>
                                 <Button variant="premium" onClick={() => navigate('SUBSCRIPTION')}>{t.unlockNow}</Button>
                             </div>
                         ) : (
                             isEmbed ? (
                                <iframe 
                                    src={ytId 
                                        ? `https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0&modestbranding=1&playsinline=1&origin=${origin}` 
                                        : `https://player.vimeo.com/video/${vimeoId}?autoplay=0`}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    title={selectedMasterclass.title}
                                ></iframe>
                             ) : selectedMasterclass.videoUrl ? (
                                 <video controls className="w-full h-full" poster={displayThumb} playsInline>
                                     <source src={selectedMasterclass.videoUrl} type="video/mp4" />
                                     Your browser does not support the video tag.
                                 </video>
                             ) : (
                                 <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                     <p className="text-slate-500">Video source unavailable</p>
                                 </div>
                             )
                         )}
                         {isLocked && displayThumb && (
                             <img src={displayThumb} className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
                         )}
                     </div>

                     <div className="p-6 max-w-2xl mx-auto">
                         <div className="flex justify-between items-start mb-4">
                             <div>
                                <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-1">{selectedMasterclass.title}</h1>
                                <p className="text-brand-600 font-bold text-sm uppercase">{selectedMasterclass.instructor}</p>
                             </div>
                             <div className="flex flex-col items-end">
                                 <span className="text-xs text-slate-400 uppercase tracking-wide">Duration</span>
                                 <span className="font-bold text-slate-900 dark:text-white">{selectedMasterclass.duration} min</span>
                             </div>
                         </div>

                         <div className="prose prose-slate dark:prose-invert">
                             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">About this Masterclass</h3>
                             <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedMasterclass.description}</p>
                         </div>
                         
                         {isLocked && (
                            <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-center">
                                <Star size={32} className="text-amber-500 mx-auto mb-3" fill="currentColor"/>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Subscribe to watch</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Get unlimited access to all Masterclasses and Books.</p>
                                <Button variant="premium" fullWidth onClick={() => navigate('SUBSCRIPTION')}>Upgrade to Premium</Button>
                            </div>
                         )}
                     </div>
                 </div>
             </div>
        </div>
    );
};
