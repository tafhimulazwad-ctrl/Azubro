-- BookExchange Database Schema
-- Created for production use with Spring Boot JPA compatibility

-- Create database with UTF8MB4 character set for full Unicode support
CREATE DATABASE IF NOT EXISTS book_exchange CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE book_exchange;

-- Users table (matches User.java entity)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    avatar VARCHAR(255),
    joined_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Validation constraints matching entity annotations
    CONSTRAINT chk_username_length CHECK (LENGTH(username) >= 3 AND LENGTH(username) <= 50),
    CONSTRAINT chk_password_length CHECK (LENGTH(password) >= 6)
) ENGINE=InnoDB;

-- Books table (matches Book.java entity)
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    condition ENUM('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    seller_id BIGINT NOT NULL,
    is_available BOOLEAN DEFAULT true,
    published_year INT,
    language VARCHAR(50),
    page_count INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    for_sale BOOLEAN DEFAULT true,
    for_exchange BOOLEAN DEFAULT false,
    
    -- Indexes for performance optimization
    INDEX idx_isbn (isbn),
    INDEX idx_seller (seller_id),
    
    -- Foreign key constraint matching @ManyToOne relationship
    CONSTRAINT fk_books_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Book images table (for @ElementCollection in Book.java)
CREATE TABLE book_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    
    -- Index for performance
    INDEX idx_book (book_id),
    
    -- Foreign key constraint matching collection relationship
    CONSTRAINT fk_book_images_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Reviews table (matches Review.java entity)
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_user (user_id),
    INDEX idx_book (book_id),
    
    -- Foreign key constraints matching @ManyToOne relationships
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Wishlist items table (matches WishlistItem.java entity)
CREATE TABLE wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_user (user_id),
    INDEX idx_book (book_id),
    
    -- Unique constraint to prevent duplicate wishlist entries
    UNIQUE KEY unique_wishlist_item (user_id, book_id),
    
    -- Foreign key constraints matching @ManyToOne relationships
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert sample data for testing (matches your demo credentials)
-- Users (passwords are BCrypt hashed: user123 and admin123)
INSERT INTO users (username, email, password, is_admin, avatar) VALUES
('john_doe', 'john@example.com', '$2a$10$NQ9A0aZJvXqJZqJZqJZqJZuOqJZqJZqJZqJZqJZqJZqJZqJZqJZqJ', false, 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
('jane_smith', 'jane@example.com', '$2a$10$NQ9A0aZJvXqJZqJZqJZqJZuOqJZqJZqJZqJZqJZqJZqJZqJZqJZqJ', false, 'https://images.pexels.com/photos/157661/young-woman-standing-in-front-of-window-157661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
('admin_user', 'admin@bookapp.com', '$2a$10$NQ9A0aZJvXqJZqJZqJZqJZuOqJZqJZqJZqJZqJZqJZqJZqJZqJZqJ', true, 'https://images.pexels.com/photos/157661/young-woman-standing-in-front-of-window-157661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');

-- Books
INSERT INTO books (title, author, isbn, genre, condition, price, description, seller_id, published_year, language, page_count) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', 'GOOD', 12.99, 'A story of decadence and excess in the Jazz Age', 1, 1925, 'English', 180),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Fiction', 'LIKE_NEW', 9.99, 'A story of racial injustice in the American South', 1, 1960, 'English', 281),
('1984', 'George Orwell', '9780451524935', 'Dystopian', 'NEW', 14.99, 'A dystopian novel about totalitarianism and surveillance', 2, 1949, 'English', 328),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Romance', 'FAIR', 7.99, 'A classic romance novel exploring themes of class and marriage', 2, 1813, 'English', 432);

-- Book Images (using Pexels stock photos)
INSERT INTO book_images (book_id, image_url) VALUES
(1, 'https://images.pexels.com/photos/462633/pexels-photo-462633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(2, 'https://images.pexels.com/photos/1533264/pexels-photo-1533264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(3, 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(4, 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');

-- Reviews
INSERT INTO reviews (user_id, book_id, rating, comment) VALUES
(2, 1, 5, 'A timeless classic that captures the essence of the American Dream'),
(1, 2, 4, 'Powerful storytelling that still resonates today'),
(2, 3, 5, 'Scarily prescient and still relevant in today''s world'),
(1, 4, 3, 'A bit dated but still enjoyable romance');

-- Wishlist Items
INSERT INTO wishlist_items (user_id, book_id) VALUES
(1, 3),
(2, 1),
(1, 4);
