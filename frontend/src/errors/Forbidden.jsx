import { useAuth } from '../context/AuthContext';

const Forbidden = () => {
    const auth = useAuth();
    return (
        <>
            <title>Scani5 - Forbidden</title>
            <div className="container d-flex align-items-center justify-content-center flex-column vh-100 reg-container reg-font-weight">
                <h4>403</h4>
                <div className="m-t-20">
                    <img
                        className="img-width"
                        src="/images/error-image/forbidden.png"
                        alt="error-401"
                    />
                </div>
                <div>
                    <h3 className="m-t-48">Error Forbidden</h3>
                </div>
                <div className="text-center primary-btn">
                    <p className="m-t-17">
                        The page you’re trying to access has restricted access
                        <br />
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

export default Forbidden;
