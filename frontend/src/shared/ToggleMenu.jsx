import React from 'react';
const ToggleMenu = ({ isCollapsed, toggleSidenav }) => {
    return (
        <div>
            <button
                className={`toggle-btn ${isCollapsed ? 'toggle-btn-collapsed' : ''}`}
                onClick={toggleSidenav}>
                {isCollapsed ? (
                    <img src="/images/navigate_next.svg" width={24} alt="Navigate Next" />
                ) : (
                    <img src="/images/navigate_before.svg" width={24} alt="Navigate Prev" />
                )}
            </button>
        </div>
    );
};

ToggleMenu.propTypes = {};

export default ToggleMenu;
