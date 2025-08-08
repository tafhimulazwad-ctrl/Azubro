import React from 'react';
import { Heart, ShoppingCart, RefreshCw, Calendar, User } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
  onToggleFavorite: (bookId: string) => void;
  onClick: () => void;
}

export default function BookCard({ book, onAddToCart, onToggleFavorite, onClick }: BookCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(book.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            book.isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart className="w-4 h-4" fill={book.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(book.rating)
                  ? 'bg-yellow-400'
                  : 'bg-gray-200'
              } rounded-full`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({book.rating})</span>
        </div>
        
        <div className="cursor-pointer mb-3" onClick={onClick}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm">by {book.author}</p>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-gray-900">${book.price}</span>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{book.publishedYear}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(book);
            }}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}