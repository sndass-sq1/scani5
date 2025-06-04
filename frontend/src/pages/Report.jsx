import React from 'react';
import TableComp from '../components/TableComp';

export const Report = () => {
    return (
        <>
            <title>Scani5 - Reports</title>
            <h5 className="heading m-b-15">Reports</h5>
            <TableComp from="reports" />
        </>
    );
};
