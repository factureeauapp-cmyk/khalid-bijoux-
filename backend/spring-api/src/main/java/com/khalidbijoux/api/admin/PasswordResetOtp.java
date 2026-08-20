package com.khalidbijoux.api.admin;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "password_reset_otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetOtp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    /** A BCrypt hash is persisted; the six-digit code is never stored in clear text. */
    @Column(nullable = false)
    private String otpHash;

    @Column(nullable = false)
    private OffsetDateTime expiresAt;

    @Column(nullable = false)
    private int attempts;

    private OffsetDateTime verifiedAt;
    private OffsetDateTime usedAt;
    private OffsetDateTime invalidatedAt;
}
