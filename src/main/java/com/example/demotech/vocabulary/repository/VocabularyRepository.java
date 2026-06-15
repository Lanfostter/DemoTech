package com.example.demotech.vocabulary.repository;

import com.example.demotech.vocabulary.domain.Vocabulary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VocabularyRepository extends JpaRepository<Vocabulary, UUID> {
    List<Vocabulary> findByUserIdAndVoidedFalse(UUID userId);
    Optional<Vocabulary> findByUserIdAndWordIgnoreCase(UUID userId, String word);
    long countByUserIdAndVoidedFalse(UUID userId);

    default long countByUserId(UUID userId) {
        return countByUserIdAndVoidedFalse(userId);
    }
}
