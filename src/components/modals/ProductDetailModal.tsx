// src/components/modals/ProductDetailModal.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { VideoPlayer } from '../atoms/VideoPlayer';
import { Button } from '../atoms/Button';
import type { Product } from '../../types';

const { width, height } = Dimensions.get('window');
const VIDEO_HEIGHT = height * 0.55;

interface ProductDetailModalProps {
  visible: boolean;
  product: Product;
  restaurantName: string;
  onClose: () => void;
  onAddToCart: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  restaurantName,
  onClose,
  onAddToCart,
}) => {
  const formatPrice = (price: number) => `$${price.toLocaleString('es-AR')}`;
  const hasVideo = product.video_status === 'ready' && product.video_url;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Video o imagen */}
        <View style={styles.mediaContainer}>
          {hasVideo ? (
            <VideoPlayer uri={product.video_url!} autoPlay loop />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Sin video disponible</Text>
            </View>
          )}

          {/* Botón cerrar */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
              style={styles.closeBtnGradient}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Badge de video IA */}
          {product.video_status === 'generating' && (
            <View style={styles.generatingBadge}>
              <Text style={styles.generatingText}>⚡ Generando video IA...</Text>
            </View>
          )}
        </View>

        {/* Info del producto */}
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Restaurante */}
            <Text style={styles.restaurantLabel}>🍽️ {restaurantName}</Text>

            {/* Nombre y precio */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.productName}>{product.name}</Text>
                {product.is_featured && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>🔥 Destacado</Text>
                  </View>
                )}
              </View>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
            </View>

            {/* Descripción */}
            <Text style={styles.description}>{product.description}</Text>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {product.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Alérgenos */}
            {product.allergens && product.allergens.length > 0 && (
              <View style={styles.allergensSection}>
                <Text style={styles.allergensLabel}>⚠️ Contiene:</Text>
                <Text style={styles.allergensText}>
                  {product.allergens.join(', ')}
                </Text>
              </View>
            )}

            {/* Tiempo de preparación */}
            {product.prep_time_min && (
              <View style={styles.prepTime}>
                <Text style={styles.prepTimeIcon}>🕐</Text>
                <Text style={styles.prepTimeText}>
                  Listo en {product.prep_time_min} minutos
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer con botón agregar */}
        <View style={styles.footer}>
          <LinearGradient
            colors={['transparent', 'rgba(10,10,10,0.98)']}
            style={styles.footerGradient}
          >
            <Button
              label={`Agregar al carrito · ${formatPrice(product.price)}`}
              onPress={() => {
                onAddToCart();
                onClose();
              }}
              variant="neon"
              size="xl"
            />
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  mediaContainer: {
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.secondary,
  },
  placeholderText: {
    color: colors.text.tertiary,
    fontSize: 15,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: spacing.xl,
    zIndex: 10,
  },
  closeBtnGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  closeIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  generatingBadge: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.xl,
    backgroundColor: 'rgba(255, 200, 0, 0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  generatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 120,
    gap: spacing.lg,
  },
  restaurantLabel: {
    fontSize: 13,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  headerLeft: {
    flex: 1,
    gap: spacing.sm,
  },
  productName: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text.primary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neon.faint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neon.medium,
  },
  featuredText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neon.primary,
  },
  price: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.neon.primary,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.bg.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  tagText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  allergensSection: {
    backgroundColor: 'rgba(255, 200, 0, 0.1)',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 0, 0.3)',
    gap: spacing.xs,
  },
  allergensLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFC800',
  },
  allergensText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  prepTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  prepTimeIcon: {
    fontSize: 16,
  },
  prepTimeText: {
    fontSize: 14,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerGradient: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: 40,
  },
});
