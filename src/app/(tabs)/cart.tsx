// src/app/(tabs)/cart.tsx
import { useCartStore } from '@/store/cart.store';
import { Image } from 'expo-image';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();

  const renderCartItem = ({ item }: { item: any }) => (
    <View className="flex-row bg-white p-3 m-2 rounded-xl border border-gray-200 items-center">
      {item.images && item.images.length > 0 ? (
        <Image
          source={{ uri: item.images[0].src }}
          style={{ width: 64, height: 64, borderRadius: 8 }}
          contentFit="cover"
        />
      ) : (
        <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center">
          <Text className="text-xs text-gray-400">S/F</Text>
        </View>
      )}

      <View className="flex-1 ml-3">
        <Text className="font-bold text-gray-900 text-sm" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-blue-600 font-semibold mt-0.5">${item.price}</Text>
        
        <View className="flex-row items-center mt-2 bg-gray-50 self-start rounded-md border border-gray-200">
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-3 py-1"
          >
            <Text className="font-bold text-gray-600">-</Text>
          </TouchableOpacity>
          <Text className="px-2 font-bold text-gray-800">{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-1"
          >
            <Text className="font-bold text-gray-600">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => removeItem(item.id)}
        className="p-2"
      >
        <Text className="text-red-500 font-semibold text-xs">Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900">Carrito de Ventas</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text className="text-gray-500 text-sm">Vaciar</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-400 text-lg font-medium">El carrito está vacío</Text>
          <Text className="text-gray-400 text-sm text-center mt-1">Agrega productos desde el catálogo</Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-200 rounded-t-2xl shadow-lg">
            {/* AQUÍ ESTABA EL ERROR: Cambiado <div> por <View> */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-500 font-medium text-base">Total a pagar:</Text>
              <Text className="text-2xl font-black text-gray-900">${getTotalPrice().toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity className="bg-green-600 w-full py-4 rounded-xl items-center justify-center">
              <Text className="text-white font-bold text-lg">Cobrar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}