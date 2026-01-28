
import React from 'react';
import { AppProvider, useApp } from './context/Store';
import { BottomNav } from './components/Layout/BottomNav';
import { HomeView } from './views/Home';
import { SearchView } from './views/Search';
import { LibraryView } from './views/Library';
import { SettingsView } from './views/Settings';
import { AdminView } from './views/Admin';
import { SubscriptionView } from './views/Subscription';
import { BookDetail } from './views/BookDetail';
import { ReaderView } from './views/Reader';
import { AuthView } from './views/Auth';
import { MasterclassListView, MasterclassDetailView } from './views/Masterclass';
import { HelpView } from './views/Help';
import { ContactInfoView } from './views/ContactInfo';
import { BookstoreView } from './views/Bookstore';
import { FAQView } from './views/FAQ';
import { Bell } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, selectedBook, selectedMasterclass, navigate, notificationMsg, clearNotification } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'AUTH': return <AuthView />;
      case 'HOME': return <HomeView />;
      case 'SEARCH': return <SearchView />;
      case 'MASTERCLASS_LIST': return <MasterclassListView />;
      case 'MASTERCLASS_DETAIL': return <MasterclassDetailView />;
      case 'LIBRARY': return <LibraryView />;
      case 'SETTINGS': return <SettingsView />;
      case 'ADMIN': return <AdminView />;
      case 'SUBSCRIPTION': return <SubscriptionView />;
      case 'READER': return <ReaderView />;
      case 'HELP': return <HelpView />;
      case 'CONTACT_INFO': return <ContactInfoView />;
      case 'BOOKSTORE': return <BookstoreView />;
      case 'FAQ': return <FAQView />;
      default: return <HomeView />;
    }
  };

  const showNav = ['HOME', 'SEARCH', 'MASTERCLASS_LIST', 'LIBRARY', 'BOOKSTORE', 'SETTINGS'].includes(currentView);
  const isAuth = currentView === 'AUTH';

  return (
    <div className="h-[100dvh] bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white font-sans selection:bg-brand-200 flex justify-center">
      <main className="w-full h-full bg-white dark:bg-dark-900 shadow-2xl relative flex overflow-hidden transition-colors max-w-7xl">
        
        {/* Responsive Sidebar / Bottom Nav */}
        {showNav && !isAuth && <BottomNav />}

        <div className="flex-1 flex flex-col relative overflow-hidden h-full">
            {/* Notification Toast */}
            {notificationMsg && (
                <div 
                    className="absolute top-4 left-4 right-4 z-[100] bg-slate-900 text-white p-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up max-w-md mx-auto"
                    onClick={clearNotification}
                >
                    <div className="bg-brand-500 p-2 rounded-full">
                        <Bell size={16} fill="white" />
                    </div>
                    <p className="text-sm font-bold">{notificationMsg}</p>
                </div>
            )}

            {/* Scrollable Content Area */}
            <div className={`flex-1 overflow-y-auto hide-scrollbar scroll-smooth relative transition-opacity duration-300 w-full`}>
                {renderView()}
            </div>
        </div>

        {/* Book Detail Overlay (Modal) */}
        {selectedBook && currentView !== 'READER' && (
            <BookDetail book={selectedBook} onClose={() => navigate(currentView)} />
        )}

      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
