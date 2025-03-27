import axios from "axios";
import {
  BuyerDto,
  SellerDto,
  ProductDto,
  OrderDto,
  ApiError,
  BuyerUpdateDto,
  SellerUpdateDto,
  ProductUpdateDto,
} from "@/types/api";
import { Buyer, Seller, Product, Order } from "@/types/models";


const api = axios.create({
  baseURL: "http://localhost:8085/api",
  headers: {
    "Content-Type": "application/json",
  },
});

//error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse: ApiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An unknown error occurred",
      timestamp: new Date().toISOString(),
    };
    return Promise.reject(errorResponse);
  }
);

//buyer endpoints
export const buyerService = {
  getAllBuyers: () => api.get<Buyer[]>("/buyers"),
  getBuyerById: (id: number) => api.get<Buyer>(`/buyers/${id}`),
  createBuyer: (buyer: BuyerDto) => api.post<Buyer>("/buyers", buyer),
  updateBuyer: (id: number, buyer: BuyerUpdateDto) =>
    api.put<Buyer>(`/buyers/${id}`, buyer),
  deleteBuyer: (id: number) => api.delete(`/buyers/${id}`),
};

//seller endpoints
export const sellerService = {
  getAllSellers: () => api.get<Seller[]>("/sellers"),
  getSellerById: (id: number) => api.get<Seller>(`/sellers/${id}`),
  createSeller: (seller: SellerDto) => api.post<Seller>("/sellers", seller),
  updateSeller: (id: number, seller: SellerUpdateDto) =>
    api.put<Seller>(`/sellers/${id}`, seller),
  deleteSeller: (id: number) => api.delete(`/sellers/${id}`),
};

//product endpoints
export const productService = {
  getAllProducts: () => api.get<Product[]>("/products"),
  getProductById: (id: number) => api.get<Product>(`/products/${id}`),
  getProductsBySeller: (sellerId: number) =>
    api.get<Product[]>(`/products/seller/${sellerId}`),
  getProductsByCategory: (category: string) =>
    api.get<Product[]>(`/products/category/${category}`),
  createProduct: (product: ProductDto) =>
    api.post<Product>("/products", product),
  updateProduct: (id: number, product: ProductUpdateDto) =>
    api.put<Product>(`/products/${id}`, product),
  deleteProduct: (id: number) => api.delete(`/products/${id}`),
};

//order endpoints
export const orderService = {
  getAllOrders: () => api.get<Order[]>("/orders"),
  getOrderById: (id: number) => api.get<Order>(`/orders/${id}`),
  getOrderByNumber: (orderNumber: string) =>
    api.get<Order>(`/orders/number/${orderNumber}`),
  getOrdersByBuyer: (buyerId: number) =>
    api.get<Order[]>(`/orders/buyer/${buyerId}`),
  createOrder: (order: OrderDto) => api.post<Order>("/orders", order),
  updateOrderStatus: (id: number, status: string) =>
    api.put<Order>(`/orders/${id}/status?status=${status}`),
  updateTrackingInfo: (id: number, trackingNumber: string) =>
    api.put<Order>(`/orders/${id}/tracking?trackingNumber=${trackingNumber}`),
  cancelOrder: (id: number) => api.delete(`/orders/${id}/cancel`),
};

export default api;
