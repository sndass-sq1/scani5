import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();

    const navigatePrevRoute = () => {
        navigate(-1);
    };

    return (
        <>
            <title>Scani5 - Page Not Found</title>
            <div
                className="container d-flex align-items-center justify-content-center flex-column vh-100 reg-container reg-font-weight"
                id="error-500">
                <h4>404</h4>
                <div>
                    <img
                        className="m-t-20 img-width"
                        src="/images/error-image/asking-question.png"
                        alt="hotspot"
                    />
                </div>
                <div>
                    <h3 className="m-t-10">Webpage doesn’t exist</h3>
                </div>
                <div className="text-center primary-btn">
                    <p className="m-t-20">The requested URL was not found on this server</p>
                    <button onClick={navigatePrevRoute} className="submit-btn m-t-20 w-half">
                        Back to Page
                    </button>
                </div>
            </div>
        </>
    );
};

export default PageNotFound;
