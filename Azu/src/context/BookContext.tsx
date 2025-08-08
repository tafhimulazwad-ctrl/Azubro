import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Review, ExchangeRequest, WishlistItem } from '../types';

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

  useEffect(() => {
    // Initialize with sample data
    const sampleBooks: Book[] = [
      {
        id: '1',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        genre: 'Classic Literature',
        condition: 'good',
        price: 12.99,
        description: 'A classic American novel about the Jazz Age.',
        images: ['https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'],
        sellerId: '2',
        sellerName: 'johndoe',
        isAvailable: true,
        publishedYear: 1925,
        language: 'English',
        pageCount: 180,
        createdAt: '2024-01-01',
        forSale: true,
        forExchange: true
      },
      {
        id: '2',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780060935467',
        genre: 'Classic Literature',
        condition: 'like-new',
        price: 14.50,
        description: 'A gripping tale of racial injustice and childhood innocence.',
        images: ['https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'],
        sellerId: '1',
        sellerName: 'admin',
        isAvailable: true,
        publishedYear: 1960,
        language: 'English',
        pageCount: 281,
        createdAt: '2024-01-02',
        forSale: true,
        forExchange: false
      },
      {
        id: '3',
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        genre: 'Science Fiction',
        condition: 'good',
        price: 11.25,
        description: 'A dystopian social science fiction novel.',
        images: ['https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'],
        sellerId: '2',
        sellerName: 'johndoe',
        isAvailable: true,
        publishedYear: 1949,
        language: 'English',
        pageCount: 328,
        createdAt: '2024-01-03',
        forSale: false,
        forExchange: true
      }
    ];

    setBooks(sampleBooks);
  }, []);

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...bookData } : book
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [...prev, newReview]);
  };

  const addToWishlist = (userId: string, bookId: string) => {
    const newWishlistItem: WishlistItem = {
      id: Date.now().toString(),
      userId,
      bookId,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setWishlist(prev => [...prev, newWishlistItem]);
  };

  const removeFromWishlist = (userId: string, bookId: string) => {
    setWishlist(prev => prev.filter(item => 
      !(item.userId === userId && item.bookId === bookId)
    ));
  };

  const createExchangeRequest = (requestData: Omit<ExchangeRequest, 'id' | 'createdAt'>) => {
    const newRequest: ExchangeRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setExchangeRequests(prev => [...prev, newRequest]);
  };

  const updateExchangeRequest = (id: string, status: ExchangeRequest['status']) => {
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
