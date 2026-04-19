package com.khalidbijoux.api.order;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerInfo {

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
}
