// src/screens/client/OrderVideoScreen.tsx
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Animated } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@theme/index';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const VISOR_MARGIN = 20;
const VISOR_W = SCREEN_W - VISOR_MARGIN * 2;
const VISOR_H = SCREEN_H - 140; // espacio para skip arriba y margen abajo
const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;
const CORNER_RADIUS = 8;

interface OrderVideoScreenProps {
  onFinish: () => void;
}

const VIDEO_URL = 'https://vaczajhxkbhpmildxhqo.supabase.co/storage/v1/object/public/toma-app-videos-test/Pedidos%20en%20accio%20Test/Cinematic_8second_vertical_202602181849_qclj.mp4';

export const OrderVideoScreen: React.FC<OrderVideoScreenProps> = ({ onFinish }) => {
  const videoRef = useRef<Video>(null);
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Glow pulsante en las esquinas
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    return () => glowAnim.stopAnimation();
  }, []);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />

      {/* Visor frame */}
      <View style={styles.visorContainer}>
        {/* Video dentro del visor */}
        <View style={styles.videoWrapper}>
          <Video
            ref={videoRef}
            source={{ uri: VIDEO_URL }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping={false}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
        </View>

        {/* Esquinas del visor estilo logo [T] */}
        <Animated.View style={[styles.corner, styles.cornerTL, { opacity: glowAnim }]} />
        <Animated.View style={[styles.corner, styles.cornerTR, { opacity: glowAnim }]} />
        <Animated.View style={[styles.corner, styles.cornerBL, { opacity: glowAnim }]} />
        <Animated.View style={[styles.corner, styles.cornerBR, { opacity: glowAnim }]} />

        {/* Líneas sutiles conectando esquinas */}
        <View style={styles.borderTop} />
        <View style={styles.borderBottom} />
        <View style={styles.borderLeft} />
        <View style={styles.borderRight} />
      </View>

      {/* Marca "TOMA" abajo */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandText}>TOMA</Text>
      </View>

      {/* Botón saltar */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={handleSkip}
        activeOpacity={0.8}
      >
        <View style={styles.skipBtnInner}>
          <Text style={styles.skipText}>Saltar →</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visorContainer: {
    width: VISOR_W,
    height: VISOR_H,
    position: 'relative',
  },
  videoWrapper: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
    margin: CORNER_THICKNESS,
  },
  video: {
    flex: 1,
  },
  // Esquinas neón del visor
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#00FF88',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: CORNER_RADIUS,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: CORNER_RADIUS,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: CORNER_RADIUS,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: CORNER_RADIUS,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  // Líneas sutiles entre esquinas
  borderTop: {
    position: 'absolute',
    top: 0,
    left: CORNER_SIZE,
    right: CORNER_SIZE,
    height: 1,
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
  },
  borderBottom: {
    position: 'absolute',
    bottom: 0,
    left: CORNER_SIZE,
    right: CORNER_SIZE,
    height: 1,
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
  },
  borderLeft: {
    position: 'absolute',
    left: 0,
    top: CORNER_SIZE,
    bottom: CORNER_SIZE,
    width: 1,
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
  },
  borderRight: {
    position: 'absolute',
    right: 0,
    top: CORNER_SIZE,
    bottom: CORNER_SIZE,
    width: 1,
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
  },
  // Marca TOMA debajo del visor
  brandContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00FF88',
    letterSpacing: 6,
    textShadowColor: 'rgba(0, 255, 136, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  skipBtnInner: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
