import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, typography } from '../theme/index';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo aparece
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Glow pulsa
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Tagline sube
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(taglineY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Pausa
      Animated.delay(800),
    ]).start(() => onFinish());

  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Glow de fondo */}
      <Animated.View style={[styles.bgGlow, { opacity: glowOpacity }]}>
        <LinearGradient
          colors={['transparent', 'rgba(0, 255, 136, 0.04)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Logo: Viewfinder [T] + TOMA */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        {/* Viewfinder icon con T adentro */}
        <View style={styles.viewfinderContainer}>
          {/* Esquina superior izquierda */}
          <View style={[styles.corner, styles.cornerTL]} />
          {/* Esquina superior derecha */}
          <View style={[styles.corner, styles.cornerTR]} />
          {/* Esquina inferior izquierda */}
          <View style={[styles.corner, styles.cornerBL]} />
          {/* Esquina inferior derecha */}
          <View style={[styles.corner, styles.cornerBR]} />
          {/* T central */}
          <Text style={styles.viewfinderT}>T</Text>
        </View>

        {/* Texto TOMA */}
        <Text style={styles.logoText}>TOMA</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={[
          styles.taglineContainer,
          {
            opacity: taglineOpacity,
            transform: [{ translateY: taglineY }],
          },
        ]}
      >
        <Text style={styles.tagline}>Pedí directo. Comé mejor.</Text>
      </Animated.View>

      {/* Dots loader */}
      <Animated.View style={[styles.loader, { opacity: glowOpacity }]}>
        <LoadingDots />
      </Animated.View>
    </View>
  );
};

const LoadingDots: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.parallel([
            Animated.timing(dot1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
            Animated.timing(dot2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
            Animated.timing(dot3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          ]),
          Animated.delay(200),
        ])
      ).start();
    };
    animate();
  }, []);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[dot1, dot2, dot3].map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#00FF88',
            opacity: anim,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgGlow: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  viewfinderContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: '#00FF88',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  viewfinderT: {
    fontSize: 32,
    fontWeight: '900',
    color: '#00FF88',
    textShadowColor: 'rgba(0, 255, 136, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#00FF88',
    textShadowColor: 'rgba(0, 255, 136, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  taglineContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.tertiary,
    letterSpacing: 0.5,
  },
  loader: {
    position: 'absolute',
    bottom: 80,
  },
});
