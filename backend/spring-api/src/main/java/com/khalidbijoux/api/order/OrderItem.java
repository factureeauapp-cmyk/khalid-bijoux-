package com.khalidbijoux.api.order;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private String productId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Transient
    private String productName;

    @Transient
    private String productImage;

    /**
     * Attributs sélectionnés par le client
     *
     * Exemple :
     * Taille  -> 8
     * Couleur -> Or
     * Pierre  -> Diamant
     */
    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    @JoinColumn(name = "order_item_id")
    private List<OrderItemAttribute> selectedAttributes =
            new ArrayList<>();
}