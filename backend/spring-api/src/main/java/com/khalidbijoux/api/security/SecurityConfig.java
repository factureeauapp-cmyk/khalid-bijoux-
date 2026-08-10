package com.khalidbijoux.api.security;

 // voir remarque ci-dessous
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Active le support CORS de Spring Security : insère un CorsFilter
                // TOUT en amont de la chaîne, avant JwtAuthFilter.
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                // API stateless -> pas de session, pas de CSRF nécessaire
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((req, res, ex) -> {
                            res.setStatus(401);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"error\": \"" + ex.getMessage() + "\"}");
                        })
                )

                .authorizeHttpRequests(auth -> auth
                        // 1) TOUJOURS autoriser le preflight CORS en premier,
                        //    quelle que soit la route ciblée derrière.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2) Routes publiques métier
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/me", "/api/auth/logout").permitAll()
                        .requestMatchers("/api/products", "/api/products/**").permitAll()
                        .requestMatchers("/api/categories", "/api/categories/**").permitAll()
                        .requestMatchers("/api/chat/**", "/api/contact/**", "/api/orders/**", "/api/test/**", "/uploads/**").permitAll()

                        .requestMatchers("/api/admin/**").permitAll()
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}