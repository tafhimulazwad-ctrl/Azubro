import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import Header from './components/Layout/Header';
import BookList from './components/Books/BookList';
import AddBook from './components/Books/AddBook';
import Wishlist from './components/Wishlist/Wishlist';
import Reviews from './components/Reviews/Reviews';
import AdminPanel from './components/Admin/AdminPanel';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('books');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    if (!user && currentView !== 'books') {
      return <BookList />;
    }
    
    switch (currentView) {
      case 'books':
        return <BookList />;
      case 'add-book':
        return user ? <AddBook /> : <BookList />;
      case 'wishlist':
        return user ? <Wishlist /> : <BookList />;
      case 'reviews':
        return user ? <Reviews /> : <BookList />;
      case 'admin':
        return user?.isAdmin ? <AdminPanel /> : <BookList />;
      default:
        return <BookList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <AppContent />
      </BookProvider>
    </AuthProvider>
  );
}

export default App;
