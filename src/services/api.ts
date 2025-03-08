import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { Buyer, Order, Product, Seller } from "../types/models";
import {
  ApiError,
  BuyerDto,
  BuyerUpdateDto,
  OrderDto,
  ProductDto,
  ProductUpdateDto,
  SellerDto,
  SellerUpdateDto,
} from "../types/api";

class ApiService {
  //this will hold the axios instance
  private api: AxiosInstance;
  //this will hold the base URL for the API
  private baseURL: string;

  constructor() {
    //initialize the base URL from the environment variable or default to localhost
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085/api";
    //creates the axios instance with the base URL and headers
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    //response interceptor for error handling, tries to extract the error message from the response
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const errorResponse = error.response?.data;
        return Promise.reject(errorResponse || error);
      }
    );
  }

  // BUYER ENDPOINTS
  public async getAllBuyers(): Promise<Buyer[]> {
    const response: AxiosResponse<Buyer[]> = await this.api.get("/buyers");
    return response.data;
  }

  public async getBuyerById(id: number): Promise<Buyer> {
    const response: AxiosResponse<Buyer> = await this.api.get(`/buyers/${id}`);
    return response.data;
  }

  public async createBuyer(buyerDto: BuyerDto): Promise<Buyer> {
    const response: AxiosResponse<Buyer> = await this.api.post(
      "/buyers",
      buyerDto
    );
    return response.data;
  }

  public async updateBuyer(
    id: number,
    buyerUpdateDto: BuyerUpdateDto
  ): Promise<Buyer> {
    const response: AxiosResponse<Buyer> = await this.api.put(
      `/buyers/${id}`,
      buyerUpdateDto
    );
    return response.data;
  }

  public async deleteBuyer(id: number): Promise<void> {
    await this.api.delete(`/buyers/${id}`);
  }

  // SELLER ENDPOINTS
  public async getAllSellers(): Promise<Seller[]> {
    const response: AxiosResponse<Seller[]> = await this.api.get("/sellers");
    return response.data;
  }

  public async getSellerById(id: number): Promise<Seller> {
    const response: AxiosResponse<Seller> = await this.api.get(
      `/sellers/${id}`
    );
    return response.data;
  }

  public async createSeller(sellerDto: SellerDto): Promise<Seller> {
    const response: AxiosResponse<Seller> = await this.api.post(
      "/sellers",
      sellerDto
    );
    return response.data;
  }

  public async updateSeller(
    id: number,
    sellerUpdateDto: SellerUpdateDto
  ): Promise<Seller> {
    const response: AxiosResponse<Seller> = await this.api.put(
      `/sellers/${id}`,
      sellerUpdateDto
    );
    return response.data;
  }

  public async deleteSeller(id: number): Promise<void> {
    await this.api.delete(`/sellers/${id}`);
  }

  // PRODUCT ENDPOINTS
  public async getAllProducts(): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.api.get("/products");
    return response.data;
  }

  public async getProductById(id: number): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(
      `/products/${id}`
    );
    return response.data;
  }

  public async getProductsBySeller(sellerId: number): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.api.get(
      `/products/seller/${sellerId}`
    );
    return response.data;
  }

  public async getProductsByCategory(category: string): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.api.get(
      `/products/category/${category}`
    );
    return response.data;
  }

  public async createProduct(productDto: ProductDto): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.post(
      "/products",
      productDto
    );
    return response.data;
  }

  public async updateProduct(
    id: number,
    productUpdateDto: ProductUpdateDto
  ): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.put(
      `/products/${id}`,
      productUpdateDto
    );
    return response.data;
  }

  public async deleteProduct(id: number): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  // ORDER ENDPOINTS
  public async getAllOrders(): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.api.get("/orders");
    return response.data;
  }

  public async getOrderById(id: number): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  public async getOrderByOrderNumber(orderNumber: string): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.get(
      `/orders/number/${orderNumber}`
    );
    return response.data;
  }

  public async getOrdersByBuyer(buyerId: number): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.api.get(
      `/orders/buyer/${buyerId}`
    );
    return response.data;
  }

  public async createOrder(orderDto: OrderDto): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.post(
      "/orders",
      orderDto
    );
    return response.data;
  }

  /*
  the URL is /orders/${id}/status where ${id} is the order ID
  the second parameter is null because this request doesn't need a request body
  the third parameter is an options object with a params property = status
  */
  public async updateOrderStatus(
    id: number,
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  ): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.put(
      `/orders/${id}/status`,
      null,
      {
        params: { status },
      }
    );
    return response.data;
  }

  public async updateTrackingInfo(
    id: number,
    trackingNumber: string
  ): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.put(
      `/orders/${id}/tracking`,
      null,
      {
        params: { trackingNumber },
      }
    );
    return response.data;
  }

  public async cancelOrder(id: number): Promise<void> {
    await this.api.delete(`/orders/${id}/cancel`);
  }
}

//create a singleton instance, ensuring that only one instance is created
//and that it is used throughout the application
const apiService = new ApiService();
export default apiService;
