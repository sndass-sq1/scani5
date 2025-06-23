import { useAuth } from '../context/AuthContext';

const ServerError = () => {
    const auth = useAuth();

    return (
        <>
            <title>Scani5 - Server Error</title>
            <div
                className="container d-flex align-items-center justify-content-center flex-column vh-100 reg-container reg-font-weight"
                id="error-500">
                <h4>500</h4>
                <div>
                    <img
                        className="m-t-20 img-width"
                        src="/images/error-image/phone-hotspot.png"
                        alt="hotspot"
                    />
                </div>
                <div>
                    <h3 className="m-t-10">Internal Server Error</h3>
                </div>
                <div className="text-center primary-btn">
                    <p className="m-t-20">
                        The page you’re trying to access has restricted access <br />
                        Please refer to your system administrator
                    </p>
                    <button onClick={auth?.confirmLogout} className="submit-btn m-t-20 w-half">
                        Back to Login
                    </button>
                </div>
            </div>
        </>
    );
};

export default ServerError;
