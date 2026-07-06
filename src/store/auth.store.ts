// src/store/auth.store.ts
import { storage } from '@/lib/storage';
import { User } from '@/types/auth.types';
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  hasBusiness: boolean | null;
  hasStoreConnected: boolean | null;
  isHydrated: boolean;

  setSession: (token: string, user: User) => Promise<void>;
  clearSession: () => Promise<void>;
  hydrate: () => Promise<void>;
  setBusinessStatus: (hasBusiness: boolean, hasStoreConnected: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  hasBusiness: null,
  hasStoreConnected: null,
  isHydrated: false,

  setSession: async (token, user) => {
    await storage.setToken(token);
    set({ token, user, isAuthenticated: true });
  },

  clearSession: async () => {
    await storage.removeToken();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      hasBusiness: null,
      hasStoreConnected: null
    });
  },

  hydrate: async () => {
    const token = await storage.getToken();
    if (token) {
      set({ token, isAuthenticated: true, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },

  setBusinessStatus: (hasBusiness, hasStoreConnected) => {
    set({ hasBusiness, hasStoreConnected });
  }
}));