package com.example.demotech.base.repository;

import com.example.demotech.base.domain.Role;
import com.example.demotech.base.helper.Enum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(Enum.ROLE role);
}
