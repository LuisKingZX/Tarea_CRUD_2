package com.example.crud.config;

import com.example.crud.model.Role;
import com.example.crud.model.User;
import com.example.crud.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));

                Role adminRole = new Role();
                adminRole.setName(Role.ROLE_ADMIN); // Constante que defines en Role

                admin.setRoles(Collections.singleton(adminRole));
                userRepository.save(admin);
            }

            if (userRepository.findByUsername("user").isEmpty()) {
                User user = new User();
                user.setUsername("user");
                user.setPassword(passwordEncoder.encode("user123"));

                Role userRole = new Role();
                userRole.setName(Role.ROLE_USER); // Constante que defines en Role

                user.setRoles(Collections.singleton(userRole));
                userRepository.save(user);
            }
        };
    }
}

