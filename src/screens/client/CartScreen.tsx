// src/screens/client/CartScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '@theme/index';
import { Button } from '@components/atoms/Button';
import { useCartStore } from '@store/cartStore';

interface CartScreenProps {
  onBack: () => void;
  onCheckout: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({ onBack, onCheckout }) => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  const deliveryFee = 1500;
  const subtotal = totalPrice();
  const total = subtotal + deliveryFee;
  const savings = Math.round(total * 0.3);

  const formatPrice = (price: number) => `$${price.toLocaleString('es-AR')}`;

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Carrito</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyText}>Agregá productos para empezar tu pedido</Text>
          <Button
            label="Ver restaurantes"
            onPress={onBack}
            variant="neon"
            size="lg"
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrito ({items.length})</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearBtn}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Items */}
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.itemImage} />
            )}
            <View style={styles.itemContent}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
            </View>

            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Text style={styles.quantityBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeItem(item.id)}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Totales */}
        <View style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery</Text>
            <Text style={styles.totalValue}>{formatPrice(deliveryFee)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelFinal}>Total</Text>
            <Text style={styles.totalValueFinal}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Ahorro */}
        <View style={styles.savingsCard}>
          <LinearGradient
            colors={['rgba(0, 255, 136, 0.1)', 'rgba(0, 255, 136, 0.05)']}
            style={styles.savingsGradient}
          >
            <Text style={styles.savingsIcon}>💰</Text>
            <View style={styles.savingsContent}>
              <Text style={styles.savingsTitle}>
                Ahorrás {formatPrice(savings)} vs Rappi
              </Text>
              <Text style={styles.savingsText}>
                Sin comisión del 30%. Precio directo del restaurante.
              </Text>
            </View>
          </LinearGradient>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <LinearGradient
          colors={['transparent', 'rgba(10,10,10,0.98)']}
          style={styles.footerGradient}
        >
          <Button
            label={`Ir al checkout · ${formatPrice(total)}`}
            onPress={onCheckout}
            variant="neon"
            size="xl"
          />
        </LinearGradient>
      </View>
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
    justifyContent: 'space-between',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
  },
  clearBtn: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 22,
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
  itemCard: {
    flexDirection: 'row',
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    gap: spacing.md,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: spacing.xs,
  },
  removeBtnText: {
    fontSize: 18,
    color: colors.text.tertiary,
  },
  totalsCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginTop: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  totalLabel: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.sm,
  },
  totalLabelFinal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
  },
  totalValueFinal: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.neon.primary,
  },
  savingsCard: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neon.medium,
    marginTop: spacing.md,
  },
  savingsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.md,
  },
  savingsIcon: {
    fontSize: 28,
  },
  savingsContent: {
    flex: 1,
    gap: 4,
  },
  savingsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neon.primary,
  },
  savingsText: {
    fontSize: 13,
    color: colors.text.secondary,
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
