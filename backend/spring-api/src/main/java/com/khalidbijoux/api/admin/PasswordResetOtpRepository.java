package com.khalidbijoux.api.admin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    List<PasswordResetOtp> findByEmailAndUsedAtIsNullAndInvalidatedAtIsNull(String email);
    Optional<PasswordResetOtp> findFirstByEmailAndUsedAtIsNullAndInvalidatedAtIsNullOrderByIdDesc(String email);
}
