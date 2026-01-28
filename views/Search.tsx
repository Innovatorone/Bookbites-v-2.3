
import React, { useState } from 'react';
import { useApp } from '../context/Store';
import { Header, BookCard, Input } from '../components/Shared';
import { Search, XCircle, ShoppingBag } from 'lucide-react';
import { CATEGORIES } from '../constants';

export const SearchView: React.FC = () => {
  const { books, storeBooks, navigate, t } = useApp();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const filteredBooks = books.filter(book => {
    const matchesQuery = query === '' || 
        book.title.toLowerCase().includes(query.toLowerCase()) || 
        book.author.toLowerCase().includes(query.toLowerCase());
    
    const matchesCat = selectedCat === null || book.category === selectedCat;

    return matchesQuery && matchesCat;
  });

  const filteredStoreBooks = storeBooks.filter(book => {
      if (query === '') return false; 
      const matchesQuery = book.title.toLowerCase().includes(query.toLowerCase()) || 
          book.author.toLowerCase().includes(query.toLowerCase());
      const matchesCat = selectedCat === null || (book.category && book.category === selectedCat);
      return matchesQuery && matchesCat;
  });

  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-slate-50 dark:bg-dark-900">
      <div className="px-5 pt-8 pb-4 bg-white dark:bg-dark-900 sticky top-0 z-20 shadow-sm md:shadow-none">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-serif mb-4">{t.explore}</h1>
        <div className="max-w-xl">
            <Input 
                placeholder={t.search + "..."}
                icon={<Search size={18} />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
        
        <div className="mt-4 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            <button
                onClick={() => setSelectedCat(null)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCat === null ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400'
                }`}
            >
                {t.all}
            </button>
            {CATEGORIES.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                        selectedCat === cat ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="px-5 mt-4">
        {filteredBooks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map(book => (
                    <BookCard 
                        key={book.id} 
                        book={book} 
                        onClick={() => navigate('SEARCH', book)}
                    />
                ))}
            </div>
        )}

        {/* Bookstore Results Section */}
        {filteredStoreBooks.length > 0 && (
            <div className="mt-8">
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                    <ShoppingBag size={14} /> From Bookstore
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStoreBooks.map(book => (
                        <div 
                            key={book.id} 
                            onClick={() => navigate('BOOKSTORE', book)}
                            className="flex gap-4 p-3 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
                        >
                             <img src={book.coverUrl} className="w-16 h-20 object-cover rounded bg-slate-100" />
                             <div className="flex-1">
                                 <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{book.title}</h4>
                                 <p className="text-xs text-slate-500 mb-1">{book.author}</p>
                                 <p className="text-brand-600 text-sm font-bold">{book.price}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {filteredBooks.length === 0 && filteredStoreBooks.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-slate-400">
                <XCircle size={48} className="mb-4 opacity-50"/>
                <p>No books found.</p>
            </div>
        )}
      </div>
    </div>
  );
};
