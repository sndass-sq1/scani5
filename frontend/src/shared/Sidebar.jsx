import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import ToggleMenu from './ToggleMenu';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';
import Offcanvas from 'react-bootstrap/Offcanvas';

const Sidebar = ({ isCollapsed, toggleSidenav, handleClose, show }) => {
    const user = useAuth();

    const decrypytActiveRole = useDecrypt(user?.activeRole);

    return (
        <>
            <div className={`sidenav ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="logo-section">
                    <div className="nav-logo">
                        <img src="/images/logo_icon.png" alt="logo" />
                    </div>
                    {!isCollapsed && (
                        <span>
                            <img src="/images/scani5.svg" alt="logo" />
                        </span>
                    )}
                </div>
                <div className="divider-line"></div>
                <div className="overflow">
                    <ul className="menu-items">
                        {decrypytActiveRole?.includes('org') ? (
                            <>
                                <li className="li-heading" title="Main">
                                    Main
                                </li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Dashboard</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/dashdoard.svg"
                                                    alt="Dashboard Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Dashboard</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Assets</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/assets"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/asset.svg"
                                                    alt="Dashboard Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Assets</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Vulnerabilities</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/vulnerability"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/vulnerability.svg"
                                                    alt="Dashboard Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Vulnerabilities</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>

                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Reports</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/reports"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/report.svg"
                                                    alt="Dashboard Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Reports</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>

                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Users</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="users"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/users.svg"
                                                    alt="Users Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Users</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>
                                <li className="divider-line my-4"></li>
                                <li className="li-heading">Settings</li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Tags</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/tags"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/tags.svg"
                                                    alt="Dashboard Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Tags</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Organization info</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/organization-info"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/organisation.svg"
                                                    alt="Dashboard Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Organization info</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>

                                {/* <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Help</Tooltip>}
                                        placement="right" trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/help"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/info.svg"
                                                    alt="Help Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Help</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li> */}
                                <li className="divider-line my-4"></li>
                                <li className="menu-item" title="">
                                    {/* <li className="menu-item" title=""> */}
                                    <OverlayTrigger
                                        overlay={<Tooltip>Logout</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <div
                                            onClick={user?.logout}
                                            className={`menu-link cursor-pointer`}>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/logout.svg"
                                                    alt="Logout Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Logout</span>
                                        </div>
                                    </OverlayTrigger>
                                    {/* </li> */}
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="li-heading" title="Main">
                                    Main
                                </li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Dashboard</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/dashdoard.svg"
                                                    alt="Dashboard Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Dashboard</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Organizations</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="organization"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/organisation.svg"
                                                    alt="Organization Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Organizations</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Users</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="users"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/users.svg"
                                                    alt="Users Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Users</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Activity Log</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/activityLog"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/activity.svg"
                                                    alt="Activity Log Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Activity Log</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>
                                <li className="divider-line my-4"></li>
                                <li className="li-heading">Settings</li>
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Settings</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/settings"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/setting.svg"
                                                    alt="Settings Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Settings</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li>
                                <li className="divider-line my-4"></li>
                                {/* <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Help</Tooltip>}
                                        placement="right" trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <NavLink
                                            to="/help"
                                            className={({ isActive }) =>
                                                `menu-link ${isActive ? 'active' : ''}`
                                            }>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/info.svg"
                                                    alt="Help Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Help</span>
                                        </NavLink>
                                    </OverlayTrigger>
                                </li> */}
                                <li className="menu-item" title="">
                                    <OverlayTrigger
                                        overlay={<Tooltip>Logout</Tooltip>}
                                        placement="right"
                                        trigger={['hover', 'focus']}
                                        show={isCollapsed ? undefined : false}>
                                        <div
                                            onClick={user?.logout}
                                            className={`menu-link cursor-pointer`}>
                                            <span className="menu-icon">
                                                <img
                                                    src="/images/sidebar-icon/logout.svg"
                                                    alt="Logout Icon"
                                                />
                                            </span>
                                            <span className="menu-text">Logout</span>
                                        </div>
                                    </OverlayTrigger>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            <div className="mobile-side-nav">
                <Offcanvas show={show} onHide={handleClose} className="custom-canvas">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>
                            <div className="logo-section">
                                <div className="nav-logo">
                                    <img src="/images/logo_icon.png" alt="logo" />
                                </div>
                                <span>
                                    <img src="/images/scani5.svg" alt="logo" />
                                </span>
                            </div>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <div className="divider-line"></div>
                    <Offcanvas.Body>
                        <div className="overflow">
                            <ul className="menu-items">
                                {decrypytActiveRole?.includes('org') ? (
                                    <>
                                        <li className="li-heading" title="Main">
                                            Main
                                        </li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Dashboard</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="/"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/dashdoard.svg"
                                                            alt="Dashboard Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Dashboard</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Assets</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="/assets"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/asset.svg"
                                                            alt="Dashboard Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Assets</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Vulnerabilities</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="/vulnerability"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/vulnerability.svg"
                                                            alt="Dashboard Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">
                                                        Vulnerabilities
                                                    </span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Reports</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="/reports"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/report.svg"
                                                            alt="Dashboard Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Reports</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Tags</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="/tags"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/tags.svg"
                                                            alt="Dashboard Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Tags</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>{' '}
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Users</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="users"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/users.svg"
                                                            alt="Users Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Users</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="divider-line my-4"></li>
                                        <li className="li-heading">Settings</li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Organization info</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="/organization-info"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/organisation.svg"
                                                            alt="Dashboard Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">
                                                        Organization info
                                                    </span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="divider-line my-4"></li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Logout</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <div
                                                    onClick={user?.logout}
                                                    className={`menu-link cursor-pointer`}>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/logout.svg"
                                                            alt="Logout Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Logout</span>
                                                </div>
                                            </OverlayTrigger>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="li-heading" title="Main">
                                            Main
                                        </li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Dashboard</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="/"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/dashdoard.svg"
                                                            alt="Dashboard Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Dashboard</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Organization</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="organization"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/organisation.svg"
                                                            alt="Organization Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Organization</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Users</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="users"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/users.svg"
                                                            alt="Users Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Users</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Activity Log</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="/activityLog"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/activity.svg"
                                                            alt="Activity Log Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Activity Log</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="divider-line my-4"></li>
                                        <li className="li-heading">Settings</li>
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Settings</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <NavLink
                                                    to="/settings"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/setting.svg"
                                                            alt="Settings Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Settings</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li>
                                        <li className="divider-line my-4"></li>
                                        {/* <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Help</Tooltip>}
                                                placement="right">
                                                <NavLink
                                                    to="/help"
                                                    className={({ isActive }) =>
                                                        `menu-link ${isActive ? 'active' : ''}`
                                                    }>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/info.svg"
                                                            alt="Help Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Help</span>
                                                </NavLink>
                                            </OverlayTrigger>
                                        </li> */}
                                        <li className="menu-item" title="">
                                            <OverlayTrigger
                                                overlay={<Tooltip>Logout</Tooltip>}
                                                placement="right"
                                                show={false}>
                                                <div
                                                    onClick={user?.logout}
                                                    className={`menu-link cursor-pointer`}>
                                                    <span className="menu-icon">
                                                        <img
                                                            src="/images/sidebar-icon/logout.svg"
                                                            alt="Logout Icon"
                                                        />
                                                    </span>
                                                    <span className="menu-text">Logout</span>
                                                </div>
                                            </OverlayTrigger>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            {/* <div className="hamburger" onClick={handleShow}>
                <RxHamburgerMenu />
            </div> */}
            <ToggleMenu isCollapsed={isCollapsed} toggleSidenav={toggleSidenav} />
        </>
    );
};

Sidebar.propTypes = {};

export default React.memo(Sidebar);
