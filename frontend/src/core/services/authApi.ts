import type { ApiResponse, LoginResponse, ValidateTokenResponse } from '../types';

// Importez votre instance axios configurée
import { api } from '../config/axios'// Ajustez le chemin selon votre structure

// Ou si vous n'avez pas d'instance configurée, créez-en une :
// import axios from 'axios';
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
// });

export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async validateToken(token: string): Promise<ApiResponse<ValidateTokenResponse>> {
    try {
      const response = await api.post('/auth/validate-token', { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};