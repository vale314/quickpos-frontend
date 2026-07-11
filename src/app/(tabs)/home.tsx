// src/app/(tabs)/home.tsx
import { productsApi } from '@/api/products.api';
import { Product } from '@/types/product.types';
// 1. Importamos el store global del carrito
import { useCartStore } from '@/store/cart.store';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // 2. Traemos la función de añadir al carrito desde el estado global
  const addItem = useCartStore((state) => state.addItem);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => productsApi.getProducts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  const products = data?.pages.flat() || [];

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      onPress={() => setSelectedProduct(item)}
      activeOpacity={0.8}
      className="flex-1 m-2 bg-white rounded-xl border border-gray-200 overflow-hidden"
      style={{ 
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      }}
    >
      {item.images && item.images.length > 0 ? (
        <Image
          source={{ uri: item.images[0].src }}
          style={{ width: '100%', height: 144, backgroundColor: '#f3f4f6' }} 
          contentFit="cover" 
          transition={200}
        />
      ) : (
        <View className="w-full h-36 bg-gray-100 items-center justify-center">
          <Text className="text-gray-400">Sin foto</Text>
        </View>
      )}

      <View className="p-3">
        <Text className="text-sm font-bold text-gray-900" numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text className="text-lg font-semibold text-blue-600 mt-1">
          ${item.price || '0.00'}
        </Text>
        
        <Text className="text-xs text-gray-500 mt-1">
          Stock: {item.manage_stock ? (item.stock_quantity ?? 'Agotado') : 'Ilimitado'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#208AEF" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-red-500">Error al cargar el catálogo</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Catálogo</Text>
      </View>
      
      <FlatList
        data={products}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color="#208AEF" className="my-4" />
          ) : null
        }
      />

      <Modal
        visible={!!selectedProduct}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedProduct(null)} 
      >
        <SafeAreaView className="flex-1 bg-white">
          {selectedProduct && (
            <View className="flex-1 relative">
              
              <TouchableOpacity 
                onPress={() => setSelectedProduct(null)}
                activeOpacity={0.7}
                className="absolute top-4 right-4 z-50 bg-white w-10 h-10 items-center justify-center rounded-full"
                style={{
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                }}
              >
                <Text className="font-bold text-gray-800 text-base">✕</Text>
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <Image
                    source={{ uri: selectedProduct.images[0].src }}
                    style={{ width: '100%', height: 320, backgroundColor: '#f3f4f6' }} 
                    contentFit="cover" 
                  />
                ) : (
                  <View style={{ width: '100%', height: 320, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' }}>
                    <Text className="text-gray-400">Sin foto</Text>
                  </View>
                )}

                <View className="px-5 pt-5">
                  <Text className="text-2xl font-bold text-gray-900">
                    {selectedProduct.name}
                  </Text>

                  <View className="flex-row items-center justify-between mt-4">
                    <Text className="text-3xl font-extrabold text-blue-600">
                      ${selectedProduct.price || '0.00'}
                    </Text>
                    <Text className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                      Stock: {selectedProduct.manage_stock ? (selectedProduct.stock_quantity ?? 'Agotado') : 'Ilimitado'}
                    </Text>
                  </View>
                  
                  {/* 3. Botón de Agregar al Carrito Conectado Globalmente */}
                  <TouchableOpacity 
                    className="bg-blue-600 w-full py-4 rounded-xl mt-8 items-center flex-row justify-center"
                    onPress={() => {
                      addItem(selectedProduct); // Guardamos el JSON completo en Zustand
                      setSelectedProduct(null); // Cerramos la ventana
                    }}
                  >
                    <Text className="text-white font-bold text-lg">Agregar al Carrito</Text>
                  </TouchableOpacity>
                </View>

              </ScrollView>
            </View>
          )}
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}