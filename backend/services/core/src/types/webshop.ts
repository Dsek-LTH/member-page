// eslint-disable-next-line import/no-cycle
import { UUID } from '../shared';

export interface Product {
  id: UUID,
  name: string,
  description: string,
  SKU: string,
  price: number,
  image_url: string,
  max_per_user: number,
  category_id: UUID,
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
  discount_id?: UUID,
  product_id: UUID,
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
  student_id: UUID,
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

export interface Payment {
  id: UUID,
  payment_id: string,
  payment_method: 'SWISH',
  payment_status: 'PENDING' | 'PAID' | 'DECLINED' | 'ERROR' | 'CANCELLED',
  payment_amount: number,
  payment_currency: 'SEK',
  created_at: Date,
  updated_at: Date,
  student_id: string,
}

export interface Cart {
  id: UUID,
  student_id: UUID,
  total_price: number,
  total_quantity: number,
  created_at: Date,
  updated_at: Date,
  expires_at: Date,
}

export interface CartItem {
  id: UUID,
  cart_id: UUID,
  product_inventory_id: UUID,
  quantity: number,
  created_at: Date,
  updated_at: Date,
}

export interface UserInventory {
  id: UUID,
  student_id: UUID,
  created_at: Date,
  updated_at: Date,
  deleted_at?: Date,
}

export interface UserInventoryItem {
  id: UUID,
  student_id: UUID,
  user_inventory_id: UUID,
  product_inventory_id: UUID,
  quantity: number,
  created_at: Date,
  updated_at: Date,
  deleted_at?: Date,
}

export interface UserAddingToCart {
  id: UUID,
  student_id: UUID,
}

export interface SwishData {
  payeePaymentReference: string,
  callbackUrl: string,
  payeeAlias: string,
  currency: 'SEK',
  payerAlias: string,
  amount: string,
  message: string,
}
