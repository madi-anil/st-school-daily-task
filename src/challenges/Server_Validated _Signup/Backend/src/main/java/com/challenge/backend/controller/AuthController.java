package com.challenge.backend.controller;

import com.challenge.backend.dto.RegisterRequest;
import com.challenge.backend.dto.RegisterResponse;
import com.challenge.backend.exception.DuplicateEmailException;
import com.challenge.backend.model.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (usersByEmail.containsKey(normalizedEmail)) {
            throw new DuplicateEmailException("Email already registered");
        }

        Long id = idGenerator.getAndIncrement();
        String hashedPassword = passwordEncoder.encode(request.password());

        User user = new User(
                id,
                request.name().trim(),
                request.email().trim(),
                hashedPassword,
                request.age()
        );
        usersByEmail.put(normalizedEmail, user);

        RegisterResponse response = new RegisterResponse(user.getId(), user.getName(), user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/users")
    public List<RegisterResponse> getUsers() {
        return usersByEmail.values().stream()
                .map(u -> new RegisterResponse(u.getId(), u.getName(), u.getEmail()))
                .toList();
    }
}