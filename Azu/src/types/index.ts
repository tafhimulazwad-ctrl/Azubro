export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  avatar?: string;
  joinedDate: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  price: number;
  description: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  isAvailable: boolean;
  publishedYear: number;
  language: string;
  pageCount: number;
  createdAt: string;
  forSale: boolean;
  forExchange: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ExchangeRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  ownerId: string;
  ownerName: string;
  requestedBookId: string;
  requestedBookTitle: string;
  offeredBookId: string;
  offeredBookTitle: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  bookId: string;
  addedAt: string;
}
