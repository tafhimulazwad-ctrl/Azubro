import React, { useState } from 'react';
import { RefreshCw, Send, Check, X, Clock, ArrowRight } from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';

const Exchange: React.FC = () => {
  const { books, exchangeRequests, createExchangeRequest, updateExchangeRequest } = useBooks();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'available' | 'my-requests' | 'received'>('available');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [message, setMessage] = useState('');

  const availableBooks = books.filter(book => 
    book.forExchange && book.sellerId !== user?.id && book.isAvailable
  );

  const myBooks = books.filter(book => 
    book.sellerId === user?.id && book.forExchange && book.isAvailable
  );

  const myRequests = exchangeRequests.filter(req => req.requesterId === user?.id);
  const receivedRequests = exchangeRequests.filter(req => req.ownerId === user?.id);

  const handleCreateRequest = (requestedBookId: string, ownerId: string) => {
    if (!selectedBook || !message.trim()) {
      alert('Please select a book to offer and add a message');
      return;
    }

    const requestedBook = books.find(b => b.id === requestedBookId);
    const offeredBook = books.find(b => b.id === selectedBook);

    if (!requestedBook || !offeredBook) return;

    createExchangeRequest({
      requesterId: user!.id,
      requesterName: user!.username,
      ownerId,
      ownerName: requestedBook.sellerName,
      requestedBookId,
      requestedBookTitle: requestedBook.title,
      offeredBookId: selectedBook,
      offeredBookTitle: offeredBook.title,
      status: 'pending',
      message
    });

    setSelectedBook('');
    setMessage('');
    alert('Exchange request sent!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'accepted': return <Check size={16} />;
      case 'rejected': return <X size={16} />;
      case 'completed': return <Check size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Exchange</h1>
        <p className="text-gray-600">Trade books with other users</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'available', label: 'Available for Exchange', count: availableBooks.length },
              { id: 'my-requests', label: 'My Requests', count: myRequests.length },
              { id: 'received', label: 'Received Requests', count: receivedRequests.length }
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

      {/* Available Books Tab */}
      {selectedTab === 'available' && (
        <div>
          {availableBooks.length === 0 ? (
            <div className="text-center py-16">
              <RefreshCw size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Books Available for Exchange</h3>
              <p className="text-gray-600">Check back later for new exchange opportunities.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {availableBooks.map(book => (
                <div key={book.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex gap-6">
                    <img
                      src={book.images[0]}
                      alt={book.title}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{book.title}</h3>
                      <p className="text-gray-600 mb-2">by {book.author}</p>
                      <p className="text-sm text-gray-500 mb-3">Offered by {book.sellerName}</p>
                      <p className="text-gray-700 mb-4">{book.description}</p>
                      
                      <div className="flex items-end gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select your book to offer:
                          </label>
                          <select
                            value={selectedBook}
                            onChange={(e) => setSelectedBook(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Choose a book...</option>
                            {myBooks.map(myBook => (
                              <option key={myBook.id} value={myBook.id}>
                                {myBook.title} by {myBook.author}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message (optional):
                          </label>
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Add a message to your exchange request..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        
                        <button
                          onClick={() => handleCreateRequest(book.id, book.sellerId)}
                          disabled={!selectedBook}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <Send size={16} className="mr-2" />
                          Request Exchange
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Requests Tab */}
      {selectedTab === 'my-requests' && (
        <div>
          {myRequests.length === 0 ? (
            <div className="text-center py-16">
              <Send size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Exchange Requests</h3>
              <p className="text-gray-600">You haven't sent any exchange requests yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map(request => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Sent on {request.createdAt}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">You offer</div>
                      <div className="font-semibold">{request.offeredBookTitle}</div>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">You want</div>
                      <div className="font-semibold">{request.requestedBookTitle}</div>
                    </div>
                    <div className="text-center ml-auto">
                      <div className="text-sm text-gray-600 mb-1">Owner</div>
                      <div className="font-semibold">{request.ownerName}</div>
                    </div>
                  </div>
                  
                  {request.message && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-1">Your message:</div>
                      <p className="text-gray-800">{request.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Received Requests Tab */}
      {selectedTab === 'received' && (
        <div>
          {receivedRequests.length === 0 ? (
            <div className="text-center py-16">
              <RefreshCw size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Exchange Requests</h3>
              <p className="text-gray-600">You haven't received any exchange requests yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {receivedRequests.map(request => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Received on {request.createdAt}
                      </span>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateExchangeRequest(request.id, 'accepted')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Check size={16} className="mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => updateExchangeRequest(request.id, 'rejected')}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <X size={16} className="mr-1" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">{request.requesterName} offers</div>
                      <div className="font-semibold">{request.offeredBookTitle}</div>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">For your</div>
                      <div className="font-semibold">{request.requestedBookTitle}</div>
                    </div>
                  </div>
                  
                  {request.message && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600 mb-1">Message from {request.requesterName}:</div>
                      <p className="text-gray-800">{request.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Exchange;
