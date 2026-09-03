package com.khalidbijoux.api.order;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_item_attributes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemAttribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attribute_name", nullable = false)
    private String attributeName;

    @Column(name = "attribute_name_ar")
    private String attributeNameAr;

    @Column(name = "selected_value", nullable = false)
    private String selectedValue;

    @Column(name = "selected_value_ar")
    private String selectedValueAr;
}