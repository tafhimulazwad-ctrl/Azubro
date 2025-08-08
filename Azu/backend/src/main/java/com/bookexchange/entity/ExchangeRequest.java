package com.bookexchange.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "exchange_requests")
public class ExchangeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_book_id")
    private Book requestedBook;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offered_book_id")
    private Book offeredBook;

    @Enumerated(EnumType.STRING)
    private ExchangeStatus status = ExchangeStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String message;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public ExchangeRequest() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public Book getRequestedBook() { return requestedBook; }
    public void setRequestedBook(Book requestedBook) { this.requestedBook = requestedBook; }

    public Book getOfferedBook() { return offeredBook; }
    public void setOfferedBook(Book offeredBook) { this.offeredBook = offeredBook; }

    public ExchangeStatus getStatus() { return status; }
    public void setStatus(ExchangeStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public enum ExchangeStatus {
        PENDING, ACCEPTED, REJECTED, COMPLETED
    }
}
