export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface ResetPasswordPayload {
    newPassword: string;
    token: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export enum LoginError {
    NONE = '',
    ERROR = 'Error',
}
