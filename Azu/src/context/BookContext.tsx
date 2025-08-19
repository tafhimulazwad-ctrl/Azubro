import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Review, ExchangeRequest, WishlistItem } from '../types';
import { booksAPI, reviewsAPI, wishlistAPI, exchangeAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface BookContextType {
  books: Book[];
  reviews: Review[];
  exchangeRequests: ExchangeRequest[];
  wishlist: WishlistItem[];
  addBook: (book: Omit<Book, 'id' | 'createdAt'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  addToWishlist: (userId: string, bookId: string) => void;
  removeFromWishlist: (userId: string, bookId: string) => void;
  createExchangeRequest: (request: Omit<ExchangeRequest, 'id' | 'createdAt'>) => void;
  updateExchangeRequest: (id: string, status: ExchangeRequest['status']) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

interface BookProviderProps {
  children: ReactNode;
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await booksAPI.getAllBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    // This will be handled by the AddBook component with API call
    loadBooks(); // Refresh books after adding
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    // This will be handled with API call
    loadBooks(); // Refresh books after updating
  };

  const deleteBook = (id: string) => {
    // This will be handled with API call
    loadBooks(); // Refresh books after deleting
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    // This will be handled with API call
    // For now, add locally
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [...prev, newReview]);
  };

  const addToWishlist = (userId: string, bookId: string) => {
    // This will be handled with API call
    const newWishlistItem: WishlistItem = {
      id: Date.now().toString(),
      userId,
      bookId,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setWishlist(prev => [...prev, newWishlistItem]);
  };

  const removeFromWishlist = (userId: string, bookId: string) => {
    // This will be handled with API call
    setWishlist(prev => prev.filter(item => 
      !(item.userId === userId && item.bookId === bookId)
    ));
  };

  const createExchangeRequest = (requestData: Omit<ExchangeRequest, 'id' | 'createdAt'>) => {
    // This will be handled with API call
    const newRequest: ExchangeRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setExchangeRequests(prev => [...prev, newRequest]);
  };

  const updateExchangeRequest = (id: string, status: ExchangeRequest['status']) => {
    // This will be handled with API call
    setExchangeRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  return (
    <BookContext.Provider value={{
      books,
      reviews,
      exchangeRequests,
      wishlist,
      addBook,
      updateBook,
      deleteBook,
      addReview,
      addToWishlist,
      removeFromWishlist,
      createExchangeRequest,
      updateExchangeRequest
    }}>
      {children}
    </BookContext.Provider>
  );
};
