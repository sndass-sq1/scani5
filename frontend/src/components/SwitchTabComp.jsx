import { FaClockRotateLeft, FaUser } from 'react-icons/fa6';
import { switch_tab_details } from '../utils/constant';
import { useEffect, useState } from 'react';

export const SwitchTabComp = ({ from = '', getSelectedTab, changeTab = '' }) => {
    const tabDetails = switch_tab_details.find((val) => val.name === from)?.['list'];
    const [selectedTab, setSelectedTab] = useState(tabDetails[0].name);

    const mapIcons = {
        profile: <FaUser />,
        activity_log: <FaClockRotateLeft />,
    };

    const selectTab = (tab) => {
        setSelectedTab(tab);
        getSelectedTab(tab);
    };

    useEffect(() => {
        if (!!changeTab && changeTab !== selectedTab) {
            selectTab(changeTab);
        }
    }, [changeTab]);

    return (
        <div className="tab-container">
            <div className="flex-column">
                {tabDetails?.length > 0 &&
                    tabDetails.map((val, index) => (
                        <div
                            className={`tab-pills ${selectedTab === val.name ? 'active' : ''}`}
                            key={`${val.name}_tab_${index}`}
                            onClick={() => selectTab(val.name)}>
                            {val?.icon && <span>{mapIcons[val?.icon]}</span>}
                            {val.name}
                        </div>
                    ))}
            </div>
        </div>
    );
};
