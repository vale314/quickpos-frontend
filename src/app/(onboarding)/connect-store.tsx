// src/app/(onboarding)/connect-store.tsx
import { storesApi } from '@/api/stores.api';
import { useAuthStore } from '@/store/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

// Esquema de validación estricto
const connectSchema = z.object({
  storeUrl: z.string().url('Ingresa una URL válida (ej. https://tutienda.com)'),
  consumerKey: z.string().min(1, 'El Consumer Key es obligatorio'),
  consumerSecret: z.string().min(1, 'El Consumer Secret es obligatorio'),
});

type ConnectForm = z.infer<typeof connectSchema>;

export default function ConnectStoreScreen() {
  const router = useRouter();
  const setStoreConnected = useAuthStore((state) => state.setStoreConnected);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ConnectForm>({
    resolver: zodResolver(connectSchema),
    defaultValues: {
      storeUrl: '',
      consumerKey: '',
      consumerSecret: '',
    },
  });

  const onSubmit = async (data: ConnectForm) => {
    try {
      setIsLoading(true);
      // 1. Mandamos las credenciales a tu backend Spring Boot
      await storesApi.connect(data);
      
      // 2. Actualizamos la memoria global indicando que ya conectó la tienda
      setStoreConnected();
      
      // 3. Empujón mágico al Auth Gate (Este lo mandará por fin al Home/POS)
      router.replace('/');
      
    } catch (error: any) {
      console.error('Error conectando tienda:', error);
      Alert.alert('Error', 'No se pudo conectar la tienda. Verifica tu URL y tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 px-6 bg-white justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Conectar Tienda</Text>
        <Text className="text-gray-600 text-base">
          Ingresa las credenciales REST API de tu WooCommerce para sincronizar tus productos de forma segura.
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-semibold">URL de la Tienda</Text>
        <Controller
          control={control}
          name="storeUrl"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
              placeholder="https://tutienda.com"
              keyboardType="url"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.storeUrl && <Text className="text-red-500 text-sm mt-1">{errors.storeUrl.message}</Text>}
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-semibold">Consumer Key</Text>
        <Controller
          control={control}
          name="consumerKey"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
              placeholder="ck_..."
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.consumerKey && <Text className="text-red-500 text-sm mt-1">{errors.consumerKey.message}</Text>}
      </View>

      <View className="mb-8">
        <Text className="text-gray-700 mb-2 font-semibold">Consumer Secret</Text>
        <Controller
          control={control}
          name="consumerSecret"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
              placeholder="cs_..."
              secureTextEntry // Opcional, pero recomendado por seguridad
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.consumerSecret && <Text className="text-red-500 text-sm mt-1">{errors.consumerSecret.message}</Text>}
      </View>

      <TouchableOpacity 
        className={`bg-blue-600 rounded-lg p-4 items-center ${isLoading ? 'opacity-70' : ''}`}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold">Sincronizar y Entrar</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}