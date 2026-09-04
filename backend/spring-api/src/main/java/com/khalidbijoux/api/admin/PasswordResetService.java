package com.khalidbijoux.api.admin;

import com.khalidbijoux.api.mail.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
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

        log.info("==============================================");
        log.info("PASSWORD RESET - REQUEST");
        log.info("Configured administrator email: [{}]", adminEmail);
        log.info("==============================================");

        OffsetDateTime now = OffsetDateTime.now();

        // Vérifier que l'administrateur existe AVANT de créer l'OTP
        boolean adminExists = adminRepository.findByEmail(adminEmail).isPresent();

        log.info(
                "Administrator lookup for email [{}] -> exists: {}",
                adminEmail,
                adminExists
        );

        if (!adminExists) {
            log.error(
                    "CONFIGURATION ERROR: No administrator found for configured email [{}]",
                    adminEmail
            );

            throw new IllegalArgumentException(
                    "Configured administrator was not found"
            );
        }

        // Invalider les anciens OTP
        var existingOtps =
                otpRepository.findByEmailAndUsedAtIsNullAndInvalidatedAtIsNull(
                        adminEmail
                );

        log.info(
                "Active OTP records found for [{}]: {}",
                adminEmail,
                existingOtps.size()
        );

        existingOtps.forEach(otp -> {
            otp.setInvalidatedAt(now);

            log.debug(
                    "Previous OTP invalidated. OTP ID: {}",
                    otp.getId()
            );
        });

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

        PasswordResetOtp savedOtp =
                otpRepository.save(passwordResetOtp);

        log.info(
                "New password reset OTP created. OTP ID: {}, email: [{}], expiresAt: {}",
                savedOtp.getId(),
                adminEmail,
                savedOtp.getExpiresAt()
        );

        // Ne jamais logger le code OTP
        mailService.sendPasswordResetCode(
                adminEmail,
                code,
                OTP_TTL_MINUTES
        );

        log.info(
                "Password reset email sent successfully to [{}]",
                adminEmail
        );
    }

    // ============================================================
    // VERIFY OTP
    // ============================================================

    @Transactional
    public void verify(VerifyOtpRequest request) {

        log.info("==============================================");
        log.info("PASSWORD RESET - VERIFY OTP");
        log.info("Configured administrator email: [{}]", adminEmail);
        log.info("==============================================");

        PasswordResetOtp otp = activeOtp();

        log.info(
                "Active OTP found. ID: {}, email: [{}], attempts: {}, verifiedAt: {}, expiresAt: {}",
                otp.getId(),
                otp.getEmail(),
                otp.getAttempts(),
                otp.getVerifiedAt(),
                otp.getExpiresAt()
        );

        validateCode(otp, request.otp());

        otp.setVerifiedAt(OffsetDateTime.now());

        log.info(
                "OTP verified successfully. OTP ID: {}",
                otp.getId()
        );
    }

    // ============================================================
    // CHANGE PASSWORD
    // ============================================================

    @Transactional
    public void changePassword(ChangePasswordRequest request) {

        log.info("==============================================");
        log.info("PASSWORD RESET - CHANGE PASSWORD");
        log.info("Configured administrator email: [{}]", adminEmail);
        log.info("==============================================");

        // Vérification confirmation
        if (!request.newPassword().equals(request.confirmPassword())) {

            log.warn(
                    "Password confirmation does not match for administrator [{}]",
                    adminEmail
            );

            throw new IllegalArgumentException(
                    "Password confirmation does not match"
            );
        }

        log.info("Password confirmation: OK");

        // Récupération OTP
        PasswordResetOtp otp = activeOtp();

        log.info(
                "OTP loaded for password change. ID: {}, email: [{}], verifiedAt: {}, attempts: {}, expiresAt: {}",
                otp.getId(),
                otp.getEmail(),
                otp.getVerifiedAt(),
                otp.getAttempts(),
                otp.getExpiresAt()
        );

        // Vérifier que OTP a déjà été vérifié
        if (otp.getVerifiedAt() == null) {

            log.warn(
                    "Password change rejected: OTP has not been verified. OTP ID: {}",
                    otp.getId()
            );

            throw new IllegalArgumentException(
                    "OTP must be verified before changing the password"
            );
        }

        log.info("OTP verification state: VALID");

        // Vérifier à nouveau le code
        validateCode(
                otp,
                request.otp()
        );

        log.info("OTP code validation: OK");

        // ========================================================
        // RECHERCHE ADMIN
        // ========================================================

        log.info(
                "Searching administrator in database with email: [{}]",
                adminEmail
        );

        var adminOptional =
                adminRepository.findByEmail(adminEmail);

        log.info(
                "Administrator lookup result for [{}]: {}",
                adminEmail,
                adminOptional.isPresent()
        );

        if (adminOptional.isEmpty()) {

            log.error(
                    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
            );

            log.error(
                    "CONFIGURED ADMINISTRATOR NOT FOUND"
            );

            log.error(
                    "Configured email = [{}]",
                    adminEmail
            );

            log.error(
                    "Check the Admin table and verify that this exact email exists."
            );

            log.error(
                    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
            );

            throw new IllegalArgumentException(
                    "Configured administrator was not found"
            );
        }

        Admin admin = adminOptional.get();

        log.info(
                "Administrator FOUND. Database ID: {}, email: [{}]",
                admin.getId(),
                admin.getEmail()
        );

        // ========================================================
        // UPDATE PASSWORD
        // ========================================================

        admin.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        otp.setUsedAt(
                OffsetDateTime.now()
        );

        adminRepository.save(admin);

        log.info(
                "Administrator password successfully updated. Admin ID: {}",
                admin.getId()
        );

        log.info(
                "Password reset completed successfully for [{}]",
                adminEmail
        );
    }

    // ============================================================
    // ACTIVE OTP
    // ============================================================

    private PasswordResetOtp activeOtp() {

        log.info(
                "Searching active OTP for email [{}]",
                adminEmail
        );

        var otpOptional =
                otpRepository
                        .findFirstByEmailAndUsedAtIsNullAndInvalidatedAtIsNullOrderByIdDesc(
                                adminEmail
                        );

        log.info(
                "Active OTP lookup result: {}",
                otpOptional.isPresent()
        );

        PasswordResetOtp otp =
                otpOptional.orElseThrow(() -> {

                    log.warn(
                            "No active password reset request found for [{}]",
                            adminEmail
                    );

                    return new IllegalArgumentException(
                            "No active password reset request"
                    );
                });

        OffsetDateTime now = OffsetDateTime.now();

        // ========================================================
        // EXPIRATION
        // ========================================================

        if (otp.getExpiresAt().isBefore(now)) {

            log.warn(
                    "OTP expired. OTP ID: {}, expiresAt: {}, currentTime: {}",
                    otp.getId(),
                    otp.getExpiresAt(),
                    now
            );

            otp.setInvalidatedAt(now);

            throw new IllegalArgumentException(
                    "OTP has expired"
            );
        }

        // ========================================================
        // MAX ATTEMPTS
        // ========================================================

        if (otp.getAttempts() >= MAX_ATTEMPTS) {

            log.warn(
                    "OTP maximum attempts reached. OTP ID: {}, attempts: {}",
                    otp.getId(),
                    otp.getAttempts()
            );

            otp.setInvalidatedAt(now);

            throw new IllegalArgumentException(
                    "Too many invalid OTP attempts"
            );
        }

        log.info(
                "Active OTP is valid. ID: {}, attempts: {}, expiresAt: {}",
                otp.getId(),
                otp.getAttempts(),
                otp.getExpiresAt()
        );

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

        log.info(
                "OTP hash validation result: {}",
                matches
        );

        if (!matches) {

            otp.setAttempts(
                    otp.getAttempts() + 1
            );

            log.warn(
                    "Invalid OTP. OTP ID: {}, attempts: {}",
                    otp.getId(),
                    otp.getAttempts()
            );

            if (otp.getAttempts() >= MAX_ATTEMPTS) {

                otp.setInvalidatedAt(
                        OffsetDateTime.now()
                );

                log.warn(
                        "OTP invalidated because maximum attempts was reached. OTP ID: {}",
                        otp.getId()
                );
            }

            throw new IllegalArgumentException(
                    "Invalid OTP"
            );
        }
    }
}