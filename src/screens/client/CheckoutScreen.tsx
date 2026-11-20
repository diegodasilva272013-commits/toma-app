// src/screens/client/CheckoutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '@theme/index';
import { Button } from '@components/atoms/Button';
import { useCartStore } from '@store/cartStore';
import { supabase } from '@services/supabase';

interface CheckoutScreenProps {
  onBack: () => void;
  onSuccess: (orderId: string) => void; // Ahora va al video
}

type PaymentMethod = 'card' | 'cash' | 'mercadopago';

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');
  const [loading, setLoading] = useState(false);
  const { items, totalPrice, clearCart } = useCartStore();

  const deliveryFee = 1500;
  const subtotal = totalPrice();
  const total = subtotal + deliveryFee;
  const savings = Math.round(total * 0.3); // 30% que ahorrás vs Rappi

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Error', 'El carrito está vacío');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'Debés estar logueado');
        return;
      }

      // Obtener dirección del usuario
      const { data: addressData, error: addressError } = await supabase
        .from('saved_addresses')
        .select('*')
        .eq('client_id', user.id)
        .eq('is_default', true)
        .maybeSingle(); // Cambiado de single() a maybeSingle()

      console.log('Address data:', addressData);
      console.log('Address error:', addressError);

      if (!addressData) {
        Alert.alert(
          'Dirección requerida',
          'Necesitás agregar una dirección de entrega antes de hacer el pedido',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Agregar dirección', 
              onPress: () => {
                // TODO: navegar a AddressesScreen
                Alert.alert('Próximamente', 'Navegación a pantalla de direcciones');
              }
            }
          ]
        );
        setLoading(false);
        return;
      }

      const defaultAddress = addressData;

      // Crear el pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          client_id: user.id,
          restaurant_id: items[0].restaurantId,
          status: 'pending',
          payment_method: selectedPayment,
          payment_status: 'pending',
          subtotal: subtotal,
          delivery_price: deliveryFee,
          total: total,
          delivery_address: {
            street: defaultAddress.street,
            number: defaultAddress.number,
            apartment: defaultAddress.apartment,
            city: defaultAddress.city,
            postal_code: defaultAddress.postal_code,
          },
          delivery_instructions: defaultAddress.instructions,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Crear los items del pedido
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name, // AGREGADO
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Limpiar carrito
      clearCart();

      // Navegar a confirmación
      onSuccess(order.id);

    } catch (error: any) {
      Alert.alert('Error', 'No se pudo crear el pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => `$${price.toLocaleString('es-AR')}`;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen del pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Tu pedido</Text>
          <View style={styles.card}>
            {items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <Text style={styles.orderItemQty}>{item.quantity}x</Text>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                </View>
                <Text style={styles.orderItemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Método de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Método de pago</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentBtn,
                selectedPayment === 'cash' && styles.paymentBtnActive,
              ]}
              onPress={() => setSelectedPayment('cash')}
              activeOpacity={0.8}
            >
              <Text style={styles.paymentIcon}>💵</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentLabel}>Efectivo</Text>
                <Text style={styles.paymentHint}>Pagás al delivery</Text>
              </View>
              {selectedPayment === 'cash' && (
                <View style={styles.paymentCheck}>
                  <Text style={styles.paymentCheckIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentBtn,
                selectedPayment === 'card' && styles.paymentBtnActive,
              ]}
              onPress={() => setSelectedPayment('card')}
              activeOpacity={0.8}
            >
              <Text style={styles.paymentIcon}>💳</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentLabel}>Tarjeta</Text>
                <Text style={styles.paymentHint}>Próximamente</Text>
              </View>
              {selectedPayment === 'card' && (
                <View style={styles.paymentCheck}>
                  <Text style={styles.paymentCheckIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentBtn,
                selectedPayment === 'mercadopago' && styles.paymentBtnActive,
              ]}
              onPress={() => setSelectedPayment('mercadopago')}
              activeOpacity={0.8}
            >
              <Text style={styles.paymentIcon}>🔵</Text>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentLabel}>Mercado Pago</Text>
                <Text style={styles.paymentHint}>Próximamente</Text>
              </View>
              {selectedPayment === 'mercadopago' && (
                <View style={styles.paymentCheck}>
                  <Text style={styles.paymentCheckIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Totales */}
        <View style={styles.section}>
          <View style={styles.card}>
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
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer con botón */}
      <View style={styles.footer}>
        <LinearGradient
          colors={['transparent', 'rgba(10,10,10,0.98)']}
          style={styles.footerGradient}
        >
          <Button
            label={`Confirmar pedido · ${formatPrice(total)}`}
            onPress={handleConfirmOrder}
            loading={loading}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text.primary,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  orderItemQty: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neon.primary,
    minWidth: 30,
  },
  orderItemName: {
    fontSize: 15,
    color: colors.text.primary,
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  paymentMethods: {
    gap: spacing.sm,
  },
  paymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    padding: spacing.base,
    gap: spacing.md,
  },
  paymentBtnActive: {
    borderColor: colors.neon.primary,
    backgroundColor: colors.neon.faint,
  },
  paymentIcon: {
    fontSize: 28,
  },
  paymentInfo: {
    flex: 1,
    gap: 2,
  },
  paymentLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  paymentHint: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  paymentCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neon.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentCheckIcon: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    lineHeight: 18,
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
