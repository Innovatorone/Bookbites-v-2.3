
import React, { useState } from 'react';
import { useApp } from '../context/Store';
import { Header, BookCard, Button } from '../components/Shared';
import { FolderPlus, Folder, ChevronLeft, Trash2 } from 'lucide-react';
import { Bookshelf } from '../types';

export const LibraryView: React.FC = () => {
  const { books, bookshelves, createBookshelf, navigate, t, saveBookToShelf } = useApp();
  const [showCreateShelf, setShowCreateShelf] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');
  const [activeShelf, setActiveShelf] = useState<Bookshelf | null>(null);
  
  const handleCreateShelf = () => {
      if (newShelfName.trim()) {
          createBookshelf(newShelfName);
          setNewShelfName('');
          setShowCreateShelf(false);
      }
  };

  // If inside a shelf, show the shelf view
  if (activeShelf) {
    // Re-find shelf to ensure we have latest data (e.g. if updated)
    const currentShelf = bookshelves.find(s => s.id === activeShelf.id) || activeShelf;
    const shelfBooks = books.filter(b => currentShelf.bookIds.includes(b.id));

    return (
        <div className="pb-24 animate-fade-in min-h-full bg-slate-50 dark:bg-dark-900 flex flex-col">
            <div className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm sticky top-0 z-20 px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button onClick={() => setActiveShelf(null)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors">
                    <ChevronLeft size={24} className="text-slate-700 dark:text-slate-200" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white font-serif">{currentShelf.name}</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{shelfBooks.length} books</p>
                </div>
            </div>

            <div className="px-5 mt-4">
                {shelfBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {shelfBooks.map(book => (
                            <div key={book.id} className="relative group">
                                <BookCard 
                                    book={book} 
                                    onClick={() => navigate('LIBRARY', book)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center mt-20 text-center px-8">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <Folder size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Shelf is empty</h3>
                        <p className="text-slate-500 text-sm mb-6">Go discover books and save them to this shelf.</p>
                        <Button onClick={() => navigate('HOME')}>Browse Books</Button>
                    </div>
                )}
            </div>
        </div>
    );
  }

  // Default View: List of Shelves
  return (
    <div className="pb-24 animate-fade-in min-h-full bg-slate-50 dark:bg-dark-900">
      <Header title={t.myLibrary} subtitle={t.bookshelves} />
      
      {/* Create Shelf Action */}
      <div className="px-5 mb-6">
          <div className="flex justify-between items-center mb-4">
               <p className="text-sm text-slate-500 dark:text-slate-400">Organize your summaries</p>
              <button onClick={() => setShowCreateShelf(!showCreateShelf)} className="text-brand-600 dark:text-brand-400 text-sm font-bold flex items-center gap-1 hover:bg-brand-50 dark:hover:bg-brand-900/20 px-3 py-1.5 rounded-lg transition-colors">
                  <FolderPlus size={16} /> {t.newShelf}
              </button>
          </div>

          {showCreateShelf && (
              <div className="mb-6 bg-white dark:bg-dark-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-2 animate-slide-up max-w-lg">
                  <input 
                    autoFocus
                    className="flex-1 bg-slate-50 dark:bg-dark-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500/20 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="e.g. Finance, Psychology..."
                    value={newShelfName}
                    onChange={(e) => setNewShelfName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateShelf()}
                  />
                  <button onClick={handleCreateShelf} className="bg-brand-600 text-white px-4 rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20">Add</button>
              </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bookshelves.map(shelf => (
                  <div 
                    key={shelf.id} 
                    onClick={() => setActiveShelf(shelf)}
                    className="bg-white dark:bg-dark-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3 cursor-pointer hover:border-brand-200 dark:hover:border-brand-800 hover:shadow-md transition-all active:scale-[0.98]"
                  >
                      <div className="flex justify-between items-start">
                          <Folder size={28} className="text-brand-500 fill-brand-50 dark:fill-brand-900/10" />
                          <span className="bg-slate-100 dark:bg-dark-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-1 rounded-full">
                              {shelf.bookIds.length}
                          </span>
                      </div>
                      <div>
                          <p className="font-bold text-slate-900 dark:text-white text-base mb-0.5 line-clamp-1">{shelf.name}</p>
                          <p className="text-xs text-slate-400">View collection</p>
                      </div>
                  </div>
              ))}
              
              {/* Empty state helper if no shelves */}
              {bookshelves.length === 0 && (
                   <div className="col-span-2 text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                       <p className="text-slate-400 text-sm">No shelves yet. Create one!</p>
                   </div>
              )}
          </div>
      </div>
    </div>
  );
};
