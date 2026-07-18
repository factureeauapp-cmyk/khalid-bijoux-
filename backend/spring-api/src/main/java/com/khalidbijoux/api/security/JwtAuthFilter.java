package com.khalidbijoux.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    // TODO adapte à ton implémentation (injection de ton JwtService / UserDetailsService)
    // private final JwtService jwtService;
    // private final UserDetailsService userDetailsService;
    //
    // public JwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService) {
    //     this.jwtService = jwtService;
    //     this.userDetailsService = userDetailsService;
    // }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // ------------------------------------------------------------------
        // ÉTAPE CRITIQUE : ne jamais appliquer la logique JWT à une requête
        // OPTIONS (preflight CORS). Le navigateur n'envoie JAMAIS de header
        // Authorization sur un preflight -> toute tentative de validation de
        // token ici provoquerait un 401/403 avant même que Spring Security
        // n'applique les règles permitAll() ou les headers CORS.
        // ------------------------------------------------------------------
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        // Pas de header Authorization -> on laisse passer, Spring Security
        // (authorizeHttpRequests) décidera si la route nécessite une auth.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);

            // TODO adapte à ton implémentation réelle
            // final String username = jwtService.extractUsername(jwt);
            //
            // if (username != null
            //         && SecurityContextHolder.getContext().getAuthentication() == null) {
            //
            //     UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            //
            //     if (jwtService.isTokenValid(jwt, userDetails)) {
            //         UsernamePasswordAuthenticationToken authToken =
            //                 new UsernamePasswordAuthenticationToken(
            //                         userDetails, null, userDetails.getAuthorities()
            //                 );
            //         authToken.setDetails(
            //                 new WebAuthenticationDetailsSource().buildDetails(request)
            //         );
            //         SecurityContextHolder.getContext().setAuthentication(authToken);
            //     }
            // }

        } catch (Exception ex) {
            // Important : ne JAMAIS répondre directement ici (res.sendError, etc.)
            // On laisse la requête continuer sans authentification. C'est
            // authorizeHttpRequests / l'AuthenticationEntryPoint qui décidera
            // du code retour final (401) si la route l'exige vraiment.
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}