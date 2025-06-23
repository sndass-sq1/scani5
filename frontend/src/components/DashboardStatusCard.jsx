import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashdoard_details } from '../utils/constant';
import useDecrypt from '../utils/useDecrypt';

const DashboardStatusCard = ({
    cardStatusCount,
    changeVulnerabilitiesDays,
    VulnerabilitiesDays,
}) => {
    const user = useAuth();
    const navigate = useNavigate();
    const decryptActiveRole = useDecrypt(user.activeRole);
    const cardDetails = dashdoard_details[0]?.['cards'];

    const navigateToTableComp = (path) => {
        navigate(path);
    };

    return (
        <div className="dashboard-box d-flex flex-wrap text-nowrap gap-3">
            {cardDetails?.map((card, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                    key={`${card?.label}_dashboard_${index}`}
                    className={`box-card ${decryptActiveRole === 'org super admin' ? 'admin-box-card' : ''} ${card?.clickable && 'cursor-pointer  color-inherit'}`} /* box-card - 4 card , admin-box-card - 6 card*/
                    onClick={() =>
                        card?.clickable ? navigateToTableComp(card.navigate) : undefined
                    }>
                    <div className="box-card-icon">
                        <img src={`/images/dashboard/${card.img}.png`} alt={card.label} />
                    </div>
                    <div className="d-flex flex-column gap-1">
                        <p className={`box-count`}>{cardStatusCount[card.backend_param]}</p>
                        <p className={`box-content`}>{card.label}</p>
                        {'has_dropdown' in card && card.has_dropdown && (
                            <div className="pos-vuln">
                                <div className="d-flex align-items-center gap-2 position-relative">
                                    <select
                                        id="perPage"
                                        value={VulnerabilitiesDays}
                                        onChange={(e) => changeVulnerabilitiesDays(e.target.value)}
                                        className="bg-white page-select valuner-select">
                                        {card?.options?.map((val, index) => (
                                            <option value={val.value} key={`${val.label}_${index}`}>
                                                {val.value}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="perPage">Days</label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStatusCard;
