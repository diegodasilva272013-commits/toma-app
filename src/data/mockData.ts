import { Restaurant, Product, Category, Review } from '../types/index';

// ═══════════════════════════════════════
// RESTAURANTES MOCK
// ═══════════════════════════════════════
export const mockRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Don Julio',
    description: 'La parrilla más famosa de Palermo. Carnes premium, vinos de autor.',
    logo_url: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=200',
    cover_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    cover_video_url: undefined,
    address: 'Guatemala 4699',
    zone: 'Palermo',
    lat: -34.5881,
    lng: -58.4252,
    phone: '+5491156781234',
    opening_hours: {
      monday: { open: '12:00', close: '23:30' },
      tuesday: { open: '12:00', close: '23:30' },
      wednesday: { open: '12:00', close: '23:30' },
      thursday: { open: '12:00', close: '23:30' },
      friday: { open: '12:00', close: '00:30' },
      saturday: { open: '12:00', close: '00:30' },
      sunday: { open: '12:00', close: '23:00' },
    },
    delivery_zones: [{ name: 'Palermo', price: 1500, max_distance_km: 3 }],
    delivery_price: 1500,
    min_order: 8000,
    avg_prep_time: 35,
    rating_food: 4.9,
    rating_delivery: 4.7,
    total_reviews: 847,
    is_open: true,
    is_active: true,
    subscription_status: 'active',
    founded_badge: true,
  },
  {
    id: 'r2',
    name: 'Mishiguene',
    description: 'Cocina judía contemporánea. Sabores de origen, técnica de vanguardia.',
    logo_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200',
    cover_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    cover_video_url: undefined,
    address: 'Lafinur 3368',
    zone: 'Palermo',
    lat: -34.5830,
    lng: -58.4210,
    phone: '+5491156782345',
    opening_hours: {
      tuesday: { open: '19:30', close: '23:30' },
      wednesday: { open: '19:30', close: '23:30' },
      thursday: { open: '19:30', close: '23:30' },
      friday: { open: '19:30', close: '00:00' },
      saturday: { open: '12:30', close: '00:00' },
      sunday: { open: '12:30', close: '23:00' },
    },
    delivery_zones: [{ name: 'Palermo', price: 1800, max_distance_km: 4 }],
    delivery_price: 1800,
    min_order: 10000,
    avg_prep_time: 40,
    rating_food: 4.8,
    rating_delivery: 4.6,
    total_reviews: 612,
    is_open: true,
    is_active: true,
    subscription_status: 'active',
    founded_badge: true,
  },
  {
    id: 'r3',
    name: 'Osaka',
    description: 'Nikkei cuisine. La fusión peruana-japonesa más auténtica de Buenos Aires.',
    logo_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200',
    cover_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800',
    cover_video_url: undefined,
    address: 'Soler 5608',
    zone: 'Palermo',
    lat: -34.5860,
    lng: -58.4330,
    phone: '+5491156783456',
    opening_hours: {
      monday: { open: '12:30', close: '23:00' },
      tuesday: { open: '12:30', close: '23:00' },
      wednesday: { open: '12:30', close: '23:00' },
      thursday: { open: '12:30', close: '23:00' },
      friday: { open: '12:30', close: '00:00' },
      saturday: { open: '12:30', close: '00:00' },
    },
    delivery_zones: [{ name: 'Palermo', price: 2000, max_distance_km: 5 }],
    delivery_price: 2000,
    min_order: 12000,
    avg_prep_time: 30,
    rating_food: 4.9,
    rating_delivery: 4.8,
    total_reviews: 1203,
    is_open: true,
    is_active: true,
    subscription_status: 'active',
    founded_badge: false,
  },
  {
    id: 'r4',
    name: 'La Cabrera',
    description: 'Parrilla argentina clásica. Costillares legendarios y guarniciones de autor.',
    logo_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200',
    cover_url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    cover_video_url: undefined,
    address: 'Cabrera 5127',
    zone: 'Palermo',
    lat: -34.5845,
    lng: -58.4290,
    phone: '+5491156784567',
    opening_hours: {
      monday: { open: '12:00', close: '00:00' },
      tuesday: { open: '12:00', close: '00:00' },
      wednesday: { open: '12:00', close: '00:00' },
      thursday: { open: '12:00', close: '00:00' },
      friday: { open: '12:00', close: '01:00' },
      saturday: { open: '12:00', close: '01:00' },
      sunday: { open: '12:00', close: '23:30' },
    },
    delivery_zones: [{ name: 'Palermo', price: 1200, max_distance_km: 3 }],
    delivery_price: 1200,
    min_order: 6000,
    avg_prep_time: 25,
    rating_food: 4.7,
    rating_delivery: 4.5,
    total_reviews: 2341,
    is_open: false,
    is_active: true,
    subscription_status: 'active',
    founded_badge: false,
  },
];

