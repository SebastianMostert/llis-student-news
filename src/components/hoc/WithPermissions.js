import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkPermissions } from '@/utils/checkPermissions';

const withPermissions = (WrappedComponent, permissions, redirectTo = '/') => {
    const WithPermissions = (props) => {
        const [hasPermissions, setHasPermissions] = useState(false);
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            const fetchPermissions = async () => {
                const result = await checkPermissions({ permissionsToCheck: permissions, redirectTo });
                setHasPermissions(result);
                setLoading(false);
            };

            fetchPermissions();
        }, []);

        if (loading) return <div>Loading...</div>;

        if (!hasPermissions) {
            router.push(redirectTo);
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    WithPermissions.displayName = `WithPermissions(${getDisplayName(WrappedComponent)})`;

    return WithPermissions;
};

const getDisplayName = (WrappedComponent) => {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default withPermissions;
