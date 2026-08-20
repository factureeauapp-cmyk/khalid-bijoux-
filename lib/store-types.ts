
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
  category?: Category;
  price: number
  originalPrice?: number
  tag?: string
  descriptionFr: string
  descriptionAr: string
  image: string
  images?: ProductImage[]
  quantity?: number
}

export interface ProductImage {
  id?: number
  imageUrl: string
  displayOrder?: number
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
