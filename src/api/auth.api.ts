// src/api/auth.api.ts
import { AuthResponse, LoginRequest } from '@/types/auth.types';
import { apiClient } from './client';

export const authApi = {
  /**
   * Envía las credenciales al backend de Spring Boot y retorna el JWT y datos del usuario
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Hace un POST a http://192.168.3.15:8080/api/v1/auth/login
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
};