// src/app/(tabs)/home.tsx
import { productsApi } from '@/api/products.api';
import { Product } from '@/types/product.types';
import { useInfiniteQuery } from '@tanstack/react-query';
// 1. Quitamos 'Image' de react-native
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// 2. Importamos la imagen superpoderosa de Expo
import { Image } from 'expo-image';

export default function HomeScreen() {
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
    <View 
      className="flex-1 m-2 bg-white rounded-xl border border-gray-200 overflow-hidden"
      style={{ 
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      }}
    >
      {/* Implementación de expo-image con medidas forzadas */}
      {item.images && item.images.length > 0 ? (
        <Image
          source={{ uri: item.images[0].src }}
          // Forzamos las medidas con style nativo (144px es el equivalente exacto a h-36)
          style={{ width: '100%', height: 144, backgroundColor: '#f3f4f6' }} 
          contentFit="cover" 
          transition={200}
        />
      ) : (
        <View className="w-full h-36 bg-gray-100 items-center justify-center">
          <Text className="text-gray-400">Sin foto</Text>
        </View>
      )}

      {/* Contenedor de Textos */}
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
    </View>
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
    </SafeAreaView>
  );
}