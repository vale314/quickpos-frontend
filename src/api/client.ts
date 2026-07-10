// src/api/client.ts
import { ENV } from '@/config/env';
import { storage } from '@/lib/storage';
import { useAuthStore } from '@/store/auth.store';
import axios from 'axios';

// Creamos la instancia maestra de Axios
export const apiClient = axios.create({
  baseURL: ENV.API_URL, // Toma la IP de tu archivo .env
  timeout: 10000, // 10 segundos máximo de espera
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request: Antes de que cualquier petición salga, le pegamos el JWT
apiClient.interceptors.request.use(
  async (config) => {
    // AGREGA ESTO PARA DEPURAR
  console.log("--- INTENTANDO PETICIÓN ---");
  console.log("URL Completa:", apiClient.getUri(config));

    const token = await storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response: Si el backend nos batea con un 401 (Token expirado)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado o inválido. Cerrando sesión...');
      // Limpiamos el estado global y SecureStore automáticamente
      await useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);