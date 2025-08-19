import React from 'react';
import { Heart, ShoppingCart, RefreshCw, Star, MapPin } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  viewMode?: 'grid' | 'list';
  isInWishlist?: boolean;
  onToggleWishlist?: () => void;
  onClick?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  viewMode = 'grid', 
  isInWishlist = false, 
  onToggleWishlist, 
  onClick 
}) => {
  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new': return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200';
      case 'like-new': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200';
      case 'good': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200';
      case 'fair': return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200';
      case 'poor': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 p-6">
        <div className="flex gap-6">
          <div className="relative">
            <img
              src={book.images?.[0] || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'}
              alt={book.title}
              className="w-24 h-32 object-cover rounded-lg shadow-md"
            />
            {onToggleWishlist && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist();
                }}
                className={`absolute -top-2 -right-2 p-2 rounded-full shadow-lg transition-all ${
                  isInWishlist
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                    : 'bg-white text-gray-400 hover:text-pink-500 hover:bg-pink-50'
                }`}
              >
                <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
          
          <div className="flex-1 cursor-pointer" onClick={onClick}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
                {book.title}
              </h3>
              {book.forSale && (
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${book.price}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-2">by {book.author}</p>
            
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getConditionColor(book.condition)}`}>
                {book.condition}
              </span>
              <span className="text-sm text-purple-600 font-medium">{book.genre}</span>
              <span className="text-sm text-gray-500">{book.publishedYear}</span>
            </div>
            
            <p className="text-gray-700 mb-4 line-clamp-2">{book.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {book.forSale && (
                  <span className="flex items-center text-sm text-green-600 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1 rounded-full border border-green-200">
                    <ShoppingCart size={14} className="mr-1" />
                    For Sale
                  </span>
                )}
                {book.forExchange && (
                  <span className="flex items-center text-sm text-blue-600 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1 rounded-full border border-blue-200">
                    <RefreshCw size={14} className="mr-1" />
                    Exchange
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">by {book.sellerName}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 group"
    >
      <div className="relative">
        <img
          src={book.images?.[0] || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'}
          alt={book.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={onClick}
        />
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all ${
              isInWishlist
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                : 'bg-white text-gray-400 hover:text-pink-500 hover:bg-pink-50'
            }`}
          >
            <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
        )}
        
        <div className="absolute bottom-3 left-3 flex gap-2">
          {book.forSale && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              Sale
            </span>
          )}
          {book.forExchange && (
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              Exchange
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="cursor-pointer" onClick={onClick}>
          <h3 className="font-bold text-lg mb-1 text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 mb-2">by {book.author}</p>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConditionColor(book.condition)}`}>
            {book.condition}
          </span>
          <span className="text-sm text-purple-600 font-medium">{book.genre}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          {book.forSale && (
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${book.price}
            </span>
          )}
          <span className="text-sm text-gray-500">{book.publishedYear}</span>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          <span>by {book.sellerName}</span>
        </div>
        
        <div className="flex gap-2">
          {book.forSale && (
            <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center text-sm font-medium">
              <ShoppingCart size={14} className="mr-1" />
              Buy
            </button>
          )}
          {book.forExchange && (
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center text-sm font-medium">
              <RefreshCw size={14} className="mr-1" />
              Exchange
            </button>
          )}
        </div>
      </div>
    </div>
  );
};