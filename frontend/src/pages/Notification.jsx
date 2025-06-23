import React, { useEffect, useState } from 'react';
import useDynamicQuery from '../services/useDynamicQuery';
import useDecrypt from '../utils/useDecrypt';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import { FormatDate } from '../utils/FormatDate';
import { NoData } from '../shared/NoData';

const Notification = () => {
    const user = useAuth();
    const orgId = useDecrypt(user?.activeOrgId);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [goToPage, setGoToPage] = useState('');
    const [type, setType] = useState('');

    const [queryParams, setQueryParams] = useState({
        // search: debouncedSearchValue, // Default to empty string if undefined
        // sort_direction: sorting[0]?.desc ? 'desc' : 'asc',
        page: currentPage, // Ensure there's always a page value
        limit: perPage,
        // sort_column: sorting[0]?.id, // Default to empty string if no sorting
        orgId: orgId,
        ...(type !== '' && { module: type }),
    });

    const { data = {} } = useDynamicQuery({
        type: 'get',
        url: `notifications/all`,
        query_name: 'getNotificationsAll',
        params: queryParams,
    });

    useEffect(() => {
        setQueryParams({ ...queryParams, module: type });
    }, [type]);

    const pagination = data?.data?.meta || {};
    const totalRecords = pagination?.total || 0;

    const showingEntries = Math.min(currentPage * perPage, totalRecords);
    // const showingEntries = pagination?.to || 5;
    const totalPage = pagination?.last_page || Math.ceil(totalRecords / perPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
        // setGoToPage('');
    };

    // const handleGoToPageChange = (page) => {
    //     setCurrentPage(page);
    // };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when perPage changes
        setGoToPage('');
    };

    useEffect(() => {
        setQueryParams((prevParams) => ({
            ...prevParams,
            page: currentPage,
            limit: perPage,
        }));
    }, [currentPage, perPage]);
    return (
        <div>
            <div className="notification-container">
                <div className="notification-header">
                    <div className="notification-heading d-flex justify-content-between">
                        <div className="notification-title">
                            <h6>Notification Center</h6>
                        </div>
                        {/* <div className="notification-mark-as-read d-flex">
                            <img
                                className="mt-1"
                                src="/images/notification-user/mark as read.png"
                                alt="mark as read"
                            />
                            <p className="ms-2">Mark all as read</p>
                        </div> */}
                    </div>

                    <div className="notification-button-user d-flex flex-wrap gap-2 m-t-20">
                        <button
                            className={`notification-button d-flex justify-content-between align-items-center ${type === '' ? 'active' : ''} `}
                            onClick={() => {
                                setType('');
                            }}>
                            <img
                                src="./images/notification-user/all-notification-dark.svg"
                                alt="All"
                            />
                            <p className="ms-2">All</p>
                        </button>
                        <button
                            className={`notification-button d-flex justify-content-between align-items-center ${type === 'asset' ? 'active' : ''} `}
                            onClick={() => {
                                setType('asset');
                            }}>
                            <img src="./images/notification-user/computer 1.png" alt="Assets" />
                            <p className="ms-2"> Assets</p>
                        </button>
                        <button
                            className={`notification-button d-flex justify-content-between align-items-center ${type === 'vulnerability' ? 'active' : ''} `}
                            onClick={() => {
                                setType('vulnerability');
                            }}>
                            <img src="./images/notification-user/bug 1.png" alt="Vulnerabilties" />
                            <p className="ms-2">Vulnerabilties</p>
                        </button>
                        <button
                            className={`notification-button d-flex justify-content-between align-items-center ${type === 'exploitability' ? 'active' : ''} `}
                            onClick={() => {
                                setType('exploitability');
                            }}>
                            <img
                                src="./images/notification-user/bug-cut.png"
                                alt="Exploitability"
                            />
                            <p className="ms-2">Exploitability</p>
                        </button>
                    </div>
                </div>
                <div className="notification-wrapper">
                    <div className="notification-table">
                        {!data?.data?.data?.length && (
                            <div className="notification-card-body mt-1 d-flex  align-items-center justify-content-center fw-bold">
                                <NoData />
                            </div>
                        )}

                        {data?.data?.data?.map((value) => (
                            <div
                                key={value.id}
                                id="first-row"
                                className="notification-card-body  mt-1 d-flex align-items-center flex-wrap flex-md-nowrap justify-content-between">
                                <div className="notification-image-container wh-40">
                                    {value?.type === 'vulnerability' && (
                                        <img
                                            className="notification-image"
                                            src={`/images/dashboard/open-vuln.png`}
                                            alt="open-vuln"
                                        />
                                    )}
                                    {value?.type === 'asset' && (
                                        <img
                                            className="notification-image"
                                            src={`/images/dashboard/assets-count.png`}
                                            alt="assets-count"
                                        />
                                    )}
                                    {value?.type === 'exploits' && (
                                        <img
                                            className="notification-image"
                                            src={`/images/dashboard/exploits.png`}
                                            alt="exploits"
                                        />
                                    )}
                                </div>
                                <p className="notification-content wh-100">{value?.type}</p>
                                <p
                                    className={`notification-content wh-80 noti-severity-default ${value?.severity ? 'noti-' + value?.severity : ' '}`}>
                                    {value?.severity}
                                </p>
                                <p className="notification-content">{value?.message}</p>

                                <div className="notification-indicator">
                                    <p className="notification-time  ">
                                        {value?.created_at ? FormatDate(value?.created_at) : '-'}
                                    </p>
                                    {!value.is_read && <div className="notification-dot"></div>}
                                </div>
                            </div>
                        ))}

                        <div className="d-flex justify-content-end align-items-center pagination-pos">
                            {data?.data?.meta?.total > 0 && (
                                <>
                                    <Pagination
                                        totalPage={totalPage}
                                        totalRecords={totalRecords}
                                        perPage={perPage}
                                        showingEntries={showingEntries}
                                        currentPage={currentPage}
                                        goToPage={goToPage}
                                        setGoToPage={setGoToPage}
                                        onPageChange={handlePageChange}
                                        onPerPageChange={handlePerPageChange}
                                        // onGoToPageChange={handleGoToPageChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
