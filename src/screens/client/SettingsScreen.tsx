// src/screens/client/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { supabase } from '../../services/supabase';

interface SettingsScreenProps {
  onBack: () => void;
  onEditProfilePress?: () => void;
  onAddressesPress?: () => void;
  onLegalPress?: (type: 'terms' | 'privacy' | 'cookies') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onEditProfilePress, onAddressesPress, onLegalPress }) => {
  const [loading, setLoading] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setPushNotifications(data.push_notifications);
      setEmailNotifications(data.email_notifications);
      setOrderUpdates(data.order_updates);
      setPromotions(data.promotions);
    } else {
      // Si no existen preferencias, crearlas
      await supabase
        .from('user_preferences')
        .insert({ user_id: user.id });
    }

    setLoading(false);
  };

  const updatePreference = async (field: string, value: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_preferences')
      .update({ [field]: value })
      .eq('user_id', user.id);
  };

  const handleTogglePush = (value: boolean) => {
    setPushNotifications(value);
    updatePreference('push_notifications', value);
  };

  const handleToggleEmail = (value: boolean) => {
    setEmailNotifications(value);
    updatePreference('email_notifications', value);
  };

  const handleToggleOrders = (value: boolean) => {
    setOrderUpdates(value);
    updatePreference('order_updates', value);
  };

  const handleTogglePromos = (value: boolean) => {
    setPromotions(value);
    updatePreference('promotions', value);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción es permanente y no se puede deshacer. Se eliminarán todos tus datos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;

              // Marcar perfil como deleted (borrado lógico)
              await supabase
                .from('profiles')
                .update({ 
                  deleted_at: new Date().toISOString(),
                  email: `deleted_${user.id}@toma.app` 
                })
                .eq('id', user.id);

              // Cerrar sesión
              await supabase.auth.signOut();

              Alert.alert(
                'Cuenta eliminada',
                'Tu cuenta ha sido eliminada correctamente',
                [{ text: 'OK' }]
              );
            } catch (error: any) {
              Alert.alert('Error', 'No se pudo eliminar la cuenta: ' + error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Cuenta</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={onEditProfilePress}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Editar perfil</Text>
                <Text style={styles.settingHint}>Nombre, email, teléfono</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={onAddressesPress}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Direcciones guardadas</Text>
                <Text style={styles.settingHint}>Mis direcciones</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Métodos de pago</Text>
                <Text style={styles.settingHint}>Tarjetas y Mercado Pago</Text>
              </View>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notificaciones</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Notificaciones push</Text>
                <Text style={styles.settingHint}>Alertas en tu dispositivo</Text>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={handleTogglePush}
                trackColor={{ false: colors.bg.elevated, true: colors.neon.medium }}
                thumbColor={pushNotifications ? colors.neon.primary : colors.text.tertiary}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Emails</Text>
                <Text style={styles.settingHint}>Resúmenes y recibos</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={handleToggleEmail}
                trackColor={{ false: colors.bg.elevated, true: colors.neon.medium }}
                thumbColor={emailNotifications ? colors.neon.primary : colors.text.tertiary}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Estado del pedido</Text>
                <Text style={styles.settingHint}>Confirmado, en camino, entregado</Text>
              </View>
              <Switch
                value={orderUpdates}
                onValueChange={handleToggleOrders}
                trackColor={{ false: colors.bg.elevated, true: colors.neon.medium }}
                thumbColor={orderUpdates ? colors.neon.primary : colors.text.tertiary}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Promociones y ofertas</Text>
                <Text style={styles.settingHint}>Cupones y descuentos</Text>
              </View>
              <Switch
                value={promotions}
                onValueChange={handleTogglePromos}
                trackColor={{ false: colors.bg.elevated, true: colors.neon.medium }}
                thumbColor={promotions ? colors.neon.primary : colors.text.tertiary}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Privacidad</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingRow} onPress={() => onLegalPress?.('terms')}>
              <Text style={styles.settingLabel}>Términos y condiciones</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={() => onLegalPress?.('privacy')}>
              <Text style={styles.settingLabel}>Política de privacidad</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={() => onLegalPress?.('cookies')}>
              <Text style={styles.settingLabel}>Política de cookies</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Zona peligrosa</Text>
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <Text style={styles.dangerBtnText}>Eliminar mi cuenta</Text>
          </TouchableOpacity>
          <Text style={styles.dangerHint}>
            Esta acción es permanente y no se puede deshacer
          </Text>
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>TOMA v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2026 TOMA App</Text>
        </View>

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
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text.primary,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    minHeight: 60,
  },
  settingLeft: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  settingHint: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  settingArrow: {
    fontSize: 16,
    color: colors.text.tertiary,
    marginLeft: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginLeft: spacing.base,
  },
  dangerBtn: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)',
    borderRadius: radius.lg,
    padding: spacing.base,
    alignItems: 'center',
  },
  dangerBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.error,
  },
  dangerHint: {
    fontSize: 13,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  appInfo: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.xl,
  },
  appVersion: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  appCopyright: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
});
