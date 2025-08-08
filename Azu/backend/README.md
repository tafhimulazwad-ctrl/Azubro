# Book Exchange Backend API

A Spring Boot REST API for the Book Exchange application with MySQL database.

## Features

- User authentication with JWT tokens
- Book management (CRUD operations)
- User reviews and ratings
- Wishlist functionality
- Book exchange system
- Admin panel capabilities
- MySQL database with proper indexing

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup Instructions

### 1. Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE book_exchange;
```

2. Update database credentials in `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/book_exchange
    username: your_username
    password: your_password
```

3. Run the schema script:
```bash
mysql -u your_username -p book_exchange < database/schema.sql
```

### 2. Application Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `GET /api/books/search?q={query}` - Search books
- `GET /api/books/genre/{genre}` - Get books by genre
- `GET /api/books/for-sale` - Get books for sale
- `GET /api/books/for-exchange` - Get books for exchange
- `POST /api/books` - Create new book (authenticated)
- `PUT /api/books/{id}` - Update book (owner/admin only)
- `DELETE /api/books/{id}` - Delete book (owner/admin only)

### Reviews
- `GET /api/reviews/book/{bookId}` - Get reviews for a book
- `GET /api/reviews/user/{userId}` - Get reviews by user
- `POST /api/reviews` - Create review (authenticated)

### Wishlist
- `GET /api/wishlist` - Get user's wishlist (authenticated)
- `POST /api/wishlist/{bookId}` - Add book to wishlist (authenticated)
- `DELETE /api/wishlist/{bookId}` - Remove book from wishlist (authenticated)

### Exchange Requests
- `GET /api/exchanges/sent` - Get sent exchange requests (authenticated)
- `GET /api/exchanges/received` - Get received exchange requests (authenticated)
- `POST /api/exchanges` - Create exchange request (authenticated)
- `PUT /api/exchanges/{id}/status` - Update exchange request status (authenticated)

## Database Schema

The application uses the following main tables:
- `users` - User accounts and profiles
- `books` - Book listings with details
- `book_images` - Book image URLs
- `reviews` - User reviews and ratings
- `exchange_requests` - Book exchange requests
- `wishlist_items` - User wishlist items

## Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control (USER/ADMIN)
- CORS configuration for frontend integration

## Default Users

The schema includes two default users:
- **Admin**: admin@bookexchange.com / password
- **User**: john@example.com / password

## Development

To run in development mode with auto-reload:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Production Deployment

1. Build the JAR file:
```bash
mvn clean package
```

2. Run the JAR:
```bash
java -jar target/book-exchange-api-0.0.1-SNAPSHOT.jar
```

## Environment Variables

For production, set these environment variables:
- `DB_URL` - Database URL
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRATION` - JWT expiration time in milliseconds
