// src/app/(tabs)/home.tsx
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-xl font-bold text-blue-600">Catálogo de Productos</Text>
      <Text className="text-gray-500 mt-2">Punto de Venta Activo</Text>
    </View>
  );
}