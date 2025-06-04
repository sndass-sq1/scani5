import React, { useState } from 'react';
import { SwitchTabComp } from '../components/SwitchTabComp';
import FormComp from '../components/FormComp';
import { UserActivityLog } from './UserActivityLog';

const ProfileSettings = () => {
    const [selectedTab, setSelectedTab] = useState('Profile Information');
    const getSelectedTab = (val) => {
        setSelectedTab(val);
    };

    return (
        <div className="profile-wrapper-container">
            <SwitchTabComp from="profile-settings" getSelectedTab={getSelectedTab} />
            {selectedTab === 'Activity log' ? (
                <UserActivityLog />
            ) : (
                <>
                    <div className="profile-wrapper">
                        <FormComp from="profileSettings" className="profile-card" />
                        <FormComp from="changePassword" className="profile-card" />
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileSettings;
