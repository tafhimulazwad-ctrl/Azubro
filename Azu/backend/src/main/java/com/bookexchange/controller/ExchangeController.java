package com.bookexchange.controller;

import com.bookexchange.entity.ExchangeRequest;
import com.bookexchange.entity.User;
import com.bookexchange.entity.Book;
import com.bookexchange.repository.ExchangeRequestRepository;
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
@RequestMapping("/exchanges")
public class ExchangeController {
    @Autowired
    private ExchangeRequestRepository exchangeRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @GetMapping("/sent")
    public List<ExchangeRequest> getSentRequests(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return exchangeRequestRepository.findByRequesterIdOrderByCreatedAtDesc(userPrincipal.getId());
    }

    @GetMapping("/received")
    public List<ExchangeRequest> getReceivedRequests(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return exchangeRequestRepository.findByOwnerIdOrderByCreatedAtDesc(userPrincipal.getId());
    }

    @PostMapping
    public ResponseEntity<?> createExchangeRequest(@Valid @RequestBody ExchangeRequest exchangeRequest, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<User> requester = userRepository.findById(userPrincipal.getId());
        Optional<User> owner = userRepository.findById(exchangeRequest.getOwner().getId());
        Optional<Book> requestedBook = bookRepository.findById(exchangeRequest.getRequestedBook().getId());
        Optional<Book> offeredBook = bookRepository.findById(exchangeRequest.getOfferedBook().getId());
        
        if (requester.isEmpty() || owner.isEmpty() || requestedBook.isEmpty() || offeredBook.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid request data");
        }

        exchangeRequest.setRequester(requester.get());
        exchangeRequest.setOwner(owner.get());
        exchangeRequest.setRequestedBook(requestedBook.get());
        exchangeRequest.setOfferedBook(offeredBook.get());
        
        ExchangeRequest savedRequest = exchangeRequestRepository.save(exchangeRequest);
        return ResponseEntity.ok(savedRequest);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateExchangeStatus(@PathVariable Long id, @RequestBody ExchangeRequest.ExchangeStatus status, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<ExchangeRequest> requestOptional = exchangeRequestRepository.findById(id);
        
        if (requestOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ExchangeRequest request = requestOptional.get();
        
        // Check if user is the owner of the requested book
        if (!request.getOwner().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403).body("Access denied");
        }

        request.setStatus(status);
        ExchangeRequest updatedRequest = exchangeRequestRepository.save(request);
        return ResponseEntity.ok(updatedRequest);
    }
}