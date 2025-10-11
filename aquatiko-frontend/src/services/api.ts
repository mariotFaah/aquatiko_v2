import { api } from '../lib/axios';
import type { ApiResponse } from '../types/index';
export class ApiService {
  static async get<T>(endpoint: string): Promise<T> {
    const response = await api.get<ApiResponse<T>>(endpoint);
    return response.data.data;
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await api.post<ApiResponse<T>>(endpoint, data);
    return response.data.data;
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await api.put<ApiResponse<T>>(endpoint, data);
    return response.data.data;
  }

  static async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await api.patch<ApiResponse<T>>(endpoint, data);
    return response.data.data;
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(endpoint);
    return response.data.data;
  }
}
