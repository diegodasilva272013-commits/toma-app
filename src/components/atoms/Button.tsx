import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../../theme/index';

type ButtonVariant = 'neon' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'neon',
  size = 'lg',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
}) => {
  const isDisabled = disabled || loading;

  const sizeStyles: Record<ButtonSize, { height: number; paddingH: number; fontSize: number }> = {
    sm: { height: 36, paddingH: 16, fontSize: 13 },
    md: { height: 44, paddingH: 20, fontSize: 14 },
    lg: { height: 52, paddingH: 24, fontSize: 15 },
    xl: { height: 60, paddingH: 28, fontSize: 17 },
  };

  const { height, paddingH, fontSize } = sizeStyles[size];

  const containerBase: ViewStyle = {
    height,
    paddingHorizontal: paddingH,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    alignSelf: fullWidth ? 'auto' : 'flex-start',
    opacity: isDisabled ? 0.4 : 1,
  };

  const textBase: TextStyle = {
    fontSize,
    fontWeight: '700',
    letterSpacing: 0.3,
  };

  if (variant === 'neon') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[{ borderRadius: radius.full, overflow: 'hidden' }, style]}
      >
        <LinearGradient
          colors={['#00FF88', '#00CC6F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[containerBase, { paddingHorizontal: paddingH }]}
        >
          {loading ? (
            <ActivityIndicator color="#000000" size="small" />
          ) : (
            <>
              {icon && iconPosition === 'left' && icon}
              <Text style={[textBase, { color: '#000000' }]}>{label}</Text>
              {icon && iconPosition === 'right' && icon}
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[
          containerBase,
          {
            borderWidth: 1.5,
            borderColor: colors.neon.primary,
            backgroundColor: colors.neon.faint,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.neon.primary} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <Text style={[textBase, { color: colors.neon.primary }]}>{label}</Text>
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[containerBase, style]}
      >
        {loading ? (
          <ActivityIndicator color={colors.text.secondary} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <Text style={[textBase, { color: colors.text.secondary }]}>{label}</Text>
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </TouchableOpacity>
    );
  }

  // danger
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        containerBase,
        {
          backgroundColor: 'rgba(255, 71, 87, 0.12)',
          borderWidth: 1,
          borderColor: 'rgba(255, 71, 87, 0.3)',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.error} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[textBase, { color: colors.error }]}>{label}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};
