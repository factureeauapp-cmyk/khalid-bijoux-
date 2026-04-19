package com.khalidbijoux.api.order;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
        @NotBlank(message = "{address.street.required}")
        String street,

        @NotBlank(message = "{address.city.required}")
        String city,

        @NotBlank(message = "{address.state.required}")
        String state,

        @NotBlank(message = "{address.postalCode.required}")
        String postalCode,

        @NotBlank(message = "{address.country.required}")
        String country
) {
}