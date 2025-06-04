import React, { useState, useRef, useEffect } from 'react';
import { FaAngleDown, FaCircle } from 'react-icons/fa';
import { LiaAngleRightSolid } from 'react-icons/lia';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import useDynamicQuery from '../services/useDynamicQuery';
import useDecrypt from '../utils/useDecrypt';
import { Link, useNavigate } from 'react-router-dom';
import { useEncrypt } from '../utils/useEncrypt';
import { RxHamburgerMenu } from 'react-icons/rx';
import { ucFirst } from '../utils/UcFirst';
import { toast } from 'react-toastify';
import { Loader } from './Loader';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { NoData } from './NoData';
import Echo from '../echo';
const Navbar = ({ isCollapsed, handleShow }) => {
    const auth = useAuth();
    const encrypt = useEncrypt();
    const activeRole = auth?.activeRole;
    const activeOrgName = localStorage.getItem('activeOrgName') || '';
    const decryptedRole = useDecrypt(activeRole || '');
    const decryptedOrgName = useDecrypt(activeOrgName);
    const decryptUserData = useDecrypt(auth?.userdata);
    const orgId = useDecrypt(auth?.activeOrgId || null);
    const decryptLogo = useDecrypt(localStorage.getItem('logo'));
    const [logo, setLogo] = useState(decryptLogo);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const orgDropdownRef = useRef(null);

    const notificationRef = useRef(null);
    const [notificationID, setNotificationID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showUnread, setShowUnread] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    let vulnerability = '/images/dashboard/vulner-1.png';
    let assests = '/images/dashboard/workstation.png';
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        if (isOpen == false) {
            organizationRefetch();
        }
    };

    const handleClickOutside = (event) => {
        if (
            notificationRef.current &&
            !notificationRef.current.contains(event.target) &&
            !event.target.closest('#dropdown-basic') // to allow toggle button clicks
        ) {
            setShowNotification(false);
        }
        if (
            orgDropdownRef.current &&
            !orgDropdownRef.current.contains(event.target) &&
            !event.target.closest('.org-dropdown-toggle') // Your custom toggle class (adjust if needed)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const {
        data: organizationData = {},
        isSuccess: getOrganizationisSuccess,
        isLoading: organizationisLoading,
        refetch: organizationRefetch,
    } = useDynamicQuery({
        type: 'get',
        url: `organizations/switch?orgId=${orgId}`,
        query_name: 'getOrganizationLists',
        params: {},
        // enabled: !!isOpen,
        enabled: false,
    });

    const { data: notificationCount = {} } = useDynamicQuery({
        type: 'get',
        url: 'notifications/count',
        query_name: 'getNotificationCount',
        params: {
            orgId: orgId,
        },
        enabled: auth?.token,
    });

    useEffect(() => {
        if (getOrganizationisSuccess) {
            auth.setOrgData(encrypt(organizationData?.data?.data));
        }
    }, [getOrganizationisSuccess]);

    const handleSwitchRole = (e, value) => {
        e.preventDefault();
        navigate('/', { replace: true });
        localStorage.setItem('activeOrgId', encrypt(value.id));
        let en_role = encrypt(value?.role_name);
        localStorage.setItem('activeRole', en_role);
        localStorage.setItem('activeOrgName', encrypt(value?.name));

        setIsOpen(false);
        toast.success('Active organization changed to ' + value?.name, {
            position: 'bottom-left',
        });
        setTimeout(() => {
            auth.setActiveOrgName(encrypt(value?.name));
            auth.setActiveOrgId(encrypt(value.id));
            auth.setActiveRole(encrypt(value?.role_name));
            localStorage?.setItem('logo', value?.dark_logo ? encrypt(value?.dark_logo) : null);
        }, 500);
        setIsOpen(false);
    };

    // window.Echo = new Echo({
    //     broadcaster: `${process.env.REACT_APP_Echo_Broad_Caster}`,
    //     // "pusher"
    //     key: `${process.env.REACT_APP_Echo_KEY}`,
    //     cluster: `${process.env.REACT_APP_Echo_Cluster}`,
    //     forceTLS: true,
    //     // authEndpoint : "http://localhost:8000/broadcasting/auth",
    //     // auth: {
    //     //   headers: {
    //     //     Authorization: `Bearer ${token}`,
    //     //     Accept: 'application/json',
    //     //   },
    //     // },
    // });
    const CustomToast = ({ datas }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {datas?.type != 'others' && (
                <img
                    src={datas?.type == 'asset' ? assests : vulnerability}
                    alt="toast"
                    style={{ width: '40px', height: '40px', marginRight: '10px' }}
                />
            )}
            <div>
                <p>{ucFirst(datas?.message)}</p>
                <p className={datas?.severity?.toLowerCase()} style={{ width: 'fit-content' }}>
                    {ucFirst(datas?.severity)}
                </p>
            </div>
        </div>
    );
    // useEffect(() => {
    //     var channel = window.Echo.channel(`${process.env.REACT_APP_CHANNEL_NAME}_${orgId}`);
    //     console.log('channel : ', channel);

    //     channel.listen(`.${process.env.REACT_APP_CHANNEL_EVENT}`, function (datas) {
    //         // alert(JSON.stringify(datas));

    //         let data = datas?.data;
    //         // alert(data);
    //         console.log('data?.severity?.toLowerCase() :', data?.severity);

    //         // setTimeout(() => {
    //         //     switch (data?.severity?.toLowerCase()) {
    //         //         case 'critical':
    //         //         case 'low':
    //         //         case 'medium':
    //         //         case 'high':
    //         //             return toast(<CustomToast datas={datas} />, {
    //         //                 position: 'top-right',
    //         //                 autoClose: 2500,
    //         //                 hideProgressBar: true,
    //         //                 closeOnClick: true,
    //         //                 pauseOnHover: true,
    //         //                 draggable: true,
    //         //                 progress: undefined,
    //         //                 theme: 'light',
    //         //                 //  transition: "Bounce",
    //         //             });
    //         //         default:
    //         //             return toast.info(data?.message);
    //         //     }
    //         // }, 500);
    //     });
    //     return () => {
    //         channel.stopListening(`.${process.env.REACT_APP_CHANNEL_EVENT}`);
    //     };
    // }, []);
    // Pusher.logToConsole = true;

    const navigateToProfile = (e) => {
        e.preventDefault();
        navigate('profile');
        setIsOpen(false);
    };

    const {
        data: notificationsData = {},
        isPending: notificationsPending,
        refetch: notificationRefetch,
        isLoading: notificationisLoading,
    } = useDynamicQuery({
        type: 'get',
        url: `notifications`,
        query_name: 'getNotificationsLists',
        params: { orgId: orgId, type: showUnread ? 'unread' : 'all', showUnread },
        enabled: false,
    });

    const { mutate: readNotificationMutate } = useDynamicQuery({
        type: 'put',
        url: `notifications/read/${notificationID}`,
        invalidateQuery: ['getNotificationsLists'],
        mutationKey: 'ReadNotification',
    });

    useEffect(() => {
        if (
            !!notificationID &&
            notificationsData?.data?.find((val) => val.id === notificationID)?.is_read === false
        ) {
            const readNotificationFun = async () => {
                try {
                    await readNotificationMutate();
                    if (auth?.token) {
                        setTimeout(() => {
                            notificationRefetch();
                        }, 50);
                    }
                } catch (error) {
                    console.log(
                        'notification mark as read error : ',
                        notificationID,
                        ' error: ',
                        error
                    );
                } finally {
                    setNotificationID(null);
                }
            };
            readNotificationFun();
        }
    }, [notificationID]);

    const getNotiCount = () => {
        let count = notificationCount?.data?.unread || 0;
        if (count > 9) {
            return '9 +';
        } else if (count > 99) {
            return '99 +';
        }
        return count;
    };

    useEffect(() => {
        setLogo(decryptLogo);
    }, [localStorage.getItem('logo')]);

    const fetchImage = async () => {
        setLoading(true);
        const response = await axios.get(
            `${process.env.REACT_APP_FOLDER_PATH}${orgId}/${logo}?t=${Date.now()}`,
            {
                responseType: 'blob',
            }
        );
        auth?.setOrgImageURL(false);
        setLoading(() => {
            setLoading(false);
        }, 300);

        return URL.createObjectURL(response.data);
    };

    const { data: imageUrl, refetch } = useQuery({
        queryKey: ['image', orgId, logo],
        queryFn: () => fetchImage(),
        enabled: !!orgId && !!logo,
        staleTime: 0,
        retry: 0,
        cacheTime: 0,
    });

    useEffect(() => {
        if (!!orgId && auth?.orgImageURL && !!logo) {
            refetch({ force: true });
        }
    }, [auth?.orgImageURL, refetch]);

    useEffect(() => {
        if (showNotification && auth?.token) {
            notificationRefetch();
        }
    }, [showNotification, showUnread]);

    const handleCheckboxChange = () => {
        setShowUnread((prev) => !prev);
    };

    useEffect(() => {
        Echo.channel(
            `${process.env.REACT_APP_CHANNEL_NAME}${orgId}_${decryptUserData?.userid}`
        ).listen(`.${process.env.REACT_APP_CHANNEL_EVENT}`, (data) => {
            let notificationData = data?.post;

            setTimeout(() => {
                switch (notificationData?.severity?.toLowerCase()) {
                    case 'critical':
                    case 'low':
                    case 'medium':
                    case 'high':
                        return toast(<CustomToast datas={notificationData} />, {
                            position: 'top-right',
                            autoClose: 2500,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'light',
                            //  transition: "Bounce",
                        });
                    default:
                        return toast.info(notificationData?.message);
                }
            }, 200);
        });

        return () => {
            Echo.leave(`${process.env.REACT_APP_CHANNEL_NAME}${orgId}_${decryptUserData?.userid}`);
        };
    }, []);
    console.log('showNotification : ', showNotification);

    return (
        <div>
            <div
                className={`main-content ${
                    isCollapsed ? 'sidenav-collapsed' : 'sidenav-expanded'
                }`}>
                <div className="navbar-header navbar-fixed d-flex align-items-center justify-content-end">
                    <div className="hamburger" onClick={handleShow}>
                        <RxHamburgerMenu />
                    </div>
                    <div className="d-flex gap-4 align-items-center cus-gap">
                        <div className="notify">
                            <div className="position-relative">
                                <Dropdown
                                    show={showNotification}
                                    // onToggle={(isOpen) => {
                                    //     console.log('isOpen : ', isOpen);

                                    //     if (isOpen) {
                                    //         // When dropdown closes, trigger API call
                                    //         setShowNotification(isOpen);
                                    //     }
                                    // }}
                                >
                                    <Dropdown.Toggle
                                        id="dropdown-basic"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowNotification((prev) => !prev);
                                        }}>
                                        {getNotiCount() > 0 && (
                                            <p className="noti-count">{getNotiCount()}</p>
                                        )}
                                        <img src="/images/notification.svg" alt="notification" />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu ref={notificationRef}>
                                        <div className="overflow-hidden noti-container">
                                            {notificationisLoading && <Loader />}
                                            <div className="d-flex justify-content-between align-items-center border-bottom pddng-tb">
                                                <p className="noti-title">Notifications</p>
                                                <div className="form-check form-switch d-flex justify-content-between">
                                                    <p className="noti-title me-5 mt-1">
                                                        Show Unread
                                                    </p>
                                                    <input
                                                        className={`form-check-input ${showUnread ? 'noti-toggle-active' : 'noti-toggle-inactive'}`}
                                                        type="checkbox"
                                                        role="switch"
                                                        checked={showUnread}
                                                        onChange={handleCheckboxChange}
                                                        style={{
                                                            width: '40px',
                                                            height: '25px',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="noti-wrapper">
                                                {notificationsPending && <Loader />}
                                                {!notificationsData?.data?.length && (
                                                    <div className="text-center align-content-center">
                                                        {/* <p className="nodata">No Data Available</p> */}
                                                        <NoData />
                                                    </div>
                                                )}
                                                {notificationsData?.data?.map((notification) => (
                                                    <div
                                                        onClick={() =>
                                                            setNotificationID(notification.id)
                                                        }
                                                        key={`${notification.id}_notification_msg`}
                                                        className="d-flex align-items-center justify-content-between pddng cursor-pointer noti-hover">
                                                        <div className="notification-icon">
                                                            <div className="notify-avatar">
                                                                {notification?.type ===
                                                                    'vulnerability' && (
                                                                    <img
                                                                        className="notification-image"
                                                                        src={`/images/dashboard/open-vuln.png`}
                                                                        alt="Icon"
                                                                    />
                                                                )}
                                                                {notification?.type === 'asset' && (
                                                                    <img
                                                                        className="notification-image"
                                                                        src={`/images/dashboard/assets-count.png`}
                                                                        alt="Icon"
                                                                    />
                                                                )}
                                                                {notification?.type ===
                                                                    'exploits' && (
                                                                    <img
                                                                        className="notification-image"
                                                                        src={`/images/dashboard/exploits.png`}
                                                                        alt="Icon"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="noti-content">
                                                                <p
                                                                    className={`not-head 
patches-complex severity-${notification.severity?.toLowerCase()}`}>
                                                                    {notification.severity}
                                                                </p>
                                                                <p className="noti-text">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="not-text fs-10">
                                                                    {notification.type}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="notification-icon">
                                                            {!notification.is_read && (
                                                                <div className="noti-indicator">
                                                                    <FaCircle className="indicat-color" />
                                                                </div>
                                                            )}

                                                            <div className="noti-arrow">
                                                                <LiaAngleRightSolid className="fs-24 clr" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {notificationCount?.data?.all > 0 && (
                                            <div className="noti-footer d-flex justify-content-end border-top pddng-tb gap-2">
                                                <Link
                                                    to="/notifications"
                                                    className="noti-mark me-2"
                                                    onClick={() => setShowNotification(false)}>
                                                    View All
                                                </Link>
                                            </div>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        {logo ? (
                            <div className="client-logo">
                                {!loading ? <img src={imageUrl} alt="client Logo" /> : ''}
                            </div>
                        ) : (
                            <Badge bg="primary" className="p-2 text-capitalize client-badge">
                                {decryptedOrgName}
                            </Badge>
                        )}
                        <div className="v-divider"></div>
                        <div className="user-info" ref={orgDropdownRef}>
                            <div
                                className="user-sec desk-top org-dropdown-toggle"
                                onClick={toggleDropdown}>
                                <div className="user-profile cursor-pointer" title="User">
                                    <img src="/images/user.png" alt="Profile" />
                                </div>
                                <div className="user-desp">
                                    <p className="text-capitalize">
                                        {decryptUserData?.name || '-'}
                                    </p>
                                    <p className="text-capitalize">
                                        {decryptedRole || '-'}
                                        {/* Super Admin */} - <span>{decryptedOrgName || '-'}</span>
                                    </p>
                                </div>
                                <div className="custom-dropdown-container d-flex ml-auto ">
                                    <div className="cursor-pointer text-white fs-16">
                                        <FaAngleDown />
                                    </div>
                                </div>
                            </div>
                            <div className="mobile-view" onClick={toggleDropdown}>
                                <div className="user-profile cursor-pointer" title="User">
                                    <img src="/images/user.png" alt="Profile" />
                                </div>
                            </div>
                            {isOpen && (
                                <div className="dropdown-menu-list">
                                    <div className="myProfile d-flex flex-column gap-2 align-items-center">
                                        {organizationisLoading && <p>Loading...</p>}
                                        {organizationData?.data?.data?.map((org, index) => (
                                            <div
                                                key={index}
                                                className={`user-sec gray-bg hover-bg ${
                                                    // index === 0
                                                    org.id === orgId ? 'active disabled ' : ''
                                                } width-100`}
                                                onClick={(e) => {
                                                    if (org.id !== orgId) {
                                                        handleSwitchRole(e, org);
                                                    }
                                                }}>
                                                <div
                                                    className="user-profile cursor-pointer"
                                                    title={org?.name}>
                                                    <img src="/images/user.png" alt="Profile" />
                                                </div>
                                                <div className="user-desp">
                                                    <p className="text-capitalize">{org?.name}</p>
                                                    <p className="text-capitalize">
                                                        {org?.role_name}
                                                        {/* <span>{org?.organization}</span> */}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="li-divider"></div>
                                    <div className="d-flex justify-content-between px-1 profile-pddng">
                                        {/* {orgId === decryptUserData.orgId && ( */}
                                        <div className="profile-sttng" onClick={navigateToProfile}>
                                            <span>
                                                <img
                                                    src="/images/profile-settings.svg"
                                                    alt="Profile Setting"
                                                    width={15}
                                                />
                                            </span>
                                            Profile Settings
                                        </div>
                                        {/* )} */}
                                        <div className="profile-sttng logout" onClick={auth.logout}>
                                            <span>
                                                <img
                                                    src="/images/logout.svg"
                                                    alt="Logout"
                                                    width={15}
                                                />
                                            </span>
                                            Logout
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Navbar.propTypes = {};

export default React.memo(Navbar);
