import api from "../../commons/utils/apiUtility";
import type { Permission, RegisterRequest, UserSummary } from "../../user/api/userApis";
import type { Nullable } from "../../commons/types/commonTypes";

const baseUrl = '/admin-service';

export interface CreateUserRequest extends RegisterRequest {
    roles: string[] | null;
    allowedConcurrentLogins: number;
    emailVerified: boolean;
    accountLocked: boolean;
    accountEnabled: boolean;
    accountDeleted: boolean;
}

export interface UserSummaryToCompanyUser extends UserSummary {
    realEmail: string;
    accountDeleted: boolean;
    accountDeletedAt: string | null;
    accountDeletedBy: string | null;
    accountRecoveredAt: string | null;
    accountRecoveredBy: string | null;
}

export interface CreateUsersResponse {
    message?: string;
    created_users?: UserSummaryToCompanyUser[];
    reasons_due_to_which_users_has_not_been_created?: any;
    reasons_due_to_which_some_users_has_not_been_created?: any;
    missing_roles?: string[];
    not_allowed_to_assign_roles?: string[];
}

export const createUsers = async (users: CreateUserRequest[], leniency: boolean): Promise<CreateUsersResponse> => {
    const response = await api.post<CreateUsersResponse>(
        `${baseUrl}/create-users?leniency=${leniency ? 'enable' : 'disable'}`,
        users
    );
    return response.data;
};

export interface DeleteUsersResponse {
    message?: string;
    reasons_due_to_which_users_has_not_been_deleted?: any;
    reasons_due_to_which_some_users_has_not_been_deleted?: any;
    you_cannot_delete_your_own_account_using_this_endpoint?: string[];
    users_not_found_with_usernames?: string[];
    users_not_found_with_emails?: string[];
    users_not_found_with_ids?: string[];
    cannot_delete_users_having_roles_higher_or_equal_than_deleter_roles?: string[];
    cannot_delete_users_having_roles_higher_or_equal_than_deleter_identifiers?: string[];
}

export const deleteUsers = async (identifiers: string[], hardDelete: boolean, leniency: boolean): Promise<DeleteUsersResponse> => {
    const response = await api.delete<DeleteUsersResponse>(`${baseUrl}/delete-users`, {
        params: {
            hard: hardDelete ? 'enable' : 'disable',
            leniency: leniency ? 'enable' : 'disable'
        },
        data: identifiers
    });
    return response.data;
};

export interface ReadUsersResponse {
    found_users?: UserSummaryToCompanyUser[];
    message?: string;
    users_not_found_with_usernames?: string[];
    users_not_found_with_emails?: string[];
    users_not_found_with_ids?: string[];
    reasons_due_to_which_users_has_not_been_returned?: any;
    reasons_due_to_which_some_users_has_not_been_returned?: any;
}

export const readUsers = async (identifiers: string[], leniency: boolean): Promise<ReadUsersResponse> => {
    const response = await api.post<ReadUsersResponse>(`${baseUrl}/read-users`, identifiers, {
        params: {
            leniency: leniency ? 'enable' : 'disable'
        }
    });
    return response.data;
};

export type UserUpdationRequest = Nullable<CreateUserRequest> & {
    oldUsername: string;
};

export interface UpdateUsersResponse {
    message?: string;
    updated_users?: UserSummaryToCompanyUser[];
    reasons_due_to_which_users_has_not_been_updated?: any;
    reasons_due_to_which_some_users_has_not_been_updated?: any;
    cannot_update_own_account_using_this_endpoint?: string;
    users_not_found_with_old_usernames?: string[];
    usernames_already_taken?: string[];
    emails_already_taken?: string[];
    missing_roles?: string[];
    cannot_update_users_having_roles_higher_or_equal_than_updater_roles?: string[];
    cannot_update_users_having_roles_higher_or_equal_than_updater_usernames?: string[];
    not_allowed_to_assign_roles?: string[];
}

