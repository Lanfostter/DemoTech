package com.example.demotech.base.config;

import com.example.demotech.base.domain.Role;
import com.example.demotech.base.domain.User;
import com.example.demotech.base.helper.Enum;
import com.example.demotech.base.repository.RoleRepository;
import com.example.demotech.base.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Array;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName((Enum.ROLE.ADMIN)).isEmpty()) {
                roleRepository.save(new Role(Enum.ROLE.ADMIN, Enum.ROLE.ADMIN));
            }
            if (roleRepository.findByName(Enum.ROLE.USER).isEmpty()) {
                roleRepository.save(new Role(Enum.ROLE.USER, Enum.ROLE.USER));
            }
            System.out.println("✅ Roles initialized successfully.");
        };
    }
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,RoleRepository roleRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                Role role = roleRepository.findByName(Enum.ROLE.ADMIN).orElse(new Role());
                Set<Role> roles = new HashSet<>();
                roles.add(role);
                User admin = new User("Đức Anh", "fostter2@gmail.com","$2a$12$o5jWCo6LrP7eWXJHQ5dtqesiD4jUmPMPRBzi7LzODV7OUDBZBODxS","admin",roles);
                userRepository.save(admin);
            }

            if (userRepository.findByUsername("user").isEmpty()) {
                Role role = roleRepository.findByName(Enum.ROLE.USER).orElse(new Role());
                Set<Role> roles = new HashSet<>();
                roles.add(role);
                User user = new User("Đức Anh", "fostter2@gmail.com","$2a$12$o5jWCo6LrP7eWXJHQ5dtqesiD4jUmPMPRBzi7LzODV7OUDBZBODxS","user",roles);
                userRepository.save(user);
            }

            System.out.println("✅ Database initialized with default users.");
        };
    }
}
