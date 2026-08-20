package com.khalidbijoux.api.admin;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Creates the first administrator only for an empty Admin table. */
@Slf4j
@Configuration
@EnableConfigurationProperties(AdminBootstrapProperties.class)
public class AdminBootstrapConfig {

    @Bean
    ApplicationRunner createDefaultAdminIfMissing(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            AdminBootstrapProperties properties
    ) {
        return arguments -> {
            if (!properties.isEnabled() || adminRepository.count() > 0) {
                return;
            }

            Admin admin = new Admin();
            admin.setEmail(properties.getEmail().trim().toLowerCase());
            admin.setPassword(passwordEncoder.encode(properties.getPassword()));
            adminRepository.save(admin);

            log.warn("Default administrator created for {}. Change its password immediately.", admin.getEmail());
        };
    }
}
