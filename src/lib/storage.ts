// src/lib/storage.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'quickpos_jwt';

export const storage = {
  getToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error al leer el token de SecureStore:', error);
      return null;
    }
  },
  
  setToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error al guardar el token en SecureStore:', error);
    }
  },
  
  removeToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error al eliminar el token de SecureStore:', error);
    }
  }
};