import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { config } from './config.js';

// Default config for axios
const defaultConfig: AxiosRequestConfig = {
  timeout: Number(config.timeoutServer),
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Axios adapter for API requests
 */
export class AxiosAdapter {
  private static instance: AxiosInstance;

  // Initialize axios instance with base URL
  public static getInstance(): AxiosInstance {
    if (!this.instance) {
      const baseURL = config.beServerUrl;
      this.instance = axios.create({
        ...defaultConfig,
        baseURL,
      });

      // Add interceptor to handle request
      this.instance.interceptors.request.use(
        (config) => {
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );

      // Add interceptor to handle response
      this.instance.interceptors.response.use(
        (response) => {
          return response.data;
        },
        (error) => {
          // Handle response errors
          return Promise.reject(error);
        },
      );
    }
    return this.instance;
  }
}

// Export default instance
export const axiosInstance = AxiosAdapter.getInstance();
