// src/api/stores.api.ts
import { apiClient } from './client';

export interface ConnectStoreRequest {
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

export interface StoreStatusResponse {
  isConnected: boolean;
}

export const storesApi = {
  connect: async (data: ConnectStoreRequest) => {
    
    const response = await apiClient.post('/stores/connect', data);
    return response.data;
  },
  
  // NUEVO ENDPOINT
  checkStatus: async (): Promise<StoreStatusResponse> => {
    const response = await apiClient.get('/stores/status');
    return response.data;
  }
};