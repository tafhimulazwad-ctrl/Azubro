@@ .. @@
 import React, { useState } from 'react';
 import { AuthProvider, useAuth } from './context/AuthContext';
 import { BookProvider } from './context/BookContext';
 import Header from './components/Layout/Header';
 import BookList from './components/Books/BookList';
 import AddBook from './components/Books/AddBook';
 import Wishlist from './components/Wishlist/Wishlist';
 import Reviews from './components/Reviews/Reviews';
+import Exchange from './components/Exchange/Exchange';
 import AdminPanel from './components/Admin/AdminPanel';
 
 const AppContent: React.FC = () => {
@@ .. @@
     switch (currentView) {
       case 'books':
         return <BookList />;
       case 'add-book':
         return user ? <AddBook /> : <BookList />;
       case 'wishlist':
         return user ? <Wishlist /> : <BookList />;
+      case 'exchange':
+        return user ? <Exchange /> : <BookList />;
       case 'reviews':
         return user ? <Reviews /> : <BookList />;
       case 'admin':
         return user?.isAdmin ? <AdminPanel /> : <BookList />;
       default:
         return <BookList />;
     }
   };