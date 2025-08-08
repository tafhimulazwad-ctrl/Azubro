package com.bookexchange.repository;

import com.bookexchange.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findBySellerIdAndIsAvailableTrue(Long sellerId);
    List<Book> findByIsAvailableTrueOrderByCreatedAtDesc();
    List<Book> findByGenreAndIsAvailableTrue(String genre);
    List<Book> findByForSaleTrueAndIsAvailableTrue();
    List<Book> findByForExchangeTrueAndIsAvailableTrue();
    
    @Query("SELECT b FROM Book b WHERE b.isAvailable = true AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Book> findBySearchTerm(@Param("searchTerm") String searchTerm);
}
