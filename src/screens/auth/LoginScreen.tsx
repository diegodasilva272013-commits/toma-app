import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { useAuthStore } from '../../store/authStore';

interface LoginScreenProps {
  onLogin: (role: 'client' | 'restaurant' | 'delivery') => void;
  onGoRegister: () => void;
}

const TEST_USERS = [
  { role: 'client' as const,     label: 'Cliente',      emoji: '👤', color: '#00FF88' },
  { role: 'restaurant' as const, label: 'Restaurante',  emoji: '🍳', color: '#FFB800' },
  { role: 'delivery' as const,   label: 'Delivery',     emoji: '🏍️', color: '#7C83FF' },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completá email y contraseña');
      return;
    }
    setLoading(true);
    setError('');
    // TODO: Supabase auth real
    setTimeout(() => {
      setLoading(false);
      onLogin('client');
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      onLogin('client');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err?.message || 'Error al iniciar sesión con Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      <View style={styles.headerGlow}>
        <LinearGradient
          colors={['rgba(0, 255, 136, 0.08)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo — mismo que Splash */}
        <View style={styles.logoSection}>
          <View style={styles.logoRow}>
            {/* Viewfinder con T */}
            <View style={styles.viewfinderContainer}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <Text style={styles.viewfinderT}>T</Text>
            </View>
            <Text style={styles.logoText}>TOMA</Text>
          </View>
          <Text style={styles.welcome}>Bienvenido de vuelta</Text>
          <Text style={styles.subtitle}>Ingresá a tu cuenta</Text>
        </View>

        {/* TEST USERS — Solo en __DEV__ */}
        {__DEV__ && (
          <View style={styles.devSection}>
            <View style={styles.devHeader}>
              <View style={styles.devLine} />
              <Text style={styles.devTitle}>ACCESO RÁPIDO · TEST</Text>
              <View style={styles.devLine} />
            </View>
            <View style={styles.devCards}>
              {TEST_USERS.map((u) => (
                <TouchableOpacity
                  key={u.role}
                  onPress={() => onLogin(u.role)}
                  activeOpacity={0.75}
                  style={[styles.devCard, { borderColor: u.color + '50' }]}
                >
                  <LinearGradient
                    colors={[u.color + '18', 'transparent']}
                    style={styles.devCardInner}
                  >
                    <Text style={styles.devEmoji}>{u.emoji}</Text>
                    <Text style={[styles.devLabel, { color: u.color }]}>{u.label}</Text>
                    <Text style={styles.devHint}>tap para entrar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="EMAIL"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Input
            label="CONTRASEÑA"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={
              <Text style={{ color: colors.text.tertiary, fontSize: 13 }}>
                {showPassword ? 'Ocultar' : 'Ver'}
              </Text>
            }
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <Button
            label="Ingresar"
            onPress={handleLogin}
            loading={loading}
            variant="neon"
            size="xl"
          />

          {/* Separador */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continuar con</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <Button
            label="🔵  Continuar con Google"
            onPress={handleGoogleLogin}
            loading={googleLoading}
            variant="outline"
            size="xl"
          />
        </View>

        <TouchableOpacity onPress={onGoRegister} activeOpacity={0.7} style={styles.registerBtn}>
          <Text style={styles.registerText}>
            ¿No tenés cuenta?{' '}
            <Text style={styles.registerAccent}>Registrate gratis</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  headerGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 280 },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: 48,
    gap: spacing.xxl,
  },
  logoSection: { alignItems: 'center', gap: spacing.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: spacing.base },
  viewfinderContainer: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 16, height: 16, borderColor: '#00FF88' },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  viewfinderT: { fontSize: 32, fontWeight: '900', color: '#00FF88', textShadowColor: 'rgba(0, 255, 136, 0.6)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  logoText: { fontSize: 48, fontWeight: '900', letterSpacing: 6, color: '#00FF88', textShadowColor: 'rgba(0, 255, 136, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  welcome: { fontSize: 26, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: colors.text.tertiary },
  devSection: { gap: spacing.md },
  devHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  devLine: { flex: 1, height: 1, backgroundColor: colors.border.default },
  devTitle: { fontSize: 11, fontWeight: '700', color: colors.text.tertiary, letterSpacing: 1.5 },
  devCards: { flexDirection: 'row', gap: spacing.md },
  devCard: { flex: 1, borderWidth: 1, borderRadius: radius.xl, overflow: 'hidden' },
  devCardInner: { alignItems: 'center', paddingVertical: spacing.base, gap: 4 },
  devEmoji: { fontSize: 28 },
  devLabel: { fontSize: 13, fontWeight: '800' },
  devHint: { fontSize: 10, color: colors.text.tertiary, fontWeight: '500' },
  form: { gap: spacing.lg },
  errorBox: {
    backgroundColor: 'rgba(255,71,87,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,71,87,0.3)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  errorText: { color: colors.error, fontSize: 14 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -spacing.sm },
  forgotText: { color: colors.neon.primary, fontSize: 14, fontWeight: '500' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border.default },
  dividerText: { color: colors.text.tertiary, fontSize: 13, fontWeight: '500' },
  registerBtn: { alignItems: 'center' },
  registerText: { fontSize: 15, color: colors.text.tertiary },
  registerAccent: { color: colors.neon.primary, fontWeight: '600' },
});
