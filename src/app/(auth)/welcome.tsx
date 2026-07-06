// src/app/(auth)/welcome.tsx
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    // Cambiamos View por SafeAreaView aquí en la raíz
    <SafeAreaView className="flex-1 bg-gray-50">
      
      {/* Contenedor interno para centrar el contenido */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-blue-600 mb-8">QuickPOS</Text>
        
        <TouchableOpacity 
          className="w-full bg-blue-600 p-4 rounded-lg items-center"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-white font-bold text-lg">Ir a Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}