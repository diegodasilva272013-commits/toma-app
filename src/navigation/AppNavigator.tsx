// src/navigation/AppNavigator.tsx
import React, { useState } from 'react';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/client/HomeScreen';
import { SearchScreen } from '../screens/client/SearchScreen';
import { ProfileScreen } from '../screens/client/ProfileScreen';
import { FavoritesScreen } from '../screens/client/FavoritesScreen';
import { OrderHistoryScreen } from '../screens/client/OrderHistoryScreen';
import { CouponsScreen } from '../screens/client/CouponsScreen';
import { SettingsScreen } from '../screens/client/SettingsScreen';
import { LegalScreen } from '../screens/client/LegalScreen';
import { SupportScreen } from '../screens/client/SupportScreen';
import { EditProfileScreen } from '../screens/client/EditProfileScreen';
import { AddressesScreen } from '../screens/client/AddressesScreen';
import { CartScreen } from '../screens/client/CartScreen';
import { CheckoutScreen } from '../screens/client/CheckoutScreen';
import { OrderVideoScreen } from '../screens/client/OrderVideoScreen';
import { OrderConfirmedScreen } from '../screens/client/OrderConfirmedScreen';
import { RestaurantProfileScreen } from '../screens/client/RestaurantProfileScreen';
import { ProductDetailModal } from '../components/modals/ProductDetailModal';
import { useCartStore } from '../store/cartStore';
import { Restaurant, Product } from '../types/index';
import { View, Text } from 'react-native';
import { colors } from '../theme/index';

type AppState =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'client_home'
  | 'client_search'
  | 'client_profile'
  | 'client_favorites'
  | 'client_history'
  | 'client_coupons'
  | 'client_settings'
  | 'client_legal'
  | 'client_edit_profile'
  | 'client_addresses'
  | 'client_support'
  | 'client_restaurant'
  | 'client_cart'
  | 'client_checkout'
  | 'client_order_video'
  | 'client_order_confirmed'
  | 'client_tracking'
  | 'restaurant'
  | 'delivery';

const Placeholder = ({ label }: { label: string }) => (
  <View style={{ flex: 1, backgroundColor: colors.bg.primary, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: colors.neon.primary, fontSize: 18, fontWeight: '700' }}>{label}</Text>
    <Text style={{ color: colors.text.tertiary, marginTop: 8, fontSize: 14 }}>Próximo sprint ✦</Text>
  </View>
);

