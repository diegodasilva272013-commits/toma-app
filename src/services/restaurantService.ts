import { supabase } from '../lib/supabase';
import { Restaurant, Product, Category } from '../types/index';

// ═══════════════════════════════════════
// RESTAURANT SERVICE
// ═══════════════════════════════════════

export const restaurantService = {
  /** Obtener todos los restaurantes activos */
  async getAll(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .order('rating_food', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /** Obtener restaurante por ID */
  async getById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /** Buscar restaurantes por nombre o zona */
  async search(query: string): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,zone.ilike.%${query}%,description.ilike.%${query}%`)
      .order('rating_food', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /** Obtener restaurantes por zona */
  async getByZone(zone: string): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .eq('zone', zone)
      .order('rating_food', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /** Obtener restaurantes destacados (featured) */
  async getFeatured(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .eq('is_open', true)
      .gte('rating_food', 4.5)
      .order('total_reviews', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data ?? [];
  },
};

// ═══════════════════════════════════════
// PRODUCT SERVICE
// ═══════════════════════════════════════

export const productService = {
  /** Obtener productos de un restaurante */
  async getByRestaurant(restaurantId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('is_featured', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /** Obtener categorías de un restaurante */
  async getCategoriesByRestaurant(restaurantId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  /** Obtener productos destacados de un restaurante */
  async getFeatured(restaurantId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .eq('is_featured', true);

    if (error) throw error;
    return data ?? [];
  },

  /** Buscar productos */
  async search(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, restaurants!inner(name, is_active)')
      .eq('is_available', true)
      .ilike('name', `%${query}%`);

    if (error) throw error;
    return data ?? [];
  },
};
