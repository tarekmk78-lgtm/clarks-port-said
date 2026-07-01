export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  description?: string;
  description_ar?: string;
  image_url?: string;
  parent_id?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  category_id: string;
  category?: Category;
  brand?: string;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  stock_quantity: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  color_code?: string;
  price_adjustment?: number;
  stock_quantity: number;
  sku: string;
  images?: string[];
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  variant_id: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  user_id?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon_code?: string;
}

export interface Address {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  coupon_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  variant_id: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user?: User;
  rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount?: number;
  max_uses?: number;
  uses_count: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  title_ar: string;
  subtitle?: string;
  subtitle_ar?: string;
  image_url: string;
  video_url?: string;
  link_url?: string;
  button_text?: string;
  button_text_ar?: string;
  position: 'hero' | 'promo' | 'category' | 'sidebar';
  sort_order: number;
  is_active: boolean;
  starts_at?: string;
  ends_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  site_name_ar: string;
  tagline?: string;
  tagline_ar?: string;
  logo_url?: string;
  favicon_url?: string;
  hero_title: string;
  hero_title_ar: string;
  hero_subtitle: string;
  hero_subtitle_ar: string;
  hero_video_url?: string;
  hero_image_url?: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  address: string;
  address_ar: string;
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
  social_youtube?: string;
  meta_title: string;
  meta_title_ar: string;
  meta_description: string;
  meta_description_ar: string;
  currency: string;
  currency_symbol: string;
  shipping_cost: number;
  free_shipping_threshold: number;
  tax_rate: number;
}
