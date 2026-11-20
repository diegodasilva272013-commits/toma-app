// src/screens/client/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { Button } from '../../components/atoms/Button';
import { LoadingLogo } from '../../components/atoms/LoadingLogo';
import { supabase } from '../../services/supabase';

interface ProfileScreenProps {
  onBack: () => void;
  onHistoryPress: () => void;
  onFavoritesPress: () => void;
  onCouponsPress: () => void;
  onSettingsPress: () => void;
  onSupportPress: () => void;
  onLogout: () => void;
}

interface ClientProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  level: string;
  xp: number;
  orders_count: number;
  total_spent: number;
  streak_days: number;
}

const LEVELS = {
  foodie_rookie: { label: 'Foodie Rookie', emoji: '🍽️', color: '#A0AEC0', xpMin: 0 },
  local_hero: { label: 'Local Hero', emoji: '⭐', color: '#FFB800', xpMin: 500 },
  verified_critic: { label: 'Verified Critic', emoji: '👨‍🍳', color: '#FF6B6B', xpMin: 1500 },
  gourmet_legend: { label: 'Gourmet Legend', emoji: '💎', color: '#00FF88', xpMin: 5000 },
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onHistoryPress,
  onFavoritesPress,
  onCouponsPress,
  onSettingsPress,
  onSupportPress,
  onLogout,
}) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ClientProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: clientData } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData || clientData) {
        setProfile({
          id: user.id,
          email: profileData?.email || user.email || '',
          full_name: profileData?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
          avatar_url: profileData?.avatar_url || user.user_metadata?.avatar_url || null,
          level: clientData?.level || 'foodie_rookie',
          xp: clientData?.xp || 0,
          orders_count: clientData?.orders_count || 0,
          total_spent: clientData?.total_spent || 0,
          streak_days: clientData?.streak_days || 0,
        });
      } else {
        // No hay datos en tablas — crear perfil local con datos de auth
        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario',
          avatar_url: user.user_metadata?.avatar_url || null,
          level: 'foodie_rookie',
          xp: 0,
          orders_count: 0,
          total_spent: 0,
          streak_days: 0,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que querés salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            onLogout();
          },
        },
      ]
    );
  };

  const formatPrice = (price: number) => `$${price.toLocaleString('es-AR')}`;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingLogo size={100} message="Cargando perfil..." />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text.tertiary, fontSize: 16 }}>
            No se pudo cargar el perfil
          </Text>
          <Button
            label="Volver"
            onPress={onBack}
            variant="outline"
            size="md"
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </View>
    );
  }

  const currentLevel = LEVELS[profile.level as keyof typeof LEVELS];
  const nextLevelKey = Object.keys(LEVELS).find(
    (key) => LEVELS[key as keyof typeof LEVELS].xpMin > profile.xp
  ) as keyof typeof LEVELS | undefined;
  const nextLevel = nextLevelKey ? LEVELS[nextLevelKey] : null;
  const progress = nextLevel
    ? ((profile.xp - currentLevel.xpMin) / (nextLevel.xpMin - currentLevel.xpMin)) * 100
    : 100;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(0, 255, 136, 0.1)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar y nombre */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {profile.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.avatarImage}
              />
            ) : (
              <LinearGradient
                colors={[currentLevel.color, currentLevel.color + 'AA']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarInitial}>
                  {profile.full_name?.[0]?.toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
            )}
          </View>
          <Text style={styles.userName}>{profile.full_name || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
        </View>

        {/* Nivel y progreso */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelEmoji}>{currentLevel.emoji}</Text>
              <Text style={[styles.levelName, { color: currentLevel.color }]}>
                {currentLevel.label}
              </Text>
            </View>
            <Text style={styles.xpText}>{profile.xp} XP</Text>
          </View>

          {nextLevel && (
            <>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]}>
                  <LinearGradient
                    colors={['#00FF88', '#00CC6F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              </View>
              <Text style={styles.progressText}>
                {nextLevel.xpMin - profile.xp} XP para {nextLevel.label}
              </Text>
            </>
          )}

          {/* Racha */}
          {profile.streak_days > 0 && (
            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>
                {profile.streak_days} días de racha
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.orders_count}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatPrice(profile.total_spent)}</Text>
            <Text style={styles.statLabel}>Gastado</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {formatPrice(Math.round(profile.total_spent * 0.3))}
            </Text>
            <Text style={styles.statLabel}>Ahorrado vs Rappi</Text>
          </View>
        </View>

        {/* Menú */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={onHistoryPress}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>📦</Text>
              <Text style={styles.menuLabel}>Mis pedidos</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onFavoritesPress}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>❤️</Text>
              <Text style={styles.menuLabel}>Favoritos</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onCouponsPress}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🎁</Text>
              <Text style={styles.menuLabel}>Cupones y descuentos</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onSettingsPress}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuLabel}>Configuración</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onSupportPress}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>💬</Text>
              <Text style={styles.menuLabel}>Ayuda y soporte</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <Button
          label="Cerrar sesión"
          onPress={handleLogout}
          variant="outline"
          size="lg"
          style={{ marginTop: spacing.xl }}
        />

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '900',
    color: '#000',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text.primary,
  },
  userEmail: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  levelCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  levelEmoji: {
    fontSize: 24,
  },
  levelName: {
    fontSize: 17,
    fontWeight: '800',
  },
  xpText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.bg.elevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 13,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 100, 0, 0.1)',
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 100, 0, 0.3)',
  },
  streakEmoji: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6400',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.neon.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  menu: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  menuArrow: {
    fontSize: 16,
    color: colors.text.tertiary,
  },
});
