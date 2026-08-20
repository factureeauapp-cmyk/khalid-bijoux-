package com.khalidbijoux.api.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;

    @Value("${SMTP_USER:}")
    private String senderEmail;

    public void sendPasswordResetCode(String recipient, String code, int expirationMinutes) {
        send(recipient, "Khalid Bijoux — code de changement de mot de passe",
                "Votre code de vérification est : " + code + "\n\nIl expire dans " + expirationMinutes + " minutes.\nNe partagez ce code avec personne.");
    }

    public void sendContactMessage(String adminEmail, String name, String email, String subject, String message) {
        SimpleMailMessage mail = message(adminEmail, "[Contact] " + subject,
                "Nom : " + name + "\nEmail : " + email + "\nSujet : " + subject + "\n\nMessage :\n" + message);
        mail.setReplyTo(email);
        mailSender.send(mail);
    }

    private void send(String recipient, String subject, String body) {
        mailSender.send(message(recipient, subject, body));
    }

    private SimpleMailMessage message(String recipient, String subject, String body) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(recipient);
        mail.setSubject(subject);
        mail.setText(body);
        if (senderEmail != null && !senderEmail.isBlank()) mail.setFrom(senderEmail);
        return mail;
    }
}
