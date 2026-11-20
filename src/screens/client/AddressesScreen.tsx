// src/screens/client/AddressesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, radius } from '../../theme/index';
import { Button } from '../../components/atoms/Button';
import { LoadingLogo } from '../../components/atoms/LoadingLogo';
import { Input } from '../../components/atoms/Input';
import { supabase } from '../../services/supabase';

interface AddressesScreenProps {
  onBack: () => void;
}

interface Address {
  id: string;
  client_id?: string;
  street: string;
  number: string;
  apartment?: string;
  city: string;
  postal_code?: string;
  instructions?: string;
  is_default: boolean;
  created_at?: string;
}

export const AddressesScreen: React.FC<AddressesScreenProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('saved_addresses')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando direcciones:', error);
      } else if (data) {
        setAddresses(data as Address[]);
      }
    }
    setLoading(false);
  };

  const handleAddAddress = () => {
    setEditingAddress({
      id: '',
      street: '',
      number: '',
      apartment: '',
      city: 'Buenos Aires',
      postal_code: '',
      instructions: '',
      is_default: addresses.length === 0,
    });
    setShowModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  const handleSaveAddress = async () => {
    if (!editingAddress) return;

    if (!editingAddress.street.trim() || !editingAddress.number.trim()) {
      Alert.alert('Error', 'Calle y número son obligatorios');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'No se pudo obtener el usuario');
        return;
      }

      const isEditing = editingAddress.id && addresses.some(a => a.id === editingAddress.id);

      if (isEditing) {
        // Actualizar dirección existente
        const { error } = await supabase
          .from('saved_addresses')
          .update({
            street: editingAddress.street,
            number: editingAddress.number,
            apartment: editingAddress.apartment || null,
            city: editingAddress.city,
            postal_code: editingAddress.postal_code || null,
            instructions: editingAddress.instructions || null,
            is_default: editingAddress.is_default,
          })
          .eq('id', editingAddress.id);

        if (error) {
          console.error('Error actualizando dirección:', error);
          Alert.alert('Error', 'No se pudo actualizar la dirección: ' + error.message);
          return;
        }
      } else {
        // Si va a ser default, quitar default de las demás
        if (editingAddress.is_default && addresses.length > 0) {
          await supabase
            .from('saved_addresses')
            .update({ is_default: false })
            .eq('client_id', user.id);
        }

        // Insertar nueva dirección
        const { error } = await supabase
          .from('saved_addresses')
          .insert({
            client_id: user.id,
            street: editingAddress.street,
            number: editingAddress.number,
            apartment: editingAddress.apartment || null,
            city: editingAddress.city,
            postal_code: editingAddress.postal_code || null,
            instructions: editingAddress.instructions || null,
            is_default: editingAddress.is_default,
          });

        if (error) {
          console.error('Error guardando dirección:', error);
          Alert.alert('Error', 'No se pudo guardar la dirección: ' + error.message);
          return;
        }
      }

      // Recargar direcciones desde la BD
      await loadAddresses();
      setShowModal(false);
      setEditingAddress(null);
    } catch (err: any) {
      console.error('Error inesperado:', err);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Eliminar dirección',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('saved_addresses')
              .delete()
              .eq('id', id);

            if (error) {
              console.error('Error eliminando dirección:', error);
              Alert.alert('Error', 'No se pudo eliminar la dirección');
              return;
            }

            await loadAddresses();
          },
        },
      ]
    );
  };

  const handleSetDefault = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Quitar default de todas
    await supabase
      .from('saved_addresses')
      .update({ is_default: false })
      .eq('client_id', user.id);

    // Marcar la seleccionada como default
    await supabase
      .from('saved_addresses')
      .update({ is_default: true })
      .eq('id', id);

    await loadAddresses();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingLogo size={100} message="Cargando direcciones..." />
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
        <Text style={styles.headerTitle}>Direcciones</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddAddress}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📍</Text>
            <Text style={styles.emptyTitle}>Sin direcciones guardadas</Text>
            <Text style={styles.emptyText}>
              Agregá una dirección para hacer pedidos más rápido
            </Text>
            <Button
              label="Agregar dirección"
              onPress={handleAddAddress}
              variant="neon"
              size="lg"
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.addressHeaderLeft}>
                  <Text style={styles.addressStreet}>
                    {address.street} {address.number}
                    {address.apartment ? `, ${address.apartment}` : ''}
                  </Text>
                  {address.is_default && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Principal</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => handleEditAddress(address)}>
                  <Text style={styles.editIcon}>✏️</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.addressCity}>{address.city}</Text>
              {address.instructions && (
                <Text style={styles.addressInstructions}>
                  💡 {address.instructions}
                </Text>
              )}

              <View style={styles.addressActions}>
                {!address.is_default && (
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleSetDefault(address.id)}
                  >
                    <Text style={styles.actionBtnText}>Marcar como principal</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDeleteAddress(address.id)}
                >
                  <Text style={styles.deleteBtnText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modal de edición */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {addresses.find(a => a.id === editingAddress?.id) ? 'Editar' : 'Nueva'} dirección
            </Text>
            <TouchableOpacity onPress={handleSaveAddress}>
              <Text style={styles.modalSave}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
            <Input
              label="CALLE"
              placeholder="Av. Corrientes"
              value={editingAddress?.street || ''}
              onChangeText={(v) => setEditingAddress(prev => prev ? {...prev, street: v} : null)}
            />
            <Input
              label="NÚMERO"
              placeholder="1234"
              value={editingAddress?.number || ''}
              onChangeText={(v) => setEditingAddress(prev => prev ? {...prev, number: v} : null)}
              keyboardType="numeric"
            />
            <Input
              label="PISO/DEPTO (OPCIONAL)"
              placeholder="5º B"
              value={editingAddress?.apartment || ''}
              onChangeText={(v) => setEditingAddress(prev => prev ? {...prev, apartment: v} : null)}
            />
            <Input
              label="CIUDAD"
              placeholder="Buenos Aires"
              value={editingAddress?.city || ''}
              onChangeText={(v) => setEditingAddress(prev => prev ? {...prev, city: v} : null)}
            />
            <Input
              label="CÓDIGO POSTAL (OPCIONAL)"
              placeholder="C1043"
              value={editingAddress?.postal_code || ''}
              onChangeText={(v) => setEditingAddress(prev => prev ? {...prev, postal_code: v} : null)}
            />
            <Input
              label="INSTRUCCIONES (OPCIONAL)"
              placeholder="Timbre roto, llamar al celular"
              value={editingAddress?.instructions || ''}
              onChangeText={(v) => setEditingAddress(prev => prev ? {...prev, instructions: v} : null)}
              multiline
            />
          </ScrollView>
        </View>
      </Modal>
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neon.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: '#000',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
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
  addressCard: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.sm,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressHeaderLeft: {
    flex: 1,
    gap: spacing.xs,
  },
  addressStreet: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neon.faint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neon.medium,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neon.primary,
  },
  editIcon: {
    fontSize: 18,
  },
  addressCity: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  addressInstructions: {
    fontSize: 13,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  addressActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.bg.elevated,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  deleteBtn: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  modalCancel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neon.primary,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: spacing.xl,
    gap: spacing.lg,
    paddingBottom: 100,
  },
});
