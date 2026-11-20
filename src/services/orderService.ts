import { supabase } from '../lib/supabase';
import { Order, OrderItem, OrderStatus } from '../types/index';

// ═══════════════════════════════════════
// ORDER SERVICE
// ═══════════════════════════════════════

export const orderService = {
  /** Crear un nuevo pedido */
  async create(order: Omit<Order, 'id' | 'created_at'>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Obtener pedidos del cliente */
  async getByClient(clientId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /** Obtener pedidos del restaurante */
  async getByRestaurant(restaurantId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /** Obtener pedido por ID */
  async getById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  /** Actualizar estado del pedido */
  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const updates: Record<string, any> = { status };

    // Agregar timestamps según el estado
    if (status === 'confirmed') updates.confirmed_at = new Date().toISOString();
    if (status === 'delivered') updates.delivered_at = new Date().toISOString();

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) throw error;
  },

  /** Suscribirse a cambios en tiempo real de un pedido */
  subscribeToOrder(orderId: string, callback: (order: Order) => void) {
    return supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          callback(payload.new as Order);
        }
      )
      .subscribe();
  },

  /** Suscribirse a pedidos nuevos de un restaurante (para el dashboard) */
  subscribeToRestaurantOrders(restaurantId: string, callback: (order: Order) => void) {
    return supabase
      .channel(`restaurant-orders-${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          callback(payload.new as Order);
        }
      )
      .subscribe();
  },
};
