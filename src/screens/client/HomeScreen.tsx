import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, spacing, radius } from '../../theme/index';
import { RestaurantCard } from '../../components/cards/RestaurantCard';
import { ProductCard } from '../../components/cards/ProductCard';
import { mockRestaurants, mockProducts, formatPrice } from '../../data/mockData';
import { useCartStore } from '../../store/cartStore';
import { Restaurant, Product } from '../../types/index';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'Todos', emoji: '🔥' },
  { id: 'parrilla', label: 'Parrilla', emoji: '🥩' },
  { id: 'sushi', label: 'Sushi', emoji: '🍱' },
  { id: 'pasta', label: 'Pasta', emoji: '🍝' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'vegano', label: 'Vegano', emoji: '🥗' },
  { id: 'postre', label: 'Postres', emoji: '🍮' },
];

interface HomeScreenProps {
  onRestaurantPress: (restaurant: Restaurant) => void;
  onProductPress: (product: Product, restaurantId: string) => void;
  onCartPress: () => void;
  onSearchPress: () => void;
  onProfilePress: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onRestaurantPress,
  onProductPress,
  onCartPress,
  onSearchPress,
  onProfilePress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { itemCount, addItem } = useCartStore();
  const cartCount = itemCount();

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  // Todos los productos featured para la sección trending
  const trendingProducts = Object.values(mockProducts)
    .flat()
    .filter((p) => p.is_featured)
    .slice(0, 6);

  const openRestaurants = mockRestaurants.filter((r) => r.is_open);
  const topRestaurants = [...mockRestaurants].sort(
    (a, b) => b.rating_food - a.rating_food
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header flotante con blur al hacer scroll */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.floatingHeaderContent}>
          <Text style={styles.floatingLogo}>TOMA</Text>
          {cartCount > 0 && (
            <TouchableOpacity style={styles.cartFloating} onPress={onCartPress}>
              <Text style={styles.cartIcon}>🛒</Text>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.neon.primary}
          />
        }
      >
        {/* ═══════════ HERO HEADER ═══════════ */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['rgba(0, 255, 136, 0.06)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />

          {/* Top row */}
          <View style={styles.heroTop}>
            <View>
              <View style={styles.locationRow}>
                <Text style={styles.locationPin}>📍</Text>
                <Text style={styles.locationText}>Palermo, Buenos Aires</Text>
                <Text style={styles.locationArrow}>▾</Text>
              </View>
              <Text style={styles.heroGreeting}>Buenas noches 👋</Text>
            </View>
            <View style={styles.heroActions}>
              {cartCount > 0 && (
                <TouchableOpacity style={styles.cartBtn} onPress={onCartPress}>
                  <Text style={styles.cartBtnIcon}>🛒</Text>
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.profileBtn} onPress={onProfilePress}>
                <LinearGradient
                  colors={['#00FF88', '#00CC6F']}
                  style={styles.profileGradient}
                >
                  <Text style={styles.profileInitial}>M</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search bar */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={onSearchPress}
            activeOpacity={0.8}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>
              Restaurantes, platos, cocinas...
            </Text>
          </TouchableOpacity>
        </View>

        {/* ═══════════ CATEGORÍAS ═══════════ */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === cat.id && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ═══════════ TRENDING PLATOS ═══════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>🔥 Tendencia ahora</Text>
              <Text style={styles.sectionSubtitle}>Los más pedidos esta noche</Text>
            </View>
          </View>
          <FlatList
            data={trendingProducts}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: spacing.xl, paddingRight: spacing.md }}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const restaurant = mockRestaurants.find(
                (r) => r.id === item.restaurant_id
              );
              return (
                <ProductCard
                  product={item}
                  onPress={() => onProductPress(item, item.restaurant_id)}
                  onAddToCart={() => {
                    if (restaurant) {
                      addItem(item, restaurant.id, restaurant.name);
                    }
                  }}
                />
              );
            }}
          />
        </View>

