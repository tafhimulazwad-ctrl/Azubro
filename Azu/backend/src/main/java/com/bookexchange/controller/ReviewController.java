package com.bookexchange.controller;

import com.bookexchange.entity.Review;
import com.bookexchange.entity.User;
import com.bookexchange.entity.Book;
import com.bookexchange.repository.ReviewRepository;
import com.bookexchange.repository.UserRepository;
import com.bookexchange.repository.BookRepository;
import com.bookexchange.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/reviews")
public class ReviewController {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/book/{bookId}")
    public List<Review> getBookReviews(@PathVariable Long bookId) {
        return reviewRepository.findByBookIdOrderByCreatedAtDesc(bookId);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getUserReviews(@PathVariable Long userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @PostMapping
    public ResponseEntity<?> createReview(@Valid @RequestBody Review review, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<User> user = userRepository.findById(userPrincipal.getId());
        Optional<Book> book = bookRepository.findById(review.getBook().getId());
        
        if (user.isEmpty() || book.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Book not found");
        }

        review.setUser(user.get());
        review.setBook(book.get());
        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.ok(savedReview);
    }
}