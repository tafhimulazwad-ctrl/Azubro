const API_BASE_URL = 'http://localhost:8080/api';

// API Response types
interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  },

  signup: async (userData: { username: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    
    return response.json();
  },
};

// Books API
export const booksAPI = {
  getAllBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return response.json();
  },

  getBookById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch book');
    }
    return response.json();
  },

  searchBooks: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search books');
    }
    return response.json();
  },

  getBooksByGenre: async (genre: string) => {
    const response = await fetch(`${API_BASE_URL}/books/genre/${encodeURIComponent(genre)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch books by genre');
    }
    return response.json();
  },

  getBooksForSale: async () => {
    const response = await fetch(`${API_BASE_URL}/books/for-sale`);
    if (!response.ok) {
      throw new Error('Failed to fetch books for sale');
    }
    return response.json();
  },

  getBooksForExchange: async () => {
    const response = await fetch(`${API_BASE_URL}/books/for-exchange`);
    if (!response.ok) {
      throw new Error('Failed to fetch books for exchange');
    }
    return response.json();
  },

  createBook: async (bookData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create book');
    }
    
    return response.json();
  },

  updateBook: async (id: string, bookData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
    
    return response.json();
  },

  deleteBook: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  },
};

// Reviews API
export const reviewsAPI = {
  getBookReviews: async (bookId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/book/${bookId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  },

  getUserReviews: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user reviews');
    }
    return response.json();
  },

  createReview: async (reviewData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create review');
    }
    
    return response.json();
  },
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch wishlist');
    }
    return response.json();
  },

  addToWishlist: async (bookId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/${bookId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to wishlist');
    }
    
    return response.json();
  },

  removeFromWishlist: async (bookId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove from wishlist');
    }
  },
};

// Exchange API
export const exchangeAPI = {
  getSentRequests: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/exchanges/sent`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch sent requests');
    }
    return response.json();
  },

  getReceivedRequests: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/exchanges/received`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch received requests');
    }
    return response.json();
  },

  createExchangeRequest: async (requestData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/exchanges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create exchange request');
    }
    
    return response.json();
  },

  updateExchangeStatus: async (id: string, status: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/exchanges/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update exchange status');
    }
    
    return response.json();
  },
};