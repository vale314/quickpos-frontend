// src/app/(tabs)/settings.tsx
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  // Traemos nuestra función demoledora desde Zustand
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = async () => {
    // 1. Borramos el JWT del celular y limpiamos la memoria global
    await clearSession();
    
    // 2. Empujón mágico a la raíz. 
    // Como la memoria está limpia, el Auth Gate se dará cuenta de que ya no hay token
    // y lo aventará de regreso a tu pantalla pública /(auth)/welcome.
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Usamos flex-1 en este View para poder empujar el botón al fondo si lo deseamos */}
      <View className="p-4 flex-1">
        
        <View>
          <Text className="text-2xl font-bold text-gray-900">Ajustes</Text>
          <Text className="text-gray-500 mb-8">Opciones de la tienda...</Text>
        </View>

        {/* mt-auto empuja automáticamente este contenedor hacia la parte inferior de la pantalla */}
        <View className="mt-auto mb-4">
          <TouchableOpacity 
            className="bg-red-500 rounded-lg p-4 items-center"
            onPress={handleLogout}
          >
            <Text className="text-white text-lg font-bold">Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}