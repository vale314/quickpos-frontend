import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900">Carrito de Compras</Text>
        <Text className="text-gray-500">Tu carrito está vacío.</Text>
      </View>
    </SafeAreaView>
  );
}