package com.bookexchange.controller;

import com.bookexchange.entity.WishlistItem;
import com.bookexchange.entity.User;
import com.bookexchange.entity.Book;
import com.bookexchange.repository.WishlistItemRepository;
import com.bookexchange.repository.UserRepository;
import com.bookexchange.repository.BookRepository;
import com.bookexchange.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/wishlist")
public class WishlistController {
    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping
    public List<WishlistItem> getWishlist(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return wishlistItemRepository.findByUserIdOrderByAddedAtDesc(userPrincipal.getId());
    }

    @PostMapping("/{bookId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long bookId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<User> user = userRepository.findById(userPrincipal.getId());
        Optional<Book> book = bookRepository.findById(bookId);
        
        if (user.isEmpty() || book.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Book not found");
        }

        // Check if already in wishlist
        Optional<WishlistItem> existing = wishlistItemRepository.findByUserIdAndBookId(userPrincipal.getId(), bookId);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("Book already in wishlist");
        }

        WishlistItem wishlistItem = new WishlistItem(user.get(), book.get());
        WishlistItem savedItem = wishlistItemRepository.save(wishlistItem);
        return ResponseEntity.ok(savedItem);
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long bookId, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        wishlistItemRepository.deleteByUserIdAndBookId(userPrincipal.getId(), bookId);
        return ResponseEntity.ok().build();
    }
}