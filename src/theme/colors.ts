export const colors = {
  // ═══════════════════════════════════════
  // FONDOS — Dark Mode Cinematográfico
  // ═══════════════════════════════════════
  bg: {
    primary: '#0A0A0A',      // Negro absoluto (base)
    secondary: '#111111',    // Cards, modals
    tertiary: '#1A1A1A',     // Inputs, headers
    elevated: '#222222',     // Bottom sheets, tooltips
    overlay: 'rgba(0,0,0,0.85)',
    glass: 'rgba(17,17,17,0.8)',
  },

  // ═══════════════════════════════════════
  // BORDES & SEPARADORES
  // ═══════════════════════════════════════
  border: {
    subtle: '#1A1A1A',
    default: '#242424',
    strong: '#333333',
    neon: 'rgba(0, 255, 136, 0.3)',   // Verde neón con transparencia
    neonFull: '#00FF88',
  },

  // ═══════════════════════════════════════
  // TEXTOS
  // ═══════════════════════════════════════
  text: {
    primary: '#FFFFFF',
    secondary: '#AAAAAA',
    tertiary: '#666666',
    disabled: '#3A3A3A',
    inverse: '#0A0A0A',
    neon: '#00FF88',
    price: '#00FF88',
  },

  // ═══════════════════════════════════════
  // ACENTO PRINCIPAL — Verde Neón
  // ═══════════════════════════════════════
  neon: {
    primary: '#00FF88',       // El verde TOMA
    hover: '#00E07A',
    pressed: '#00CC6F',
    faint: 'rgba(0, 255, 136, 0.08)',
    subtle: 'rgba(0, 255, 136, 0.15)',
    medium: 'rgba(0, 255, 136, 0.25)',
    glow: 'rgba(0, 255, 136, 0.4)',
  },

  // ═══════════════════════════════════════
  // ESTADOS DE PEDIDO
  // ═══════════════════════════════════════
  status: {
    pending: {
      bg: 'rgba(255, 193, 7, 0.1)',
      text: '#FFC107',
      border: 'rgba(255, 193, 7, 0.3)',
    },
    preparing: {
      bg: 'rgba(33, 150, 243, 0.1)',
      text: '#2196F3',
      border: 'rgba(33, 150, 243, 0.3)',
    },
    ready: {
      bg: 'rgba(0, 255, 136, 0.1)',
      text: '#00FF88',
      border: 'rgba(0, 255, 136, 0.3)',
    },
    inDelivery: {
      bg: 'rgba(156, 39, 176, 0.1)',
      text: '#CE93D8',
      border: 'rgba(156, 39, 176, 0.3)',
    },
    delivered: {
      bg: 'rgba(0, 255, 136, 0.08)',
      text: '#00CC6F',
      border: 'rgba(0, 255, 136, 0.2)',
    },
    cancelled: {
      bg: 'rgba(244, 67, 54, 0.1)',
      text: '#EF9A9A',
      border: 'rgba(244, 67, 54, 0.3)',
    },
  },

  // ═══════════════════════════════════════
  // GAMIFICACIÓN — Niveles
  // ═══════════════════════════════════════
  level: {
    novato: '#666666',
    bronce: '#CD7F32',
    plata: '#C0C0C0',
    dorado: '#FFD700',
    platinum: '#00FF88',
    diamante: '#B9F2FF',
  },

  // ═══════════════════════════════════════
  // UTILITARIOS
  // ═══════════════════════════════════════
  error: '#FF4757',
  warning: '#FFA502',
  info: '#2196F3',
  success: '#00FF88',

  // Transparencias
  white10: 'rgba(255,255,255,0.1)',
  white20: 'rgba(255,255,255,0.2)',
  black50: 'rgba(0,0,0,0.5)',
  black80: 'rgba(0,0,0,0.8)',
};
