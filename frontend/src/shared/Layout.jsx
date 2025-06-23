import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, matchRoutes, useMatch, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RouteConfig from '../config/RouteConfig';
import { ucFirst } from '../utils/UcFirst';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const toggleSidenav = () => {
        setIsCollapsed((prevState) => !prevState);
    };
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    const decrypytToken = auth?.token;
    const decrypytTOTPToken = auth?.totpToken;
    const decrypytUserData = useDecrypt(auth?.userdata);
    const decrypytQr_Status = useDecrypt(auth?.qr_status);

    const noLayoutPath = [
        '/login',
        '/forgot-password',
        '/mfa/qr',
        '/mfa/totp',
        '/registration-not-found',
        '/server-error',
        '/access-denied',
    ];
    const isUpdatePassword = useMatch('/update-password/:token');
    const isRegister = useMatch('/register/:id');
    // Get matched routes from the route configuration
    const matchedRoutes = matchRoutes(RouteConfig().routes, location);

    // Extract the paths from matchedRoutes
    const matchedPaths = matchedRoutes ? matchedRoutes.map((route) => route.route.path) : [];

    // Determine if the current route is one of the "no layout" routes or doesn't match any route
    const noLayout =
        matchedPaths.length === 0 || // No matched route
        matchedPaths.includes('/*') || // Wildcard route
        isUpdatePassword ||
        isRegister ||
        noLayoutPath.includes(location.pathname);

    const preventToGoBack = () => {
        let path = location.pathname;
        if (location.pathname.endsWith('/') && location.pathname !== '/') {
            path = location.pathname.slice(0, -1);
        }
        if (path === '/login' && (!!decrypytToken || !!decrypytTOTPToken)) {
            console.log('login true');

            return true;
        }
        if (
            path === '/mfa/totp' &&
            ((!!decrypytToken && !!decrypytUserData) ||
                (!!decrypytTOTPToken && decrypytQr_Status === 'mfa_qr'))
        ) {
            console.log('/mfa/totp true');

            return true;
        }

        if (
            path === '/mfa/qr' &&
            ((!!decrypytToken && !!decrypytUserData) ||
                (!!decrypytTOTPToken && decrypytQr_Status === 'mfa_otp'))
        ) {
            return true;
        }

        return false;
    };

    useEffect(() => {
        if (preventToGoBack()) {
            if (!!decrypytToken && !!decrypytUserData) {
                navigate('/', { replace: true });
            } else if (!!decrypytTOTPToken) {
                if (decrypytQr_Status === 'mfa_qr') {
                    navigate('/mfa/qr', { replace: true });
                } else {
                    navigate('/mfa/totp', { replace: true });
                }
            } else {
                navigate('/login', { replace: true });
            }
        }
    }, [navigate, location.pathname]);

    if (preventToGoBack()) {
        return null;
    }

    if (noLayout) {
        return (
            <div>
                <div>
                    <Outlet />
                </div>
            </div>
        );
    }

    return (
        <div className=" p-0 ">
            <div className="Sidebar-layout-page">
                <div className="Side-navbar-wrapper">
                    <Sidebar
                        isCollapsed={isCollapsed}
                        toggleSidenav={toggleSidenav}
                        show={show}
                        handleShow={handleShow}
                        handleClose={handleClose}
                    />
                    <Navbar isCollapsed={isCollapsed} handleShow={handleShow} />
                    <div
                        className={`main-content ${
                            isCollapsed ? 'sidenav-collapsed' : 'sidenav-expanded'
                        }`}>
                        <div className="content-wrapper">
                            <title>{`Scani5 - ${ucFirst(location.pathname.slice(1))}`}</title>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
