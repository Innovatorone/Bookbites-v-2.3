

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, User, ViewState, Bookshelf, Language, Theme, Message, Masterclass, ContactInfo, SubscriptionTier, AccessLevel, SubscriptionPlan, StoreBook, CartItem, AppConfig, MessageReply, FAQItem } from '../types';
import { MOCK_BOOKS, MOCK_MASTERCLASSES, TRANSLATIONS, INITIAL_CONTACT_INFO, INITIAL_PLANS, MOCK_STORE_BOOKS, DEFAULT_APP_CONFIG, MOCK_FAQS } from '../constants';

interface AppContextType {
  appConfig: AppConfig;
  user: User | null;
  books: Book[];
  masterclasses: Masterclass[];
  savedBookIds: string[];
  bookshelves: Bookshelf[];
  categories: string[];
  masterclassCategories: string[];
  currentView: ViewState;
  selectedBook: Book | null;
  selectedMasterclass: Masterclass | null;
  selectedStoreBook: StoreBook | null;
  
  // Admin & Session State
  isAdminAuthenticated: boolean;
  showAdminLogin: boolean;
  isAuthorizedAdmin: boolean; // Computed helper
  isLoadingAuth: boolean;
  
  subscriptionPlans: SubscriptionPlan[];
  language: Language;
  theme: Theme;
  t: any;
  messages: Message[];
  contactInfo: ContactInfo;
  notificationsOn: boolean;
  notificationMsg: string | null;
  allUsers: User[];
  faqs: FAQItem[];

  // Bookstore Data
  storeBooks: StoreBook[];
  storeCategories: string[];
  cart: CartItem[];
  storeFavorites: string[];

  // Actions
  completeProfile: (name: string, phone: string) => void;
  loginWithTelegram: () => boolean; // Returns success status
  guestLogin: (name: string, phone: string) => void; 
  logout: () => void;
  setBooks: (books: Book[]) => void;
  saveBookToShelf: (bookId: string, shelfId: string) => void; 
  saveBook: (bookId: string) => void; 
  removeBook: (bookId: string) => void;
  isSaved: (bookId: string) => boolean;
  navigate: (view: ViewState, item?: any) => void;
  getRecommendedBooks: () => Book[]; // New Algorithm
  
  // Admin Actions
  triggerAdminLogin: () => void; 
  cancelAdminLogin: () => void;
  authenticateAdmin: (id: string, pass: string) => boolean;
  exitAdminPanel: () => void;
  updateAppConfig: (config: AppConfig) => void;
  
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;
  addMasterclass: (mc: Masterclass) => void;
  updateMasterclass: (mc: Masterclass) => void;
  deleteMasterclass: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  addMasterclassCategory: (category: string) => void;
  deleteMasterclassCategory: (category: string) => void;
  
  createBookshelf: (name: string) => void;
  addToBookshelf: (shelfId: string, bookId: string) => void;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  
  // Message Actions
  sendMessage: (name: string, text: string) => void;
  replyToMessage: (msgId: string, replyText: string) => void;
  
  updateContactInfo: (info: ContactInfo) => void;
  toggleNotifications: () => void;
  clearNotification: () => void;
  
  // New Actions
  canAccess: (itemAccess: AccessLevel) => boolean;
  updateUserTier: (userId: string, tier: SubscriptionTier, expiryDate?: number) => void; 
  updateSubscriptionPlans: (plans: SubscriptionPlan[]) => void;
  
  // FAQ Actions
  addFAQ: (q: string, a: string) => void;
  deleteFAQ: (id: string) => void;
  
  // Bookstore Actions
  addStoreBook: (book: StoreBook) => void;
  updateStoreBook: (book: StoreBook) => void;
  deleteStoreBook: (id: string) => void;
  addStoreCategory: (category: string) => void;
  deleteStoreCategory: (category: string) => void;
  addToCart: (bookId: string) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, delta: number) => void;
  toggleStoreFavorite: (bookId: string) => void;
  promoteToManager: (userId: string, isManager: boolean) => void;
  promoteToSuperAdmin: (userId: string, isSuper: boolean) => void;
  setSelectedStoreBook: (book: StoreBook | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for lazy initialization
const getStored = <T,>(key: string, defaultVal: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultVal;
    } catch {
        return defaultVal;
    }
};

