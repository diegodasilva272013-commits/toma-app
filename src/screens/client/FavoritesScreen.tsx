// src/screens/client/FavoritesScreen.tsx
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
import { RestaurantCard } from '../../components/cards/RestaurantCard';
import { LoadingLogo } from '../../components/atoms/LoadingLogo';
import { supabase } from '../../services/supabase';
import type { Restaurant } from '../../types/index';

interface FavoritesScreenProps {
  onBack: () => void;
  onRestaurantPress: (restaurant: Restaurant) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  onBack,
  onRestaurantPress,
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Restaurant[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Obtener los IDs de restaurantes favoritos
    const { data: favData } = await supabase
      .from('favorites')
      .select('restaurant_id')
      .eq('client_id', user.id);

    if (favData && favData.length > 0) {
      const restaurantIds = favData.map(f => f.restaurant_id);

      // Obtener los datos completos de los restaurantes
      const { data: restaurantsData } = await supabase
        .from('restaurants')
        .select('*')
        .in('id', restaurantIds)
        .eq('is_active', true);

      if (restaurantsData) {
        setFavorites(restaurantsData as Restaurant[]);
      }
    }

    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingLogo size={100} message="Cargando favoritos..." />
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
        <Text style={styles.headerTitle}>Favoritos</Text>
        <View style={{ width: 40 }} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>❤️</Text>
          <Text style={styles.emptyTitle}>Sin favoritos todavía</Text>
          <Text style={styles.emptyText}>
            Guardá tus restaurantes favoritos para encontrarlos más rápido
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
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
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => onRestaurantPress(item)}
              variant="vertical"
            />
          )}
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
    paddingBottom: 100,
  },
});
