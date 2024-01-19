package com.example.demotech;

import com.example.demotech.base.domain.User;
import com.example.demotech.base.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class DemotechApplicationTests {
    @Autowired
    public UserRepository userRepository;
    @Test
    void contextLoads() {
        User user = new User();
        user.setName("ducanh");
        user.setUsername("admin");
        user.setEmail("fostter2@gmail.com");
        String password = new BCryptPasswordEncoder().encode("admin");
        user.setPassword(password);
        userRepository.save(user);
    }

}
