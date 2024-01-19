package com.example.demotech.base.repository;

import com.example.demotech.base.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    User findByUsername(String username);
}
