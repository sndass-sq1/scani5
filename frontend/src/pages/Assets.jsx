import React, { useState } from 'react';
import TableComp from '../components/TableComp';
import { SwitchTabComp } from '../components/SwitchTabComp';
import { useLocation } from 'react-router-dom';

export const Assets = () => {
    const { state } = useLocation();
    const [selectedTab, setSelectedTab] = useState('Assets');
    const [status, setStatus] = useState(state);
    const getSelectedTab = (val) => {
        setSelectedTab(val);
        if (state) {
            setStatus(null);
        }
    };

    return (
        <>
            <div className="vul-pages">
                <title>Scani5 - Assets</title>
                <h5 className="heading m-b-15">Assets</h5>
                <SwitchTabComp from="assets" getSelectedTab={getSelectedTab} />
                <div className="assets-table-height">
                    {selectedTab === 'Assets' && <TableComp from="assets" status={status} />}
                    {selectedTab === 'Retired Assets' && <TableComp from="retiredassets" />}
                    {/* {selectedTab === 'Reported Assets' && <TableComp from="reportassets" />} */}
                </div>
            </div>
        </>
    );
};
