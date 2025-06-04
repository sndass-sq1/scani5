import React, { useState } from 'react';
import DashboardStatusCard from './DashboardStatusCard';
import ChartComp from './ChartComp';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';
import { dashdoard_details } from '../utils/constant';
import useDynamicQuery from '../services/useDynamicQuery';
import Skeleton from 'react-loading-skeleton';

const DashboardComp = () => {
    const user = useAuth();
    const decryptActiveRole = useDecrypt(user.activeRole);
    const [discoveredVulnerabilitiesDays, setDiscoveredVulnerabilitiesDays] = useState(1);
    const dashboardDetails = dashdoard_details[0];
    const { apiDetails, cards, charts } = dashboardDetails || {};

    const { data: chartData = {}, isPending: chartPending } = useDynamicQuery({
        type: 'get',
        url: `${apiDetails?.url}`,
        query_name: apiDetails?.query_name,
        params: {
            dicsover_date: discoveredVulnerabilitiesDays,
        },
        enabled: !decryptActiveRole?.includes('org'),
    });

    const getDashboardStatus = () => {
        const cardCountDetails = {};
        cards?.forEach((val) => {
            cardCountDetails[val?.backend_param] = chartData?.data?.[val?.backend_param] || 0;
        });
        return cardCountDetails;
    };

    const changeVulnerabilitiesDays = (days) => {
        setDiscoveredVulnerabilitiesDays(days);
    };

    return (
        <div>
            <DashboardStatusCard
                cardStatusCount={getDashboardStatus()}
                changeVulnerabilitiesDays={changeVulnerabilitiesDays}
                VulnerabilitiesDays={discoveredVulnerabilitiesDays}
            />
            <div className={`grid-temp m-t-15 sq1-super-admin`}>
                {/*  sq1-super-admin - 3 card , grid-temp - multiple card*/}
                {charts?.length > 0 &&
                    charts?.map((chart, index) => (
                        <div className="chart-container" key={`${chart?.title}_chart_${index}`}>
                            {chartPending ? (
                                <Skeleton width="100%" height="100%" />
                            ) : (
                                <>
                                    <p className="text-center chart-title">{chart?.title}</p>
                                    <div className="chart">
                                        <div className="chart-inner">{chart?.label}</div>
                                        <ChartComp
                                            data={chart?.customDataBind(chartData)}
                                            type={chart?.type}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default DashboardComp;
