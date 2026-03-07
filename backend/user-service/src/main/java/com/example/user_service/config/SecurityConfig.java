package com.example.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // Disable CSRF for simplicity (enable in production)
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll()  // Allow access to /auth endpoints
                .anyRequest().authenticated()  // Require auth for others
            );
        return http.build();
    }
}
