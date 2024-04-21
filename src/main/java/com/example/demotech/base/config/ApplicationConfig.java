package com.example.demotech.base.config;

import com.example.demotech.base.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
public class ApplicationConfig {
    @Autowired
    private UserRepository userRepository;
//    @Bean
//    public UserDetailsService userDetailsService(){
//        return username -> (UserDetails) userRepository.findByUsername(username).orElseThrow(()->new UsernameNotFoundException("Username not found"));
//    }
}
