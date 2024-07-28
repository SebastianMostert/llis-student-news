import { Permissions } from "./constant";

let cachedUser = null;
let cacheExpirationTime = null;

const CACHE_DURATION = 5 * 60 * 1000; // Cache duration in milliseconds (e.g., 5 minutes)

export const getUser = async () => {
    const currentTime = Date.now();

    if (cachedUser && cacheExpirationTime && currentTime < cacheExpirationTime) {
        console.log('Using cached user data');
        return { data: cachedUser, authenticated: true };
    }

    console.log('Fetching user data');
    const res = await fetch('/api/user/', { cache: "no-store" });

    if (res.ok) {
        const data = await res.json();
        cachedUser = data;
        cacheExpirationTime = currentTime + CACHE_DURATION;
        return { data, authenticated: true };
    } else if (res.status === 401) {
        cachedUser = null;
        cacheExpirationTime = null;
        return { data: null, authenticated: false };
    } else {
        throw new Error('Failed to fetch user data');
    }
};

export async function getUserRoles(options) {
    const { userToCheck, checkByID, unauthRedirectTo } = options;

    if (typeof window === 'undefined') {
        return false;
    }

    let user = userToCheck || (await getUser()).data;

    if (!user) {
        if (window.location.pathname !== unauthRedirectTo) {
            window.location.href = unauthRedirectTo;
        }
        throw new Error('User not authenticated');
    }

    if (!Array.isArray(user.roles)) throw new Error('User has no roles');

    return user.roles.flatMap(role =>
        role.rolePermissions.map(rp => checkByID ? rp.permission.id : rp.permission.name.toLowerCase())
    );
}

export async function checkPermissions(options) {
    const { permissionsToCheck, userToCheck, checkByID = false, unauthRedirectTo = '/login', redirectTo } = options;

    if (typeof window === 'undefined') {
        return false;
    }

    try {
        const userPermissions = await getUserRoles({ userToCheck, checkByID, unauthRedirectTo });

        if (userPermissions.includes(Permissions.Administrator)) {
            return true;
        }

        const hasAllPermissions = permissionsToCheck.every(permission => userPermissions.includes(permission.toLowerCase()));

        if (!hasAllPermissions && redirectTo) {
            window.location.href = redirectTo;
        }

        return hasAllPermissions;
    } catch (error) {
        return false;
    }
}
