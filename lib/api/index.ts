// Export all API services
export { apiCall, API_BASE_URL } from "./client";
export { authService } from "./auth";
export { catalogService } from "./products";
export { orderService } from "./orders";

// Export types
export type { LoginResponse, AuthError } from "./auth";
export type { Product } from "./products";
export type {
  OrderItem,
  CustomerInfo,
  Address,
  CreateOrderRequest,
  CreateOrderResponse,
} from "./orders";
