
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "BUYER" | "SELLER";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Buyer extends User {
  shippingAddress: string;
  billingAddress: string;
  phoneNumber: string;
}

export interface Seller extends User {
  companyName: string;
  companyDescription: string;
  contactPhone: string;
  businessAddress: string;
  taxId: string;
}


export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
  seller: Seller;
  status: "ACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED";
  createdAt: string;
  updatedAt: string;
}


export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  productName: string;
  productDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  buyer: Buyer;
  items: OrderItem[];
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  placedAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  shippingAddress: string;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
}