export const updateUsers = async (users: UserUpdationRequest[], leniency: boolean): Promise<UpdateUsersResponse> => {
    const response = await api.put<UpdateUsersResponse>(
        `${baseUrl}/update-users?leniency=${leniency ? 'enable' : 'disable'}`,
        users
    );
    return response.data;
};

export interface RoleCreationUpdationRequest {
    roleName: string;
    description: string | null;
    permissions: string[] | null;
}

export interface RoleSummary {
    roleName: string;
    description: string | null;
    createdBy: string;
    updatedBy: string | null;
    permissions: Permission[] | null;
    createdAt: string;
    updatedAt: string | null;
    systemRole: boolean;
}

export interface CreateRolesResponse {
    message?: string;
    created_roles?: RoleSummary[];
    reasons_due_to_which_roles_has_not_been_created?: any;
    reasons_due_to_which_some_roles_has_not_been_created?: any;
    role_names_already_taken?: string[];
    missing_permissions?: string[];
}

export const createRoles = async (roles: RoleCreationUpdationRequest[], leniency: boolean): Promise<CreateRolesResponse> => {
    const response = await api.post<CreateRolesResponse>(
        `${baseUrl}/create-roles?leniency=${leniency ? 'enable' : 'disable'}`,
        roles
    );
    return response.data;
};

export interface DeleteRolesResponse {
    message?: string;
    reasons_due_to_which_roles_has_not_been_deleted?: any;
    reasons_due_to_which_some_roles_has_not_been_deleted?: any;
    roles_not_found?: string[];
    system_roles_cannot_be_deleted?: string[];
    roles_assigned_to_users?: string[];
}

export const deleteRoles = async (roleNames: string[], hardDelete: boolean, leniency: boolean): Promise<DeleteRolesResponse> => {
    const response = await api.delete<DeleteRolesResponse>(`${baseUrl}/delete-roles`, {
        params: {
            force: hardDelete ? 'enable' : 'disable',
            leniency: leniency ? 'enable' : 'disable'
        },
        data: roleNames
    });
    return response.data;
};

export interface UpdateRolesResponse {
    message?: string;
    updated_roles?: RoleSummary[];
    reasons_due_to_which_roles_has_not_been_updated?: any;
    reasons_due_to_which_some_roles_has_not_been_updated?: any;
    roles_not_found?: string[];
    system_roles_cannot_be_updated?: string[];
    missing_permissions?: string[];
}

export const updateRoles = async (roles: RoleCreationUpdationRequest[], leniency: boolean): Promise<UpdateRolesResponse> => {
    const response = await api.put<UpdateRolesResponse>(
        `${baseUrl}/update-roles?leniency=${leniency ? 'enable' : 'disable'}`,
        roles
    );
    return response.data;
};

export interface ReadRolesResponse {
    found_roles?: RoleSummary[];
    message?: string;
    roles_not_found?: string[];
    reasons_due_to_which_roles_has_not_been_returned?: any;
    reasons_due_to_which_some_roles_has_not_been_returned?: any;
}

export const readRoles = async (roleNames: string[], leniency: boolean): Promise<ReadRolesResponse> => {
    const response = await api.post<ReadRolesResponse>(`${baseUrl}/read-roles`, roleNames, {
        params: {
            leniency: leniency ? 'enable' : 'disable'
        }
    });
    return response.data;
};

export interface ReadPermissionsResponse {
    found_permissions?: Permission[];
    message?: string;
    permissions_not_found?: string[];
    reasons_due_to_which_permissions_has_not_been_returned?: any;
    reasons_due_to_which_some_permissions_has_not_been_returned?: any;
}

export const readPermissions = async (permissionNames: string[], leniency: boolean): Promise<ReadPermissionsResponse> => {
    const response = await api.post<ReadPermissionsResponse>(`${baseUrl}/read-permissions`, permissionNames, {
        params: {
            leniency: leniency ? 'enable' : 'disable'
        }
    });
    return response.data;
};
