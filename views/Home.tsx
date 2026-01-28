
import React from 'react';
import { useApp } from '../context/Store';
import { Header, BookCard } from '../components/Shared';
import { Sparkles } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { books, navigate, t, getRecommendedBooks } = useApp();
  
  const featured = books.filter(b => b.isFeatured);
  const popular = books.filter(b => b.isPopular && !b.isFeatured);
  const others = books.filter(b => !b.isFeatured && !b.isPopular);
  
  const recommended = getRecommendedBooks();

  return (
    <div className="pb-24 animate-fade-in">
      <Header title={t.discover} subtitle={t.goodMorning} />

      {/* Featured Section - Horizontal Scroll (Keep as is for carousel feel) */}
      <div className="mt-4 overflow-x-auto hide-scrollbar pl-5 pr-5 pb-4 -mr-5">
        <div className="flex gap-4 w-max">
          {featured.map(book => (
            <BookCard 
                key={book.id} 
                book={book} 
                variant="featured" 
                onClick={() => navigate('HOME', book)}
            />
          ))}
        </div>
      </div>

      {/* Recommended Section (New) */}
      {recommended.length > 0 && (
          <div className="mt-6 px-5">
            <div className="flex items-center gap-2 mb-4">
               <Sparkles size={18} className="text-amber-500" />
               <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.recommended}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommended.map(book => (
                    <BookCard 
                        key={book.id} 
                        book={book} 
                        onClick={() => navigate('HOME', book)}
                    />
                ))}
            </div>
          </div>
      )}

      {/* Popular Section */}
      <div className="mt-8 px-5">
        <div className="flex justify-between items-end mb-4">
           <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.trending}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popular.map(book => (
                <BookCard 
                    key={book.id} 
                    book={book} 
                    onClick={() => navigate('HOME', book)}
                />
            ))}
        </div>
      </div>

      {/* Fresh Section */}
      <div className="mt-8 px-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.newArrivals}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map(book => (
                <BookCard 
                    key={book.id} 
                    book={book} 
                    onClick={() => navigate('HOME', book)}
                />
            ))}
        </div>
      </div>
    </div>
  );
};
