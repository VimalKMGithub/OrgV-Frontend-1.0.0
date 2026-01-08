import api from "../../commons/utils/apiUtility";
import type { Nullable } from "../../commons/types/commonTypes";

const baseUrl = '/user-service';

export interface Permission {
    permissionName: string;
    createdAt: string;
    createdBy: string;
}

export interface Role {
    roleName: string;
    description: string | null;
    systemRole: boolean;
    permissions: Permission[];
    createdAt: string;
    updatedAt: string | null;
    createdBy: string;
    updatedBy: string | null;
}

export interface ExternalIdentity {
    id: string;
    provider: string;
    providerUserId: string;
    email: string;
    createdAt: string;
    linkedAt: string;
    lastUsedAt: string;
    profilePictureUrl: string;
    userId: string;
}

export interface UserSummary {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string | null;
    username: string;
    email: string;
    createdBy: string;
    updatedBy: string | null;
    roles: Role[] | null;
    mfaMethods: string[] | null;
    lastLoginAt: string | null;
    passwordChangedAt: string;
    createdAt: string;
    updatedAt: string | null;
    lastLockedAt: string | null;
    emailVerified: boolean;
    mfaEnabled: boolean;
    accountLocked: boolean;
    accountEnabled: boolean;
    failedLoginAttempts: number;
    failedMfaAttempts: number;
    allowedConcurrentLogins: number;
    oauth2User: boolean;
    externalIdentities: ExternalIdentity[] | null;
}

export const selfDetails = async (): Promise<UserSummary> => {
    const response = await api.get<UserSummary>(`${baseUrl}/self-details`);
    return response.data;
};

export interface VerifyEmailRequest {
    emailVerificationToken: string;
}

export interface VerifyEmailResponse {
    message?: string;
}

export const verifyEmail = async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    const response = await api.post<VerifyEmailResponse>(`${baseUrl}/verify-email`, data);
    return response.data;
};

export interface ResendEmailVerificationLinkRequest {
    usernameOrEmailOrId: string;
}

export interface ResendEmailVerificationLinkResponse {
    message?: string;
}

export const resendEmailVerificationLink = async (data: ResendEmailVerificationLinkRequest): Promise<ResendEmailVerificationLinkResponse> => {
    const response = await api.post<ResendEmailVerificationLinkResponse>(`${baseUrl}/resend-email-verification-link`, data);
    return response.data;
};

export interface ForgotPasswordRequest {
    usernameOrEmailOrId: string;
}

export interface ForgotPasswordResponse {
    message?: string;
    methods?: string[];
}

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>(`${baseUrl}/forgot-password`, data);
    return response.data;
};

export interface ForgotPasswordMethodSelectionRequest {
    usernameOrEmailOrId: string;
    method: string;
}

export interface ForgotPasswordMethodSelectionResponse {
    message?: string;
}

export const forgotPasswordMethodSelection = async (data: ForgotPasswordMethodSelectionRequest): Promise<ForgotPasswordMethodSelectionResponse> => {
    const response = await api.post<ForgotPasswordMethodSelectionResponse>(`${baseUrl}/forgot-password-method-selection?method=${data.method}`, {
        usernameOrEmailOrId: data.usernameOrEmailOrId
    });
    return response.data;
};

export interface ResetPasswordRequest extends ForgotPasswordMethodSelectionRequest {
    otpTotp: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ResetPasswordResponse {
    message?: string;
}

export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await api.post<ResetPasswordResponse>(`${baseUrl}/reset-password`, data);
    return response.data;
};

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    middleName: string | null;
    lastName: string | null;
}

export interface RegisterResponse {
    message?: string;
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(`${baseUrl}/register`, data);
    return response.data;
};

export interface EmailChangeRequestRequest {
    newEmail: string;
}

export interface EmailChangeRequestResponse {
    message?: string;
}

export const emailChangeRequest = async (data: EmailChangeRequestRequest): Promise<EmailChangeRequestResponse> => {
    const response = await api.post<EmailChangeRequestResponse>(`${baseUrl}/email-change-request`, data);
    return response.data;
};

export interface VerifyEmailChangeRequest {
    newEmailOtp: string;
    oldEmailOtp: string;
    password: string;
}

export interface VerifyEmailChangeResponse {
    message?: string;
}

export const verifyEmailChange = async (data: VerifyEmailChangeRequest): Promise<VerifyEmailChangeResponse> => {
    const response = await api.post<VerifyEmailChangeResponse>(`${baseUrl}/verify-email-change`, data);
    return response.data;
};

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ChangePasswordResponse {
    message?: string;
    methods?: string[];
}

export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await api.post<ChangePasswordResponse>(`${baseUrl}/change-password`, data);
    return response.data;
};

export interface ChangePasswordMethodSelectionRequest {
    method: string;
}

export interface ChangePasswordMethodSelectionResponse {
    message?: string;
}

export const changePasswordMethodSelection = async (data: ChangePasswordMethodSelectionRequest): Promise<ChangePasswordMethodSelectionResponse> => {
    const response = await api.post<ChangePasswordMethodSelectionResponse>(`${baseUrl}/change-password-method-selection?method=${data.method}`);
    return response.data;
};

export interface VerifyChangePasswordRequest extends ChangePasswordRequest {
    method: string | null;
    otpTotp: string;
}

export interface VerifyChangePasswordResponse {
    message?: string;
}

export const verifyChangePassword = async (data: VerifyChangePasswordRequest): Promise<VerifyChangePasswordResponse> => {
    const response = await api.post<VerifyChangePasswordResponse>(`${baseUrl}/verify-change-password`, data);
    return response.data;
};

export interface DeleteAccountRequest {
    password: string;
}

export interface DeleteAccountResponse {
    message?: string;
    methods?: string[];
}

export const deleteAccount = async (data: DeleteAccountRequest): Promise<DeleteAccountResponse> => {
    const response = await api.delete<DeleteAccountResponse>(`${baseUrl}/delete-account`, {
        data: data
    });
    return response.data;
};

export interface DeleteAccountMethodSelectionRequest {
    method: string;
}

export interface DeleteAccountMethodSelectionResponse {
    message?: string;
}

export const deleteAccountMethodSelection = async (data: DeleteAccountMethodSelectionRequest): Promise<DeleteAccountMethodSelectionResponse> => {
    const response = await api.post<DeleteAccountMethodSelectionResponse>(`${baseUrl}/delete-account-method-selection`, null, {
        params: { method: data.method }
    });
    return response.data;
};

export interface VerifyDeleteAccountRequest extends DeleteAccountMethodSelectionRequest {
    otpTotp: string;
}

export interface VerifyDeleteAccountResponse {
    message?: string;
}

export const verifyDeleteAccount = async (data: VerifyDeleteAccountRequest): Promise<VerifyDeleteAccountResponse> => {
    const response = await api.delete<VerifyDeleteAccountResponse>(`${baseUrl}/verify-delete-account`, {
        data: data
    });
    return response.data;
};

export type UpdateDetailsRequest = Nullable<Omit<RegisterRequest, 'email' | 'password'>> & {
    oldPassword: string;
};

export interface UpdateDetailsResponse {
    message: string;
}

export const updateDetails = async (data: UpdateDetailsRequest): Promise<UpdateDetailsResponse> => {
    const response = await api.put<UpdateDetailsResponse>(`${baseUrl}/update-details`, data);
    return response.data;
};
