package com.khalidbijoux.api.admin;

import com.khalidbijoux.api.security.AuthenticationException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AdminRepository adminRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AdminRepository adminRepository,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.email())
                .orElseThrow(() -> new AuthenticationException(
                        "INVALID_CREDENTIALS",
                        "Invalid email or password"
                ));

        if (!passwordEncoder.matches(request.password(), admin.getPassword())) {
            throw new AuthenticationException(
                    "INVALID_CREDENTIALS",
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(admin.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", admin.getEmail(),
                "expiresIn", 28800000
        ));
    }
}