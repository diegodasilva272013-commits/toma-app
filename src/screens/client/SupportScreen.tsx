// src/screens/client/SupportScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { Button } from '../../components/atoms/Button';

interface SupportScreenProps {
  onBack: () => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    question: '¿Cómo funciona TOMA?',
    answer:
      'TOMA conecta directamente con los restaurantes, eliminando las comisiones del 30% de las apps tradicionales. Pagás el precio real del restaurante + delivery, sin sobrecargos.',
  },
  {
    id: '2',
    question: '¿Cuánto cuesta el delivery?',
    answer:
      'El costo de delivery lo define cada restaurante según la distancia. Lo ves claramente antes de pagar. Sin sorpresas.',
  },
  {
    id: '3',
    question: '¿Puedo cancelar un pedido?',
    answer:
      'Podés cancelar sin cargo hasta que el restaurante confirme. Una vez confirmado, contactanos y vemos caso por caso.',
  },
  {
    id: '4',
    question: '¿Cómo subo de nivel?',
    answer:
      'Ganás XP con cada pedido: 50 XP base + 1 XP por cada $100 que gastás. Al llegar a ciertos pedidos, subís de nivel y desbloqueás beneficios.',
  },
  {
    id: '5',
    question: '¿Qué son los videos IA?',
    answer:
      'Los restaurantes pueden generar videos cinematográficos de sus platos usando IA. Ayuda a ver el plato en movimiento antes de pedirlo.',
  },
  {
    id: '6',
    question: '¿Cómo funcionan los cupones?',
    answer:
      'Recibís cupones por email, notificaciones o por logros. Los aplicás al momento de pagar ingresando el código.',
  },
];

export const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Escribí tu mensaje');
      return;
    }

    Alert.alert(
      'Mensaje enviado',
      'Te responderemos a la brevedad por email',
      [{ text: 'OK', onPress: () => setMessage('') }]
    );
  };

  const handleOpenWhatsApp = () => {
    Linking.openURL('https://wa.me/59892034193?text=Hola,%20necesito%20ayuda%20con%20TOMA');
  };

  const handleOpenEmail = () => {
    Linking.openURL('mailto:toma-app@toma-app.com?subject=Ayuda%20con%20TOMA');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayuda y soporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Contacto rápido</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={handleOpenWhatsApp}
              activeOpacity={0.8}
            >
              <Text style={styles.contactIcon}>📱</Text>
              <Text style={styles.contactLabel}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={handleOpenEmail}
              activeOpacity={0.8}
            >
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={styles.contactLabel}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Preguntas frecuentes</Text>
          <View style={styles.faqList}>
            {FAQS.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Text style={styles.faqToggle}>
                    {expandedFAQ === faq.id ? '−' : '+'}
                  </Text>
                </TouchableOpacity>
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📨 Envianos un mensaje</Text>
          <View style={styles.messageBox}>
            <TextInput
              style={styles.messageInput}
              placeholder="Describí tu problema o consulta..."
              placeholderTextColor={colors.text.tertiary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Button
              label="Enviar mensaje"
              onPress={handleSendMessage}
              variant="neon"
              size="lg"
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Tiempo de respuesta promedio: 2 horas en días hábiles
          </Text>
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
    fontSize: 17,
    fontWeight: '800',
    color: colors.text.primary,
  },
  contactRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  contactBtn: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.sm,
  },
  contactIcon: {
    fontSize: 32,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  faqList: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    gap: spacing.md,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  faqToggle: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.neon.primary,
  },
  faqAnswer: {
    padding: spacing.base,
    paddingTop: 0,
    paddingBottom: spacing.base,
  },
  faqAnswerText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  messageBox: {
    gap: spacing.md,
  },
  messageInput: {
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.lg,
    padding: spacing.base,
    fontSize: 15,
    color: colors.text.primary,
    minHeight: 140,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.neon.faint,
    borderWidth: 1,
    borderColor: colors.neon.medium,
    borderRadius: radius.lg,
    padding: spacing.base,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
});
