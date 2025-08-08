import React, { useState } from 'react';
import { Star, MessageSquare, User, Calendar, ThumbsUp } from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';

const Reviews: React.FC = () => {
  const { books, reviews, addReview } = useBooks();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'all' | 'my-reviews'>('all');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const myReviews = reviews.filter(review => review.userId === user?.id);
  const displayReviews = selectedTab === 'all' ? reviews : myReviews;

  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  const getBooksByUser = () => {
    return books.filter(book => book.sellerId !== user?.id);
  };

  const handleSubmitReview = () => {
    if (!selectedBook || !newReview.comment.trim()) {
      alert('Please select a book and add a comment');
      return;
    }

    addReview({
      userId: user!.id,
      userName: user!.username,
      bookId: selectedBook,
      rating: newReview.rating,
      comment: newReview.comment
    });

    setSelectedBook('');
    setNewReview({ rating: 5, comment: '' });
    alert('Review added successfully!');
  };

  const getAverageRating = (bookId: string) => {
    const bookReviews = reviews.filter(r => r.bookId === bookId);
    if (bookReviews.length === 0) return 0;
    return bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
  };

  const renderStars = (rating: number, size: number = 20, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type={interactive ? 'button' : undefined}
        onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
        className={interactive ? 'hover:scale-110 transition-transform' : ''}
        disabled={!interactive}
      >
        <Star
          size={size}
          className={`${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          } ${interactive ? 'hover:text-yellow-400' : ''}`}
        />
      </button>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
        <p className="text-gray-600">Share your thoughts about books and see what others think</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', label: 'All Reviews', count: reviews.length },
              { id: 'my-reviews', label: 'My Reviews', count: myReviews.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    selectedTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {selectedTab === 'all' && (
        <>
          {/* Add Review Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-center mb-4">
              <MessageSquare className="text-blue-600 mr-3" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Add a Review</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Book
                </label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a book to review...</option>
                  {getBooksByUser().map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center">
                  {renderStars(newReview.rating, 24, true, (rating) => 
                    setNewReview({...newReview, rating})
                  )}
                  <span className="ml-2 text-sm text-gray-600">
                    ({newReview.rating} star{newReview.rating !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="Share your thoughts about this book..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmitReview}
                disabled={!selectedBook || !newReview.comment.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <MessageSquare size={16} className="mr-2" />
                Submit Review
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Reviews</p>
                  <p className="text-3xl font-bold">{reviews.length}</p>
                </div>
                <MessageSquare size={40} className="text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Average Rating</p>
                  <p className="text-3xl font-bold">
                    {reviews.length > 0 
                      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
                <Star size={40} className="text-yellow-200 fill-current" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Books Reviewed</p>
                  <p className="text-3xl font-bold">
                    {new Set(reviews.map(r => r.bookId)).size}
                  </p>
                </div>
                <User size={40} className="text-green-200" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reviews List */}
      <div>
        {displayReviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedTab === 'all' ? 'No Reviews Yet' : 'You Haven\'t Written Any Reviews'}
            </h3>
            <p className="text-gray-600">
              {selectedTab === 'all' 
                ? 'Be the first to review a book and help others discover great reads!'
                : 'Start sharing your thoughts about books you\'ve read.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayReviews
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(review => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{review.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {renderStars(review.rating, 16)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <h5 className="font-medium text-gray-900 mb-1">
                    Review for: {getBookTitle(review.bookId)}
                  </h5>
                  <div className="text-sm text-gray-500">
                    Average book rating: {renderStars(getAverageRating(review.bookId), 14)}
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp size={16} />
                    <span className="text-sm">Helpful</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
