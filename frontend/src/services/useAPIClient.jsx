import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Expires: 0,
    Pragma: 'no-cache',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
};

const errorBind = (err) => {
    const extractMessage = () => {
        if (err.response && err.response.data && typeof err.response.data.message === 'object') {
            return Object.values(err.response.data.message)?.[0]?.[0];
        }
        return 'An error occurred';
    };

    const message =
        err.response && err.response.data && typeof err.response.data.message === 'string'
            ? err.response.data.message
            : extractMessage();

    toast.error(message);
};

function useAPIClient() {
    const navigate = useNavigate();
    const user = useAuth();
    const [errorRoute, setErrorRoute] = useState(null);

    useEffect(() => {
        if (errorRoute) {
            navigate(errorRoute, { replace: true });
            setErrorRoute(null);
        }
    }, [errorRoute, navigate]);

    const apiClient = axios.create({
        baseURL: `${process.env.REACT_APP_BACKEND_BASE_URL}`,
        headers: headers,
    });

    apiClient.defaults.headers.common['Authorization'] = `Bearer ${
        localStorage.getItem('token') ||
        sessionStorage.getItem('token') ||
        user?.token ||
        user?.totpToken
    }`;

    // Request Interceptor
    apiClient.interceptors.request.use(
        (req) => {
            return req;
        },
        (err) => {
            console.error(err);
            return Promise.reject(err);
        }
    );

    // Response Interceptor
    apiClient.interceptors.response.use(
        (res) => res,
        (err) => {
            console.error(err);
            const status = err.response?.status;

            if (err.code === 'ERR_NETWORK' || status === 500) {
                errorBind(err);
                setErrorRoute('/server-error');
            } else if (status === 401) {
                user?.SetOtp_Status('');
                user?.setToken('');
                user?.SetQr_Status('');
                user?.setActiveRole('');
                user?.setTotpToken('');
                user?.setActiveRole('');
                user?.setUserdata('');
                user?.setActiveOrgId('');
                user?.setActiveOrgName('');
                user?.setOrgData([]);
                localStorage.clear();
                sessionStorage.clear();
                // errorBind(err);
                setErrorRoute('/login');
            } else if (status === 403) {
                errorBind(err);
                setErrorRoute('/access-denied');
            } else if (status === 422) {
                errorBind(err);
            } else {
                errorBind(err);
            }

            return Promise.reject(err);
        }
    );

    return apiClient;
}

export default useAPIClient;
