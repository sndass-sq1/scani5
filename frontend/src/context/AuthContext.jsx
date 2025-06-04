import { useState, createContext, useEffect } from 'react';
import useDynamicQuery from '../services/useDynamicQuery';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalComp from '../components/ModalComp';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [userdata, setUserdata] = useState(localStorage.getItem('user') || null);
    const [totpToken, setTotpToken] = useState(sessionStorage.getItem('token') || '');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [otp_status, SetOtp_Status] = useState(localStorage.getItem('otp_status') || '');
    const [qr_status, SetQr_Status] = useState(localStorage.getItem('qr_status') || '');
    const [activeRole, setActiveRole] = useState(localStorage.getItem('activeRole') || '');
    const [orgData, setOrgData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeOrgId, setActiveOrgId] = useState(localStorage.getItem('activeOrgId') || '');
    const [activeOrgName, setActiveOrgName] = useState(localStorage.getItem('activeOrgName') || '');
    const [orgImageURL, setOrgImageURL] = useState(false);

    const {
        mutate: logoutMutate,
        isPending: logoutPending,
        // error: logoutErrors,
        isSuccess: logoutSuccess,
    } = useDynamicQuery({
        type: 'post',
        url: 'auth/logout',
    });

    const cancelLogout = () => {
        setIsModalOpen(false);
    };

    const afterSuccessLogout = () => {
        setUserdata('');
        localStorage.clear();
        sessionStorage.clear();
        SetOtp_Status('');
        setTotpToken('');
        setToken('');
        setOrgData([]);
        SetQr_Status('');
        setActiveRole('');
        setActiveOrgId('');
        setActiveOrgName('');
        cancelLogout();
        navigate('/login');
    };

    useEffect(() => {
        if (logoutSuccess) {
            afterSuccessLogout();
        }
    }, [logoutSuccess]);

    // if (logoutErrors) {
    //     const errors = logoutErrors.response?.data?.message || {};
    //     if (Object.keys(errors).length > 0) {
    //         cancelLogout();
    //     }
    // }

    const confirmLogout = async () => {
        try {
            logoutMutate();
        } catch (error) {
            console.log('logout call error, ', error);
        }
    };

    const loginModalButtons = [
        {
            label: 'No',
            function: cancelLogout,
            varient: 'secondary',
        },
        {
            label: 'Yes',
            function: confirmLogout,
            varient: 'primary',
            disable: logoutPending,
        },
    ];

    const logout = () => {
        setIsModalOpen(true);
    };

    return (
        <AuthContext
            value={{
                totpToken,
                setTotpToken,
                token,
                otp_status,
                SetOtp_Status,
                setToken,
                qr_status,
                SetQr_Status,
                logout,
                userdata,
                setUserdata,
                activeRole,
                setActiveRole,
                orgData,
                confirmLogout,
                activeOrgId,
                setActiveOrgId,
                activeOrgName,
                setActiveOrgName,
                setOrgData,
                afterSuccessLogout,
                orgImageURL,
                setOrgImageURL,
            }}>
            {children}
            {isModalOpen && (
                <ModalComp
                    isOpen={isModalOpen}
                    // children="Are you sure want to delete this?"
                    title={<p className="logout-modal">Are you sure want to logout?</p>}
                    buttons={loginModalButtons}
                />
            )}
        </AuthContext>
    );
};

export const useAuth = () => {
    return use(AuthContext);
};
