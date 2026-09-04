package com.khalidbijoux.api.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MailService {

    @Value("${brevo.api-key}")
    private String brevoApiKey;

    @Value("${brevo.from-email}")
    private String fromEmail;

    @Value("${brevo.from-name:Khalid Bijoux}")
    private String fromName;

    @Value("${app.admin.email}")
    private String adminEmail;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.brevo.com")
            .build();

    /**
     * Envoi d'un email via l'API Brevo.
     */
    private void sendEmail(
            String to,
            String subject,
            String textContent
    ) {
        Map<String, Object> body = Map.of(
                "sender", Map.of(
                        "name", fromName,
                        "email", fromEmail
                ),
                "to", List.of(
                        Map.of(
                                "email", to
                        )
                ),
                "subject", subject,
                "textContent", textContent
        );

        restClient.post()
                .uri("/v3/smtp/email")
                .header("api-key", brevoApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    /**
     * Envoie le code OTP de réinitialisation du mot de passe administrateur.
     */
    public void sendPasswordResetCode(
            String to,
            String code,
            int expirationMinutes
    ) {
        String text = """
            Bonjour,

            Votre code de vérification Khalid Bijoux est :

            %s

            Ce code expire dans %d minutes.

            Si vous n'êtes pas à l'origine de cette demande,
            veuillez ignorer cet email.

            Khalid Bijoux
            """.formatted(code, expirationMinutes);

        sendEmail(
                to,
                "Code de vérification - Khalid Bijoux",
                text
        );
    }

    /**
     * Envoie un message provenant du formulaire de contact.
     */
    public void sendContactMessage(
            String to,
            String name,
            String email,
            String subject,
            String message
    ) {
        String text = """
            Nouveau message depuis le formulaire de contact Khalid Bijoux.

            Nom :
            %s

            Email :
            %s

            Sujet :
            %s

            Message :
            %s
            """.formatted(
                name,
                email,
                subject,
                message
        );

        sendEmail(
                to,
                "Nouveau message contact - " + subject,
                text
        );
    }

}