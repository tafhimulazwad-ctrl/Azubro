import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart, RefreshCw, Star, Calendar, User, Package, Globe, BookOpen, CreditCard } from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';

interface BookDetailProps {
  bookId: string;
  onBack: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ bookId, onBack }) => {
  const { books, reviews, addReview, wishlist, addToWishlist, removeFromWishlist } = useBooks();
  const { user } = useAuth();
  const [showPayment, setShowPayment] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const book = books.find(b => b.id === bookId);
  const bookReviews = reviews.filter(r => r.bookId === bookId);
  const averageRating = bookReviews.length > 0 
    ? bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length
    : 0;

  const isInWishlist = wishlist.some(item => item.bookId === bookId && item.userId === user?.id);

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Book not found</h2>
          <button
            onClick={onBack}
            className="mt-4 text-blue-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const toggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(user!.id, bookId);
    } else {
      addToWishlist(user!.id, bookId);
    }
  };

  const handleAddReview = () => {
    if (newReview.comment.trim()) {
      addReview({
        userId: user!.id,
        userName: user!.username,
        bookId,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setNewReview({ rating: 5, comment: '' });
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800 border-green-200';
      case 'like-new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'good': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fair': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (showPayment && book.forSale) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setShowPayment(false)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to book details
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
              <CreditCard className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h2>
            <p className="text-gray-600 mt-2">Secure payment for "{book.title}"</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{book.title}</span>
                  <span>${book.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$3.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(book.price * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 font-semibold">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>${(book.price + 3.99 + book.price * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to books
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Book Image */}
        <div>
          <img
            src={book.images[0]}
            alt={book.title}
            className="w-full max-w-md mx-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Book Details */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="flex items-center gap-4 mb-4">
              {averageRating > 0 && (
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({bookReviews.length} review{bookReviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getConditionColor(book.condition)}`}>
                {book.condition}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <BookOpen size={16} className="mr-2" />
                <span>{book.pageCount} pages</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{book.publishedYear}</span>
              </div>
              <div className="flex items-center">
                <Globe size={16} className="mr-2" />
                <span>{book.language}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>by {book.sellerName}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{book.description}</p>

            <div className="flex items-center gap-4 mb-8">
              {book.forSale && (
                <div className="text-3xl font-bold text-green-600">
                  ${book.price}
                </div>
              )}
              <div className="flex gap-2">
                {book.forSale && (
                  <span className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <ShoppingCart size={14} className="mr-1" />
                    For Sale
                  </span>
                )}
                {book.forExchange && (
                  <span className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    <RefreshCw size={14} className="mr-1" />
                    For Exchange
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            {book.forSale && (
              <button
                onClick={() => setShowPayment(true)}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                <ShoppingCart size={20} className="mr-2" />
                Buy Now - ${book.price}
              </button>
            )}
            
            <button
              onClick={toggleWishlist}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                isInWishlist
                  ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                  : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Heart size={20} className="mr-2" fill={isInWishlist ? 'currentColor' : 'none'} />
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-xl font-semibold mb-6">Reviews</h3>
        
        {/* Add Review */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-4">Add Your Review</h4>
          <div className="flex items-center mb-4">
            <span className="mr-2">Rating:</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setNewReview({...newReview, rating: star})}
                className="mr-1"
              >
                <Star
                  size={20}
                  className={`${
                    star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  } hover:text-yellow-400`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            placeholder="Write your review..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            rows={4}
          />
          <button
            onClick={handleAddReview}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {bookReviews.map(review => (
            <div key={review.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="font-medium mr-3">{review.userName}</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{review.createdAt}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>

        {bookReviews.length === 0 && (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this book!</p>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