export const AppNavigator: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | 'cookies'>('terms');
  const { addItem } = useCartStore();

  const navigate = (state: AppState) => setAppState(state);

  if (appState === 'splash') {
    return <SplashScreen onFinish={() => navigate('onboarding')} />;
  }

  if (appState === 'onboarding') {
    return <OnboardingScreen onFinish={() => navigate('auth')} />;
  }

  if (appState === 'auth') {
    return (
      <LoginScreen
        onLogin={(role) => {
          if (role === 'client') navigate('client_home');
          else if (role === 'restaurant') navigate('restaurant');
          else navigate('delivery');
        }}
        onGoRegister={() => navigate('onboarding')}
      />
    );
  }

  if (appState === 'client_home') {
    return (
      <>
        <HomeScreen
          onRestaurantPress={(r) => {
            setSelectedRestaurant(r);
            navigate('client_restaurant');
          }}
          onProductPress={(p, rId) => {
            const restaurant = [selectedRestaurant].find(r => r?.id === rId);
            setSelectedProduct(p);
            setSelectedRestaurant(restaurant || null);
            setShowProductModal(true);
          }}
          onCartPress={() => navigate('client_cart')}
          onSearchPress={() => navigate('client_search')}
          onProfilePress={() => navigate('client_profile')}
        />
        {selectedProduct && selectedRestaurant && (
          <ProductDetailModal
            visible={showProductModal}
            product={selectedProduct}
            restaurantName={selectedRestaurant.name}
            onClose={() => setShowProductModal(false)}
            onAddToCart={() => {
              addItem(selectedProduct, selectedRestaurant.id, selectedRestaurant.name);
            }}
          />
        )}
      </>
    );
  }

  if (appState === 'client_restaurant' && selectedRestaurant) {
    return (
      <>
        <RestaurantProfileScreen
          restaurant={selectedRestaurant}
          onBack={() => navigate('client_home')}
          onCartPress={() => navigate('client_cart')}
          onProductPress={(p) => {
            setSelectedProduct(p);
            setShowProductModal(true);
          }}
        />
        {selectedProduct && (
          <ProductDetailModal
            visible={showProductModal}
            product={selectedProduct}
            restaurantName={selectedRestaurant.name}
            onClose={() => setShowProductModal(false)}
            onAddToCart={() => {
              addItem(selectedProduct, selectedRestaurant.id, selectedRestaurant.name);
            }}
          />
        )}
      </>
    );
  }

  if (appState === 'client_search') {
    return (
      <SearchScreen
        onBack={() => navigate('client_home')}
        onRestaurantPress={(r) => {
          setSelectedRestaurant(r);
          navigate('client_restaurant');
        }}
        onProductPress={(p, rId) => {
          setSelectedProduct(p);
          setShowProductModal(true);
        }}
      />
    );
  }

  if (appState === 'client_profile') {
    return (
      <ProfileScreen
        onBack={() => navigate('client_home')}
        onHistoryPress={() => navigate('client_history')}
        onFavoritesPress={() => navigate('client_favorites')}
        onCouponsPress={() => navigate('client_coupons')}
        onSettingsPress={() => navigate('client_settings')}
        onSupportPress={() => navigate('client_support')}
        onLogout={() => navigate('auth')}
      />
    );
  }

  if (appState === 'client_favorites') {
    return (
      <FavoritesScreen
        onBack={() => navigate('client_profile')}
        onRestaurantPress={(r) => {
          setSelectedRestaurant(r);
          navigate('client_restaurant');
        }}
      />
    );
  }

  if (appState === 'client_history') {
    return (
      <OrderHistoryScreen
        onBack={() => navigate('client_profile')}
        onOrderPress={(order) => {
          // TODO: pantalla de detalle del pedido
        }}
      />
    );
  }

  if (appState === 'client_coupons') {
    return <CouponsScreen onBack={() => navigate('client_profile')} />;
  }

  if (appState === 'client_settings') {
    return (
      <SettingsScreen
        onBack={() => navigate('client_profile')}
        onEditProfilePress={() => navigate('client_edit_profile')}
        onAddressesPress={() => navigate('client_addresses')}
        onLegalPress={(type) => {
          setLegalType(type);
          navigate('client_legal');
        }}
      />
    );
  }

  if (appState === 'client_legal') {
    return (
      <LegalScreen
        type={legalType}
        onBack={() => navigate('client_settings')}
      />
    );
  }

  if (appState === 'client_edit_profile') {
    return (
      <EditProfileScreen
        onBack={() => navigate('client_settings')}
      />
    );
  }

  if (appState === 'client_addresses') {
    return (
      <AddressesScreen
        onBack={() => navigate('client_settings')}
      />
    );
  }

  if (appState === 'client_support') {
    return <SupportScreen onBack={() => navigate('client_profile')} />;
  }

  if (appState === 'client_cart') {
    return (
      <CartScreen
        onBack={() => {
          if (selectedRestaurant) {
            navigate('client_restaurant');
          } else {
            navigate('client_home');
          }
        }}
        onCheckout={() => navigate('client_checkout')}
      />
    );
  }

  if (appState === 'client_checkout') {
    return (
      <CheckoutScreen
        onBack={() => navigate('client_cart')}
        onSuccess={(orderId) => {
          setCurrentOrderId(orderId);
          navigate('client_order_video');
        }}
      />
    );
  }

  if (appState === 'client_order_video') {
    return (
      <OrderVideoScreen
        onFinish={() => navigate('client_order_confirmed')}
      />
    );
  }

  if (appState === 'client_order_confirmed' && currentOrderId) {
    return (
      <OrderConfirmedScreen
        orderId={currentOrderId}
        onViewOrder={() => {
          // TODO: ir a tracking screen
          navigate('client_home');
        }}
        onBackHome={() => navigate('client_home')}
      />
    );
  }

  if (appState === 'client_tracking') {
    return <Placeholder label="📍 Tracking GPS en vivo" />;
  }

  if (appState === 'restaurant') {
    return <Placeholder label="🍳 Dashboard Restaurante — Sprint D" />;
  }

  if (appState === 'delivery') {
    return <Placeholder label="🏍️ App Delivery — Sprint C" />;
  }

  return null;
};
