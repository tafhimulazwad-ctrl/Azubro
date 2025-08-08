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
}) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
        <div className="flex gap-4">
          <img
            src={book.images[0]}
            alt={book.title}
            className="w-20 h-28 object-cover rounded-lg cursor-pointer"
            onClick={onClick}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="cursor-pointer" onClick={onClick}>
                <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-blue-600">
                  {book.title}
                </h3>
                <p className="text-gray-600">by {book.author}</p>
              </div>
              
              <button
                onClick={onToggleWishlist}
                className={`p-2 rounded-full transition-colors ${
                  isInWishlist
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
                {book.condition}
              </span>
              <span className="text-sm text-gray-500">
                <Calendar size={14} className="inline mr-1" />
                {book.publishedYear}
              </span>
              <span className="text-sm text-gray-500">
                <User size={14} className="inline mr-1" />
                {book.sellerName}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {book.forSale && (
                  <span className="text-lg font-bold text-green-600">
                    ${book.price}
                  </span>
                )}
                <div className="flex gap-2">
                  {book.forSale && (
                    <span className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                      <ShoppingCart size={14} className="mr-1" />
                      Sale
                    </span>
                  )}
                  {book.forExchange && (
                    <span className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      <RefreshCw size={14} className="mr-1" />
                      Exchange
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
