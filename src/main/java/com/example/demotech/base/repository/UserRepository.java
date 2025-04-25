package com.example.demotech.base.repository;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.dto.UserInfoResponse;
import com.example.demotech.base.dto.search.UserSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    Optional<User> findByUsername(String username);
    @Query("SELECT new com.example.demotech.base.dto.UserInfoResponse(user) FROM User user")
    Page<UserInfoResponse> paging(UserSearch search, Pageable pageable);
}
