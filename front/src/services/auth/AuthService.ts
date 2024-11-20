import {
    authAxios,
    hostname,
    publicAxios,
} from '../../providers/AxiosProvider';
import { AuthResponse } from './types';

export const authService = {
    login: async (email: string, password: string) => {
        try {
            const data = await publicAxios.post<AuthResponse>(
                hostname + '/auth/signin',
                {
                    email,
                    password,
                }
            );
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    signup: async (
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ) => {
        try {
            const data = await publicAxios.post<AuthResponse>(
                hostname + '/auth/signup',
                {
                    email,
                    password,
                    firstName,
                    lastName,
                }
            );
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    logout: async () => {
        return await authAxios.get<void>(hostname + '/auth/logout');
    },

    refresh: async () => {
        try {
            const data = await publicAxios.get<AuthResponse>(
                hostname + '/auth/refresh',
                { withCredentials: true }
            );
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    forgot: async (email: string) => {
        try {
            const data = await publicAxios.post<AuthResponse>(
                hostname + '/auth/forgot-password',
                {
                    email,
                }
            );
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    reset: async (token: string, newPassword: string) => {
        try {
            const data = await publicAxios.post<AuthResponse>(
                hostname + '/auth/reset-password',
                {
                    token,
                    password: newPassword,
                }
            );
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
