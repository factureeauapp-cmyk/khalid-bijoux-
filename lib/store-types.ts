export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled"

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
  price: number
  originalPrice?: number
  tag?: string
  descriptionFr: string
  descriptionAr: string
  image: string
}

export interface CustomerOrderItem {
  productId: string
  productNameFr: string
  productNameAr: string
  quantity: number
  unitPrice: number
  image: string
}

export interface CustomerOrder {
  id: string
  orderNumber: string
  customerName: string
  address: string
  phone: string
  notes?: string
  items: CustomerOrderItem[]
  total: number
  paymentMethod: "cash_on_delivery"
  status: OrderStatus
  createdAt: string
}
