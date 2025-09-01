package com.example.demotech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class DemotechApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemotechApplication.class, args);
    }

}
