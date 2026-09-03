
export interface Category {
  id: string
  nameFr: string
  nameAr: string
}

export interface Product {
  id: string
  nameFr: string
  nameAr: string
  categoryId: string
  category?: Category
  price: number
  originalPrice?: number
  tag?: string
  descriptionFr: string
  descriptionAr: string
  image: string
  images?: ProductImage[]
  quantity?: number
  /** Optional, backwards-compatible configurable product options. */
  attributes?: ProductAttribute[]
}

/** A named characteristic of a product (e.g. "Taille", "Couleur"). */
export interface ProductAttribute {
  id?: string
  name: string
  nameAr?: string
  values: ProductAttributeValue[]
}

/** One selectable value for an attribute, with stable id and bilingual labels. */
export interface ProductAttributeValue {
  id?: string
  value: string
  valueAr?: string
}

export interface ProductImage {
  id?: number
  imageUrl: string
  displayOrder?: number
}

// ============================================================================
// PANIER — sélection d'attributs
// ============================================================================

/**
 * Sélection "brute" faite par l'utilisateur sur la page produit.
 * Clé = ProductAttribute.id (ou .name si pas d'id)
 * Valeur = ProductAttributeValue.id (ou .value si pas d'id)
 */
export type SelectedAttributes = Record<string, string>

/**
 * Attribut sélectionné tel que stocké dans le panier / envoyé au backend.
 * Auto-suffisant : ne dépend plus de product.attributes pour être affiché,
 * donc reste correct même si le produit est modifié/supprimé plus tard.
 */
export interface SelectedCartAttribute {
  attributeId?: string
  attributeName: string
  attributeNameAr?: string
  valueId?: string
  selectedValue: string
  selectedValueAr?: string
}

/**
 * Item du panier. `variantKey` identifie de façon unique
 * un produit + une configuration d'attributs donnée.
 */
export interface CartItem extends Product {
  quantity: number
  selectedAttributes: SelectedCartAttribute[]
  variantKey: string
}

// ⚠️ Type mis à jour pour correspondre exactement à la réponse du back-end
// Spring Boot (GET /orders), et non plus à l'ancien mock Next.js local.

export interface OrderCustomer {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface CustomerOrderItem {
  id: number
  productId: string
  quantity: number
  selectedSize?: string | null
  price: number
  productName: string | null
  productImage: string | null
}

// Adapte cette liste aux valeurs réelles exposées par ton enum Spring Boot
// (OrderStatus). "PENDING" est confirmé par ton exemple ; complète le reste
// selon ce que ton back-end accepte réellement en PATCH /orders/:orderNumber.
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"

export interface CustomerOrder {
  id: number
  orderNumber: string
  status: OrderStatus
  customer: OrderCustomer
  shippingAddress: ShippingAddress
  paymentMethod: string
  items: CustomerOrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  createdAt: string
  updatedAt: string | null
}