        {/* ═══════════ CHEF EJECUTIVO (top restaurants) ═══════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>👨‍🍳 Chef Ejecutivo</Text>
              <Text style={styles.sectionSubtitle}>Los mejores del barrio</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>Ver todos →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={topRestaurants.slice(0, 4)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: spacing.xl, paddingRight: spacing.md }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <RestaurantCard
                restaurant={item}
                onPress={() => onRestaurantPress(item)}
                variant="horizontal"
              />
            )}
          />
        </View>

        {/* ═══════════ CERCA TUYO ═══════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>📍 Cerca tuyo</Text>
              <Text style={styles.sectionSubtitle}>Abiertos en tu zona</Text>
            </View>
          </View>
          <View style={styles.nearbyList}>
            {openRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() => onRestaurantPress(restaurant)}
                variant="vertical"
              />
            ))}
          </View>
        </View>

        {/* ═══════════ BANNER AHORRO ═══════════ */}
        <View style={styles.savingsBanner}>
          <LinearGradient
            colors={['rgba(0, 255, 136, 0.08)', 'rgba(0, 255, 136, 0.03)']}
            style={styles.savingsBannerGradient}
          >
            <View style={styles.savingsBorderLeft} />
            <View style={styles.savingsContent}>
              <Text style={styles.savingsEmoji}>💰</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.savingsTitle}>Pedís directo, pagás menos</Text>
                <Text style={styles.savingsSubtitle}>
                  Sin el 30% de comisión de Rappi. El precio es el precio.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Bottom padding para nav */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* ═══════════ BOTTOM NAV ═══════════ */}
      <BottomNav
        onHomePress={() => {}}
        onSearchPress={onSearchPress}
        onCartPress={onCartPress}
        onProfilePress={onProfilePress}
        cartCount={cartCount}
      />
    </View>
  );
};

// ─────────────────────────────────────
// Bottom Navigation
// ─────────────────────────────────────
interface BottomNavProps {
  onHomePress: () => void;
  onSearchPress: () => void;
  onCartPress: () => void;
  onProfilePress: () => void;
  cartCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({
  onHomePress,
  onSearchPress,
  onCartPress,
  onProfilePress,
  cartCount,
}) => {
  const [active, setActive] = useState<'home' | 'search' | 'cart' | 'profile'>('home');

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Inicio', onPress: onHomePress },
    { id: 'search', icon: '🔍', label: 'Buscar', onPress: onSearchPress },
    { id: 'cart', icon: '🛒', label: 'Pedido', onPress: onCartPress },
    { id: 'profile', icon: '👤', label: 'Perfil', onPress: onProfilePress },
  ] as const;

  return (
    <View style={navStyles.container}>
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={navStyles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={navStyles.tab}
            onPress={() => {
              setActive(tab.id);
              tab.onPress();
            }}
            activeOpacity={0.7}
          >
            <View style={navStyles.iconWrapper}>
              <Text style={navStyles.icon}>{tab.icon}</Text>
              {tab.id === 'cart' && cartCount > 0 && (
                <View style={navStyles.badge}>
                  <Text style={navStyles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                navStyles.label,
                active === tab.id && navStyles.labelActive,
              ]}
            >
              {tab.label}
            </Text>
            {active === tab.id && (
              <View style={navStyles.activeDot} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const navStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    overflow: 'hidden',
  },
  tabs: {
    flexDirection: 'row',
    paddingBottom: 28,
    paddingTop: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  iconWrapper: {
    position: 'relative',
  },
  icon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.neon.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
  },
  label: {
    fontSize: 11,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.neon.primary,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neon.primary,
    position: 'absolute',
    bottom: -8,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 90,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
    overflow: 'hidden',
  },
  floatingHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    paddingTop: 44,
  },
  floatingLogo: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.neon.primary,
    letterSpacing: 4,
  },
  cartFloating: {
    position: 'relative',
  },
  cartIcon: {
    fontSize: 20,
  },
  hero: {
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationPin: {
    fontSize: 12,
  },
  locationText: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  locationArrow: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  heroGreeting: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBtnIcon: {
    fontSize: 18,
  },
  cartBadge: {
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
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
  },
  profileBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    height: 50,
    gap: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: colors.text.tertiary,
    flex: 1,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  categoryChipActive: {
    backgroundColor: colors.neon.faint,
    borderColor: colors.neon.primary,
  },
  categoryEmoji: {
    fontSize: 14,
  },
  categoryLabel: {
    fontSize: 13,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: colors.neon.primary,
  },
  section: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  seeAll: {
    fontSize: 14,
    color: colors.neon.primary,
    fontWeight: '600',
  },
  nearbyList: {
    paddingHorizontal: spacing.xl,
  },
  savingsBanner: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neon.medium,
  },
  savingsBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsBorderLeft: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: colors.neon.primary,
  },
  savingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.md,
    flex: 1,
  },
  savingsEmoji: {
    fontSize: 28,
  },
  savingsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  savingsSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  featuredText: {
    fontSize: 16,
  },
});
