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
@RequestMapping("/api/auth")
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
        System.out.println("===== LOGIN ENDPOINT CALLED =====");

        System.out.println("Email : " + request.email());
        System.out.println("Password reçu : " + request.password());


        System.out.println("Nombre admins : " + adminRepository.count());

        adminRepository.findAll().forEach(a ->
                System.out.println("Admin => " + a.getEmail())
        );
        Admin admin = adminRepository.findByEmail(request.email())
                .orElseThrow(() -> new AuthenticationException(
                        "INVALID_CREDENTIALS",
                        "Invalid email or password"
                ));



        boolean ok = passwordEncoder.matches(request.password(), "$2a$10$Jm5nRQzPEUwv3FJW.VpNkeLKj9z3xn6g/BJ9CnNdTQEKkpQ5V3Q4K");

        System.out.println("Matches : " + ok);

        if (!passwordEncoder.matches(request.password(), admin.getPassword())) {


            throw new AuthenticationException(
                    "INVALID_CREDENTIALS",
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(request.email());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", request.email(),
                "expiresIn", 28800000
        ));
    }
}
//Suppression d'un produit
//cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

//9. Modification d'un produit
//
//Si une nouvelle image est envoyée :
//
//Supprimer l'ancienne :
//
//        cloudinary.uploader().destroy(...)