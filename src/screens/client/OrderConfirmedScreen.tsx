// src/screens/client/OrderConfirmedScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing } from '@theme/index';
import { Button } from '@components/atoms/Button';

interface OrderConfirmedScreenProps {
  orderId: string;
  onViewOrder: () => void;
  onBackHome: () => void;
}

export const OrderConfirmedScreen: React.FC<OrderConfirmedScreenProps> = ({
  orderId,
  onViewOrder,
  onBackHome,
}) => {
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkRotate = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación del check
    Animated.sequence([
      Animated.parallel([
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(checkRotate, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Auto-redirigir al home después de 10 segundos como fallback
    const timer = setTimeout(() => {
      onBackHome();
    }, 10000);

    return () => {
      clearTimeout(timer);
      checkScale.stopAnimation();
      checkRotate.stopAnimation();
      glowOpacity.stopAnimation();
    };
  }, []);

  const rotate = checkRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-30deg', '0deg'],
  });

  const estimatedTime = 35; // minutos

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={['rgba(0, 255, 136, 0.1)', 'transparent', 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Animación del check */}
        <View style={styles.checkContainer}>
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity: glowOpacity,
                transform: [{ scale: 1.5 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.checkCircle,
              {
                transform: [{ scale: checkScale }, { rotate }],
              },
            ]}
          >
            <LinearGradient
              colors={['#00FF88', '#00CC6F']}
              style={styles.checkGradient}
            >
              <Text style={styles.checkIcon}>✓</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Textos */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>¡Pedido confirmado!</Text>
          <Text style={styles.subtitle}>
            Tu pedido está siendo preparado
          </Text>
        </View>

        {/* Info del pedido */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número de pedido</Text>
            <Text style={styles.infoValue}>#{orderId.slice(0, 8).toUpperCase()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tiempo estimado</Text>
            <Text style={styles.infoValue}>{estimatedTime} min</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Pedido recibido</Text>
              <Text style={styles.timelineTime}>Ahora</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Preparando</Text>
              <Text style={styles.timelineTime}>~10 min</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>En camino</Text>
              <Text style={styles.timelineTime}>~25 min</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Entregado</Text>
              <Text style={styles.timelineTime}>~{estimatedTime} min</Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.actions}>
          <Button
            label="Ver estado del pedido"
            onPress={onViewOrder}
            variant="neon"
            size="xl"
          />
          <Button
            label="Volver al inicio"
            onPress={onBackHome}
            variant="outline"
            size="lg"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingTop: 100,
    paddingBottom: 60,
    gap: spacing.xxl,
  },
  checkContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.3)',
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  checkGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neon.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  checkIcon: {
    fontSize: 60,
    fontWeight: '900',
    color: '#000',
  },
  textContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: 16,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neon.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.bg.secondary,
    borderWidth: 2,
    borderColor: colors.border.default,
    marginTop: 2,
  },
  timelineDotActive: {
    backgroundColor: colors.neon.primary,
    borderColor: colors.neon.primary,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.sm,
  },
  timelineLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border.default,
    marginLeft: 9,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
