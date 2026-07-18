import { apiCall } from "./client";

export interface OrderItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderRequest {
  customer: CustomerInfo;
  shippingAddress: Address;
  paymentMethod: string;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  status: string;
  orderNumber: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export const orderService = {
  async createOrder(
    request: CreateOrderRequest
  ): Promise<{ data?: CreateOrderResponse; error?: any }> {
    return apiCall<CreateOrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  async getOrder(orderNumber: string): Promise<{ data?: any; error?: any }> {
    return apiCall(`/api/orders/${orderNumber}`);
  },
};
