// src/app/(onboarding)/business.tsx
import { Text, View } from 'react-native';

export default function BusinessScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-xl font-bold text-gray-800">Crea tu Negocio</Text>
      <Text className="text-gray-500 mt-2">Paso 1 del Onboarding</Text>
    </View>
  );
}