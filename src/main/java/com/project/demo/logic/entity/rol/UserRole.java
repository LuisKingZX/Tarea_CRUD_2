package com.project.demo.logic.entity.rol;

import com.project.demo.logic.entity.user.User;
import com.project.demo.logic.entity.user.UserRepository;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Order(3)
public class UserRole implements ApplicationListener<ContextRefreshedEvent> {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserRole(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        this.createUser();
    }

    private void createUser() {
        User userNormal = new User();
        userNormal.setName("User");
        userNormal.setEmail("user.@gmail.com");
        userNormal.setPassword("user123");

        Optional<Role> optionalRole = roleRepository.findByName(RoleEnum.USER); //Aquí indica el tipo de Usuario
        Optional<User> optionalUser = userRepository.findByEmail(userNormal.getEmail());

        if (optionalRole.isEmpty() || optionalUser.isPresent()) {
            return;
        }

        var user = new User();
        user.setName(userNormal.getName());
        user.setEmail(userNormal.getEmail());
        user.setPassword(passwordEncoder.encode(userNormal.getPassword()));
        user.setRole(optionalRole.get());

        userRepository.save(user);
    }
}