// ═══════════════════════════════════════
// CATEGORÍAS MOCK
// ═══════════════════════════════════════
export const mockCategories: Record<string, Category[]> = {
  r1: [
    { id: 'c1', restaurant_id: 'r1', name: 'Entradas', emoji: '🥗', sort_order: 1 },
    { id: 'c2', restaurant_id: 'r1', name: 'Carnes', emoji: '🥩', sort_order: 2 },
    { id: 'c3', restaurant_id: 'r1', name: 'Vinos', emoji: '🍷', sort_order: 3 },
    { id: 'c4', restaurant_id: 'r1', name: 'Postres', emoji: '🍮', sort_order: 4 },
  ],
  r3: [
    { id: 'c5', restaurant_id: 'r3', name: 'Tiraditos', emoji: '🐟', sort_order: 1 },
    { id: 'c6', restaurant_id: 'r3', name: 'Nigiris', emoji: '🍱', sort_order: 2 },
    { id: 'c7', restaurant_id: 'r3', name: 'Rolls', emoji: '🍣', sort_order: 3 },
    { id: 'c8', restaurant_id: 'r3', name: 'Bebidas', emoji: '🍵', sort_order: 4 },
  ],
};

// ═══════════════════════════════════════
// PRODUCTOS MOCK
// ═══════════════════════════════════════
export const mockProducts: Record<string, Product[]> = {
  r1: [
    {
      id: 'p1', restaurant_id: 'r1', category_id: 'c1',
      name: 'Provoleta a la parrilla',
      description: 'Queso provolone fundido con orégano, oliva extra virgen y tomates secos',
      price: 7500,
      image_url: 'https://images.unsplash.com/photo-1588866571397-28d3eeea84cf?w=600',
      video_url: undefined, video_status: 'none',
      is_available: true, is_featured: true, prep_time_min: 10,
      tags: ['vegetariano', 'para compartir'], allergens: ['lácteos'],
    },
    {
      id: 'p2', restaurant_id: 'r1', category_id: 'c2',
      name: 'Bife de chorizo 400g',
      description: 'Corte premium de novillo angus con chimichurri casero y papas rústicas',
      price: 18500,
      image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600',
      video_url: undefined, video_status: 'generating',
      is_available: true, is_featured: true, prep_time_min: 30,
      tags: ['bestseller', 'premium'], allergens: [],
    },
    {
      id: 'p3', restaurant_id: 'r1', category_id: 'c2',
      name: 'Costillar de cerdo',
      description: 'Costillas ahumadas 6 horas, glaseado de miel y mostaza, ensalada de col',
      price: 22000,
      image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600',
      video_url: undefined, video_status: 'none',
      is_available: true, is_featured: false, prep_time_min: 40,
      tags: ['premium', 'para compartir'], allergens: ['mostaza'],
    },
    {
      id: 'p4', restaurant_id: 'r1', category_id: 'c3',
      name: 'Malbec Clos de los Siete 750ml',
      description: 'Blend de malbec de Mendoza, notas a ciruela y chocolate negro',
      price: 9500,
      image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
      video_url: undefined, video_status: 'none',
      is_available: true, is_featured: false, prep_time_min: 2,
      tags: ['vino tinto', 'mendoza'], allergens: ['sulfitos'],
    },
    {
      id: 'p5', restaurant_id: 'r1', category_id: 'c4',
      name: 'Flan casero con crema',
      description: 'Flan de huevo con caramelo oscuro y crema batida de vainilla',
      price: 4500,
      image_url: 'https://images.unsplash.com/photo-1621236378699-8597faf6a11e?w=600',
      video_url: undefined, video_status: 'none',
      is_available: true, is_featured: false, prep_time_min: 5,
      tags: ['postre', 'clásico'], allergens: ['huevo', 'lácteos'],
    },
  ],
  r3: [
    {
      id: 'p10', restaurant_id: 'r3', category_id: 'c5',
      name: 'Tiradito nikkei',
      description: 'Lenguado en leche de tigre, maracuyá, ají amarillo y crocante de quinoa',
      price: 11500,
      image_url: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600',
      video_url: undefined, video_status: 'ready',
      is_available: true, is_featured: true, prep_time_min: 12,
      tags: ['sin gluten', 'bestseller'], allergens: ['pescado', 'mariscos'],
    },
    {
      id: 'p11', restaurant_id: 'r3', category_id: 'c6',
      name: 'Nigiri de salmón flambeado (4u)',
      description: 'Arroz de sushi con salmón noruego flameado, salsa ponzu y ikura',
      price: 8900,
      image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600',
      video_url: undefined, video_status: 'none',
      is_available: true, is_featured: true, prep_time_min: 15,
      tags: ['premium', 'fresco'], allergens: ['pescado', 'soja'],
    },
  ],
};

