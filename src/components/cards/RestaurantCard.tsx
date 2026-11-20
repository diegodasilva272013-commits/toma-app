import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../theme/index';
import { Restaurant } from '../../types/index';
import { formatPrice } from '../../data/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  variant?: 'horizontal' | 'vertical';
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onPress,
  variant = 'horizontal',
}) => {
  const isHorizontal = variant === 'horizontal';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.card,
        isHorizontal ? { width: CARD_WIDTH, marginRight: spacing.md } : styles.vertical,
      ]}
    >
      {/* Cover image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: restaurant.cover_url }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(10,10,10,0.85)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Badges top */}
        <View style={styles.topBadges}>
          {restaurant.founded_badge && (
            <View style={styles.founderBadge}>
              <Text style={styles.founderBadgeText}>⭐ FUNDADOR</Text>
            </View>
          )}
          {!restaurant.is_open && (
            <View style={styles.closedBadge}>
              <Text style={styles.closedBadgeText}>Cerrado</Text>
            </View>
          )}
        </View>

        {/* Rating bottom left */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {restaurant.rating_food.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({restaurant.total_reviews})</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {restaurant.description}
        </Text>

        {/* Meta row */}
        <View style={styles.meta}>
          <Text style={styles.metaItem}>🕐 {restaurant.avg_prep_time} min</Text>
          <View style={styles.dot} />
          <Text style={styles.metaItem}>🛵 {formatPrice(restaurant.delivery_price)}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaItem}>Min {formatPrice(restaurant.min_order)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  vertical: {
    width: '100%',
    marginBottom: spacing.md,
  },
  imageWrapper: {
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadges: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  founderBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.4)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  founderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neon.primary,
    letterSpacing: 0.5,
  },
  closedBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  closedBadgeText: {
    fontSize: 11,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reviewCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  info: {
    padding: spacing.md,
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: colors.text.tertiary,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  metaItem: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.border.strong,
  },
});
