import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';
import useDynamicQuery from '../services/useDynamicQuery';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Piechart from '../components/Piechart';
import ModalComp from '../components/ModalComp';
import { useFormModalContext } from '../context/FormModalContext';
import { FaPlus } from 'react-icons/fa6';
import { FormatDate } from '../utils/FormatDate';
export const AssetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useAuth();
    const { openFormModal, OpenFormModalFn } = useFormModalContext();
    const orgId = useDecrypt(user?.activeOrgId);

    const queryParams = {
        asset_id: id,
        orgId: orgId,
    };

    const { data = {} } = useDynamicQuery({
        type: 'get',
        url: `assets/details/${id}`,
        query_name: 'getAssetDetails',
        params: queryParams,
    });
    const {
        agent_status,
        created_on,
        organization_name,
        host_name,
        host_id,
        ip_address_v4,
        ip_address_v6,
        last_activity,
        last_scanned,
        last_system_boot,
        location,
        os,
        tag_value,
    } = data?.data || {};

    return (
        <>
            <div className="inner-page-details">
                <div className="d-flex align-items-center gap-3">
                    <div className="back-to cursor-pointer m-l-30" onClick={() => navigate(-1)}>
                        <img src="/images/left-arrow.svg" alt="back_arrow" />
                    </div>
                    <div className="inner-page-heading">
                        <h2>{host_name}</h2>
                        <div className="date-preview d-flex gap-3">
                            <span>
                                <span>Published Date : </span>
                                <span>{created_on ? FormatDate(created_on) : ''}</span>
                            </span>
                            <span>
                                <span>Discovered Date : </span>
                                <span>{created_on ? FormatDate(created_on) : ''}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="assets-wrapper m-t-20">
                    <div className="assets-grid">
                        <div className="width-70 leftside-card">
                            <div className="asset-container">
                                <div className="asset-title-sub">Assets</div>
                                <div className="asset-title">Summary</div>
                                <div className="divider-hr w-100"></div>
                                <div className="d-flex align-items-center gap-3">
                                    {/* <img
                                        src="/images/windows.png"
                                        alt="Windows"
                                        className="window-img"
                                    /> */}
                                    {agent_status?.toLowerCase() === 'connected' &&
                                        os?.toLowerCase() === 'linux' && (
                                            <img
                                                src="/images/green-linux.svg"
                                                className="window-img"
                                                alt="Linux"
                                            />
                                        )}
                                    {agent_status?.toLowerCase() === 'connected' &&
                                        os?.toLowerCase() === 'windows' && (
                                            <img
                                                src="/images/green-windows.svg"
                                                className="window-img"
                                                alt="Windows"
                                            />
                                        )}
                                    {agent_status?.toLowerCase() === 'connected' &&
                                        os?.toLowerCase() === 'mac' && (
                                            <img
                                                src="/images/green-mac.svg"
                                                className="window-img"
                                                style={{ width: '100px' }}
                                                alt="Mac"
                                            />
                                        )}
                                    {agent_status?.toLowerCase() === 'disconnected' &&
                                        os?.toLowerCase() === 'mac' && (
                                            <img
                                                src="/images/red-mac.svg"
                                                style={{ width: '100px' }}
                                                alt="Mac"
                                            />
                                        )}
                                    {agent_status?.toLowerCase() === 'disconnected' &&
                                        os?.toLowerCase() === 'linux' && (
                                            <img
                                                src="/images/red-linux.svg"
                                                className="window-img"
                                                style={{ width: '100px' }}
                                                alt="Linux"
                                            />
                                        )}
                                    {agent_status?.toLowerCase() === 'disconnected' &&
                                        os?.toLowerCase() === 'windows' && (
                                            <img
                                                src="/images/red-windows.svg"
                                                className="window-img"
                                                style={{ width: '100px' }}
                                                alt="Windows"
                                            />
                                        )}

                                    <div className="inner-page-heading">
                                        <h2 className="fs-16">{host_name}</h2>
                                        <div className="date-preview sub-name-margin">
                                            <span>Windows</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex flex-wrap gap-4 m-t-20">
                                    <div className="assets-content">
                                        <div className="asset-title-sub">Hostname</div>
                                        <div className="asset-title">{host_name}</div>
                                    </div>
                                    <div className="assets-content">
                                        <div className="asset-title-sub">Host ID</div>
                                        <div className="asset-title">{host_id}</div>
                                    </div>
                                    <div className="assets-content">
                                        <div className="asset-title-sub">Organization</div>
                                        <div className="asset-title">{organization_name}</div>
                                    </div>
                                    <div className="assets-content">
                                        <div className="asset-title-sub">IPv4 Addresses</div>
                                        <div className="asset-title">{ip_address_v4}</div>
                                    </div>
                                    <div className="assets-content">
                                        <div className="asset-title-sub">IPv6 Addresses</div>
                                        <div className="asset-title">{ip_address_v6}</div>
                                    </div>
                                    <div className="assets-content">
                                        <div className="asset-title-sub">Last scanned</div>
                                        <div className="asset-title">
                                            {last_scanned ? FormatDate(last_scanned) : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="asset-container">
                                <div className="asset-title-sub">Assets</div>
                                <div className="asset-title">
                                    Vulnerabilities
                                    <span className="mx-2 vulner-count">
                                        {data?.data?.vulnerabilities?.total
                                            ? data?.data?.vulnerabilities?.total
                                            : 0}
                                    </span>
                                </div>
                                <div className="divider-hr w-100"></div>
                                <div className="d-flex flex-wrap">
                                    <div className="asset-chart">
                                        {data?.data?.vulnerabilities && (
                                            <Piechart vuldata={data?.data?.vulnerabilities} />
                                        )}

                                        <div></div>
                                    </div>
                                    <div className="d-flex align-items-center ml-auto asset-patches-container">
                                        <div className="asset-patches">
                                            <p>Patched</p>
                                            <p>
                                                {' '}
                                                {data?.data?.vulnerabilities?.patched
                                                    ? data?.data?.vulnerabilities?.patched
                                                    : '-'}
                                            </p>
                                            <p>Not Patched</p>
                                            <p>
                                                {' '}
                                                {data?.data?.vulnerabilities?.not_patched
                                                    ? data?.data?.vulnerabilities?.not_patched
                                                    : '-'}
                                            </p>
                                            <p>patch not available</p>
                                            <p>
                                                {data?.data?.vulnerabilities?.patch_not_available
                                                    ? data?.data?.vulnerabilities
                                                          ?.patch_not_available
                                                    : '-'}
                                            </p>
                                            <div className="primary-btn m-t-10">
                                                <Link to={`/vulnerability/${id}`}>
                                                    <button type="button" className="outline-btn">
                                                        View Vulnerabilities
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="width-30 rightside-card">
                            <div className="asset-container">
                                <div className="asset-title-sub">Assets</div>
                                <div className="asset-title">Activity</div>
                                <div className="divider-hr w-100"></div>
                                <div className="d-flex flex-wrap gap-4 m-t-20">
                                    <div className="assets-content assets-activity">
                                        <div className="asset-title-sub">Last User Login</div>
                                        <div className="asset-title">-</div>
                                    </div>
                                    <div className="assets-content assets-activity">
                                        <div className="asset-title-sub">created on</div>
                                        <div className="asset-title">
                                            {created_on ? FormatDate(created_on) : '-'}
                                        </div>
                                    </div>
                                    <div className="assets-content assets-activity">
                                        <div className="asset-title-sub">Location</div>
                                        <div className="asset-title">
                                            {location ? location : '-'}
                                        </div>
                                    </div>
                                    <div className="assets-content assets-activity">
                                        <div className="asset-title-sub">Last System Boot</div>
                                        <div className="asset-title">
                                            {last_system_boot ? FormatDate(last_system_boot) : '-'}
                                        </div>
                                    </div>
                                    <div className="assets-content assets-activity">
                                        <div className="asset-title-sub">Last Activity</div>
                                        <div className="asset-title">
                                            {last_activity ? FormatDate(last_activity) : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="asset-container">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="asset-title-sub">Assets</div>
                                        <div className="asset-title">Tags</div>
                                    </div>
                                    <div className="primary-btn icon-add">
                                        <button
                                            type="button"
                                            className="outline-btn"
                                            onClick={OpenFormModalFn}>
                                            <FaPlus /> Add Tag
                                        </button>
                                    </div>
                                </div>
                                <div className="divider-hr w-100"></div>
                                {tag_value?.map((val, ind) =>
                                    ind % 2 === 0 ? (
                                        <p className="custom-badges tag-container dis-flex-inline m-r-8">
                                            {val?.name}
                                        </p>
                                    ) : (
                                        <p className="custom-badges tag-count dis-flex-inline m-r-8 ">
                                            {val?.name}
                                        </p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {openFormModal && (
                <ModalComp
                    isOpen={openFormModal}
                    content={{
                        comp: 'FormComp',
                        from: 'assetDetailsTags',
                        row: data?.data,
                    }}></ModalComp>
            )}
        </>
    );
};
