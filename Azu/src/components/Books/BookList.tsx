import React, { useState } from 'react';
import { Search, Filter, Grid, List, Heart, ShoppingCart, RefreshCw } from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';
import { BookCard } from './BookCard';
import BookDetail from './BookDetail';

const BookList: React.FC = () => {
  const { books, wishlist, addToWishlist, removeFromWishlist } = useBooks();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'exchange'>('all');

  const genres = Array.from(new Set(books.map(book => book.genre)));

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === '' || book.genre === selectedGenre;
    const matchesType = filterType === 'all' || 
                       (filterType === 'sale' && book.forSale) ||
                       (filterType === 'exchange' && book.forExchange);
    
    return matchesSearch && matchesGenre && matchesType;
  });

  const isInWishlist = (bookId: string) => {
    return wishlist.some(item => item.bookId === bookId && item.userId === user?.id);
  };

  const toggleWishlist = (bookId: string) => {
    if (isInWishlist(bookId)) {
      removeFromWishlist(user!.id, bookId);
    } else {
      addToWishlist(user!.id, bookId);
    }
  };

  if (selectedBook) {
    return (
      <BookDetail
        bookId={selectedBook}
        onBack={() => setSelectedBook(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Book Marketplace</h1>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Search books by title or author..."
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Books</option>
                <option value="sale">For Sale</option>
                <option value="exchange">For Exchange</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-3 transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600' : 'text-gray-600 hover:bg-purple-50'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-3 transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600' : 'text-gray-600 hover:bg-purple-50'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2">
            <Heart size={16} className="text-pink-500" />
            <span className="text-sm text-gray-600">Click heart to add to wishlist</span>
          </div>
        </div>
      </div>

      {/* Books Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'space-y-4'
      }>
        {filteredBooks.map(book => (
          <BookCard
            key={book.id}
            book={book}
            viewMode={viewMode}
            isInWishlist={isInWishlist(book.id)}
            onToggleWishlist={() => toggleWishlist(book.id)}
            onClick={() => setSelectedBook(book.id)}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-purple-300 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default BookList;
