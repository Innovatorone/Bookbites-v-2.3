import React, { useState } from 'react';
import { useApp } from '../context/Store';
import { Button, Input } from '../components/Shared';
import { ChevronLeft, ShoppingCart, Heart, Plus, Edit2, Trash2, X, Minus, Book, ExternalLink, Filter, Link, Upload, Image } from 'lucide-react';
import { StoreBook } from '../types';

export const BookstoreView: React.FC = () => {
    const { 
        storeBooks, cart, storeFavorites, contactInfo, user, isAuthorizedAdmin, t,
        addToCart, removeFromCart, updateCartQuantity, toggleStoreFavorite, navigate,
        addStoreBook, updateStoreBook, deleteStoreBook, selectedStoreBook, setSelectedStoreBook,
        storeCategories, addStoreCategory, deleteStoreCategory
    } = useApp();

    const [view, setView] = useState<'grid' | 'cart' | 'favorites'>('grid');
    const [editingBook, setEditingBook] = useState<Partial<StoreBook> | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    // Cover Mode State
    const [coverMode, setCoverMode] = useState<'upload' | 'url'>('upload');

    // Category Management
    const [showCatManage, setShowCatManage] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    const isManager = user?.isBookstoreManager || isAuthorizedAdmin;
    const cartTotal = cart.reduce((acc, item) => acc + item.quantity, 0);

    const filteredBooks = storeBooks.filter(book => selectedCategory === 'All' || book.category === selectedCategory);

    const handleSaveBook = () => {
        if (!editingBook?.title || !editingBook?.price) return;
        const newBook = {
            ...editingBook,
            id: editingBook.id || 's' + Date.now(),
            coverUrl: editingBook.coverUrl || 'https://picsum.photos/300/450',
            about: editingBook.about || '',
            buyLink: editingBook.buyLink || '#',
            category: editingBook.category || 'General'
        } as StoreBook;

        if (editingBook.id) updateStoreBook(newBook);
        else addStoreBook(newBook);
        
        setIsEditMode(false);
        setEditingBook(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
             setEditingBook(prev => ({ ...prev, coverUrl: reader.result as string }));
          };
          reader.readAsDataURL(file);
        }
    };

    const openBookDetail = (book: StoreBook) => {
        setSelectedStoreBook(book);
    };

    // --- Detail Modal ---
    const DetailModal = () => {
        if (!selectedStoreBook) return null;
        const book = selectedStoreBook;
        const isFav = storeFavorites.includes(book.id);

        return (
            <div className="fixed inset-0 z-[60] bg-white dark:bg-dark-900 animate-slide-up flex flex-col overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-dark-900 z-20 px-4 py-3 border-b dark:border-slate-800 flex justify-between items-center">
                    <button onClick={() => setSelectedStoreBook(null)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-800">
                        <ChevronLeft size={24} className="text-slate-700 dark:text-slate-200" />
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => toggleStoreFavorite(book.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-full transition-colors">
                            <Heart size={22} className={isFav ? "text-red-500 fill-red-500" : "text-slate-700 dark:text-slate-200"} />
                        </button>
                    </div>
                </div>

                <div className="p-6 pb-20">
                    <div className="flex flex-col items-center text-center mb-8">
                        <img src={book.coverUrl} className="w-40 h-60 object-cover rounded-xl shadow-2xl mb-6" />
                        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">{book.title}</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-4">{book.author}</p>
                        <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase">{book.category}</span>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wide">About this Item</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{book.about}</p>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-xs text-slate-400 uppercase font-bold">Price</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{book.price}</p>
                        </div>
                        <Button onClick={() => addToCart(book.id)} className="flex-1">Add to Cart</Button>
                        <a href={book.buyLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold">
                            Buy Now
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    if (isEditMode) {
        return (
            <div className="pb-24 animate-fade-in bg-white dark:bg-dark-900 min-h-screen">
                <div className="sticky top-0 bg-white dark:bg-dark-900 z-20 px-4 py-4 border-b dark:border-slate-800 flex items-center justify-between">
                    <button onClick={() => setIsEditMode(false)} className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
                        <ChevronLeft size={20} /> Cancel
                    </button>
                    <h2 className="font-bold text-lg dark:text-white">{editingBook?.id ? 'Edit Item' : 'New Item'}</h2>
                    <button onClick={handleSaveBook} className="text-brand-600 font-bold">Save</button>
                </div>
                <div className="p-5 flex flex-col gap-4 max-w-lg mx-auto">
                     <div className="flex gap-4">
                        <img src={editingBook?.coverUrl || 'https://via.placeholder.com/150'} className="w-24 h-36 object-cover rounded bg-slate-100 shrink-0" />
                        
                        <div className="flex-1 flex flex-col gap-2">
                             <div className="flex gap-2 mb-2">
                                 <button onClick={() => setCoverMode('upload')} className={`flex-1 py-1 text-xs rounded border ${coverMode === 'upload' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Upload</button>
                                 <button onClick={() => setCoverMode('url')} className={`flex-1 py-1 text-xs rounded border ${coverMode === 'url' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>URL</button>
                             </div>

                             {coverMode === 'upload' ? (
                                <label className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50">
                                    <Upload size={20} className="text-slate-400 mb-1" />
                                    <span className="text-xs text-slate-500">Upload Cover</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                             ) : (
                                 <div className="flex flex-col gap-1">
                                     <label className="text-xs font-bold text-slate-500">Image Link</label>
                                     <input 
                                        className="border rounded px-2 py-1.5 text-sm"
                                        placeholder="https://..." 
                                        value={editingBook?.coverUrl} 
                                        onChange={e => setEditingBook({...editingBook, coverUrl: e.target.value})}
                                     />
                                 </div>
                             )}
                        </div>
                     </div>

                     <Input label="Title" value={editingBook?.title || ''} onChange={e => setEditingBook({...editingBook, title: e.target.value})} />
                     <Input label="Author" value={editingBook?.author || ''} onChange={e => setEditingBook({...editingBook, author: e.target.value})} />
                     <Input label="Price (e.g. $15.00)" value={editingBook?.price || ''} onChange={e => setEditingBook({...editingBook, price: e.target.value})} />
                     
                     <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Category</label>
                            <button onClick={() => setShowCatManage(!showCatManage)} className="text-xs text-brand-600 font-bold">Manage Categories</button>
                        </div>
                        
                        {showCatManage && (
                             <div className="bg-slate-100 p-3 rounded-xl mb-2">
                                 <div className="flex flex-wrap gap-2 mb-2">
                                     {storeCategories.map(cat => (
                                         <span key={cat} className="bg-white text-xs px-2 py-1 rounded border flex items-center gap-1">
                                             {cat} <button onClick={() => deleteStoreCategory(cat)}><X size={10}/></button>
                                         </span>
                                     ))}
                                 </div>
                                 <div className="flex gap-2">
                                     <input className="border rounded px-2 py-1 text-sm flex-1" placeholder="New Cat..." value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                                     <button onClick={() => { if(newCatName) { addStoreCategory(newCatName); setNewCatName(''); } }} className="bg-slate-900 text-white px-2 rounded text-xs">Add</button>
                                 </div>
                             </div>
                        )}

                        <select 
                            className="w-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none"
                            value={editingBook?.category || storeCategories[0]}
                            onChange={e => setEditingBook({...editingBook, category: e.target.value})}
                        >
                            {storeCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>

                     <Input label="Buy Link (Single Item)" value={editingBook?.buyLink || ''} onChange={e => setEditingBook({...editingBook, buyLink: e.target.value})} />
                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">About</label>
                        <textarea className="w-full bg-white dark:bg-dark-800 border border-slate-200 rounded-xl px-4 py-3 h-24" value={editingBook?.about} onChange={e => setEditingBook({...editingBook, about: e.target.value})} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 animate-fade-in bg-slate-50 dark:bg-dark-900 min-h-screen flex flex-col">
            {DetailModal()}

            {/* Bookstore Header */}
            <div className="sticky top-0 z-30 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="px-4 py-3 flex justify-between items-center">
                    <button onClick={() => navigate('HOME')} className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium text-sm">
                        <ChevronLeft size={18} /> {t.backToApp}
                    </button>
                    {isManager && (
                         <button onClick={() => { setEditingBook({}); setIsEditMode(true); }} className="p-2 bg-brand-100 text-brand-700 rounded-full hover:bg-brand-200 transition-colors">
                            <Plus size={20} />
                         </button>
                    )}
                </div>
                
                {/* Bookstore Menu Bar */}
                <div className="px-4 pb-2 flex gap-4 overflow-x-auto hide-scrollbar">
                    <button 
                        onClick={() => setView('grid')} 
                        className={`pb-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${view === 'grid' ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-400'}`}
                    >
                        {t.bookstore}
                    </button>
                    <button 
                        onClick={() => setView('favorites')} 
                        className={`pb-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${view === 'favorites' ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-400'}`}
                    >
                        {t.favorites} {storeFavorites.length > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 rounded-full">{storeFavorites.length}</span>}
                    </button>
                    <button 
                        onClick={() => setView('cart')} 
                        className={`pb-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${view === 'cart' ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-400'}`}
                    >
                        {t.myCart} {cartTotal > 0 && <span className="bg-brand-600 text-white text-[9px] px-1.5 rounded-full">{cartTotal}</span>}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4">
                
                {view === 'grid' && (
                    <>
                        {/* Categories Filter */}
                        <div className="mb-4 flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                             <button
                                onClick={() => setSelectedCategory('All')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                                    selectedCategory === 'All' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-dark-800 text-slate-500 border border-slate-100 dark:border-slate-700'
                                }`}
                            >
                                {t.all}
                            </button>
                            {storeCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                                        selectedCategory === cat ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-dark-800 text-slate-500 border border-slate-100 dark:border-slate-700'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5">
                            {filteredBooks.map(book => (
                                <div key={book.id} onClick={() => openBookDetail(book)} className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full relative group cursor-pointer active:scale-95 transition-transform">
                                    <div className="aspect-[2/3] relative bg-slate-200">
                                        <img src={book.coverUrl} className="w-full h-full object-cover" />
                                        
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); addToCart(book.id); }}
                                            className="absolute top-2 right-2 w-7 h-7 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                        </button>

                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleStoreFavorite(book.id); }}
                                            className="absolute top-2 left-2 w-7 h-7 bg-black/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors z-10"
                                        >
                                            <Heart size={12} fill={storeFavorites.includes(book.id) ? "white" : "none"} />
                                        </button>
                                    </div>
                                    
                                    <div className="p-2 flex-1 flex flex-col">
                                        <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2">{book.title}</h3>
                                        <p className="text-[10px] text-slate-500 line-clamp-1 mb-auto">{book.author}</p>
                                        <p className="text-sm font-bold text-brand-600 mt-2">{book.price}</p>
                                        
                                        {isManager && (
                                            <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center gap-2 backdrop-blur-sm z-20" onClick={(e) => e.stopPropagation()}>
                                                <button onClick={() => { setEditingBook(book); setIsEditMode(true); }} className="p-2 bg-white rounded-full text-slate-900"><Edit2 size={16} /></button>
                                                <button onClick={() => deleteStoreBook(book.id)} className="p-2 bg-red-500 rounded-full text-white"><Trash2 size={16} /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {view === 'favorites' && (
                     <div className="grid grid-cols-3 gap-3">
                         {storeBooks.filter(b => storeFavorites.includes(b.id)).map(book => (
                             <div key={book.id} onClick={() => openBookDetail(book)} className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col relative cursor-pointer">
                                <img src={book.coverUrl} className="w-full aspect-[2/3] object-cover" />
                                <div className="p-2">
                                    <h3 className="font-bold text-xs line-clamp-1">{book.title}</h3>
                                    <p className="text-brand-600 text-xs font-bold">{book.price}</p>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); addToCart(book.id); }}
                                        className="mt-2 w-full py-1 bg-brand-100 text-brand-700 text-[10px] font-bold rounded"
                                    >
                                        {t.addToCart}
                                    </button>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); toggleStoreFavorite(book.id); }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><X size={12}/></button>
                             </div>
                         ))}
                         {storeFavorites.length === 0 && <p className="col-span-3 text-center text-slate-400 py-10">No favorites yet.</p>}
                     </div>
                )}

                {view === 'cart' && (
                    <div className="flex flex-col gap-4 max-w-md mx-auto">
                        {cart.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">
                                <ShoppingCart size={48} className="mx-auto mb-4 opacity-50"/>
                                <p>Your cart is empty.</p>
                            </div>
                        ) : (
                            <>
                                {cart.map(item => {
                                    const book = storeBooks.find(b => b.id === item.bookId);
                                    if (!book) return null;
                                    return (
                                        <div key={item.bookId} className="flex gap-3 bg-white dark:bg-dark-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 items-center">
                                            <img src={book.coverUrl} className="w-16 h-20 object-cover rounded bg-slate-100" />
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{book.title}</h4>
                                                <p className="text-xs text-slate-500 mb-2">{book.price}</p>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => updateCartQuantity(item.bookId, -1)} className="p-1 bg-slate-100 dark:bg-slate-700 rounded"><Minus size={14}/></button>
                                                    <span className="text-sm font-bold">{item.quantity}</span>
                                                    <button onClick={() => updateCartQuantity(item.bookId, 1)} className="p-1 bg-slate-100 dark:bg-slate-700 rounded"><Plus size={14}/></button>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFromCart(item.bookId)} className="text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                                        </div>
                                    );
                                })}
                                
                                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
                                     <a 
                                        href={contactInfo.checkoutUrl || '#'} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-colors"
                                     >
                                         {t.buyAll} <ExternalLink size={18} />
                                     </a>
                                     <p className="text-center text-[10px] text-slate-400 mt-2">Proceeds to checkout page</p>
                                </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};