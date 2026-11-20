// src/screens/client/EditProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { LoadingLogo } from '../../components/atoms/LoadingLogo';
import { supabase } from '../../services/supabase';

interface EditProfileScreenProps {
  onBack: () => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || '');
        setPhone(profile.phone || '');
      }
      setEmail(user.email || '');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Actualizar perfil
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Error', 'No se pudo actualizar el perfil');
      } else {
        Alert.alert('¡Listo!', 'Perfil actualizado correctamente', [
          { text: 'OK', onPress: onBack },
        ]);
      }
    }

    setSaving(false);
  };

  const handleChangePhoto = () => {
    // TODO: Implementar selección de foto
    Alert.alert('Próximamente', 'La función de cambiar foto estará disponible pronto');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingLogo size={100} message="Cargando perfil..." />
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
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handleChangePhoto}>
            <LinearGradient
              colors={[colors.neon.primary, colors.neon.primary + 'AA']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarInitial}>
                {fullName[0]?.toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeIcon}>📷</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tocá para cambiar foto</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Input
            label="NOMBRE COMPLETO"
            placeholder="Tu nombre"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <Input
            label="EMAIL"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false}
            rightIcon={<Text style={styles.lockedIcon}>🔒</Text>}
          />
          <Text style={styles.hint}>
            El email no se puede cambiar. Contactá soporte si necesitás modificarlo.
          </Text>

          <Input
            label="TELÉFONO"
            placeholder="+598 99 123 456"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Botones */}
        <View style={styles.actions}>
          <Button
            label="Guardar cambios"
            onPress={handleSave}
            loading={saving}
            variant="neon"
            size="xl"
          />
          <Button
            label="Cancelar"
            onPress={onBack}
            variant="outline"
            size="lg"
          />
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
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg.primary,
    borderWidth: 2,
    borderColor: colors.neon.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeIcon: {
    fontSize: 16,
  },
  avatarHint: {
    fontSize: 13,
    color: colors.text.tertiary,
  },
  form: {
    gap: spacing.lg,
  },
  lockedIcon: {
    fontSize: 14,
  },
  hint: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: -spacing.md,
    lineHeight: 18,
  },
  actions: {
    gap: spacing.md,
  },
});
