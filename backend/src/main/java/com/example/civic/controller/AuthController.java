package com.example.civic.controller;

import com.example.civic.dto.AuthRequest;
import com.example.civic.dto.AuthResponse;
import com.example.civic.dto.RegisterRequest;
import com.example.civic.entity.User;
import com.example.civic.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            User user = authService.getCurrentUser();
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole(),
                    "phone", user.getPhone() != null ? user.getPhone() : ""
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }
    }
}
