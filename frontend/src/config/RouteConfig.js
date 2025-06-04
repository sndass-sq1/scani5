import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '../pages/Dashboard';
import PageNotFound from '../errors/PageNotFound';
import { AccessDenied } from '../errors/AccessDenied';
import ServerError from '../errors/ServerError';
import { Login } from '../pages/auth/Login';
import ProtectedRoutes from './ProtectedRoutes';
import Layout from '../shared/Layout';
import { Organization } from '../pages/Organization';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { UpdatePassword } from '../pages/auth/UpdatePassword';
import RegistrationLinkNotFound from '../errors/RegistrationLinkNotFound';
import { MfaQR } from '../pages/auth/MfaQR';
import { MfaTOTP } from '../pages/auth/MfaTOTP';
import { Register } from '../pages/auth/Register';
import { Users } from '../pages/Users';
import { UserActivityLog } from '../pages/UserActivityLog';
import { Assets } from '../pages/Assets';
import { Vulnerability } from '../pages/Vulnerability';
import OrganizationInfo from '../pages/OrganizationInfo';
import Notification from '../pages/Notification';
import Help from '../pages/Help';
import { Tags } from '../pages/Tags';
import { Report } from '../pages/Report';
import ProfileSettings from '../pages/ProfileSettings';
import { AssetDetails } from '../pages/AssetDetails';
import VulnerabilityDetails from '../pages/VulnerabilityDetails';
import OrgUsers from '../pages/OrgUsers';
import UsersOrg from '../pages/UsersOrg';
import { AuthProvider } from '../context/AuthContext';
import FormModalProvider from '../context/FormModalContext';
import { SearchProvider } from '../context/SearchContext';
import Settings from '../pages/Settings';
import Exploit from '../pages/Exploit';
const RouteConfig = () => {
    const Routes = createBrowserRouter([
        {
            path: '/',
            element: (
                <FormModalProvider>
                    <AuthProvider>
                        <SearchProvider>
                            <Layout />
                        </SearchProvider>
                    </AuthProvider>
                </FormModalProvider>
            ),
            children: [
                {
                    index: true, // Default route for "/"
                    element: (
                        <ProtectedRoutes>
                            <Dashboard />
                        </ProtectedRoutes>
                    ),
                },

                {
                    path: 'organization',
                    element: (
                        <ProtectedRoutes>
                            <Organization />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'users',
                    element: (
                        <ProtectedRoutes>
                            <Users />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'organization/users/:id',
                    element: (
                        <ProtectedRoutes>
                            <OrgUsers />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'users/organization/:id',
                    element: (
                        <ProtectedRoutes>
                            <UsersOrg />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'help',
                    element: (
                        <ProtectedRoutes>
                            <Help />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'settings',
                    element: (
                        <ProtectedRoutes>
                            <Settings />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'assets',
                    element: (
                        <ProtectedRoutes>
                            <Assets />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'vulnerability/:id?/:type?',
                    element: (
                        <ProtectedRoutes>
                            <Vulnerability />
                        </ProtectedRoutes>
                    ),
                },

                {
                    path: 'exploits/:id?',
                    element: (
                        <ProtectedRoutes>
                            <Exploit />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'activityLog',
                    element: (
                        <ProtectedRoutes>
                            <UserActivityLog />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'reports',
                    element: (
                        <ProtectedRoutes>
                            <Report />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'asset-details/:id',
                    element: (
                        <ProtectedRoutes>
                            <AssetDetails />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'vulnerability-details/:id',
                    element: (
                        <ProtectedRoutes>
                            <VulnerabilityDetails />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'tags',
                    element: (
                        <ProtectedRoutes>
                            <Tags />
                        </ProtectedRoutes>
                    ),
                },

                {
                    path: 'organization-info',
                    element: (
                        <ProtectedRoutes>
                            <OrganizationInfo />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'notifications',
                    element: (
                        <ProtectedRoutes>
                            <Notification />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'profile',
                    element: (
                        <ProtectedRoutes>
                            <ProfileSettings />
                        </ProtectedRoutes>
                    ),
                },
                {
                    path: 'login',
                    element: <Login />,
                },
                {
                    path: 'forgot-password',
                    element: <ForgotPassword />,
                },
                {
                    path: 'register/:id',
                    element: <Register />,
                },
                {
                    path: 'update-password/:token',
                    element: <UpdatePassword />,
                },
                {
                    path: 'mfa/qr',
                    element: <MfaQR />,
                },
                {
                    path: 'mfa/totp',
                    element: <MfaTOTP />,
                },
                {
                    path: 'server-error',
                    element: <ServerError />,
                },
                {
                    path: 'access-denied',
                    element: <AccessDenied />,
                },
                {
                    path: 'registration-not-found',
                    element: <RegistrationLinkNotFound />,
                },
                {
                    path: '/*',
                    element: <PageNotFound />,
                },
            ],
        },
    ]);
    return Routes;
};

export default RouteConfig;
