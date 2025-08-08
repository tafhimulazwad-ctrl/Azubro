import React from 'react';
import { Heart, ShoppingCart, RefreshCw, Star, Calendar, User } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  viewMode: 'grid' | 'list';
  isInWishlist: boolean;
  onToggleWishlist: () => void;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  viewMode,
  isInWishlist,
  onToggleWishlist,
  onClick
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative">
        <img
          src={book.images[0]}
          alt={book.title}
          className="w-full h-48 object-cover rounded-t-lg cursor-pointer"
          onClick={onClick}
        />
        <button
          onClick={onToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all backdrop-blur-sm ${
            isInWishlist
              ? 'text-red-500 bg-white/90 shadow-md'
              : 'text-white hover:text-red-500 bg-black/20 hover:bg-white/90'
          }`}
        >
          <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>
        
        <div className="absolute bottom-3 left-3 flex gap-1">
          {book.forSale && (
            <span className="flex items-center text-xs text-white bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded">
              <ShoppingCart size={12} className="mr-1" />
              Sale
            </span>
          )}
          {book.forExchange && (
            <span className="flex items-center text-xs text-white bg-blue-500/90 backdrop-blur-sm px-2 py-1 rounded">
              <RefreshCw size={12} className="mr-1" />
              Exchange
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="cursor-pointer mb-3" onClick={onClick}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm">by {book.author}</p>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
            {book.condition}
          </span>
          <span className="text-sm text-gray-500">{book.publishedYear}</span>
        </div>
        
        <div className="flex items-center justify-between">
          {book.forSale && (
            <span className="text-lg font-bold text-green-600">
              ${book.price}
            </span>
          )}
          <div className="text-xs text-gray-500">
            <User size={12} className="inline mr-1" />
            {book.sellerName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
