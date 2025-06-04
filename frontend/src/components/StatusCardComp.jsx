import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { cardDetails } from '../utils/constant';
import useDynamicQuery from '../services/useDynamicQuery';
import SwiperComp from './SwiperComp';
import { SwiperSlide } from 'swiper/react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';
import { useParams } from 'react-router-dom';
import TooltipComp from './TooltipComp';

const cardImages = [
    {
        name: 'organization',
        img: '/images/organization.png',
        alt: 'Organization Icon',
    },
    {
        name: 'Reports',
        img: '/images/reports.svg',
        alt: 'reports Icon',
    },
    {
        name: 'Activity',
        img: '/images/activity-log.svg',
        alt: 'Activity Icon',
    },
    {
        name: 'Tag',
        img: '/images/tag.svg',
        alt: 'Tag Icon',
    },
    {
        name: 'vulnerability',
        img: '/images/vulnerability.svg',
        alt: 'vulnerability Icon',
    },
    {
        name: 'Assets',
        img: '/images/asset-img.svg',
        alt: 'Assets Icon',
    },
    {
        name: 'users',
        img: '/images/users.svg',
        alt: 'users Icon',
    },
    {
        name: 'users',
        img: '/images/users.svg',
        alt: 'users Icon',
    },
    {
        name: 'success',
        img: '/images/ellipse-success.svg',
        alt: 'Success Icon',
    },
    {
        name: 'expired',
        img: '/images/expired-status.svg',
        alt: 'Expired Icon',
    },
    {
        name: 'critical',
        img: '/images/critical.svg',
        alt: 'Critical Icon',
    },
    {
        name: 'high',
        img: '/images/high.svg',
        alt: 'high Icon',
    },

    {
        name: 'medium',
        img: '/images/medium.svg',
        alt: 'medium Icon',
    },
    {
        name: 'low',
        img: '/images/low.svg',
        alt: 'low Icon',
    },
];

const findCardIcon = (from, type) => {
    return cardImages.find((val) => val.name === from)?.[type];
};

const StatusCardComp = ({ from = '', filterListFn, status }) => {
    const user = useAuth();
    const decrypytActiveRole = useDecrypt(user?.activeRole);
    const decryptActiveOrgId = useDecrypt(user.activeOrgId);
    const cardInfo = cardDetails.find((val) => val[from])?.[from];
    const routeParam = useParams();

    const enableCondition = () => {
        if (decrypytActiveRole.includes('org')) {
            return decryptActiveOrgId !== 1;
        }
        return true;
    };

    const mapAPIParam = {
        routeParam,
    };

    const {
        data: cardStatusData = {},
        isPending: cardStatusPending,
        isSuccess: cardStatusSuccess,
    } = useDynamicQuery({
        type: 'get',
        url:
            // cardInfo?.apiDetails?.url,
            'customApi' in cardInfo?.apiDetails
                ? cardInfo?.apiDetails.customApi(mapAPIParam)
                : cardInfo?.apiDetails.url,
        query_name: cardInfo?.apiDetails?.query_name,
        params: {
            ...(decrypytActiveRole.includes('org') && { orgId: decryptActiveOrgId }),
            ...('params' in cardInfo?.apiDetails && cardInfo?.apiDetails?.params(mapAPIParam)),
            ...(status ? status : ''),
        },
        enabled: enableCondition(),
    });

    useEffect(() => {
        if (cardStatusSuccess) {
            if (
                cardStatusData &&
                'is_list_from_backend' in cardInfo &&
                cardInfo?.is_list_from_backend
            ) {
                const filterList = cardStatusData?.data?.slice(1).map((val) => {
                    return { name: val.label, value: val.label?.toLowerCase() };
                });
                filterListFn(filterList);
            }
        }
    }, [cardStatusSuccess]);

    const getCardDetails = () => {
        if (
            cardStatusData &&
            'is_list_from_backend' in cardInfo &&
            cardInfo?.is_list_from_backend
        ) {
            return cardStatusData?.data;
        }
        return cardInfo?.details;
    };

    const getCountValue = (card) => {
        let count = cardStatusData?.data?.[card?.backend_param] ?? 0;
        let showTooltip = false;
        if ('is_list_from_backend' in cardInfo && cardInfo?.is_list_from_backend) {
            count = card.count;
        }

        if (count?.toString().length >= 4) {
            showTooltip = true;
            if (count?.toString().length >= 6) {
                count = count?.toString().slice(0, -5) + 'L';
            }
            count = count?.toString().slice(0, -3) + 'K';
        }

        if (showTooltip) {
            return (
                <TooltipComp content={count}>
                    <p className={`stats-number cursor-pointer`}>{count}</p>
                </TooltipComp>
            );
        }
        return (
            <p className={`stats-number-${card?.label?.toLowerCase()} mb-2 card-count-number`}>
                {count}
            </p>
        );
    };

    return (
        <div className="Stats-content ">
            <SwiperComp>
                {getCardDetails()?.map((card, index) => (
                    <SwiperSlide key={`${card.label}_${index}`}>
                        <div className="stats-card">
                            <div className="stats-info">
                                {cardStatusPending ? (
                                    <Skeleton count={2} />
                                ) : (
                                    <>
                                        <div className="d-flex justify-content-center ">
                                            {getCountValue(card)}
                                        </div>
                                        <div className=" d-flex justify-content-center">
                                            <p className="h-divider"></p>
                                        </div>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <div
                                                className={`stats-icon ${cardStatusPending ? 'w-10' : ''}mt-1`}>
                                                {cardStatusPending ? (
                                                    <Skeleton />
                                                ) : (
                                                    <img
                                                        src={findCardIcon(
                                                            card?.img || 'success',
                                                            'img'
                                                        )}
                                                        alt={findCardIcon(
                                                            card?.img || 'success',
                                                            'alt'
                                                        )}
                                                        className={`${
                                                            'is_list_from_backend' in cardInfo &&
                                                            cardInfo?.is_list_from_backend
                                                                ? card.label.toLowerCase()
                                                                : card.backend_param
                                                        }`}
                                                        style={{
                                                            width: card?.width || '16px',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <p className={`stats-label  text-cap mt-2 `}>
                                                {card.label}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </SwiperComp>
            {/* <div className="card stats-card border-0">
                <h2 className="d-flex justify-content-center p-3 pb-2 card-main">120</h2>
                <span className="h-divider ms-4"></span>
                <p className="d-flex justify-content-center card-sub">Assets</p>
            </div>
            <div className="card stats-card border-0">
                <h2 className="d-flex justify-content-center p-3 pb-2 card-main">120</h2>
                <span className="h-divider ms-4"></span>
                <p className="d-flex justify-content-center card-sub">Assets</p>
            </div>
            <div className="card stats-card border-0">
                <h2 className="d-flex justify-content-center p-3 pb-2 card-main">120</h2>
                <span className="h-divider ms-4"></span>
                <p className="d-flex justify-content-center card-sub">Assets</p>
            </div>
            <div className="card stats-card border-0">
                <h2 className="d-flex justify-content-center p-3 pb-2 card-main">120</h2>
                <span className="h-divider ms-4"></span>
                <p className="d-flex justify-content-center card-sub">Assets</p>
            </div> */}
        </div>
    );
};

export default React.memo(StatusCardComp);
