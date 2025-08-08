import React from 'react';
import { Heart, ShoppingCart, RefreshCw, Trash2 } from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';

const Wishlist: React.FC = () => {
  const { books, wishlist, removeFromWishlist } = useBooks();
  const { user } = useAuth();

  const userWishlist = wishlist.filter(item => item.userId === user?.id);
  const wishlistBooks = userWishlist
    .map(item => books.find(book => book.id === item.bookId))
    .filter(Boolean);

  const handleRemove = (bookId: string) => {
    removeFromWishlist(user!.id, bookId);
  };

  if (wishlistBooks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-gray-400 mb-6">
            <Heart size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8">
            Browse our book collection and add books you're interested in to your wishlist.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlistBooks.length} book{wishlistBooks.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      <div className="grid gap-6">
        {wishlistBooks.map(book => {
          if (!book) return null;
          
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

          return (
            <div key={book.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex gap-6">
                  <img
                    src={book.images[0]}
                    alt={book.title}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-gray-600">by {book.author}</p>
                      </div>
                      
                      <button
                        onClick={() => handleRemove(book.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
                        {book.condition}
                      </span>
                      <span className="text-sm text-gray-500">by {book.sellerName}</span>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{book.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {book.forSale && (
                          <span className="text-xl font-bold text-green-600">
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
                      
                      <div className="flex gap-2">
                        {book.forSale && (
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                            <ShoppingCart size={16} className="mr-2" />
                            Buy Now
                          </button>
                        )}
                        {book.forExchange && (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                            <RefreshCw size={16} className="mr-2" />
                            Exchange
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;