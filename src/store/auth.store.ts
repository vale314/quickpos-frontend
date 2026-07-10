// src/store/auth.store.ts
import { storesApi } from '@/api/stores.api'; // <-- IMPORTACIÓN NUEVA
import { storage } from '@/lib/storage';
import { User } from '@/types/auth.types';
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hasBusiness: boolean;
  hasStoreConnected: boolean;
  isHydrated: boolean;

  setSession: (token: string, user: User) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
  setStoreConnected: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 1. Estado Inicial (Usuario deslogueado por defecto)
  token: null,
  user: null,
  isAuthenticated: false,
  hasBusiness: false, 
  hasStoreConnected: false,
  isHydrated: false,

 // 2. Al iniciar sesión (El 2x1 de Spring Boot + Verificación Real)
  setSession: async (token, user) => {
    // 1. Guardamos el token primero para que Axios pueda usarlo
    await storage.setToken(token);
    
    try {
      // 2. Consultamos la verdad absoluta en la base de datos
      const status = await storesApi.checkStatus();
      
      // 3. Actualizamos la memoria con los datos reales
      set({ 
        token, 
        user, 
        isAuthenticated: true,
        hasBusiness: true, 
        hasStoreConnected: status.isConnected // <-- ¡LA MAGIA OCURRE AQUÍ!
      });
    } catch (error) {
      console.error("Error verificando estatus de la tienda en login", error);
      // Fallback de seguridad en caso de error de red
      set({ 
        token, 
        user, 
        isAuthenticated: true,
        hasBusiness: true, 
        hasStoreConnected: false 
      });
    }
  },

  // 3. Al cerrar sesión (Limpiamos absolutamente todo)
  clearSession: async () => {
    await storage.removeToken();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      hasBusiness: false,
      hasStoreConnected: false
    });
  },

  // 4. Al arrancar la app (Leer de la memoria segura y verificar con Spring Boot)
  hydrate: async () => {
    const token = await storage.getToken();
    
    if (token) {
      try {
        // 1. Como hay token, consultamos el estatus real en tu Backend
        const status = await storesApi.checkStatus();

        // 2. Si el servidor responde bien (HTTP 200), actualizamos la memoria
        set({ 
          token, 
          isAuthenticated: true, 
          hasBusiness: true, // Asumimos que ya tiene negocio (el 2x1)
          hasStoreConnected: status.isConnected, // LA VERDAD DE LA BASE DE DATOS
          isHydrated: true 
        });

      } catch (error) {
        // 3. EL MANEJO DE ERRORES REAL:
        // Si falló (ej. el token expiró, el server está caído)
        // Limpiamos todo por seguridad para que no se quede congelado
        console.warn("Token inválido o error de red al arrancar. Limpiando sesión.");
        await storage.removeToken();
        set({ 
          token: null, 
          isAuthenticated: false, 
          hasBusiness: false, 
          hasStoreConnected: false, 
          isHydrated: true 
        });
      }
    } else {
      // No hay token guardado, es un usuario nuevo o deslogueado
      set({ isHydrated: true });
    }
  },

  // 5. La llave final del Onboarding
  setStoreConnected: () => {
    set({ hasStoreConnected: true }); // <-- Esto le dará luz verde al Auth Gate para ir al Home
  }
}));