import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useDecrypt from '../utils/useDecrypt';
import { useAuth } from '../context/AuthContext';
import useDynamicQuery from '../services/useDynamicQuery';
import VulnerabilityAgeMatrix from '../components/VulnerabilityAgeMatrix';
import ChartComp from '../components/ChartComp';
import ExposureScore from '../components/ExposureScore';
import CustomDoughnut from '../components/CustomDoughnut';
import RiskDistribution from '../components/RiskDistribution';
import { NoData } from '../shared/NoData';
import * as CryptoJS from 'crypto-js';

const customDataBind = (val = {}) => {
    const chartData = {
        labels: val?.name,
        datasets: [
            {
                label: 'Patch status',
                data: val?.value,
                backgroundColor: val?.fill,
                borderRadius: 10,
                spacing: 5,
                borderWidth: 1,
            },
        ],
    };
    return chartData;
};

export const OrgDashboard = () => {
    const secretKey = process.env.REACT_APP_Encrypt_SECRET_KEY || '';
    const user = useAuth();
    const orgId = useDecrypt(user?.activeOrgId);
    const [queryParams, setQueryParams] = useState({
        orgId: orgId,
    });

    useEffect(() => {
        if (orgId) {
            const bytes = CryptoJS.AES.decrypt(user?.activeOrgId, secretKey);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            setQueryParams({ orgId: decryptedString });
        }
    }, [user?.activeOrgId]);

    const { data = {} } = useDynamicQuery({
        type: 'get',
        url: 'dashboard/organization',
        query_name: 'getOrgDetails',
        params: queryParams,
    });

    const {
        active_assets,
        assets_count,
        critical_assets_count,
        exploits_count,
        inactive_assets,
        vulnerabilities_count,
    } = data?.data || {};

    const { data: score = {} } = useDynamicQuery({
        type: 'get',
        url: 'dashboard/scanify-score',
        query_name: 'getOrgScoreDetails',
        params: queryParams,
    });
    const { data: statusChart = {} } = useDynamicQuery({
        type: 'get',
        url: 'dashboard/status-charts',
        query_name: 'getOrgStatuschartDetails',
        params: queryParams,
    });

    const {
        topVulnerabilities,
        patch_by_status,
        exposure_score,
        vulnerabilities_by_asset_category,
        exploitable_summary_by_severity,
        vulnerability_status,
    } = statusChart?.data || {};

    const { data: AgematrixData = {} } = useDynamicQuery({
        type: 'get',
        url: 'dashboard/age-matrix',
        query_name: 'getOrgAgematrixDetails',
        params: queryParams,
    });

    const { data: riskData = {} } = useDynamicQuery({
        type: 'get',
        url: 'dashboard/risk-distribution',
        query_name: 'getOrgriskDetails',
        params: queryParams,
    });

    return (
        <div>
            <div className="d-flex gap-2">
                <h5 className="heading m-b-15">Dashboard</h5>
                <img className="dashboard-logo mt-1" src="./images/dashboard-logo.svg" alt="" />
            </div>
            <div className="d-flex flex-wrap gap-3">
                <Link to="/vulnerability" className="box-card admin-box-card color-inherit">
                    <div className="box-card-icon ">
                        <img
                            src={`/images/dashboard/vulner-1.png`}
                            alt="discoveredVulnerabilities"
                        />
                    </div>

                    <div className="d-flex flex-column gap-1">
                        <p className="box-count">{vulnerabilities_count}</p>
                        <p className="box-content">Total vulnerabilities</p>
                    </div>
                </Link>
                <Link to="/exploits" className="box-card admin-box-card color-inherit">
                    <div className="box-card-icon ">
                        <img
                            src={`/images/dashboard/exploits.png`}
                            alt="discoveredVulnerabilities"
                        />
                    </div>

                    <div className="d-flex flex-column gap-1">
                        <p className="box-count">{exploits_count}</p>
                        <p className="box-content">Total exploits</p>
                    </div>
                </Link>{' '}
                <Link to="/assets" className="box-card admin-box-card color-inherit">
                    <div className="box-card-icon ">
                        <img
                            src={`/images/dashboard/workstation.png`}
                            alt="discoveredVulnerabilities"
                        />
                    </div>

                    <div className="d-flex flex-column gap-1">
                        <p className="box-count">{assets_count}</p>
                        <p className="box-content">Total assets</p>
                    </div>
                </Link>
                <Link
                    to="/assets"
                    className="box-card admin-box-card color-inherit"
                    state={{ status: 'connected' }}>
                    <div className="box-card-icon ">
                        <img
                            src={`/images/dashboard/organ-active.svg`}
                            alt="discoveredVulnerabilities"
                        />
                    </div>

                    <div className="d-flex flex-column gap-1">
                        <p className="box-count">{active_assets}</p>
                        <p className="box-content">Active assets</p>
                    </div>
                </Link>
                <Link
                    to="/assets"
                    className="box-card admin-box-card color-inherit"
                    state={{ status: 'disconnected' }}>
                    <div className="box-card-icon ">
                        <img
                            src={`/images/dashboard/organ-inactive.svg`}
                            alt="discoveredVulnerabilities"
                        />
                    </div>

                    <div className="d-flex flex-column gap-1">
                        <p className="box-count">{inactive_assets}</p>
                        <p className="box-content">Inactive assets</p>
                    </div>
                </Link>
                <Link
                    to="/assets"
                    className="box-card admin-box-card color-inherit"
                    state={{ critical_assets: true }}>
                    <div className="box-card-icon ">
                        <img
                            src={`/images/dashboard/critical-assets.png`}
                            alt="discoveredVulnerabilities"
                        />
                    </div>

                    <div className="d-flex flex-column gap-1">
                        <p className="box-count">{critical_assets_count}</p>
                        <p className="box-content">Critical assets</p>
                    </div>
                </Link>
            </div>
            <div className="grid-temp m-t-15">
                <div className="org-chart-container arg-dash-1">
                    <p className="text-left chart-title">Vulnerability risk distribution</p>
                    <div className="org-chart m-t-20">
                        {riskData?.data?.risk_distribution && (
                            <RiskDistribution
                                riskDistribution={riskData?.data?.risk_distribution}
                            />
                        )}
                    </div>
                </div>
                <div className="org-chart-container arg-dash-2">
                    <p className=" chart-title">Exploitable summary by severity</p>
                    <div className="org-chart chart">
                        {/* <div className="chart-inner"></div> */}
                        {exploitable_summary_by_severity && (
                            <CustomDoughnut data={exploitable_summary_by_severity} from="exp" />
                        )}
                    </div>
                </div>
                <div className="org-chart-container arg-dash-3">
                    <p className="text-left chart-title">Exposure score</p>
                    <div className="org-chart">
                        {exposure_score && (
                            <ExposureScore
                                scoreData={exposure_score?.average_risk}
                                riskScore={exposure_score?.risk_score}
                            />
                        )}
                    </div>
                </div>
                <div className="org-chart-container arg-dash-4">
                    <p className="text-left chart-title">Vulnerability status</p>
                    <div className="org-chart chart">
                        {/* <div className="chart-inner"></div> */}
                        {vulnerability_status && (
                            <CustomDoughnut data={vulnerability_status} from="vul" />
                        )}
                    </div>
                </div>
                <div className="org-chart-container arg-dash-5">
                    <p className="text-left chart-title">Vulnerabilities by asset category</p>
                    <div className="org-chart chart">
                        <div className="chart-inner"></div>
                        {vulnerabilities_by_asset_category && (
                            <ChartComp
                                type="donut"
                                data={customDataBind(vulnerabilities_by_asset_category)}
                            />
                        )}
                    </div>
                </div>
                <div className="org-chart-container arg-dash-6">
                    <p className="text-left chart-title">Vulnerability age matrix</p>
                    <div className="org-chart m-t-20">
                        <VulnerabilityAgeMatrix values={AgematrixData?.data} />
                    </div>
                </div>
                <div className="org-chart-container arg-dash-7">
                    <p className="text-left chart-title">Patch status</p>
                    <div className="org-chart chart">
                        <div className="chart-inner"></div>
                        {patch_by_status && (
                            <ChartComp type="donut" data={customDataBind(patch_by_status)} />
                        )}
                    </div>
                </div>
                <div className="org-chart-container org-table arg-dash-8">
                    <p className="text-left chart-title">Low/Medium CVSS with high risk score</p>
                    <div className="org-chart table-section m-t-20">
                        <div className="table-responsive">
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th className="text-center">Risk</th>
                                        <th className="text-center">Exploits</th>
                                        <th>Scani5 Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {score?.data?.length > 0 ? (
                                        score.data.map((value, index) => (
                                            <tr key={index}>
                                                <td>{value?.name || '-'}</td>
                                                <td
                                                    className={`percentage-${value?.scanify_score?.toLowerCase() || '-'} text-center`}>
                                                    {value?.risk ? `${value.risk}` : '-'}
                                                </td>
                                                <td className="text-center">
                                                    {value?.exploit_count || '-'}
                                                </td>
                                                <td>
                                                    <button
                                                        className={`patches-complex severity-${value?.scanify_score?.toLowerCase() || '-'}`}>
                                                        {value?.scanify_score || '-'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={12}>
                                                <NoData />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="org-chart-container org-table arg-dash-9">
                    <p className="text-left chart-title">Top 5 vulnerabilities</p>

                    <div className="org-chart table-section m-t-20">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Age</th>
                                        <th className="text-center">Risk</th>
                                        <th className="text-center">Asset count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!topVulnerabilities?.length ? (
                                        <tr>
                                            <td colSpan={12}>
                                                <NoData />
                                            </td>
                                        </tr>
                                    ) : (
                                        topVulnerabilities.map((value, index) => (
                                            <tr key={index}>
                                                <td>{value?.name || '-'}</td>
                                                <td>{value?.age || '-'}</td>
                                                <td
                                                    className={`percentage-${value?.severity?.toLowerCase() || '-'} text-center`}>
                                                    {value?.risk ? `${value.risk}` : '-'}
                                                </td>
                                                <td className="text-center">
                                                    {value?.asset_count || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
