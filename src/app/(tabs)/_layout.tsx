// src/app/(tabs)/_layout.tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb', // blue-600 de Tailwind
        tabBarInactiveTintColor: '#6b7280', // gray-500
        headerShown: false, // Ocultamos el header feo de arriba por defecto
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="th-large" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="shopping-cart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}