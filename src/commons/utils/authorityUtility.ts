export const extractUserAuthorities = (user: any): Set<string> => {
    const authorities = new Set<string>();
    if (!user || !user.roles) {
        return authorities;
    }
    user.roles.forEach((role: any) => {
        const roleName = typeof role === 'string' ? role : role.roleName;
        authorities.add(roleName);
        if (typeof role === 'object' && role.permissions) {
            role.permissions.forEach((permission: any) => {
                const permissionName = typeof permission === 'string' ? permission : permission.permissionName;
                authorities.add(permissionName);
            });
        }
    });
    return authorities;
};
