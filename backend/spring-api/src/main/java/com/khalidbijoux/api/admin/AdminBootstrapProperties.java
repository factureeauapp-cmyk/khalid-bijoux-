package com.khalidbijoux.api.admin;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.admin.bootstrap")
public class AdminBootstrapProperties {
    /** Enabled by default for a fresh installation; set false after first deployment if preferred. */
    private boolean enabled = true;
    private String email = "admin@khalid-bijoux.com";
    private String password = "admin123";
}
