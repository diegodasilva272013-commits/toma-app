import { supabase } from '../lib/supabase';
import { Review } from '../types/index';

// ═══════════════════════════════════════
// REVIEW SERVICE
// ═══════════════════════════════════════

export const reviewService = {
  /** Obtener reseñas de un restaurante */
  async getByRestaurant(restaurantId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  /** Crear una reseña */
  async create(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Obtener promedio de rating de un restaurante */
  async getAverageRating(restaurantId: string): Promise<{ food: number; delivery: number }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating_food, rating_delivery')
      .eq('restaurant_id', restaurantId);

    if (error) throw error;

    if (!data || data.length === 0) return { food: 0, delivery: 0 };

    const food = data.reduce((sum, r) => sum + r.rating_food, 0) / data.length;
    const deliveryReviews = data.filter(r => r.rating_delivery != null);
    const delivery = deliveryReviews.length > 0
      ? deliveryReviews.reduce((sum, r) => sum + (r.rating_delivery ?? 0), 0) / deliveryReviews.length
      : 0;

    return { food: Math.round(food * 10) / 10, delivery: Math.round(delivery * 10) / 10 };
  },
};
