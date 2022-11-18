import { UUID } from '../shared';

export interface Product {
  id: UUID,
  name: string,
  description: string,
  SKU: string,
  price: number,
  image_url: string,
  category_id: UUID,
  inventory_id: UUID,
  discount_id: UUID,
  created_at: Date,
  updated_at: Date,
  deleted_at?: Date,
}

export interface ProductCategory {
  id: UUID,
  name: string,
  description: string,
  created_at: Date,
  updated_at: Date,
  deleted_at?: Date,
}

export interface ProductInventory {
  id: UUID,
  quantity: number,
  variant: string,
  created_at: Date,
  updated_at: Date,
  deleted_at?: Date,
}

export interface ProductDiscount {
  id: UUID,
  name: string,
  description: string,
  discount_percentage: number,
  created_at: Date,
  modified_at: Date,
  deleted_at?: Date,
}

export interface Order {
  id: UUID,
  user_id: UUID,
  payment_id: UUID,
  total_price: number,
  created_at: Date,
  updated_at: Date,
}

export interface OrderItem {
  id: UUID,
  order_id: UUID,
  product_id: UUID,
  quantity: number,
  created_at: Date,
  updated_at: Date,
}

export interface PaymentDetails {
  id: UUID,
  order_id: UUID,
  payment_method: string,
  payment_status: string,
  created_at: Date,
  updated_at: Date,
}

export interface Cart {
  id: UUID,
  user_id: UUID,
  total_price: number,
  created_at: Date,
  updated_at: Date,
  expires_at: Date,
}

export interface CartItem {
  id: UUID,
  cart_id: UUID,
  product_id: UUID,
  quantity: number,
  created_at: Date,
  updated_at: Date,
}
