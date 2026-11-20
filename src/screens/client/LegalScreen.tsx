// src/screens/client/LegalScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';

interface LegalScreenProps {
  onBack: () => void;
  type: 'terms' | 'privacy' | 'cookies';
}

const CONTENT = {
  terms: {
    title: 'Términos y Condiciones',
    sections: [
      {
        title: '1. Aceptación de los Términos',
        content: 'Al utilizar TOMA, aceptás estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no deberías usar nuestra plataforma.',
      },
      {
        title: '2. Descripción del Servicio',
        content: 'TOMA es una plataforma que conecta directamente a los clientes con restaurantes, eliminando intermediarios y comisiones excesivas. No cobramos comisión del 30% como otras plataformas.',
      },
      {
        title: '3. Cuenta de Usuario',
        content: 'Sos responsable de mantener la confidencialidad de tu cuenta y contraseña. Aceptás ser responsable de todas las actividades que ocurran bajo tu cuenta.',
      },
      {
        title: '4. Pedidos y Pagos',
        content: 'Los precios mostrados son los del restaurante sin sobrecargos. El pago puede realizarse en efectivo al delivery o mediante los métodos de pago disponibles en la app.',
      },
      {
        title: '5. Cancelaciones y Reembolsos',
        content: 'Podés cancelar un pedido antes de que sea confirmado por el restaurante. Una vez confirmado, contactá al soporte para evaluar tu caso específico.',
      },
      {
        title: '6. Limitación de Responsabilidad',
        content: 'TOMA actúa como intermediario entre clientes y restaurantes. No somos responsables por la calidad de los productos ni por demoras en la entrega causadas por factores externos.',
      },
    ],
  },
  privacy: {
    title: 'Política de Privacidad',
    sections: [
      {
        title: '1. Información que Recopilamos',
        content: 'Recopilamos información que nos proporcionás directamente: nombre, email, teléfono, dirección de entrega, y datos de pedidos.',
      },
      {
        title: '2. Uso de la Información',
        content: 'Usamos tu información para procesar pedidos, mejorar nuestros servicios, enviarte notificaciones sobre el estado de tus pedidos, y comunicarnos contigo.',
      },
      {
        title: '3. Compartir Información',
        content: 'Compartimos tu información solo con los restaurantes necesarios para procesar tu pedido y con los deliveries para realizar la entrega. Nunca vendemos tu información a terceros.',
      },
      {
        title: '4. Seguridad',
        content: 'Implementamos medidas de seguridad para proteger tu información personal. Usamos encriptación y almacenamiento seguro en Supabase.',
      },
      {
        title: '5. Tus Derechos',
        content: 'Tenés derecho a acceder, corregir o eliminar tu información personal en cualquier momento. Podés hacerlo desde la configuración de tu cuenta o contactándonos.',
      },
      {
        title: '6. Cambios en esta Política',
        content: 'Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos mediante email o notificación en la app.',
      },
    ],
  },
  cookies: {
    title: 'Política de Cookies',
    sections: [
      {
        title: '1. ¿Qué son las Cookies?',
        content: 'Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando usás nuestra plataforma.',
      },
      {
        title: '2. Cookies que Utilizamos',
        content: 'Usamos cookies esenciales para el funcionamiento de la app (autenticación, sesión) y cookies analíticas para entender cómo usás TOMA y mejorar la experiencia.',
      },
      {
        title: '3. Cookies de Terceros',
        content: 'Usamos servicios de terceros como Supabase para autenticación y almacenamiento. Estos servicios pueden colocar sus propias cookies.',
      },
      {
        title: '4. Control de Cookies',
        content: 'Podés configurar tu navegador o dispositivo para rechazar cookies, pero esto puede afectar la funcionalidad de la app.',
      },
      {
        title: '5. Actualizaciones',
        content: 'Esta política puede actualizarse para reflejar cambios en nuestras prácticas o por requerimientos legales.',
      },
    ],
  },
};

export const LegalScreen: React.FC<LegalScreenProps> = ({ onBack, type }) => {
  const content = CONTENT[type];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{content.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Última actualización: 19 de febrero de 2026</Text>

        {content.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Si tenés preguntas sobre estos términos, contactanos en:
          </Text>
          <Text style={styles.footerEmail}>toma-app@toma-app.com</Text>
          <Text style={styles.footerPhone}>+598 92 034 193</Text>
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.text.primary,
    textAlign: 'center',
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  lastUpdated: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionContent: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  footer: {
    marginTop: spacing.xxl,
    padding: spacing.base,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  footerEmail: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neon.primary,
  },
  footerPhone: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neon.primary,
  },
});
