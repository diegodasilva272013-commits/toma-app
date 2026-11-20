// src/screens/client/OrderHistoryScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { LoadingLogo } from '../../components/atoms/LoadingLogo';
import { supabase } from '../../services/supabase';
import type { Order } from '../../types';

interface OrderHistoryScreenProps {
  onBack: () => void;
  onOrderPress: (order: Order) => void;
}

const ORDER_STATUS_LABELS = {
  pending: { label: 'Pendiente', color: '#FFB800', emoji: '⏳' },
  confirmed: { label: 'Confirmado', color: '#00B8D4', emoji: '✓' },
  preparing: { label: 'Preparando', color: '#FF9800', emoji: '🍳' },
  ready: { label: 'Listo', color: '#4CAF50', emoji: '✓' },
  assigned: { label: 'Asignado', color: '#9C27B0', emoji: '🏍️' },
  picking_up: { label: 'Retirando', color: '#FF5722', emoji: '📦' },
  in_delivery: { label: 'En camino', color: '#2196F3', emoji: '🚀' },
  delivered: { label: 'Entregado', color: '#00FF88', emoji: '✅' },
  cancelled: { label: 'Cancelado', color: '#FF4757', emoji: '✕' },
};

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({
  onBack,
  onOrderPress,
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data as Order[]);
    }

    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const formatPrice = (price: number) => `$${price.toLocaleString('es-AR')}`;
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingLogo size={100} message="Cargando pedidos..." />
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
        <Text style={styles.headerTitle}>Mis pedidos</Text>
        <View style={{ width: 40 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>Sin pedidos todavía</Text>
          <Text style={styles.emptyText}>
            Cuando hagas tu primer pedido, aparecerá acá
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.neon.primary}
            />
          }
          renderItem={({ item }) => {
            const statusInfo = ORDER_STATUS_LABELS[item.status as keyof typeof ORDER_STATUS_LABELS];
            return (
              <TouchableOpacity
                style={styles.orderCard}
                onPress={() => onOrderPress(item)}
                activeOpacity={0.8}
              >
                {/* Header */}
                <View style={styles.orderHeader}>
                  <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { borderColor: statusInfo.color + '40' },
                    ]}
                  >
                    <Text style={styles.statusEmoji}>{statusInfo.emoji}</Text>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>

                {/* Info */}
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>Pedido #{item.id.slice(0, 8)}</Text>
                  <Text style={styles.orderPrice}>{formatPrice(item.total)}</Text>
                </View>

                {/* Footer */}
                <View style={styles.orderFooter}>
                  <Text style={styles.orderMeta}>
                    {item.delivery_address && typeof item.delivery_address === 'object'
                      ? (item.delivery_address as any).street
                      : 'Dirección no disponible'}
                  </Text>
                  <Text style={styles.viewDetails}>Ver detalles →</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
    lineHeight: 22,
  },
  list: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 13,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  statusEmoji: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  orderId: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text.primary,
  },
  orderPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.neon.primary,
    letterSpacing: -0.3,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderMeta: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  viewDetails: {
    fontSize: 13,
    color: colors.neon.primary,
    fontWeight: '600',
  },
});
