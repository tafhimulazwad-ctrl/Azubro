import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';
import { booksAPI } from '../../services/api';

const AddBook: React.FC = () => {
  const { addBook } = useBooks();
  const { user, token } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    condition: 'good' as const,
    price: 0,
    description: '',
    publishedYear: new Date().getFullYear(),
    language: 'English',
    pageCount: 0,
    forSale: true,
    forExchange: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business',
    'Technology', 'Health', 'Travel', 'Cooking', 'Art',
    'Philosophy', 'Psychology', 'Education', 'Children', 'Classic Literature'
  ];

  const conditions = [
    { value: 'new', label: 'New', description: 'Brand new, never used' },
    { value: 'like-new', label: 'Like New', description: 'Excellent condition, minimal wear' },
    { value: 'good', label: 'Good', description: 'Good condition with minor wear' },
    { value: 'fair', label: 'Fair', description: 'Readable with noticeable wear' },
    { value: 'poor', label: 'Poor', description: 'Heavy wear but still readable' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCheckboxChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.pageCount <= 0) newErrors.pageCount = 'Page count must be greater than 0';
    if (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear()) {
      newErrors.publishedYear = 'Invalid publication year';
    }
    if (formData.forSale && formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0 for books for sale';
    }
    if (!formData.forSale && !formData.forExchange) {
      newErrors.general = 'Book must be available for sale or exchange';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        genre: formData.genre,
        condition: formData.condition.toUpperCase(),
        price: formData.price,
        description: formData.description,
        publishedYear: formData.publishedYear,
        language: formData.language,
        pageCount: formData.pageCount,
        forSale: formData.forSale,
        forExchange: formData.forExchange,
        images: ['https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg']
      };
      
      await booksAPI.createBook(bookData, token!);
      
      // Refresh the books list
      addBook(bookData as any);

      // Reset form
      setFormData({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        condition: 'good',
        price: 0,
        description: '',
        publishedYear: new Date().getFullYear(),
        language: 'English',
        pageCount: 0,
        forSale: true,
        forExchange: false
      });

      alert('Book added successfully!');
    } catch (error) {
      console.error('Failed to add book:', error);
      setErrors({ general: 'Failed to add book. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Plus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Book</h1>
          <p className="text-gray-600 mt-2">Share your books with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter book title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.author ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter author name"
                />
                {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN *
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.isbn ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter ISBN"
                />
                {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.genre ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Published Year *
                </label>
                <input
                  type="number"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  min="1000"
                  max={new Date().getFullYear()}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.publishedYear ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.publishedYear && <p className="text-red-500 text-sm mt-1">{errors.publishedYear}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Count *
                </label>
                <input
                  type="number"
                  name="pageCount"
                  value={formData.pageCount}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.pageCount ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.pageCount && <p className="text-red-500 text-sm mt-1">{errors.pageCount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter language"
                />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Condition</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {conditions.map(condition => (
                <label
                  key={condition.value}
                  className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.condition === condition.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="condition"
                    value={condition.value}
                    checked={formData.condition === condition.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-medium text-sm">{condition.label}</span>
                  <span className="text-xs text-gray-500 mt-1">{condition.description}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the book's content, condition, and any additional notes..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Availability */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="forSale"
                  checked={formData.forSale}
                  onChange={() => handleCheckboxChange('forSale')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="forSale" className="text-sm font-medium text-gray-700">
                    Available for Sale
                  </label>
                  {formData.forSale && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600 mb-1">Price ($)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="forExchange"
                  checked={formData.forExchange}
                  onChange={() => handleCheckboxChange('forExchange')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="forExchange" className="text-sm font-medium text-gray-700">
                  Available for Exchange
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
            >
              {isSubmitting ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
