// src/screens/client/RestaurantProfileScreen.tsx (REEMPLAZAR COMPLETO)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { ProductCard } from '../../components/cards/ProductCard';
import { Button } from '../../components/atoms/Button';
import { LoadingLogo } from '../../components/atoms/LoadingLogo';
import { useCartStore } from '../../store/cartStore';
import { supabase } from '../../services/supabase';
import type { Restaurant, Product, Category } from '../../types/index';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

interface RestaurantProfileScreenProps {
  restaurant: Restaurant;
  onBack: () => void;
  onCartPress: () => void;
  onProductPress: (product: Product) => void;
}

export const RestaurantProfileScreen: React.FC<RestaurantProfileScreenProps> = ({
  restaurant,
  onBack,
  onCartPress,
  onProductPress,
}) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem, itemCount } = useCartStore();
  const cartCount = itemCount();

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    setLoading(true);

    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurant_id', restaurant.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (categoriesData) {
      setCategories(categoriesData as Category[]);
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }
    }

    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('restaurant_id', restaurant.id)
      .eq('is_available', true);

    if (productsData) {
      setProducts(productsData as Product[]);
    }

    setLoading(false);
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const formatPrice = (price: number) => `$${price.toLocaleString('es-AR')}`;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header con imagen */}
      <View style={styles.header}>
        <Image
          source={{ uri: restaurant.cover_url }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(10,10,10,0.3)', 'rgba(10,10,10,0.9)']}
          style={styles.headerGradient}
        />

        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <View style={styles.backBtnInner}>
            <Text style={styles.backIcon}>←</Text>
          </View>
        </TouchableOpacity>

        {cartCount > 0 && (
          <TouchableOpacity style={styles.headerCartBtn} onPress={onCartPress}>
            <View style={styles.headerCartInner}>
              <Text style={styles.headerCartIcon}>🛒</Text>
              <View style={styles.headerCartBadge}>
                <Text style={styles.headerCartBadgeText}>{cartCount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.headerInfo}>
          <View style={styles.headerBadges}>
            {restaurant.founded_badge && (
              <View style={styles.founderBadge}>
                <Text style={styles.founderBadgeText}>⭐ FUNDADOR</Text>
              </View>
            )}
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {restaurant.rating_food.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({restaurant.total_reviews})</Text>
            </View>
          </View>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>🕐 {restaurant.avg_prep_time} min</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaItem}>🛵 {formatPrice(restaurant.delivery_price)}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaItem}>Min {formatPrice(restaurant.min_order)}</Text>
          </View>
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <LoadingLogo size={80} message="Cargando menú..." />
          </View>
        ) : (
          <>
            {/* Tabs de categorías estilo bottom nav */}
            {categories.length > 0 && (
              <View style={styles.categoriesContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesScroll}
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryTab}
                      onPress={() => setSelectedCategory(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                      <Text
                        style={[
                          styles.categoryLabel,
                          selectedCategory === cat.id && styles.categoryLabelActive,
                        ]}
                      >
                        {cat.name}
                      </Text>
                      {selectedCategory === cat.id && (
                        <View style={styles.activeDot} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Grid de productos */}
            <ScrollView
              style={styles.productsScroll}
              contentContainerStyle={styles.productsGrid}
              showsVerticalScrollIndicator={false}
            >
              {filteredProducts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🍽️</Text>
                  <Text style={styles.emptyText}>
                    No hay productos disponibles en esta categoría
                  </Text>
                </View>
              ) : (
                <View style={styles.productsRow}>
                  {filteredProducts.map((product) => (
                    <View key={product.id} style={styles.productWrapper}>
                      <ProductCard
                        product={product}
                        onPress={() => onProductPress(product)}
                        onAddToCart={() => addItem(product, restaurant.id, restaurant.name)}
                      />
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>

      {/* Footer con carrito */}
      {cartCount > 0 && (
        <View style={styles.footer}>
          <LinearGradient
            colors={['transparent', 'rgba(10,10,10,0.95)']}
            style={styles.footerGradient}
          >
            <Button
              label={`Ver carrito · ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
              onPress={onCartPress}
              variant="neon"
              size="lg"
            />
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    height: HEADER_HEIGHT,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: spacing.xl,
    zIndex: 10,
  },
  backBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerCartBtn: {
    position: 'absolute',
    top: 50,
    right: spacing.xl,
    zIndex: 10,
  },
  headerCartInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerCartIcon: {
    fontSize: 18,
  },
  headerCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.neon.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerCartBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
  },
  headerInfo: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    right: spacing.xl,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  founderBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.5)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  founderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neon.primary,
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ratingCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  restaurantDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaItem: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  categoryTab: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
  },
  categoryEmoji: {
    fontSize: 22,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
  categoryLabelActive: {
    color: colors.neon.primary,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neon.primary,
    marginTop: 2,
  },
  productsScroll: {
    flex: 1,
  },
  productsGrid: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 120,
  },
  productsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productWrapper: {
    width: (width - spacing.xl * 2 - spacing.md) / 2,
    marginBottom: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 15,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 36,
  },
  footerGradient: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
});
