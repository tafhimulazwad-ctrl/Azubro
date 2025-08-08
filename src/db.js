import { createClient } from 'libsql';

// Create SQLite database in memory (WebContainer compatible)
const db = createClient({
  url: 'file:book_exchange.db'
});

// Initialize database schema
export async function initDB() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT false,
      avatar TEXT,
      joined_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT NOT NULL,
      genre TEXT NOT NULL,
      condition TEXT NOT NULL CHECK(condition IN ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR')),
      price REAL NOT NULL,
      description TEXT,
      seller_id INTEGER NOT NULL,
      is_available BOOLEAN DEFAULT true,
      published_year INTEGER,
      language TEXT,
      page_count INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      for_sale BOOLEAN DEFAULT true,
      for_exchange BOOLEAN DEFAULT false,
      FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS book_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, book_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE CASCADE
    );
  `);
  
  // Insert sample data
  await db.executeMany([
    `INSERT OR IGNORE INTO users (username, email, password, is_admin, avatar) VALUES 
    ('john_doe', 'john@example.com', '$2a$10$NQ9A0aZJvXqJZqJZqJZqJZuOqJZqJZqJZqJZqJZqJZqJZqJZqJZqJ', false, 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
    ('jane_smith', 'jane@example.com', '$2a$10$NQ9A0aZJvXqJZqJZqJZqJZuOqJZqJZqJZqJZqJZqJZqJZqJZqJZqJ', false, 'https://images.pexels.com/photos/157661/young-woman-standing-in-front-of-window-157661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
    ('admin_user', 'admin@bookapp.com', '$2a$10$NQ9A0aZJvXqJZqJZqJZqJZuOqJZqJZqJZqJZqJZqJZqJZqJZqJZqJ', true, 'https://images.pexels.com/photos/157661/young-woman-standing-in-front-of-window-157661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
    
    `INSERT OR IGNORE INTO books (title, author, isbn, genre, condition, price, description, seller_id, published_year, language, page_count) VALUES
    ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', 'GOOD', 12.99, 'A story of decadence and excess in the Jazz Age', 1, 1925, 'English', 180),
    ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Fiction', 'LIKE_NEW', 9.99, 'A story of racial injustice in the American South', 1, 1960, 'English', 281),
    ('1984', 'George Orwell', '9780451524935', 'Dystopian', 'NEW', 14.99, 'A dystopian novel about totalitarianism and surveillance', 2, 1949, 'English', 328),
    ('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Romance', 'FAIR', 7.99, 'A classic romance novel exploring themes of class and marriage', 2, 1813, 'English', 432)`,
    
    `INSERT OR IGNORE INTO book_images (book_id, image_url) VALUES
    (1, 'https://images.pexels.com/photos/462633/pexels-photo-462633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
    (2, 'https://images.pexels.com/photos/1533264/pexels-photo-1533264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
    (3, 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
    (4, 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
    
    `INSERT OR IGNORE INTO reviews (user_id, book_id, rating, comment) VALUES
    (2, 1, 5, 'A timeless classic that captures the essence of the American Dream'),
    (1, 2, 4, 'Powerful storytelling that still resonates today'),
    (2, 3, 5, 'Scarily prescient and still relevant in today''s world'),
    (1, 4, 3, 'A bit dated but still enjoyable romance')`,
    
    `INSERT OR IGNORE INTO wishlist_items (user_id, book_id) VALUES
    (1, 3),
    (2, 1),
    (1, 4)`
  ]);
  
  return db;
}

export default db;
