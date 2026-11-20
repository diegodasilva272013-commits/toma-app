// src/components/atoms/LoadingLogo.tsx (REEMPLAZAR COMPLETO)
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '../../theme/index';

interface LoadingLogoProps {
  size?: number;
  message?: string;
}

export const LoadingLogo: React.FC<LoadingLogoProps> = ({ 
  size = 100, 
  message 
}) => {
  const heartbeat = useRef(new Animated.Value(1)).current;
  const dotOpacity1 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity2 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Latido bien marcado: pump fuerte → baja → pump chico → baja → pausa
    Animated.loop(
      Animated.sequence([
        // Pump fuerte
        Animated.timing(heartbeat, { toValue: 1.25, duration: 130, useNativeDriver: true }),
        Animated.timing(heartbeat, { toValue: 0.95, duration: 120, useNativeDriver: true }),
        // Pump chico
        Animated.timing(heartbeat, { toValue: 1.12, duration: 110, useNativeDriver: true }),
        Animated.timing(heartbeat, { toValue: 1, duration: 130, useNativeDriver: true }),
        // Pausa entre latidos
        Animated.delay(550),
      ])
    ).start();

    // Dots secuenciales
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity1, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotOpacity2, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotOpacity3, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(dotOpacity1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(300),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Visor [T] con latido */}
      <Animated.View
        style={{
          transform: [{ scale: heartbeat }],
          alignItems: 'center',
        }}
      >
        <View style={[styles.viewfinder, { width: size * 0.55, height: size * 0.55 }]}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Text style={[styles.viewfinderT, { fontSize: size * 0.3 }]}>T</Text>
        </View>
      </Animated.View>

      {/* Mensaje */}
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}

      {/* Dots */}
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, { opacity: dotOpacity1 }]} />
        <Animated.View style={[styles.dot, { opacity: dotOpacity2 }]} />
        <Animated.View style={[styles.dot, { opacity: dotOpacity3 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.lg,
  },
  viewfinder: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: '#00FF88',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 4,
  },
  viewfinderT: {
    fontWeight: '900',
    color: '#00FF88',
    textShadowColor: 'rgba(0, 255, 136, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  logoText: {
    fontWeight: '900',
    color: '#00FF88',
    letterSpacing: 6,
    marginTop: 8,
    textShadowColor: 'rgba(0, 255, 136, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  message: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neon.primary,
  },
});
