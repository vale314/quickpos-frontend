// src/app/(auth)/welcome.tsx
import { Text, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-2xl font-bold text-blue-600 mb-2">Bienvenido a QuickPOS</Text>
      <Text className="text-base text-gray-500">Pantalla pública (Login/Signup irán aquí)</Text>
    </View>
  );
}