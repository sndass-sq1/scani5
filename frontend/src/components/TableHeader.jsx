import React, { useState } from 'react';
import { formAPIData, tableHeaders } from '../utils/constant';
import PropTypes from 'prop-types';
import ModalComp from './ModalComp';
import StatusCardComp from './StatusCardComp';
import FilterComp from './FilterComp';
import { useFormModalContext } from '../context/FormModalContext';
import { SearchComp } from './SearchComp';
import { tableDetails } from '../utils/constant';
import DatePicker from 'react-datepicker';
import TooltipComp from './TooltipComp';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';
import Export from './Export';
import GenerateReport from './GenerateReport';
import { format } from 'date-fns';

const tableHeaderIcons = [
    {
        name: 'users',
        icon: '/images/profile-settings.svg',
        width: '16px',
    },
    {
        name: 'orgUsers',
        icon: '/images/profile-settings.svg',
        width: '16px',
    },
    {
        name: 'usersOrg',
        icon: '/images/profile-settings.svg',
        width: '16px',
    },
    {
        name: 'organizations',
        icon: '/images/profile-settings.svg',
        width: '16px',
    },
    {
        name: 'tags',
        icon: '/images/sidebar-icon/tags.svg',
        width: '16px',
    },
    {
        name: 'assets',
        icon: '/images/sidebar-icon/asset.svg',
        width: '16px',
    },
    {
        name: 'vulnerability',
        icon: '/images/sidebar-icon/vulnerability.svg',
        width: '16px',
    },
    {
        name: 'export',
        icon: '/images/export.svg',
        width: '16px',
    },
];

const findHeaderIcon = (from) => {
    return tableHeaderIcons.find((val) => val.name === from)?.icon;
};
const findHeaderIconWidth = (from) => {
    return tableHeaderIcons.find((val) => val.name === from)?.width;
};

