import { StyleSheet } from 'react-native';

// Fuentes: Playfair Display (food names) + DM Sans (UI) + DM Mono (numbers)
export const typography = StyleSheet.create({
  // DISPLAY — Para nombres de platos, heroes
  displayXL: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 52,
    color: '#FFFFFF',
  },
  displayL: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: 40,
    color: '#FFFFFF',
  },

  // HEADINGS
  h1: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 34,
    color: '#FFFFFF',
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 28,
    color: '#FFFFFF',
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  h4: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 22,
    color: '#FFFFFF',
  },

  // BODY
  bodyL: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.1,
    lineHeight: 26,
    color: '#AAAAAA',
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 22,
    color: '#AAAAAA',
  },
  bodyS: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 18,
    color: '#666666',
  },

  // PRECIOS — Monoespaciado, verde
  priceXL: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
    color: '#00FF88',
  },
  priceL: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#00FF88',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    color: '#00FF88',
  },

  // LABELS & CAPS
  labelL: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 20,
    textTransform: 'uppercase',
    color: '#666666',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    lineHeight: 16,
    textTransform: 'uppercase',
    color: '#666666',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 16,
    color: '#666666',
  },
});
