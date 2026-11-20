// ═══════════════════════════════════════
// USUARIO Y ROLES
// ═══════════════════════════════════════
export type UserRole = 'client' | 'restaurant' | 'delivery';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface ClientProfile extends User {
  role: 'client';
  level: GamificationLevel;
  xp: number;
  orders_count: number;
  total_spent: number;
  favorite_restaurants: string[];
}

export interface DeliveryProfile extends User {
  role: 'delivery';
  dni: string;
  moto_plate: string;
  insurance_url?: string;
  license_url?: string;
  level: DeliveryLevel;
  rating: number;
  total_deliveries: number;
  is_active: boolean;
}

// ═══════════════════════════════════════
// RESTAURANTE
// ═══════════════════════════════════════
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  cover_video_url?: string;
  address: string;
  zone: string;
  lat: number;
  lng: number;
  phone: string;
  opening_hours: OpeningHours;
  delivery_zones: DeliveryZone[];
  delivery_price: number;
  min_order: number;
  avg_prep_time: number;
  rating_food: number;
  rating_delivery: number;
  total_reviews: number;
  is_open: boolean;
  is_active: boolean;
  subscription_status: 'active' | 'trial' | 'suspended';
  founded_badge: boolean;
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;  // "09:00"
  close: string; // "23:00"
}

export interface DeliveryZone {
  name: string;
  price: number;
  max_distance_km: number;
}

// ═══════════════════════════════════════
// PRODUCTOS
// ═══════════════════════════════════════
export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  emoji?: string;
  sort_order: number;
}

export interface Product {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  video_url?: string;        // Video IA generado
  video_status: 'none' | 'generating' | 'ready' | 'failed';
  is_available: boolean;
  is_featured: boolean;
  prep_time_min?: number;
  tags: string[];
  allergens?: string[];
}

// ═══════════════════════════════════════
// PEDIDO
// ═══════════════════════════════════════
export type OrderStatus = 
  | 'pending'        // Esperando confirmación restaurante
  | 'confirmed'      // Restaurante confirmó
  | 'preparing'      // En cocina
  | 'ready'          // Listo para retirar
  | 'assigned'       // Delivery asignado
  | 'picking_up'     // Delivery fue a buscar
  | 'in_delivery'    // En camino al cliente
  | 'delivered'      // Entregado
  | 'cancelled';     // Cancelado

export interface Order {
  id: string;
  client_id: string;
  restaurant_id: string;
  delivery_id?: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  delivery_price: number;
  total: number;
  payment_method: 'card' | 'cash' | 'mercadopago';
  payment_status: 'pending' | 'paid' | 'refunded';
  delivery_address: Address;
  client_notes?: string;
  created_at: string;
  confirmed_at?: string;
  delivered_at?: string;
  estimated_delivery_at?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
}

export interface Address {
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  zip?: string;
  lat?: number;
  lng?: number;
  notes?: string;
}

// ═══════════════════════════════════════
// RESEÑAS
// ═══════════════════════════════════════
export interface Review {
  id: string;
  order_id: string;
  client_id: string;
  restaurant_id: string;
  delivery_id?: string;
  rating_food: number;
  rating_delivery?: number;
  text?: string;
  audio_url?: string;
  audio_duration?: number;
  created_at: string;
  client_name: string;
  client_avatar?: string;
}

// ═══════════════════════════════════════
// GAMIFICACIÓN
// ═══════════════════════════════════════
export type GamificationLevel = 
  | 'foodie_rookie'      // 0-9 pedidos
  | 'local_hero'         // 10-24 pedidos
  | 'verified_critic'    // 25-49 pedidos + reseñas
  | 'gourmet_legend';    // 50+ pedidos

export type DeliveryLevel = 'rookie' | 'bronze' | 'silver' | 'golden_helmet';

export interface GamificationData {
  level: GamificationLevel;
  xp: number;
  xp_to_next: number;
  orders_count: number;
  reviews_count: number;
  streak_days: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

// ═══════════════════════════════════════
// CART STORE
// ═══════════════════════════════════════
export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface CartState {
  items: CartItem[];
  restaurant_id: string | null;
  restaurant_name: string | null;
  addItem: (product: Product, restaurantId: string, restaurantName: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getDeliveryTotal: (deliveryPrice: number) => number;
  itemCount: () => number;
}
