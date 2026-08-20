package com.khalidbijoux.api.admin;

import com.khalidbijoux.api.mail.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Map;

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

    @Transactional
    public void requestReset() {
        OffsetDateTime now = OffsetDateTime.now();
        otpRepository.findByEmailAndUsedAtIsNullAndInvalidatedAtIsNull(adminEmail)
                .forEach(otp -> otp.setInvalidatedAt(now));

        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        otpRepository.save(PasswordResetOtp.builder()
                .email(adminEmail)
                .otpHash(passwordEncoder.encode(code))
                .expiresAt(now.plusMinutes(OTP_TTL_MINUTES))
                .attempts(0)
                .build());
        mailService.sendPasswordResetCode(adminEmail, code, OTP_TTL_MINUTES);
    }

    @Transactional
    public void verify(VerifyOtpRequest request) {
        PasswordResetOtp otp = activeOtp();
        validateCode(otp, request.otp());
        otp.setVerifiedAt(OffsetDateTime.now());
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("Password confirmation does not match");
        }
        PasswordResetOtp otp = activeOtp();
        if (otp.getVerifiedAt() == null) {
            throw new IllegalArgumentException("OTP must be verified before changing the password");
        }
        validateCode(otp, request.otp());
        Admin admin = adminRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalArgumentException("Configured administrator was not found"));
        admin.setPassword(passwordEncoder.encode(request.newPassword()));
        otp.setUsedAt(OffsetDateTime.now());
        adminRepository.save(admin);
    }

    private PasswordResetOtp activeOtp() {
        PasswordResetOtp otp = otpRepository.findFirstByEmailAndUsedAtIsNullAndInvalidatedAtIsNullOrderByIdDesc(adminEmail)
                .orElseThrow(() -> new IllegalArgumentException("No active password reset request"));
        if (otp.getExpiresAt().isBefore(OffsetDateTime.now())) {
            otp.setInvalidatedAt(OffsetDateTime.now());
            throw new IllegalArgumentException("OTP has expired");
        }
        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            otp.setInvalidatedAt(OffsetDateTime.now());
            throw new IllegalArgumentException("Too many invalid OTP attempts");
        }
        return otp;
    }

    private void validateCode(PasswordResetOtp otp, String code) {
        if (!passwordEncoder.matches(code, otp.getOtpHash())) {
            otp.setAttempts(otp.getAttempts() + 1);
            if (otp.getAttempts() >= MAX_ATTEMPTS) otp.setInvalidatedAt(OffsetDateTime.now());
            throw new IllegalArgumentException("Invalid OTP");
        }
    }
}
