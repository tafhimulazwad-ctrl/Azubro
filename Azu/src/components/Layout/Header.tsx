import React from 'react';
import { User, ShoppingCart, Heart, BookOpen, Menu, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../Auth/LoginModal';
import SignupModal from '../Auth/SignupModal';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showSignupModal, setShowSignupModal] = React.useState(false);

  const navItems = [
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'exchange', label: 'Exchange', icon: ShoppingCart },
    { id: 'reviews', label: 'Reviews', icon: User },
  ];

  if (user?.isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Menu });
  }

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => onViewChange('books')}
            >
              BookExchange
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentView === item.id
                        ? 'bg-blue-50 text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => onViewChange('add-book')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Add Book
                </button>
                
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <LogIn size={18} />
                  <span className="text-sm font-medium">Login</span>
                </button>
                
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </header>
  );
};

export default Header;
