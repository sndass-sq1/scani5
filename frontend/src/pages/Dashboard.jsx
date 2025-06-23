import DashboardComp from '../components/DashboardComp';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import useDecrypt from '../utils/useDecrypt';
import { OrgDashboard } from './OrgDashboard';
import { Loader } from '../shared/Loader';
export const Dashboard = () => {
    const user = useAuth();
    const [decryptedUserActiveRole, setDecryptedUserActiveRole] = useState(null);

    // let decryptedUserActiveRole = useDecrypt(user?.activeRole || '');
    const decryptedRole = useDecrypt(user?.activeRole || '');
    useEffect(() => {
        if (user?.activeRole) {
            setDecryptedUserActiveRole(decryptedRole); // Update with decrypted role
        }
    }, [user?.activeRole]);
    if (decryptedUserActiveRole === null) {
        return <Loader />;
    }
    return (
        <>
            <title>Scani5 - Dashboard</title>
            {!decryptedUserActiveRole?.includes('org') && (
                <h5 className="heading m-b-15">Dashboard</h5>
            )}
            {decryptedUserActiveRole?.includes('org') ? <OrgDashboard /> : <DashboardComp />}
        </>
    );
};
