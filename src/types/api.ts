
// Two interfaces for each entity
// One for the create DTO and one for the update DTO
// The create DTO is used to create a new entity
// The update DTO is used to update an existing entity  
export interface BuyerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  shippingAddress?: string;
  billingAddress?: string;
  phoneNumber?: string;
}

export interface BuyerUpdateDto {
  firstName: string;
  lastName: string;
  shippingAddress?: string;
  billingAddress?: string;
  phoneNumber?: string;
}


export interface SellerDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  companyDescription?: string;
  contactPhone?: string;
  businessAddress?: string;
  taxId?: string;
}

export interface SellerUpdateDto {
  firstName: string;
  lastName: string;
  companyName: string;
  companyDescription?: string;
  contactPhone?: string;
  businessAddress?: string;
  taxId?: string;
}


export interface ProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
  sellerId: number;
}

export interface ProductUpdateDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}


export interface OrderItemDto {
  productId: number;
  quantity: number;
}

export interface OrderDto {
  buyerId: number;
  shippingAddress: string;
  items: OrderItemDto[];
}


export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
