import axios, { InternalAxiosRequestConfig } from 'axios';
import { createContext, ReactNode } from 'react';
import { useAuth } from './AuthProvider/AuthProvider';
import { authService } from '../services/auth/AuthService';

const AxiosContext = createContext(undefined);

export const hostname =
    window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api/v1'
        : `https://${window.location.hostname}/api/v1`;

export const authAxios = axios.create({
    baseURL: hostname,
    withCredentials: true,
});

export const publicAxios = axios.create({
    baseURL: hostname,
    withCredentials: true,
});
export const AxiosProvider = ({ children }: { children: ReactNode }) => {
    const { accessToken } = useAuth();

    authAxios.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const oldConfig = config;
            if (!config?.headers?.Authorization) {
                oldConfig.headers.Authorization = `Bearer ${accessToken}`;
            }
            return oldConfig;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    authAxios.interceptors.response.use(
        (response) => response,
        async (error: any) => {
            const originalRequest = error.config;

            // Check if 401 error status code and if request didnt repeat
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // set retry to true to avoid endless requests

                try {
                    const newToken = await authService.refresh();

                    originalRequest.headers[
                        'Authorization'
                    ] = `Bearer ${newToken?.data.access_token}`;

                    return authAxios(originalRequest);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    await authService.logout();
                    return Promise.reject(refreshError);
                }
            }
        }
    );
    return (
        <AxiosContext.Provider value={undefined}>
            {children}
        </AxiosContext.Provider>
    );
};
