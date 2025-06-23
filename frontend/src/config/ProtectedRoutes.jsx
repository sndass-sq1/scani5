import React from 'react';
import { Navigate, useLocation, useMatch } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';

const ProtectedRoutes = ({ children }) => {
    const auth = useAuth();
    const decrypytToken = auth?.token;
    const decrypytUserData = useDecrypt(auth?.userdata);
    const decrypytActiveRole = useDecrypt(auth?.activeRole);
    const location = useLocation();
    const isOrgUsers = useMatch('/organization/users/:id');
    const isUsersOrg = useMatch('/users/organization/:id');
    const isAssetDetails = useMatch('/asset-details/:id');
    const isVulnerabilityWithIdAndType = useMatch('/vulnerability/:id/:type');
    const isVulnerabilityWithId = useMatch('/vulnerability/:id');
    const isExploitWithId = useMatch('/exploits/:id');
    const isVulDetails = useMatch('/vulnerability-details/:id');
    const sq1SuperAdminAccess = [
        '/',
        '/users',
        '/organization',
        '/settings',
        '/help',
        '/activityLog',
        '/notifications',
        '/profile',
    ];
    const orgAccess = [
        '/',
        '/users',
        '/assets',
        '/vulnerability',
        '/reports',
        '/tags',
        '/organization-info',
        '/notifications',
        '/profile',
        '/exploits',
    ];

    const checkAutherization = () => {
        let path = location.pathname;
        if (location.pathname.endsWith('/') && location.pathname !== '/') {
            path = location.pathname.slice(0, -1);
        }
        if (['sq1 super admin', 'sq1 admin', 'sq1 user'].includes(decrypytActiveRole)) {
            if (sq1SuperAdminAccess.includes(path) || isOrgUsers || isUsersOrg) {
                return true;
            }
        } else if (
            orgAccess.includes(path) ||
            isAssetDetails ||
            isVulDetails ||
            isVulnerabilityWithId ||
            isExploitWithId ||
            isVulnerabilityWithIdAndType
        ) {
            return true;
        }
        return false;
    };

    if (!decrypytUserData && !decrypytToken) {
        return <Navigate to="/login" />;
    } else {
        if (checkAutherization()) {
            return children;
        }
        return <Navigate to="/access-denied" replace={true} />;
    }
};

export default ProtectedRoutes;
