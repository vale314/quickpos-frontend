// src/app/_layout.tsx
import { QueryProvider } from '@/providers/QueryProvider'; // Ajustado con tu alias
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// ¡CRÍTICO! Importación obligatoria para que NativeWind funcione
import '@/global.css';

export default function RootLayout() {
  return (
    <QueryProvider>
      <StatusBar style="auto" />
      {/* El Stack base maneja el enrutamiento principal. 
        Ocultamos el header porque cada pantalla (o los tabs) manejarán el suyo.
      */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryProvider>
  );
}