package com.khalidbijoux.api.contact;

import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contact-requests")
public class ContactController {

    @PostMapping
    public ContactResponse create(@Valid @RequestBody ContactRequest request) {
        return new ContactResponse("RECEIVED", "CNT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    }
}