const TableHeader = ({
    from = '',
    filter,
    setFilter,
    table,
    setDateRange,
    status,
    startDate,
    endDate,
    totalRecords,
}) => {
    const { openFormModal, OpenFormModalFn } = useFormModalContext();
    const user = useAuth();
    const decrypytActiveRole = useDecrypt(user?.activeRole);
    const tableInfo = tableDetails.find((val) => val[from])?.[from];
    const tableHeader = tableHeaders.find((val) => val[from])?.[from];
    const tableDataLength = table.getRowModel().rows?.length;
    const [filterList, setFilterList] = useState([]);
    // const [startDate, setStartDate] = useState(null);
    // const [endDate, setEndDate] = useState(null);

    const searchableList = () => {
        return (
            <div>
                {tableHeader.map(
                    (val, index) =>
                        val?.searchable && (
                            <div key={`${val.label}_searchLabel_${index}`} className="text-left">
                                {val.label}
                            </div>
                        )
                )}
            </div>
        );
    };

    const mapParams = {
        decrypytActiveRole,
    };

    const addButtonCheck = () => {
        return typeof tableInfo?.addbutton === 'function'
            ? tableInfo?.addbutton(mapParams)
            : tableInfo?.addbutton;
    };

    const filterListFn = (list) => {
        setFilterList(list);
    };

    // const setDate = (type = 'start', val) => {
    //     if (type === 'end') {
    //         setEndDate(val);
    //         setDateRange((prev) => {
    //             return {
    //                 ...prev,
    //                 end: !!val ? format(val, 'yyyy-MM-dd') : val,
    //             };
    //         });
    //     } else {
    //         setStartDate(val);
    //         setEndDate(null);
    //         setDateRange({
    //             end: null,
    //             start: !!val ? format(val, 'yyyy-MM-dd') : val,
    //         });
    //     }
    // };

    const getFormModalTitle = (from) => {
        if ('customRender' in tableInfo) {
            return tableInfo.title;
        }
        return formAPIData.find((val) => val[from])?.[from]?.header_details['header'];
    };
    console.log('startDate : ', startDate);
    console.log('endDate : ', endDate);

    return (
        <>
            <div className="d-flex justify-content-between align-items-end flex-wrap flex-md-wrap flex-sm-wrap gap-md-3 gap-sm-3 gap-3 m-b-20">
                {<StatusCardComp from={from} filterListFn={filterListFn} status={status} />}
                <div className="d-flex gap-3 justify-end_md align-items-center right-flex-basic">
                    <div className="primary-btn">
                        {addButtonCheck() && (
                            <button
                                className="submit-btn users-pdng  lh-0 d-flex align-items-center gap-1"
                                onClick={() => OpenFormModalFn(from)}>
                                <span className="btn-icon">
                                    <img
                                        src={findHeaderIcon(from)}
                                        alt="Icon"
                                        style={{ width: findHeaderIconWidth(from) }}
                                    />
                                </span>
                                <span className="header-btn-text"> {tableInfo.title}</span>
                            </button>
                        )}
                    </div>
                    {'date_range' in tableInfo && tableInfo.date_range && (
                        <>
                            <div className="form-floating">
                                <div className="d-flex gap-3">
                                    <div className="mobile-view-pos">
                                        <DatePicker
                                            // selected={startDate}
                                            // startDate={startDate}
                                            // endDate={endDate}
                                            // selectsStart
                                            // onChange={(date) => setDate('start', date)}
                                            // selected={startDate}
                                            // onChange={(update) => setDateRange(update)}
                                            // startDate={startDate}
                                            // endDate={endDate}
                                            // selectsRange
                                            // className="form-control  cursor-pointer"
                                            // dateFormat="dd MMM, YYYY"
                                            // placeholderText="Select date"
                                            // shouldCloseOnSelect={true}
                                            // shouldCloseOnSelect={true}
                                            // onKeyDown={(e) => e.preventDefault()}
                                            // shouldCloseOnSelect={true}
                                            // isClearable={true}
                                            selectsRange
                                            startDate={startDate}
                                            endDate={endDate}
                                            onChange={(update) => {
                                                // Prevent selecting endDate greater than today
                                                const [start, end] = update;
                                                const today = new Date();

                                                if (end && end > today) {
                                                    setDateRange([start, today]); // clamp endDate to today
                                                } else {
                                                    setDateRange(update);
                                                }
                                            }}
                                            maxDate={new Date()} // prevent selecting dates beyond today
                                            isClearable={true}
                                            dateFormat="dd MMM, yyyy"
                                            placeholderText="Select date"
                                            className="form-control  cursor-pointer"
                                        />
                                    </div>
                                    {/* <div>
                                        <DatePicker
                                            selected={endDate}
                                            startDate={startDate}
                                            endDate={endDate}
                                            selectsEnd
                                            minDate={startDate}
                                            dateFormat="dd MMM, YYYY"
                                            onChange={(date) => setDate('end', date)}
                                            disabled={!startDate}
                                            className="form-control cursor-pointer"
                                            closeOnScroll={true}
                                            placeholderText="Select a end date"
                                            onKeyDown={(e) => e.preventDefault()}
                                            shouldCloseOnSelect={true}
                                            isClearable={true}
                                        />
                                    </div> */}
                                </div>
                            </div>
                        </>
                    )}
                    {tableInfo?.filter && (
                        <FilterComp
                            from={from}
                            filter={filter}
                            setFilter={setFilter}
                            filterList={filterList}
                        />
                    )}

                    <div className="d-flex box_shadow_search">
                        {tableInfo?.search_filter && (
                            <>
                                <SearchComp from={from} />
                                <div className="info-message cursor-pointer">
                                    <TooltipComp content={searchableList()} position="bottom">
                                        <img src="/images/info.svg" alt="info" />
                                    </TooltipComp>
                                </div>
                            </>
                        )}
                    </div>
                    {tableInfo?.export &&
                        !!tableDataLength &&
                        decrypytActiveRole !== 'org user' && (
                            <span>
                                <Export from={from} table={table} />
                            </span>
                        )}

                    {tableInfo?.report && !!tableDataLength && (
                        <span>
                            <GenerateReport table={table} />
                        </span>
                    )}
                </div>
            </div>

            <ModalComp
                isOpen={openFormModal === from}
                title={getFormModalTitle(from)}
                content={{
                    comp: 'customRender' in tableInfo ? '' : 'FormComp',
                    from: from,
                }}>
                {'customRender' in tableInfo && tableInfo?.customRender()}
            </ModalComp>
        </>
    );
};

export default React.memo(TableHeader);

TableHeader.propTypes = {
    from: PropTypes.string.isRequired,
};
