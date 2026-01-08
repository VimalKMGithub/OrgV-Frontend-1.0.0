import api from "../../commons/utils/apiUtility";

const baseUrl = '/auth-service';

export interface LoginRequest {
    usernameOrEmailOrId: string;
    password: string;
}

export interface LoginResponse {
    mfa_methods?: string[];
    state_token?: string;
    message?: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(`${baseUrl}/login`, data);
    return response.data;
};

export interface RequestMfaLoginRequest {
    type: string;
    stateToken: string;
}

export interface RequestMfaLoginResponse {
    message?: string;
}

export const requestMfaLogin = async (data: RequestMfaLoginRequest): Promise<RequestMfaLoginResponse> => {
    const response = await api.post<RequestMfaLoginResponse>(`${baseUrl}/request-to-login-by-mfa`, data);
    return response.data;
};

export interface VerifyMfaLoginRequest extends RequestMfaLoginRequest {
    otpTotp: string;
}

export interface VerifyMfaLoginResponse {
    message?: string;
}

export const verifyMfaLogin = async (data: VerifyMfaLoginRequest): Promise<VerifyMfaLoginResponse> => {
    const response = await api.post<VerifyMfaLoginResponse>(`${baseUrl}/verify-to-login-by-mfa`, data);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await api.post(`${baseUrl}/logout`);
};

export interface ActiveDevicesResponse {
    current_device_id: string;
    [key: string]: string;
}

export const getActiveDevices = async (): Promise<ActiveDevicesResponse> => {
    const response = await api.get<ActiveDevicesResponse>(`${baseUrl}/active-devices`);
    return response.data;
};

export const logoutFromDevices = async (deviceIds: string[]): Promise<void> => {
    await api.post(`${baseUrl}/logout-from-devices`, deviceIds);
};

export const logoutAllDevices = async (): Promise<void> => {
    await api.post(`${baseUrl}/logout-all-devices`);
};

export const fetchCsrfToken = async (): Promise<void> => {
    await api.get('/csrf');
};

export interface RequestToToggleMfaRequest {
    type: string | null;
    toggle: 'enable' | 'disable';
}

export interface RequestToToggleMfaResponse {
    message?: string;
}

export const requestToToggleMfa = async (data: RequestToToggleMfaRequest): Promise<RequestToToggleMfaResponse | Blob> => {
    const response = await api.post<RequestToToggleMfaResponse | Blob>(`${baseUrl}/request-to-toggle-mfa`, data, {
        responseType: (data.type === 'AUTHENTICATOR_APP_MFA' && data.toggle === 'enable') ? 'blob' : 'json'
    });
    return response.data;
};

export interface VerifyToToggleMfaRequest extends RequestToToggleMfaRequest {
    otpTotp: string;
}

export interface VerifyToToggleMfaResponse {
    message?: string;
}

export const verifyToToggleMfa = async (data: VerifyToToggleMfaRequest): Promise<VerifyToToggleMfaResponse> => {
    const response = await api.post<VerifyToToggleMfaResponse>(`${baseUrl}/verify-to-toggle-mfa`, data);
    return response.data;
};
