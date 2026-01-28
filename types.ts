

export type AccessLevel = 'free' | 'premium' | 'gold';
export type SubscriptionTier = 'free' | 'premium' | 'gold';

export interface AppConfig {
  appName: string;
  appSlogan: string;
  appLogoUrl: string; // URL or Base64
  onlyMeMode: boolean; // Security feature
}

export interface BuyButtonConfig {
  enabled: boolean;
  label: string;
  url: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImageUrl: string;
  summaryText: string;
  summaryAudioUrl?: string;
  about: string;
  duration: number; // in minutes
  createdAt: number;
  published: boolean;
  isPopular?: boolean; // Trending
  isFeatured?: boolean;
  isBookOfTheWeek?: boolean;
  accessLevel: AccessLevel;
  buyButtonConfig?: BuyButtonConfig;
}

export interface StoreBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  price: string;
  about: string;
  buyLink: string;
  category: string;
}

export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface Masterclass {
  id: string;
  title: string;
  instructor: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
  duration: number; // minutes
  accessLevel: AccessLevel;
}

export interface Bookshelf {
  id: string;
  name: string;
  bookIds: string[];
}

export interface MessageReply {
  text: string;
  date: number;
  adminName: string;
}

export interface Message {
  id: string;
  name: string;
  email?: string; 
  phone?: string; // Added phone property
  text: string;
  date: number;
  read: boolean;
  replies?: MessageReply[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  website: string;
  checkoutUrl?: string;
  mapEmbedUrl?: string; // Google Maps Embed Iframe Src
  telegramUrl?: string;
  instagramUrl?: string;
  telegramAdminUrl?: string;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: string;
  period: string; // e.g. "/month" or "/year"
  features: string[];
  paymentLink: string; // External link
  active: boolean;
}

export type Language = 'en' | 'ru' | 'uz';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  token?: string; // JWT Token for session
  name?: string;
  email?: string;
  phone?: string;
  isGuest: boolean;
  telegramUserId: string;
  savedBookIds: string[];
  bookshelves: Bookshelf[];
  subscriptionTier: SubscriptionTier;
  subscriptionExpiry?: number;
  
  // Roles
  isSuperAdmin?: boolean; 
  isBookstoreManager?: boolean; 
  
  preferences: {
    theme: Theme;
    language: Language;
    notifications: boolean;
  };
}

export type ViewState = 'AUTH' | 'HOME' | 'SEARCH' | 'MASTERCLASS_LIST' | 'MASTERCLASS_DETAIL' | 'LIBRARY' | 'SETTINGS' | 'ADMIN' | 'SUBSCRIPTION' | 'READER' | 'HELP' | 'CONTACT_INFO' | 'BOOKSTORE' | 'FAQ';
export type NavigationStack = { view: ViewState; params?: any }[];