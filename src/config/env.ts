// src/config/env.ts
export const ENV = {
  // Expo inyecta esta variable automáticamente desde tu raíz
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.3.15:8080/api/v1',
} as const;