//package com.khalidbijoux.api.mail;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class MailService {
//    private final JavaMailSender mailSender;
//
//    @Value("${SMTP_USER:}")
//    private String senderEmail;
//
//    public void sendPasswordResetCode(String recipient, String code, int expirationMinutes) {
//        send(recipient, "Khalid Bijoux — code de changement de mot de passe",
//                "Votre code de vérification est : " + code + "\n\nIl expire dans " + expirationMinutes + " minutes.\nNe partagez ce code avec personne.");
//    }
//
//    public void sendContactMessage(String adminEmail, String name, String email, String subject, String message) {
//        SimpleMailMessage mail = message(adminEmail, "[Contact] " + subject,
//                "Nom : " + name + "\nEmail : " + email + "\nSujet : " + subject + "\n\nMessage :\n" + message);
//        mail.setReplyTo(email);
//        mailSender.send(mail);
//    }
//
//    private void send(String recipient, String subject, String body) {
//        mailSender.send(message(recipient, subject, body));
//    }
//
//    private SimpleMailMessage message(String recipient, String subject, String body) {
//        SimpleMailMessage mail = new SimpleMailMessage();
//        mail.setTo(recipient);
//        mail.setSubject(subject);
//        mail.setText(body);
//        if (senderEmail != null && !senderEmail.isBlank()) mail.setFrom(senderEmail);
//        return mail;
//    }
//}






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

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.brevo.com")
            .build();

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

                Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

                Khalid Bijoux
                """.formatted(code, expirationMinutes);

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
                "subject", "Code de vérification - Khalid Bijoux",
                "textContent", text
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
}
