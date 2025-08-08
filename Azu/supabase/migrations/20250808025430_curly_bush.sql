-- Book Exchange Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS book_exchange;
USE book_exchange;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar VARCHAR(255),
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Books table
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    condition ENUM('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR') NOT NULL,
    price DECIMAL(10, 2),
    description TEXT,
    seller_id BIGINT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    published_year INT,
    language VARCHAR(50) DEFAULT 'English',
    page_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    for_sale BOOLEAN DEFAULT TRUE,
    for_exchange BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_seller (seller_id),
    INDEX idx_genre (genre),
    INDEX idx_available (is_available),
    INDEX idx_for_sale (for_sale),
    INDEX idx_for_exchange (for_exchange),
    INDEX idx_created_at (created_at)
);

-- Book images table
CREATE TABLE book_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_book_id (book_id)
);

-- Reviews table
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book_review (user_id, book_id),
    INDEX idx_book_reviews (book_id),
    INDEX idx_user_reviews (user_id),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
);

-- Exchange requests table
CREATE TABLE exchange_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    owner_id BIGINT NOT NULL,
    requested_book_id BIGINT NOT NULL,
    offered_book_id BIGINT NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (offered_book_id) REFERENCES books(id) ON DELETE CASCADE,
    INDEX idx_requester (requester_id),
    INDEX idx_owner (owner_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Wishlist items table
CREATE TABLE wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book_wishlist (user_id, book_id),
    INDEX idx_user_wishlist (user_id),
    INDEX idx_added_at (added_at)
);

-- Insert sample admin user
INSERT INTO users (username, email, password, is_admin) VALUES 
('admin', 'admin@bookexchange.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Insert sample regular user
INSERT INTO users (username, email, password, is_admin) VALUES 
('johndoe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', FALSE);

-- Insert sample books
INSERT INTO books (title, author, isbn, genre, condition, price, description, seller_id, published_year, page_count, for_sale, for_exchange) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Classic Literature', 'GOOD', 12.99, 'A classic American novel about the Jazz Age.', 2, 1925, 180, TRUE, TRUE),
('To Kill a Mockingbird', 'Harper Lee', '9780060935467', 'Classic Literature', 'LIKE_NEW', 14.50, 'A gripping tale of racial injustice and childhood innocence.', 1, 1960, 281, TRUE, FALSE),
('1984', 'George Orwell', '9780451524935', 'Science Fiction', 'GOOD', 11.25, 'A dystopian social science fiction novel.', 2, 1949, 328, FALSE, TRUE);

-- Insert sample book images
INSERT INTO book_images (book_id, image_url) VALUES
(1, 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'),
(2, 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'),
(3, 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg');
