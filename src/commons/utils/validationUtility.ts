import type { RegisterRequest } from "../../user/api/userApis";

export const PATTERNS = {
    UUID_PATTERN: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    NUMBER_ONLY_PATTERN: /^[0-9]+$/,
    EMAIL_PATTERN: /^(?=.{1,64}@)[\p{L}0-9]+([._+-][\p{L}0-9]+)*@([\p{L}0-9]+(-[\p{L}0-9]+)*\.)+\p{L}{2,190}$/u,
    USERNAME_PATTERN: /^[\p{L}0-9_-]{3,100}$/u,
    NAME_PATTERN: /^[\p{L} .'-]+$/u,
    PASSWORD_PATTERN: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,255}$/,
    ROLE_AND_PERMISSION_NAME_PATTERN: /^[\p{L}0-9_]+$/u
};

export const validateEmail = (email: string | null): string | null => {
    if (!email || !email.trim()) {
        return 'Email cannot be null or blank';
    }
    if (!PATTERNS.EMAIL_PATTERN.test(email)) {
        return 'Email is of invalid format';
    }
    return null;
};

export const validateUsername = (username: string | null): string | null => {
    if (!username || !username.trim()) {
        return 'Username cannot be null or blank';
    }
    if (!PATTERNS.USERNAME_PATTERN.test(username)) {
        return 'Username is invalid as it can only contain letters, digits, underscores, and hyphens and must be between 3 and 100 characters long';
    }
    return null;
};

export const validatePassword = (password: string | null): string | null => {
    if (!password || !password.trim()) {
        return 'Password cannot be null or blank';
    }
    if (!PATTERNS.PASSWORD_PATTERN.test(password)) {
        return 'Password is invalid as it must contain at least one digit, one lowercase letter, one uppercase letter, and one special character and must be between 8 and 255 characters long';
    }
    return null;
};

export const validateFirstName = (name: string | null): string | null => {
    if (!name || !name.trim()) {
        return 'First name cannot be null or blank';
    }
    if (name.length > 50) {
        return 'First name must be at most 50 characters long';
    }
    if (!PATTERNS.NAME_PATTERN.test(name)) {
        return 'First name is invalid as it can only contain letters, spaces, periods, apostrophes, and hyphens';
    }
    return null;
};

export const validateMiddleName = (name: string | null): string | null => {
    if (!name) {
        return null;
    }
    if (!name.trim()) {
        return 'Middle name cannot be blank if provided';
    }
    if (name.length > 50) {
        return 'Middle name must be at most 50 characters long';
    }
    if (!PATTERNS.NAME_PATTERN.test(name)) {
        return 'Middle name is invalid as it can only contain letters, spaces, periods, apostrophes, and hyphens';
    }
    return null;
};

export const validateLastName = (name: string | null): string | null => {
    if (!name) {
        return null;
    }
    if (!name.trim()) {
        return 'Last name cannot be blank if provided';
    }
    if (name.length > 50) {
        return 'Last name must be at most 50 characters long';
    }
    if (!PATTERNS.NAME_PATTERN.test(name)) {
        return 'Last name is invalid as it can only contain letters, spaces, periods, apostrophes, and hyphens';
    }
    return null;
};

export const validateOtp = (otp: string, length: number = 6): string | null => {
    if (!otp || !otp.trim()) {
        return 'OTP cannot be null or blank';
    }
    if (otp.length !== length) {
        return `OTP must be exactly ${length} characters long`;
    }
    if (!PATTERNS.NUMBER_ONLY_PATTERN.test(otp)) {
        return 'OTP must contain numbers only';
    }
    return null;
};

export const validateUuid = (uuid: string): string | null => {
    if (!uuid || !uuid.trim()) {
        return 'UUID cannot be null or blank';
    }
    if (!PATTERNS.UUID_PATTERN.test(uuid)) {
        return 'UUID is of invalid format';
    }
    return null;
};

export const validateRoleName = (roleName: string | null): string | null => {
    if (!roleName || !roleName.trim()) {
        return 'Role name cannot be null or blank';
    }
    if (roleName.length > 100) {
        return 'Role name must be at most 100 characters long';
    }
    if (!PATTERNS.ROLE_AND_PERMISSION_NAME_PATTERN.test(roleName)) {
        return 'Role name is invalid as it can only contain letters, digits, and underscores';
    }
    return null;
};

export const validatePermissionName = (permissionName: string | null): string | null => {
    if (!permissionName || !permissionName.trim()) {
        return 'Permission name cannot be null or blank';
    }
    if (permissionName.length > 100) {
        return 'Permission name must be at most 100 characters long';
    }
    if (!PATTERNS.ROLE_AND_PERMISSION_NAME_PATTERN.test(permissionName)) {
        return 'Permission name is invalid as it can only contain letters, digits, and underscores';
    }
    return null;
};

export const validateUserIdentifier = (input: string): string | null => {
    if (!input || !input.trim()) {
        return 'Identifier cannot null or blank';
    }
    const isUsername = PATTERNS.USERNAME_PATTERN.test(input);
    if (isUsername) {
        return null;
    }
    const isEmail = PATTERNS.EMAIL_PATTERN.test(input);
    if (isEmail) {
        return null;
    }
    const isUuid = PATTERNS.UUID_PATTERN.test(input);
    if (isUuid) {
        return null;
    }
    return 'Invalid identifier format (must be Username, Email, or UUID)';
};

export const validateRegistrationInputs = (data: RegisterRequest): Record<string, string> => {
    const errors: Record<string, string> = {};
    const firstNameError = validateFirstName(data.firstName);
    if (firstNameError) {
        errors.firstName = firstNameError;
    }
    const middleNameError = validateMiddleName(data.middleName);
    if (middleNameError) {
        errors.middleName = middleNameError;
    }
    const lastNameError = validateLastName(data.lastName);
    if (lastNameError) {
        errors.lastName = lastNameError;
    }
    const usernameError = validateUsername(data.username);
    if (usernameError) {
        errors.username = usernameError;
    }
    const emailError = validateEmail(data.email);
    if (emailError) {
        errors.email = emailError;
    }
    const passwordError = validatePassword(data.password);
    if (passwordError) {
        errors.password = passwordError;
    }
    return errors;
};
