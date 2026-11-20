import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../theme/index';
import { Product } from '../../types/index';
import { formatPrice } from '../../data/mockData';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Image / Video */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(10,10,10,0.6)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Video indicator */}
        {product.video_status === 'ready' && (
          <View style={styles.videoBadge}>
            <Text style={styles.videoIcon}>▶</Text>
          </View>
        )}
        {product.video_status === 'generating' && (
          <View style={[styles.videoBadge, styles.videoBadgeGenerating]}>
            <Text style={styles.videoGeneratingText}>IA ✨</Text>
          </View>
        )}

        {/* Featured */}
        {product.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>🔥</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#00FF88', '#00CC6F']}
              style={styles.addGradient}
            >
              <Text style={styles.addIcon}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginRight: spacing.md,
  },
  imageWrapper: {
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 255, 136, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBadgeGenerating: {
    backgroundColor: 'rgba(255, 200, 0, 0.9)',
    width: 40,
    borderRadius: radius.full,
    paddingHorizontal: 6,
  },
  videoIcon: {
    fontSize: 10,
    color: '#000',
    fontWeight: '900',
  },
  videoGeneratingText: {
    fontSize: 9,
    color: '#000',
    fontWeight: '700',
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  featuredText: {
    fontSize: 16,
  },
  info: {
    padding: spacing.md,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.2,
    lineHeight: 19,
  },
  description: {
    fontSize: 12,
    color: colors.text.tertiary,
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neon.primary,
    letterSpacing: -0.3,
  },
  addButton: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  addGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
    lineHeight: 22,
  },
});
