export const processDeleteUsersResponse = (response: any) => {
    let processedResults: any = { ...response };
    if (processedResults.reasons_due_to_which_users_has_not_been_deleted) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_users_has_not_been_deleted
        };
        delete processedResults.reasons_due_to_which_users_has_not_been_deleted;
    }
    if (processedResults.reasons_due_to_which_some_users_has_not_been_deleted) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_some_users_has_not_been_deleted
        };
        delete processedResults.reasons_due_to_which_some_users_has_not_been_deleted;
    }
    return processedResults;
};

export const processReadUsersResponse = (response: any) => {
    let processedResults: any = { ...response };
    if (processedResults.reasons_due_to_which_users_has_not_been_returned) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_users_has_not_been_returned
        };
        delete processedResults.reasons_due_to_which_users_has_not_been_returned;
    }
    if (processedResults.reasons_due_to_which_some_users_has_not_been_returned) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_some_users_has_not_been_returned
        };
        delete processedResults.reasons_due_to_which_some_users_has_not_been_returned;
    }
    return processedResults;
}

export const processDeleteRolesResponse = (response: any) => {
    let processedResults: any = { ...response };
    if (processedResults.reasons_due_to_which_roles_has_not_been_deleted) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_roles_has_not_been_deleted
        };
        delete processedResults.reasons_due_to_which_roles_has_not_been_deleted;
    }
    if (processedResults.reasons_due_to_which_some_roles_has_not_been_deleted) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_some_roles_has_not_been_deleted
        };
        delete processedResults.reasons_due_to_which_some_roles_has_not_been_deleted;
    }
    return processedResults;
}

export const processReadRolesResponse = (response: any) => {
    let processedResults: any = { ...response };
    if (processedResults.reasons_due_to_which_roles_has_not_been_returned) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_roles_has_not_been_returned
        };
        delete processedResults.reasons_due_to_which_roles_has_not_been_returned;
    }
    if (processedResults.reasons_due_to_which_some_roles_has_not_been_returned) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_some_roles_has_not_been_returned
        };
        delete processedResults.reasons_due_to_which_some_roles_has_not_been_returned;
    }
    return processedResults;
}

export const processReadPermissionsResponse = (response: any) => {
    let processedResults: any = { ...response };
    if (processedResults.reasons_due_to_which_permissions_has_not_been_returned) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_permissions_has_not_been_returned
        };
        delete processedResults.reasons_due_to_which_permissions_has_not_been_returned;
    }
    if (processedResults.reasons_due_to_which_some_permissions_has_not_been_returned) {
        processedResults = {
            ...processedResults,
            ...processedResults.reasons_due_to_which_some_permissions_has_not_been_returned
        };
        delete processedResults.reasons_due_to_which_some_permissions_has_not_been_returned;
    }
    return processedResults;
}
