package com.challenge.unified.signup;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/register")
public class RegisterController {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    @PostMapping
    public ResponseEntity<?> register(@RequestBody(required = false) RegisterRequest req) {
        Map<String, String> errors = new LinkedHashMap<>();

        String name = req != null && req.name() != null ? req.name().trim() : "";
        String email = req != null && req.email() != null ? req.email().trim() : "";
        String password = req != null && req.password() != null ? req.password() : "";
        Integer age = req != null ? req.age() : null;

        if (name.length() < 2) {
            errors.put("name", "Name must be at least 2 characters");
        }
        if (email.isEmpty() || !EMAIL_PATTERN.matcher(email).matches()) {
            errors.put("email", "Enter a valid email address");
        } else if (UserStore.exists(email)) {
            errors.put("email", "Email is already registered");
        }
        if (password.length() < 8) {
            errors.put("password", "Password must be at least 8 characters");
        }
        if (age == null || age < 13 || age > 120) {
            errors.put("age", "Age must be between 13 and 120");
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("errors", errors));
        }

        UserStore.save(email);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Account created for " + name));
    }
}
