// src/app/index.tsx
import { useAuthStore } from '@/store/auth.store';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AuthGate() {
  const { 
    isHydrated, 
    isAuthenticated, 
    hasBusiness, 
    hasStoreConnected, 
    hydrate 
  } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // 1. Pantalla de carga mientras leemos el JWT desde SecureStore
  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // 2. Evaluamos el estado para redirigir (El flujo estricto del MVP)
  if (!isAuthenticated) {
    // Si no hay token, lo mandamos a la ruta pública
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!hasBusiness) {
    // Si tiene cuenta pero no negocio, va al onboarding
    return <Redirect href="/(onboarding)/business" />;
  }

  if (!hasStoreConnected) {
    // Si tiene negocio pero no conectó WooCommerce
    return <Redirect href="/(onboarding)/connect-store" />;
  }

  // 3. Si todo está en orden, entra al POS (Catálogo de productos)
  return <Redirect href="/(tabs)/home" />;
}