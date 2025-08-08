import React, { useState } from 'react';
import { Settings, Book, Users, BarChart3, Trash2, Edit, Eye } from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';

const AdminPanel: React.FC = () => {
  const { books, reviews, exchangeRequests, deleteBook } = useBooks();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'books' | 'users' | 'exchanges'>('overview');

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(bookId);
    }
  };

  const totalUsers = 2; // In a real app, this would come from the user context
  const totalRevenue = books.filter(b => b.forSale).reduce((sum, b) => sum + b.price, 0);
  const pendingExchanges = exchangeRequests.filter(req => req.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Settings className="text-blue-600 mr-3" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-gray-600">Manage your BookExchange platform</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'books', label: 'Books Management', icon: Book },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'exchanges', label: 'Exchanges', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Books</p>
                  <p className="text-3xl font-bold">{books.length}</p>
                </div>
                <Book size={40} className="text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Users</p>
                  <p className="text-3xl font-bold">{totalUsers}</p>
                </div>
                <Users size={40} className="text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Total Reviews</p>
                  <p className="text-3xl font-bold">{reviews.length}</p>
                </div>
                <BarChart3 size={40} className="text-yellow-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Pending Exchanges</p>
                  <p className="text-3xl font-bold">{pendingExchanges}</p>
                </div>
                <Settings size={40} className="text-purple-200" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {books.slice(0, 5).map(book => (
                <div key={book.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <img
                      src={book.images[0]}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{book.title}</h4>
                      <p className="text-sm text-gray-500">Added by {book.sellerName}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{book.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Books Management Tab */}
      {selectedTab === 'books' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Books Management</h3>
            <p className="text-gray-600 text-sm">Manage all books in the system</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={book.images[0]}
                          alt={book.title}
                          className="w-10 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">{book.genre}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.sellerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.forSale ? `$${book.price}` : 'Exchange only'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        book.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteBook(book.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">User management features coming soon...</p>
          </div>
        </div>
      )}

      {/* Exchanges Tab */}
      {selectedTab === 'exchanges' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Exchange Management</h3>
            <p className="text-gray-600 text-sm">Monitor and manage book exchanges</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {exchangeRequests.map(request => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">
                        {request.requesterName} → {request.ownerName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {request.offeredBookTitle} for {request.requestedBookTitle}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Created: {request.createdAt}</p>
                  {request.message && (
                    <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                      "{request.message}"
                    </p>
                  )}
                </div>
              ))}
              
              {exchangeRequests.length === 0 && (
                <div className="text-center py-8">
                  <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No exchange requests yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
