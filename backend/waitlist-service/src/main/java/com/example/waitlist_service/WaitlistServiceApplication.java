package com.example.waitlist_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class WaitlistServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(WaitlistServiceApplication.class, args);
    }
}