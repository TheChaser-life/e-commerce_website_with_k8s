package com.example.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserServiceApplication {

    public static void main(String[] args) {
        // Touch comment to trigger the user service build pipeline.
        SpringApplication.run(UserServiceApplication.class, args);
    }

}
