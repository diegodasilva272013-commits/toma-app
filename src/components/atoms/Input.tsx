import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../theme/index';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  ...textInputProps
}) => {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
    ? colors.neon.primary
    : colors.border.default;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[typography.label, styles.label]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: focused
              ? colors.bg.tertiary
              : colors.bg.secondary,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          {...textInputProps}
          onFocus={(e) => {
            setFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            textInputProps.onBlur?.(e);
          }}
          style={[
            styles.input,
            leftIcon ? { paddingLeft: 0 } : null,
            rightIcon ? { paddingRight: 0 } : null,
          ]}
          placeholderTextColor={colors.text.tertiary}
          selectionColor={colors.neon.primary}
          cursorColor={colors.neon.primary}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      {hint && !error && (
        <Text style={styles.hint}>{hint}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    height: 52,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    letterSpacing: -0.1,
  },
  leftIcon: {
    opacity: 0.6,
  },
  rightIcon: {
    padding: spacing.xs,
  },
  error: {
    fontSize: 13,
    color: colors.error,
    marginTop: 2,
  },
  hint: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});
