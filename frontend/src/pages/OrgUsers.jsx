import React from 'react';
import TableComp from '../components/TableComp';
import { useLocation } from 'react-router-dom';
import { ucFirst } from '../utils/UcFirst';

const OrgUsers = () => {
    const location = useLocation();
    const orgName = location.state || 'Organization';

    return (
        <>
            <title>Scani5 - Organization Users</title>
            <h5 className="heading m-b-15">{ucFirst(orgName)}'s Users</h5>
            <TableComp from="orgUsers" />
        </>
    );
};

export default OrgUsers;
