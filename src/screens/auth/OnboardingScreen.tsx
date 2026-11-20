import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { Button } from '../../components/atoms/Button';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  accent: string;
}

const slides: Slide[] = [
  {
    id: '1',
    emoji: '🎬',
    title: 'Cada plato,\nen video.',
    subtitle: 'No más fotos aburridas. Ves el plato real antes de pedirlo. Cinematográfico, como vos querés.',
    accent: '#00FF88',
  },
  {
    id: '2',
    emoji: '💰',
    title: 'Sin comisiones.\nPrecio real.',
    subtitle: 'Rappi te cobra 30% extra. Acá pedís directo al restaurante al precio real, siempre.',
    accent: '#00FF88',
  },
  {
    id: '3',
    emoji: '⚡',
    title: 'Tu delivery\nde confianza.',
    subtitle: 'El restaurante elige a su delivery. No un algoritmo. Gente de confianza que conocés.',
    accent: '#00FF88',
  },
];

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const renderItem: ListRenderItem<Slide> = ({ item, index }) => (
    <View style={styles.slide}>
      {/* Emoji grande */}
      <View style={styles.emojiContainer}>
        <View style={styles.emojiGlow} />
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>

      {/* Texto */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={onFinish}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Saltar</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [6, 24, 6],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
              />
            );
          })}
        </View>

        {/* CTA */}
        <Button
          label={currentIndex === slides.length - 1 ? 'Empezar ahora' : 'Siguiente'}
          onPress={goToNext}
          variant="neon"
          size="xl"
        />

        {/* Login link */}
        <TouchableOpacity onPress={onFinish} activeOpacity={0.7}>
          <Text style={styles.loginLink}>
            ¿Ya tenés cuenta? <Text style={styles.loginLinkAccent}>Ingresá</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.xl,
    zIndex: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: 15,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 100,
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  emojiGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 255, 136, 0.06)',
  },
  emoji: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    gap: spacing.base,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.text.secondary,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 48,
    gap: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neon.primary,
  },
  loginLink: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.text.tertiary,
    fontWeight: '400',
  },
  loginLinkAccent: {
    color: colors.neon.primary,
    fontWeight: '600',
  },
});
