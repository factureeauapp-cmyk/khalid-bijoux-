package com.khalidbijoux.api.contact;

import jakarta.validation.Valid;
import java.util.UUID;
import com.khalidbijoux.api.mail.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {
    private final MailService mailService;

    @Value("${app.admin.email}")
    private String adminEmail;

    @PostMapping
    public ContactResponse create(@Valid @RequestBody ContactRequest request) {
        mailService.sendContactMessage(adminEmail, request.name(), request.email(), request.subject(), request.message());
        return new ContactResponse("RECEIVED", "CNT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    }
}
