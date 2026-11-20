// src/screens/client/CouponsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius } from '../../theme/index';
import { Button } from '../../components/atoms/Button';

interface CouponsScreenProps {
  onBack: () => void;
}

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount: string;
  expiresAt: string;
  isUsed: boolean;
}

const MOCK_COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'BIENVENIDO20',
    description: '20% off en tu primer pedido',
    discount: '20%',
    expiresAt: '2026-03-31',
    isUsed: false,
  },
  {
    id: '2',
    code: 'DELIVERY0',
    description: 'Envío gratis en tu próximo pedido',
    discount: 'Envío gratis',
    expiresAt: '2026-02-28',
    isUsed: false,
  },
  {
    id: '3',
    code: 'TOMA10',
    description: '$1.000 de descuento en pedidos +$5.000',
    discount: '$1.000',
    expiresAt: '2026-04-15',
    isUsed: true,
  },
];

export const CouponsScreen: React.FC<CouponsScreenProps> = ({ onBack }) => {
  const [couponCode, setCouponCode] = useState('');
  const [coupons] = useState<Coupon[]>(MOCK_COUPONS);

  const handleRedeemCode = () => {
    if (!couponCode.trim()) {
      Alert.alert('Error', 'Ingresá un código de cupón');
      return;
    }
    Alert.alert('Cupón', `Código "${couponCode}" ingresado. Verificando...`);
    setCouponCode('');
  };

  const activeCoupons = coupons.filter(c => !c.isUsed);
  const usedCoupons = coupons.filter(c => c.isUsed);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cupones y descuentos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ingresar código */}
        <View style={styles.redeemSection}>
          <Text style={styles.sectionTitle}>🎟️ Tengo un código</Text>
          <View style={styles.redeemRow}>
            <TextInput
              style={styles.codeInput}
              placeholder="Ingresá tu código..."
              placeholderTextColor={colors.text.tertiary}
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
            <Button
              label="Canjear"
              onPress={handleRedeemCode}
              variant="neon"
              size="md"
              fullWidth={false}
            />
          </View>
        </View>

        {/* Cupones activos */}
        {activeCoupons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎁 Cupones disponibles</Text>
            {activeCoupons.map((coupon) => (
              <View key={coupon.id} style={styles.couponCard}>
                <LinearGradient
                  colors={['rgba(0, 255, 136, 0.08)', 'rgba(0, 255, 136, 0.02)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={styles.couponLeft}>
                  <Text style={styles.couponDiscount}>{coupon.discount}</Text>
                </View>
                <View style={styles.couponRight}>
                  <Text style={styles.couponDescription}>{coupon.description}</Text>
                  <Text style={styles.couponCode}>{coupon.code}</Text>
                  <Text style={styles.couponExpiry}>
                    Vence: {new Date(coupon.expiresAt).toLocaleDateString('es-AR')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Cupones usados */}
        {usedCoupons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ Usados</Text>
            {usedCoupons.map((coupon) => (
              <View key={coupon.id} style={[styles.couponCard, styles.couponUsed]}>
                <View style={styles.couponLeft}>
                  <Text style={[styles.couponDiscount, { color: colors.text.tertiary }]}>
                    {coupon.discount}
                  </Text>
                </View>
                <View style={styles.couponRight}>
                  <Text style={[styles.couponDescription, { color: colors.text.tertiary }]}>
                    {coupon.description}
                  </Text>
                  <Text style={[styles.couponCode, { color: colors.text.disabled }]}>
                    {coupon.code}
                  </Text>
                </View>
              </View>
            ))}
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
  redeemSection: {
    gap: spacing.md,
  },
  redeemRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    height: 48,
    fontSize: 15,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text.primary,
  },
  couponCard: {
    flexDirection: 'row',
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.neon,
    overflow: 'hidden',
  },
  couponUsed: {
    borderColor: colors.border.subtle,
    opacity: 0.6,
  },
  couponLeft: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border.subtle,
    borderStyle: 'dashed',
    padding: spacing.md,
  },
  couponDiscount: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.neon.primary,
    textAlign: 'center',
  },
  couponRight: {
    flex: 1,
    padding: spacing.base,
    gap: spacing.xs,
  },
  couponDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  couponCode: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neon.primary,
    letterSpacing: 1,
  },
  couponExpiry: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
});
