import React from 'react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect?.(book)}
    >
      <div className="aspect-w-3 aspect-h-4 mb-4">
        <img
          src={book.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'}
          alt={book.title}
          className="w-full h-48 object-cover rounded"
        />
      </div>
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
      <p className="text-gray-600 mb-2">{book.author}</p>
      <p className="text-sm text-gray-500 mb-2">{book.genre}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-green-600">
          {book.condition}
        </span>
        <span className="text-sm text-gray-500">
          {book.location}
        </span>
      </div>
    </div>
  );
};