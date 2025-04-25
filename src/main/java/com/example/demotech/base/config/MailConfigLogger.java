package com.example.demotech.base.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class MailConfigLogger {

    @Autowired
    private JavaMailSenderImpl mailSender;

    @PostConstruct
    public void logMailConfig() {
        System.out.println("========= CẤU HÌNH MAIL ĐÃ LOAD =========");
        System.out.println("Host: " + mailSender.getHost());
        System.out.println("Port: " + mailSender.getPort());
        System.out.println("Username: " + mailSender.getUsername());
        System.out.println("Password: " + mailSender.getPassword());
        System.out.println("Protocol: " + mailSender.getProtocol());
        System.out.println("Default Encoding: " + mailSender.getDefaultEncoding());

        Properties props = mailSender.getJavaMailProperties();
        props.forEach((key, value) -> System.out.println(key + ": " + value));
        System.out.println("=========================================");
    }
}
