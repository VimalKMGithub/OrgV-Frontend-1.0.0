export const SystemPermissions = {
    CAN_CREATE_USER: 'CAN_CREATE_USER',
    CAN_READ_USER: 'CAN_READ_USER',
    CAN_UPDATE_USER: 'CAN_UPDATE_USER',
    CAN_DELETE_USER: 'CAN_DELETE_USER',
    CAN_READ_PERMISSION: 'CAN_READ_PERMISSION',
    CAN_CREATE_ROLE: 'CAN_CREATE_ROLE',
    CAN_READ_ROLE: 'CAN_READ_ROLE',
    CAN_UPDATE_ROLE: 'CAN_UPDATE_ROLE',
    CAN_DELETE_ROLE: 'CAN_DELETE_ROLE'
} as const;

export type SystemPermissions = typeof SystemPermissions[keyof typeof SystemPermissions];

export const SystemRoles = {
    ROLE_GOD: 'ROLE_GOD',
    ROLE_GLOBAL_ADMIN: 'ROLE_GLOBAL_ADMIN',
    ROLE_SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_MANAGE_ROLES: 'ROLE_MANAGE_ROLES',
    ROLE_MANAGE_USERS: 'ROLE_MANAGE_USERS',
    ROLE_MANAGE_PERMISSIONS: 'ROLE_MANAGE_PERMISSIONS'
} as const;

export type SystemRoles = typeof SystemRoles[keyof typeof SystemRoles];

export const TOP_ROLES = [
    SystemRoles.ROLE_GOD,
    SystemRoles.ROLE_GLOBAL_ADMIN,
    SystemRoles.ROLE_SUPER_ADMIN,
    SystemRoles.ROLE_ADMIN
];

const TOP_ROLES_SET: ReadonlySet<string> = new Set(TOP_ROLES);

const canCreateUsersSet = (): ReadonlySet<string> => {
    const set = new Set(TOP_ROLES_SET);
    set.add(SystemPermissions.CAN_CREATE_USER);
    return set;
};

const canReadUsersSet = (): ReadonlySet<string> => {
    const set = new Set(TOP_ROLES_SET);
    set.add(SystemPermissions.CAN_READ_USER);
    return set;
};

const canUpdateUsersSet = (): ReadonlySet<string> => {
    const set = new Set(TOP_ROLES_SET);
    set.add(SystemPermissions.CAN_UPDATE_USER);
    return set;
};

const canDeleteUsersSet = (): ReadonlySet<string> => {
    const set = new Set(TOP_ROLES_SET);
    set.add(SystemPermissions.CAN_DELETE_USER);
    return set;
};

const canReadPermissionsSet = (): ReadonlySet<string> => {
    const set = new Set(TOP_ROLES_SET);
    set.add(SystemPermissions.CAN_READ_PERMISSION);
    return set;
};

const canCreateRolesSet = (): ReadonlySet<string> => {
    const set = new Set(TOP_ROLES_SET);
    set.add(SystemPermissions.CAN_CREATE_ROLE);
    return set;
};

const canReadRolesSet = (): ReadonlySet<string> => {
    const set = new Set(TOP_ROLES_SET);
    set.add(SystemPermissions.CAN_READ_ROLE);
    return set;
};

const canUpdateRolesSet = (): ReadonlySet<string> => {
    const set = new Set(TOP_ROLES_SET);
    set.add(SystemPermissions.CAN_UPDATE_ROLE);
    return set;
};

const canDeleteRolesSet = (): ReadonlySet<string> => {
    const set = new Set(TOP_ROLES_SET);
    set.add(SystemPermissions.CAN_DELETE_ROLE);
    return set;
};

const CAN_CREATE_USERS_SET = canCreateUsersSet();
const CAN_READ_USERS_SET = canReadUsersSet();
const CAN_UPDATE_USERS_SET = canUpdateUsersSet();
const CAN_DELETE_USERS_SET = canDeleteUsersSet();
const CAN_READ_PERMISSIONS_SET = canReadPermissionsSet();
const CAN_CREATE_ROLES_SET = canCreateRolesSet();
const CAN_READ_ROLES_SET = canReadRolesSet();
const CAN_UPDATE_ROLES_SET = canUpdateRolesSet();
const CAN_DELETE_ROLES_SET = canDeleteRolesSet();

const containsAny = (requiredAuthorities: ReadonlySet<string>, userAuthorities: ReadonlySet<string>): boolean => {
    for (const auth of userAuthorities) {
        if (requiredAuthorities.has(auth)) {
            return true;
        }
    }
    return false;
};

export const canCreateUsers = (userAuthorities: ReadonlySet<string>): boolean => {
    return containsAny(CAN_CREATE_USERS_SET, userAuthorities);
};

export const canReadUsers = (userAuthorities: ReadonlySet<string>): boolean => {
    return containsAny(CAN_READ_USERS_SET, userAuthorities);
};

export const canUpdateUsers = (userAuthorities: ReadonlySet<string>): boolean => {
    return containsAny(CAN_UPDATE_USERS_SET, userAuthorities);
};

export const canDeleteUsers = (userAuthorities: ReadonlySet<string>): boolean => {
    return containsAny(CAN_DELETE_USERS_SET, userAuthorities);
};

export const canReadPermissions = (userAuthorities: ReadonlySet<string>): boolean => {
    return containsAny(CAN_READ_PERMISSIONS_SET, userAuthorities);
};

export const canCreateRoles = (userAuthorities: ReadonlySet<string>): boolean => {
    return containsAny(CAN_CREATE_ROLES_SET, userAuthorities);
};

export const canReadRoles = (userAuthorities: ReadonlySet<string>): boolean => {
    return containsAny(CAN_READ_ROLES_SET, userAuthorities);
};

export const canUpdateRoles = (userAuthorities: ReadonlySet<string>): boolean => {
    return containsAny(CAN_UPDATE_ROLES_SET, userAuthorities);
};

export const canDeleteRoles = (userAuthorities: ReadonlySet<string>): boolean => {
    return containsAny(CAN_DELETE_ROLES_SET, userAuthorities);
};
