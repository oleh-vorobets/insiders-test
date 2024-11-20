import { createContext, ReactNode, useContext, useState } from 'react';
import { authService } from '../../services/auth/AuthService';
import {
    ForgotPasswordPayload,
    LoginError,
    LoginPayload,
    ResetPasswordPayload,
    SignupPayload,
} from './types';

interface AuthContextType {
    loading: boolean;
    accessToken: string;
    error: LoginError;
    authenticated: boolean;
    login: (credentials: LoginPayload) => Promise<void>;
    signup: (credentials: SignupPayload) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    reset: (payload: ResetPasswordPayload) => Promise<void>;
    forgot: (payload: ForgotPasswordPayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState<LoginError>(LoginError.NONE);
    const [loading, isLoading] = useState<boolean>(false);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    const login = async (credentials: LoginPayload) => {
        try {
            isLoading(true);
            const res = await authService.login(
                credentials.email,
                credentials.password
            );
            if (res.status < 300 && res.status >= 200) {
                setAccessToken(res.data.access_token);
                setAuthenticated(true);
                setError(LoginError.NONE);
            }
        } catch (error) {
            console.log(error);
            setError(LoginError.ERROR);
        } finally {
            isLoading(false);
        }
    };

    const signup = async (credentials: SignupPayload) => {
        try {
            isLoading(true);
            const res = await authService.signup(
                credentials.email,
                credentials.password,
                credentials.firstName,
                credentials.lastName
            ); // TODO: later receive object instead of signle parameters
            setAccessToken(res.data.access_token);
            setAuthenticated(true);
            setError(LoginError.NONE);
        } catch (error) {
            console.log(error);
            setError(LoginError.ERROR);
        } finally {
            isLoading(false);
        }
    };

    const refresh = async () => {
        try {
            const response = await authService.refresh();
            if (response.status >= 200 && response.status < 300) {
                setAccessToken(response.data.access_token);
                setAuthenticated(true);
            }
        } catch (_err: any) {
            setError(LoginError.ERROR);
            setAccessToken('');
        }
    };

    const logout = async () => {
        try {
            isLoading(true);
            await authService.logout();
            setAccessToken('');
            setAuthenticated(false);
            setError(LoginError.NONE);
        } catch (error) {
            console.log(error);
            setError(LoginError.ERROR);
            setAccessToken('');
        } finally {
            isLoading(false);
        }
    };

    const forgot = async (payload: ForgotPasswordPayload) => {
        try {
            isLoading(true);
            await authService.forgot(payload.email);
            setAccessToken('');
            setAuthenticated(false);
            setError(LoginError.NONE);
        } catch (error) {
            console.log(error);
            setError(LoginError.ERROR);
            setAccessToken('');
        } finally {
            isLoading(false);
        }
    };

    const reset = async (payload: ResetPasswordPayload) => {
        try {
            isLoading(true);
            const res = await authService.reset(
                payload.token,
                payload.newPassword
            );
            setAccessToken(res.data.access_token);
            setAuthenticated(true);
            setError(LoginError.NONE);
        } catch (error) {
            setError(LoginError.ERROR);
            console.log(error);
        } finally {
            isLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                login,
                signup,
                logout,
                refresh,
                forgot,
                reset,
                loading,
                accessToken,
                error,
                authenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
