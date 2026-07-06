// src/app/(onboarding)/connect-store.tsx
import { Text, View } from 'react-native';

export default function ConnectStoreScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-xl font-bold text-gray-800">Conectar WooCommerce</Text>
      <Text className="text-gray-500 mt-2">Paso 2 del Onboarding</Text>
    </View>
  );
}