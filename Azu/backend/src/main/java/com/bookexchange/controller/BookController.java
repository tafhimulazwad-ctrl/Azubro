package com.bookexchange.controller;

import com.bookexchange.entity.Book;
import com.bookexchange.entity.User;
import com.bookexchange.repository.BookRepository;
import com.bookexchange.repository.UserRepository;
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
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findByIsAvailableTrueOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Optional<Book> book = bookRepository.findById(id);
        return book.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String q) {
        return bookRepository.findBySearchTerm(q);
    }

    @GetMapping("/genre/{genre}")
    public List<Book> getBooksByGenre(@PathVariable String genre) {
        return bookRepository.findByGenreAndIsAvailableTrue(genre);
    }

    @GetMapping("/for-sale")
    public List<Book> getBooksForSale() {
        return bookRepository.findByForSaleTrueAndIsAvailableTrue();
    }

    @GetMapping("/for-exchange")
    public List<Book> getBooksForExchange() {
        return bookRepository.findByForExchangeTrueAndIsAvailableTrue();
    }

    @PostMapping
    public ResponseEntity<?> createBook(@Valid @RequestBody Book book, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<User> user = userRepository.findById(userPrincipal.getId());
        
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        book.setSeller(user.get());
        Book savedBook = bookRepository.save(book);
        return ResponseEntity.ok(savedBook);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @Valid @RequestBody Book bookDetails, 
                                       Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<Book> bookOptional = bookRepository.findById(id);
        
        if (bookOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Book book = bookOptional.get();
        
        // Check if user owns the book or is admin
        if (!book.getSeller().getId().equals(userPrincipal.getId()) && 
            !userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("Access denied");
        }

        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setIsbn(bookDetails.getIsbn());
        book.setGenre(bookDetails.getGenre());
        book.setCondition(bookDetails.getCondition());
        book.setPrice(bookDetails.getPrice());
        book.setDescription(bookDetails.getDescription());
        book.setImages(bookDetails.getImages());
        book.setPublishedYear(bookDetails.getPublishedYear());
        book.setLanguage(bookDetails.getLanguage());
        book.setPageCount(bookDetails.getPageCount());
        book.setForSale(bookDetails.getForSale());
        book.setForExchange(bookDetails.getForExchange());
        book.setIsAvailable(bookDetails.getIsAvailable());

        Book updatedBook = bookRepository.save(book);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<Book> bookOptional = bookRepository.findById(id);
        
        if (bookOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Book book = bookOptional.get();
        
        // Check if user owns the book or is admin
        if (!book.getSeller().getId().equals(userPrincipal.getId()) && 
            !userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("Access denied");
        }

        bookRepository.delete(book);
        return ResponseEntity.ok().build();
    }
}