// ═══════════════════════════════════════
// RESEÑAS MOCK
// ═══════════════════════════════════════
export const mockReviews: Review[] = [
  {
    id: 'rv1', order_id: 'o1', client_id: 'u2',
    restaurant_id: 'r1', delivery_id: 'd1',
    rating_food: 5, rating_delivery: 5,
    text: 'La provoleta estaba perfecta, llegó caliente y el delivery en 25 minutos. Esto es lo que necesitaba. Nunca más Rappi.',
    audio_url: undefined, audio_duration: undefined,
    created_at: '2026-02-10T20:34:00Z',
    client_name: 'Martina L.', client_avatar: undefined,
  },
  {
    id: 'rv2', order_id: 'o2', client_id: 'u3',
    restaurant_id: 'r1', delivery_id: 'd1',
    rating_food: 5, rating_delivery: 4,
    text: 'El bife de chorizo es otro nivel. Punto perfecto. El video del menú me convenció al toque.',
    audio_url: undefined, audio_duration: undefined,
    created_at: '2026-02-12T21:15:00Z',
    client_name: 'Diego P.', client_avatar: undefined,
  },
  {
    id: 'rv3', order_id: 'o3', client_id: 'u4',
    restaurant_id: 'r1', delivery_id: 'd2',
    rating_food: 4, rating_delivery: 5,
    text: 'Muy buena experiencia. El delivery llegó rapidísimo y el packaging estaba impecable.',
    audio_url: undefined, audio_duration: undefined,
    created_at: '2026-02-14T19:45:00Z',
    client_name: 'Sofía R.', client_avatar: undefined,
  },
];

// Helpers
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString('es-AR')}`;
};

export const getRestaurantById = (id: string): Restaurant | undefined =>
  mockRestaurants.find((r) => r.id === id);

export const getProductsByRestaurant = (restaurantId: string): Product[] =>
  mockProducts[restaurantId] ?? [];

export const getCategoriesByRestaurant = (restaurantId: string): Category[] =>
  mockCategories[restaurantId] ?? [];
