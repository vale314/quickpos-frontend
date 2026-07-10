// src/types/auth.types.ts

export interface User {
  email: string;
  id?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  email: string; // <-- Ajustado al esquema plano que realmente manda tu Spring Boot
}

export interface LoginRequest {
  email: string;
  password?: string; 
}