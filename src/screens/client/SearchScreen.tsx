// src/screens/client/SearchScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { RestaurantCard } from '../../components/cards/RestaurantCard';
import { ProductCard } from '../../components/cards/ProductCard';
import { LoadingLogo } from '../../components/atoms/LoadingLogo';
import { supabase } from '../../services/supabase';
import { useCartStore } from '../../store/cartStore';
import type { Restaurant, Product } from '../../types';

interface SearchScreenProps {
  onBack: () => void;
  onRestaurantPress: (restaurant: Restaurant) => void;
  onProductPress: (product: Product, restaurantId: string) => void;
}

const QUICK_FILTERS = [
  { id: 'all', label: 'Todo', emoji: '🔍' },
  { id: 'parrilla', label: 'Parrilla', emoji: '🥩' },
  { id: 'sushi', label: 'Sushi', emoji: '🍱' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'vegano', label: 'Vegano', emoji: '🥗' },
];

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onBack,
  onRestaurantPress,
  onProductPress,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    if (query.length >= 2) {
      handleSearch();
    } else if (selectedFilter !== 'all') {
      loadByCategory();
    } else {
      // Si es 'all' y no hay búsqueda, limpiar resultados
      setRestaurants([]);
      setProducts([]);
    }
  }, [query, selectedFilter]);

  const handleSearch = async () => {
    setLoading(true);

    // Buscar restaurantes por nombre
    const { data: restaurantsData } = await supabase
      .from('restaurants')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .limit(10);

    // Buscar productos por nombre
    let productsQuery = supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .ilike('name', `%${query}%`);

    // SOLO SI hay filtro diferente a 'all', filtrar por tags
    if (selectedFilter !== 'all') {
      productsQuery = productsQuery.contains('tags', [selectedFilter]);
    }

    const { data: productsData } = await productsQuery.limit(10);

    if (restaurantsData) setRestaurants(restaurantsData as Restaurant[]);
    if (productsData) setProducts(productsData as Product[]);

    setLoading(false);
  };

  const loadByCategory = async () => {
    setLoading(true);

    // Solo cargar productos con el tag seleccionado
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .contains('tags', [selectedFilter])
      .eq('is_available', true)
      .limit(20);

    setRestaurants([]);
    if (productsData) setProducts(productsData as Product[]);

    setLoading(false);
  };

  const hasResults = restaurants.length > 0 || products.length > 0;
  const showEmpty = query.length >= 2 && !loading && !hasResults;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header con búsqueda */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Restaurantes, platos, cocinas..."
            placeholderTextColor={colors.text.tertiary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros rápidos */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScroll}
        style={{ flexGrow: 0 }}
      >
        {QUICK_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterEmoji}>{filter.emoji}</Text>
            <Text
              style={[
                styles.filterLabel,
                selectedFilter === filter.id && styles.filterLabelActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenido */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading && (
          <View style={styles.loadingState}>
            <LoadingLogo size={80} message="Buscando..." />
          </View>
        )}

        {showEmpty && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptyText}>
              Probá con otro nombre o categoría
            </Text>
          </View>
        )}

        {!loading && query.length === 0 && (
          <View style={styles.hintState}>
            <Text style={styles.hintEmoji}>💡</Text>
            <Text style={styles.hintTitle}>Buscá lo que se te antoje</Text>
            <Text style={styles.hintText}>
              Restaurantes, platos específicos, o tipos de cocina
            </Text>
          </View>
        )}

        {!loading && restaurants.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🍽️ Restaurantes ({restaurants.length})
            </Text>
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() => onRestaurantPress(restaurant)}
                variant="vertical"
              />
            ))}
          </View>
        )}

        {!loading && products.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              🍴 Platos ({products.length})
            </Text>
            <View style={styles.productsGrid}>
              {products.map((product) => {
                const restaurant = restaurants.find(r => r.id === product.restaurant_id);
                return (
                  <View key={product.id} style={styles.productWrapper}>
                    <ProductCard
                      product={product}
                      onPress={() => onProductPress(product, product.restaurant_id)}
                      onAddToCart={() => {
                        if (restaurant) {
                          addItem(product, restaurant.id, restaurant.name);
                        }
                      }}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  backIcon: {
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: '700',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    height: 48,
    gap: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    padding: 0,
  },
  clearIcon: {
    fontSize: 16,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  filtersScroll: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.neon.faint,
    borderColor: colors.neon.primary,
  },
  filterEmoji: {
    fontSize: 14,
  },
  filterLabel: {
    fontSize: 13,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  filterLabelActive: {
    color: colors.neon.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  loadingState: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  emptyState: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  hintState: {
    paddingVertical: spacing.xxxl,
    alignItems: 'center',
  },
  hintEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  hintTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 15,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productWrapper: {
    width: '48%',
    marginBottom: spacing.xl,
  },
});
