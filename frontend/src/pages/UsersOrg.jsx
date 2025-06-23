import React from 'react';
import TableComp from '../components/TableComp';
import { useLocation } from 'react-router-dom';
import { ucFirst } from '../utils/UcFirst';

const UsersOrg = () => {
    const location = useLocation();
    const userName = location.state || 'User';

    return (
        <>
            <title>Scani5 - Users Organization</title>
            <h5 className="heading m-b-15">{ucFirst(userName)}'s Organization</h5>
            <TableComp from="usersOrg" />
        </>
    );
};

export default UsersOrg;
