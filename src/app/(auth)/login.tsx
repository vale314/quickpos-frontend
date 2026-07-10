// src/app/(auth)/login.tsx
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      // 1. Llamada real a tu servidor Spring Boot
      const response = await authApi.login(data);

      console.log('Login exitoso:', response);

      // 2. Extracción directa y fuertemente tipada (esquema plano)
      const token = response.token;
      const email = response.email;

      if (!token) {
         console.warn("Cuidado: No se encontró el token en la respuesta");
      }

      // 3. Guardamos la sesión (creamos el objeto user al vuelo con el email)
      await setSession(token, { email: email });
      
      // 4. EL EMPUJÓN MÁGICO: Mandamos al usuario al Root para que el Auth Gate lo evalúe
      router.replace('/');
      
    } catch (error: any) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'Credenciales incorrectas o problema de red');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">Inicia Sesión</Text>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Correo Electrónico</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base"
              placeholder="tu@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>}
      </View>

      <View className="mb-8">
        <Text className="text-gray-700 mb-2">Contraseña</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base"
              placeholder="******"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>}
      </View>

      <TouchableOpacity 
        className={`bg-blue-600 rounded-lg p-4 items-center ${isLoading ? 'opacity-70' : ''}`}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-semibold">Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity className="mt-6 items-center" onPress={() => router.push('/(auth)/welcome')}>
        <Text className="text-blue-500">Volver al Welcome</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}