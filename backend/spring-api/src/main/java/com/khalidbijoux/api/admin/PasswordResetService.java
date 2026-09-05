package com.khalidbijoux.api.admin;

import com.khalidbijoux.api.mail.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int OTP_TTL_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;

    private final PasswordResetOtpRepository otpRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.admin.email}")
    private String adminEmail;

    // ============================================================
    // REQUEST RESET
    // ============================================================

    @Transactional
    public void requestReset() {

        OffsetDateTime now = OffsetDateTime.now();

        // Vérifier que l'administrateur existe
        boolean adminExists =
                adminRepository.findByEmail(adminEmail).isPresent();

        if (!adminExists) {
            /*
             * Ne jamais exposer l'email configuré,
             * l'ID ou les détails de la base de données.
             */
            throw new IllegalArgumentException(
                    "Une erreur est survenue."
            );
        }

        // Invalider les anciens OTP
        var existingOtps =
                otpRepository.findByEmailAndUsedAtIsNullAndInvalidatedAtIsNull(
                        adminEmail
                );

        existingOtps.forEach(otp ->
                otp.setInvalidatedAt(now)
        );

        // Génération OTP
        String code = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        PasswordResetOtp passwordResetOtp =
                PasswordResetOtp.builder()
                        .email(adminEmail)
                        .otpHash(passwordEncoder.encode(code))
                        .expiresAt(
                                now.plusMinutes(OTP_TTL_MINUTES)
                        )
                        .attempts(0)
                        .build();

        otpRepository.save(passwordResetOtp);

        // Ne JAMAIS logger le code OTP
        mailService.sendPasswordResetCode(
                adminEmail,
                code,
                OTP_TTL_MINUTES
        );
    }

    // ============================================================
    // VERIFY OTP
    // ============================================================

    @Transactional
    public void verify(VerifyOtpRequest request) {

        PasswordResetOtp otp = activeOtp();

        validateCode(
                otp,
                request.otp()
        );

        otp.setVerifiedAt(
                OffsetDateTime.now()
        );
    }

    // ============================================================
    // CHANGE PASSWORD
    // ============================================================

    @Transactional
    public void changePassword(ChangePasswordRequest request) {

        // Vérification confirmation
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new IllegalArgumentException(
                    "Les mots de passe ne correspondent pas."
            );
        }

        // Récupération OTP
        PasswordResetOtp otp = activeOtp();

        // Vérifier que l'OTP a été vérifié
        if (otp.getVerifiedAt() == null) {
            throw new IllegalArgumentException(
                    "La vérification est requise."
            );
        }

        // Vérifier à nouveau le code
        validateCode(
                otp,
                request.otp()
        );

        // Recherche administrateur
        var adminOptional =
                adminRepository.findByEmail(adminEmail);

        if (adminOptional.isEmpty()) {
            throw new IllegalArgumentException(
                    "Une erreur est survenue."
            );
        }

        Admin admin = adminOptional.get();

        // Mise à jour du mot de passe
        admin.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        otp.setUsedAt(
                OffsetDateTime.now()
        );

        adminRepository.save(admin);
    }

    // ============================================================
    // ACTIVE OTP
    // ============================================================

    private PasswordResetOtp activeOtp() {

        var otpOptional =
                otpRepository
                        .findFirstByEmailAndUsedAtIsNullAndInvalidatedAtIsNullOrderByIdDesc(
                                adminEmail
                        );

        PasswordResetOtp otp =
                otpOptional.orElseThrow(() ->
                        new IllegalArgumentException(
                                "Une demande de réinitialisation est requise."
                        )
                );

        OffsetDateTime now = OffsetDateTime.now();

        // ========================================================
        // EXPIRATION
        // ========================================================

        if (otp.getExpiresAt().isBefore(now)) {

            otp.setInvalidatedAt(now);

            throw new IllegalArgumentException(
                    "Le code a expiré."
            );
        }

        // ========================================================
        // MAX ATTEMPTS
        // ========================================================

        if (otp.getAttempts() >= MAX_ATTEMPTS) {

            otp.setInvalidatedAt(now);

            throw new IllegalArgumentException(
                    "Trop de tentatives. Veuillez recommencer."
            );
        }

        return otp;
    }

    // ============================================================
    // VALIDATE CODE
    // ============================================================

    private void validateCode(
            PasswordResetOtp otp,
            String code
    ) {

        boolean matches =
                passwordEncoder.matches(
                        code,
                        otp.getOtpHash()
                );

        if (!matches) {

            otp.setAttempts(
                    otp.getAttempts() + 1
            );

            if (otp.getAttempts() >= MAX_ATTEMPTS) {

                otp.setInvalidatedAt(
                        OffsetDateTime.now()
                );
            }

            throw new IllegalArgumentException(
                    "Code de vérification invalide."
            );
        }
    }
}