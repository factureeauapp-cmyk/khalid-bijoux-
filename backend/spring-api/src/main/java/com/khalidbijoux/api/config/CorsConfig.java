package com.khalidbijoux.api.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableConfigurationProperties(CorsProperties.class)
public class CorsConfig {

    private final CorsProperties corsProperties;

    public CorsConfig(CorsProperties corsProperties) {
        this.corsProperties = corsProperties;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origines autorisées, pilotées par application.yml / variable d'env
        configuration.setAllowedOrigins(corsProperties.getAllowedOrigins());

        // Méthodes HTTP autorisées, OPTIONS inclus explicitement
        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        // Tous les headers de requête autorisés (Authorization, Content-Type, etc.)
        configuration.setAllowedHeaders(List.of("*"));

        // Headers que le frontend peut lire dans la réponse
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type"));

        // Nécessaire si tu envoies des cookies / credentials depuis le frontend
        configuration.setAllowCredentials(true);

        // Cache du résultat du preflight côté navigateur (en secondes)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}