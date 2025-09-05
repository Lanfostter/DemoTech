package com.example.demotech.base.config;

import com.example.demotech.base.domain.Role;
import com.example.demotech.base.domain.User;
import com.example.demotech.base.helper.Enum;
import com.example.demotech.base.repository.RoleRepository;
import com.example.demotech.base.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;

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
    CommandLineRunner initDatabase(UserRepository userRepository, RoleRepository roleRepository, RedisTemplate<String, Object> redisTemplate) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                Role role = roleRepository.findByName(Enum.ROLE.ADMIN).orElse(new Role());
                Set<Role> roles = new HashSet<>();
                roles.add(role);
                User admin = new User("Đức Anh", "fostter2@gmail.com", "$2a$12$o5jWCo6LrP7eWXJHQ5dtqesiD4jUmPMPRBzi7LzODV7OUDBZBODxS", "admin", roles);
                userRepository.save(admin);
            }
            for (int i = 0; i <= 100; i++) {
                String username = "user" + i;
                if (userRepository.findByUsername(username).isEmpty()) {
                    Role role = roleRepository.findByName(Enum.ROLE.USER).orElse(new Role());
                    Set<Role> roles = new HashSet<>();
                    roles.add(role);
                    User user = new User("Đức Anh", "fostter2@gmail.com", "$2a$12$o5jWCo6LrP7eWXJHQ5dtqesiD4jUmPMPRBzi7LzODV7OUDBZBODxS", username, roles);
                    userRepository.save(user);
                }
            }
            Set<String> keys = redisTemplate.keys("users*"); // tất cả key bắt đầu bằng "users"
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
            System.out.println("🗑️ Cleared all 'users' caches in Redis.");
            System.out.println("✅ Database initialized with default users.");
        };
    }
}