declare global {
  interface Window {
    Telegram: any;
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Lazy initialize state to fix persistence issues on reload
  const [appConfig, setAppConfigState] = useState<AppConfig>(() => getStored('bookbites_config', DEFAULT_APP_CONFIG));
  const [user, setUser] = useState<User | null>(() => getStored('bookbites_user', null));
  const [allUsers, setAllUsers] = useState<User[]>(() => getStored('bookbites_all_users', []));
  const [books, setBooksState] = useState<Book[]>(() => getStored('bookbites_books', MOCK_BOOKS)); 
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>(() => getStored('bookbites_masterclasses', MOCK_MASTERCLASSES));
  
  const [savedBookIds, setSavedBookIds] = useState<string[]>(() => getStored('bookbites_saved', []));
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>(() => {
      const stored = getStored('bookbites_shelves', []);
      return stored.length > 0 ? stored : [
          { id: '1', name: 'Favorites', bookIds: [] },
          { id: '2', name: 'To Read', bookIds: [] }
      ];
  });
  
  const [categories, setCategories] = useState<string[]>(() => getStored('bookbites_cats', Array.from(new Set(MOCK_BOOKS.map(b => b.category)))));
  const [masterclassCategories, setMasterclassCategories] = useState<string[]>(() => getStored('bookbites_mc_cats', Array.from(new Set(MOCK_MASTERCLASSES.map(m => m.category)))));
  const [storeCategories, setStoreCategories] = useState<string[]>(() => getStored('bookbites_store_cats', Array.from(new Set(MOCK_STORE_BOOKS.map(b => b.category)))));

  const [currentView, setCurrentView] = useState<ViewState>('AUTH');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedMasterclass, setSelectedMasterclass] = useState<Masterclass | null>(null);
  const [selectedStoreBook, setSelectedStoreBook] = useState<StoreBook | null>(null);
  
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => getStored('bookbites_plans', INITIAL_PLANS));
  const [language, setLanguageState] = useState<Language>(() => getStored('bookbites_lang', 'uz'));
  const [theme, setThemeState] = useState<Theme>(() => getStored('bookbites_theme', 'light'));
  const [messages, setMessages] = useState<Message[]>(() => getStored('bookbites_messages', []));
  const [faqs, setFaqs] = useState<FAQItem[]>(() => getStored('bookbites_faqs', MOCK_FAQS));
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => getStored('bookbites_contact', INITIAL_CONTACT_INFO));
  const [notificationsOn, setNotificationsOn] = useState(() => getStored('bookbites_notif', true));
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const [storeBooks, setStoreBooks] = useState<StoreBook[]>(() => getStored('bookbites_store_books', MOCK_STORE_BOOKS));
  const [cart, setCart] = useState<CartItem[]>(() => getStored('bookbites_cart', []));
  const [storeFavorites, setStoreFavorites] = useState<string[]>(() => getStored('bookbites_store_fav', []));

  const t = TRANSLATIONS[language];

  // --- Persistence Effects ---
  useEffect(() => localStorage.setItem('bookbites_config', JSON.stringify(appConfig)), [appConfig]);
  useEffect(() => localStorage.setItem('bookbites_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('bookbites_all_users', JSON.stringify(allUsers)), [allUsers]);
  useEffect(() => localStorage.setItem('bookbites_books', JSON.stringify(books)), [books]);
  useEffect(() => localStorage.setItem('bookbites_masterclasses', JSON.stringify(masterclasses)), [masterclasses]);
  useEffect(() => localStorage.setItem('bookbites_saved', JSON.stringify(savedBookIds)), [savedBookIds]);
  useEffect(() => localStorage.setItem('bookbites_shelves', JSON.stringify(bookshelves)), [bookshelves]);
  useEffect(() => localStorage.setItem('bookbites_cats', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('bookbites_mc_cats', JSON.stringify(masterclassCategories)), [masterclassCategories]);
  useEffect(() => localStorage.setItem('bookbites_store_cats', JSON.stringify(storeCategories)), [storeCategories]);
  useEffect(() => localStorage.setItem('bookbites_plans', JSON.stringify(subscriptionPlans)), [subscriptionPlans]);
  useEffect(() => localStorage.setItem('bookbites_lang', language), [language]);
  useEffect(() => localStorage.setItem('bookbites_theme', theme), [theme]);
  useEffect(() => localStorage.setItem('bookbites_contact', JSON.stringify(contactInfo)), [contactInfo]);
  useEffect(() => localStorage.setItem('bookbites_store_books', JSON.stringify(storeBooks)), [storeBooks]);
  useEffect(() => localStorage.setItem('bookbites_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('bookbites_store_fav', JSON.stringify(storeFavorites)), [storeFavorites]);
  useEffect(() => localStorage.setItem('bookbites_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('bookbites_faqs', JSON.stringify(faqs)), [faqs]);

  // --- Authentication Initialization ---
  useEffect(() => {
    // 1. Check for Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

    const initAuth = async () => {
        setIsLoadingAuth(true);
        const storedToken = localStorage.getItem('bookbites_token');
        const tgUser = tg?.initDataUnsafe?.user;

        // A. JWT Token Auto-Login
        if (storedToken) {
            // Find user with this token (Simulation of backend validation)
            const foundUser = allUsers.find(u => u.token === storedToken);
            if (foundUser) {
                setUser(foundUser);
                setCurrentView('HOME');
                setIsLoadingAuth(false);
                return;
            }
        }

        // B. Telegram Auto-Recognition (If no token, but TG ID is known)
        if (tgUser) {
            const tgId = tgUser.id.toString();
            const existingUser = allUsers.find(u => u.telegramUserId === tgId);
            
            if (existingUser) {
                // Generate a fresh token for this session if needed, or re-use
                const freshToken = existingUser.token || `token_${Date.now()}_${Math.random()}`;
                const updatedUser = { ...existingUser, token: freshToken };
                
                // Update state
                setUser(updatedUser);
                setAllUsers(prev => prev.map(u => u.id === existingUser.id ? updatedUser : u));
                localStorage.setItem('bookbites_token', freshToken);
                
                setCurrentView('HOME');
                setIsLoadingAuth(false);
                return;
            }
        }

        // C. No Auth, Go to Auth Screen
        setCurrentView('AUTH');
        setIsLoadingAuth(false);
    };

    initAuth();

    // Admin Session Restore
    const adminSession = sessionStorage.getItem('bookbites_admin_session');
    if (adminSession === 'true') setIsAdminAuthenticated(true);
  }, []); // Run once on mount

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);


  // --- Actions ---

  const canAccess = (itemAccess: AccessLevel): boolean => {
      if (isAdminAuthenticated) return true; // Admin gets access to everything
      if (!user) return false;
      
      if (user.subscriptionExpiry && user.subscriptionExpiry < Date.now()) {
          return itemAccess === 'free';
      }

      if (itemAccess === 'free') return true;
      if (itemAccess === 'premium' && (user.subscriptionTier === 'premium' || user.subscriptionTier === 'gold')) return true;
      if (itemAccess === 'gold' && user.subscriptionTier === 'gold') return true;
      return false;
  };

  // RECOMMENDATION ALGORITHM
  const getRecommendedBooks = (): Book[] => {
      if (!user) return [];
      
      // 1. Get user's interests based on saved books
      const userSavedBooks = books.filter(b => savedBookIds.includes(b.id));
      const interestedCategories = new Set(userSavedBooks.map(b => b.category));
      const interestedAuthors = new Set(userSavedBooks.map(b => b.author));
      
      // If user hasn't saved anything, return trending/popular books that aren't featured
      if (userSavedBooks.length === 0) {
          return books.filter(b => b.isPopular && !b.isFeatured).slice(0, 5);
      }

      // 2. Score other books
      const scoredBooks = books
        .filter(b => !savedBookIds.includes(b.id)) // Exclude already saved
        .map(book => {
            let score = 0;
            if (interestedCategories.has(book.category)) score += 5; // High weight for category
            if (interestedAuthors.has(book.author)) score += 3;    // Medium weight for author
            if (book.isPopular) score += 1; // Slight boost for popular items
            
            return { book, score };
        });

      // 3. Sort and slice
      return scoredBooks
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.book)
        .slice(0, 6);
  };

  // Login via InitData (Manual Trigger)
  const loginWithTelegram = (): boolean => {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      if (!tgUser) return false;

      const tgId = tgUser.id.toString();
      const existingUser = allUsers.find(u => u.telegramUserId === tgId);

      if (existingUser) {
          setUser(existingUser);
          if (existingUser.token) localStorage.setItem('bookbites_token', existingUser.token);
          setCurrentView('HOME');
          return true;
      }
      return false;
  };

  // Replaces Signup/Login for Telegram Flow
  const completeProfile = (name: string, phone: string) => {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      const tgId = tgUser ? tgUser.id.toString() : `web_${Date.now()}`;
      
      // Generate a "Backend" Token
      const newToken = `jwt_${tgId}_${Date.now()}`;

      const newUser: User = {
          id: tgId,
          token: newToken,
          name,
          phone,
          isGuest: false,
          telegramUserId: tgId,
          savedBookIds: [],
          bookshelves: [],
          subscriptionTier: 'free',
          preferences: { theme, language, notifications: true }
      };

      // Check if user already exists (edge case handling)
      const exists = allUsers.find(u => u.telegramUserId === tgId);
      if (exists) {
          // Update existing profile
          const updated = { ...exists, name, phone, token: newToken };
          setUser(updated);
          setAllUsers(prev => prev.map(u => u.id === exists.id ? updated : u));
      } else {
          setUser(newUser);
          setAllUsers(prev => [...prev, newUser]);
      }

      // Persist Token
      localStorage.setItem('bookbites_token', newToken);
      setCurrentView('HOME');
  };

  const guestLogin = (name: string, phone: string) => {
      const guestUser: User = {
          id: 'guest_' + Date.now(),
          token: 'guest_token_' + Date.now(),
          name: name || 'Guest',
          phone: phone, 
          isGuest: true,
          telegramUserId: '',
          savedBookIds: [],
          bookshelves: [],
          subscriptionTier: 'free',
          preferences: { theme, language, notifications: true }
      };
      setUser(guestUser);
      setAllUsers(prev => [...prev, guestUser]);
      localStorage.setItem('bookbites_token', guestUser.token!);
      setCurrentView('HOME');
  };

  const logout = () => {
      setUser(null);
      setIsAdminAuthenticated(false);
      localStorage.removeItem('bookbites_token');
      sessionStorage.removeItem('bookbites_admin_session');
      setCurrentView('AUTH');
  };

  const updateAppConfig = (config: AppConfig) => {
      setAppConfigState(config);
  };

  const triggerAdminLogin = () => {
      setShowAdminLogin(true);
      navigate('ADMIN');
  };

  const cancelAdminLogin = () => {
      setShowAdminLogin(false);
      if (user) navigate('HOME');
      else navigate('AUTH');
  };

  const authenticateAdmin = (id: string, pass: string): boolean => {
      if (id === '940017067' && pass === 'Qizilolmaeshigi786') {
          setIsAdminAuthenticated(true);
          setShowAdminLogin(false);
          sessionStorage.setItem('bookbites_admin_session', 'true');
          navigate('ADMIN');
          return true;
      }
      return false;
  };

  const exitAdminPanel = () => {
      navigate('HOME');
  };

  const addBook = (book: Book) => setBooksState(prev => [book, ...prev]);
  const updateBook = (updatedBook: Book) => setBooksState(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  const deleteBook = (bookId: string) => setBooksState(prev => prev.filter(b => b.id !== bookId));

  const addMasterclass = (mc: Masterclass) => setMasterclasses(prev => [mc, ...prev]);
  const updateMasterclass = (mc: Masterclass) => setMasterclasses(prev => prev.map(m => m.id === mc.id ? mc : m));
  const deleteMasterclass = (id: string) => setMasterclasses(prev => prev.filter(m => m.id !== id));

  const addCategory = (category: string) => { if (!categories.includes(category)) setCategories(prev => [...prev, category]); };
  const deleteCategory = (category: string) => { setCategories(prev => prev.filter(c => c !== category)); };
  const addMasterclassCategory = (category: string) => { if (!masterclassCategories.includes(category)) setMasterclassCategories(prev => [...prev, category]); };
  const deleteMasterclassCategory = (category: string) => { setMasterclassCategories(prev => prev.filter(c => c !== category)); };
  const addStoreCategory = (category: string) => { if (!storeCategories.includes(category)) setStoreCategories(prev => [...prev, category]); };
  const deleteStoreCategory = (category: string) => { setStoreCategories(prev => prev.filter(c => c !== category)); };

  const navigate = (view: ViewState, item?: any) => {
    setCurrentView(view);
    if (item) {
        if (view === 'MASTERCLASS_DETAIL') setSelectedMasterclass(item);
        else if (view === 'BOOKSTORE') setSelectedStoreBook(item);
        else if (view === 'HOME' || view === 'SEARCH' || view === 'LIBRARY') setSelectedBook(item);
    } else {
        // Clear selections if no item is passed (Fixes back button in BookDetail)
        if (view !== 'READER') {
            setSelectedBook(null);
            setSelectedMasterclass(null);
            setSelectedStoreBook(null);
        }
    }
  };

  const createBookshelf = (name: string) => {
      const newShelf: Bookshelf = { id: Date.now().toString(), name, bookIds: [] };
      setBookshelves(prev => [...prev, newShelf]);
  };
  
  const saveBookToShelf = (bookId: string, shelfId: string) => {
    const shelfIndex = bookshelves.findIndex(s => s.id === shelfId);
    if (shelfIndex === -1) return;
    if (bookshelves[shelfIndex].bookIds.includes(bookId)) return;
    const updatedShelves = [...bookshelves];
    updatedShelves[shelfIndex] = { ...updatedShelves[shelfIndex], bookIds: [...updatedShelves[shelfIndex].bookIds, bookId] };
    setBookshelves(updatedShelves);
    if (!savedBookIds.includes(bookId)) setSavedBookIds(prev => [...prev, bookId]);
  };
  const saveBook = (bookId: string) => {
    const targetShelf = bookshelves.find(s => s.id === '1') || bookshelves[0];
    if (targetShelf) saveBookToShelf(bookId, targetShelf.id);
  };
  const removeBook = (bookId: string) => {
    setBookshelves(prev => prev.map(shelf => ({ ...shelf, bookIds: shelf.bookIds.filter(id => id !== bookId) })));
    setSavedBookIds(prev => prev.filter(id => id !== bookId));
  };
  const isSaved = (bookId: string) => savedBookIds.includes(bookId);

  const addToBookshelf = (shelfId: string, bookId: string) => {
      saveBookToShelf(bookId, shelfId);
  };

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const toggleTheme = () => setThemeState(prev => prev === 'light' ? 'dark' : 'light');

  const sendMessage = (name: string, text: string) => {
      const userId = user ? user.id : 'anon';
      const msg: Message = { 
        id: Date.now().toString(), 
        name, 
        email: userId, 
        phone: user?.phone,
        text, 
        date: Date.now(), 
        read: false 
      }; 
      setMessages(prev => [msg, ...prev]);
  };

  const replyToMessage = (msgId: string, replyText: string) => {
      setMessages(prev => prev.map(msg => {
          if (msg.id === msgId) {
              const reply: MessageReply = { text: replyText, date: Date.now(), adminName: 'Admin' };
              return { ...msg, replies: [...(msg.replies || []), reply] };
          }
          return msg;
      }));
  };

  const updateContactInfo = (info: ContactInfo) => setContactInfo(info);
  const toggleNotifications = () => setNotificationsOn(!notificationsOn);
  const clearNotification = () => setNotificationMsg(null);

  const addStoreBook = (book: StoreBook) => setStoreBooks(prev => [book, ...prev]);
  const updateStoreBook = (book: StoreBook) => setStoreBooks(prev => prev.map(b => b.id === book.id ? book : b));
  const deleteStoreBook = (id: string) => setStoreBooks(prev => prev.filter(b => b.id !== id));

  const addToCart = (bookId: string) => {
      const existing = cart.find(i => i.bookId === bookId);
      if (existing) updateCartQuantity(bookId, 1);
      else {
          setCart(prev => [...prev, { bookId, quantity: 1 }]);
          setNotificationMsg('Added to Cart');
          setTimeout(() => setNotificationMsg(null), 1500);
      }
  };
  const removeFromCart = (bookId: string) => setCart(prev => prev.filter(i => i.bookId !== bookId));
  const updateCartQuantity = (bookId: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.bookId === bookId) {
              const newQ = item.quantity + delta;
              return newQ > 0 ? { ...item, quantity: newQ } : item;
          }
          return item;
      }));
  };
  const toggleStoreFavorite = (bookId: string) => {
      if (storeFavorites.includes(bookId)) setStoreFavorites(prev => prev.filter(id => id !== bookId));
      else setStoreFavorites(prev => [...prev, bookId]);
  };

  const promoteToManager = (userId: string, isManager: boolean) => {
      const updatedUsers = allUsers.map(u => u.id === userId || u.phone === userId ? { ...u, isBookstoreManager: isManager } : u);
      setAllUsers(updatedUsers);
      if (user && (user.id === userId || user.phone === userId)) setUser({ ...user, isBookstoreManager: isManager });
  };

  const promoteToSuperAdmin = (userId: string, isSuper: boolean) => {
      const updatedUsers = allUsers.map(u => u.id === userId || u.phone === userId ? { ...u, isSuperAdmin: isSuper } : u);
      setAllUsers(updatedUsers);
      if (user && (user.id === userId || user.phone === userId)) setUser({ ...user, isSuperAdmin: isSuper });
  };

  const updateUserTier = (userId: string, tier: SubscriptionTier, expiryDate?: number) => {
      const updatedUsers = allUsers.map(u => (u.id === userId || u.phone === userId) ? { ...u, subscriptionTier: tier, subscriptionExpiry: expiryDate } : u);
      setAllUsers(updatedUsers);
      if (user && (user.id === userId || user.phone === userId)) setUser({ ...user, subscriptionTier: tier, subscriptionExpiry: expiryDate });
  };

  const updateSubscriptionPlans = (plans: SubscriptionPlan[]) => setSubscriptionPlans(plans);

  const addFAQ = (q: string, a: string) => setFaqs(prev => [...prev, { id: Date.now().toString(), question: q, answer: a }]);
  const deleteFAQ = (id: string) => setFaqs(prev => prev.filter(f => f.id !== id));

  return (
    <AppContext.Provider value={{
      appConfig, user, allUsers, books, masterclasses, savedBookIds, bookshelves, categories, masterclassCategories, storeCategories,
      currentView, selectedBook, selectedMasterclass, selectedStoreBook, isAdminAuthenticated, showAdminLogin, isAuthorizedAdmin: isAdminAuthenticated, isLoadingAuth,
      subscriptionPlans, language, theme, t, messages, contactInfo, notificationsOn, notificationMsg, faqs,
      storeBooks, cart, storeFavorites,
      loginWithTelegram, guestLogin, logout, completeProfile,
      setBooks: setBooksState, saveBookToShelf, saveBook, removeBook, isSaved, navigate, getRecommendedBooks,
      triggerAdminLogin, cancelAdminLogin, authenticateAdmin, exitAdminPanel, updateAppConfig,
      addBook, updateBook, deleteBook,
      addMasterclass, updateMasterclass, deleteMasterclass,
      addCategory, deleteCategory, addMasterclassCategory, deleteMasterclassCategory,
      createBookshelf, addToBookshelf, setLanguage, toggleTheme,
      sendMessage, replyToMessage, updateContactInfo, toggleNotifications, clearNotification,
      canAccess, updateUserTier, updateSubscriptionPlans,
      addStoreBook, updateStoreBook, deleteStoreBook, addStoreCategory, deleteStoreCategory,
      addToCart, removeFromCart, updateCartQuantity, toggleStoreFavorite,
      promoteToManager, promoteToSuperAdmin, setSelectedStoreBook,
      addFAQ, deleteFAQ
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};