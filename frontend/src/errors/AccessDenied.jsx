import { useAuth } from '../context/AuthContext';

export const AccessDenied = () => {
    const auth = useAuth();

    return (
        <>
            <title>Scani5 - Access Denied</title>
            <div className="container d-flex align-items-center justify-content-center flex-column vh-100 reg-container">
                <img className="img-width" src="/images/error-image/401_2.png" alt="error-401" />
                <div>
                    <img
                        className="img-width"
                        src="/images/error-image/401-asking-question.png"
                        alt="error-401"
                    />
                </div>
                <div>
                    <h3 className="m-t-48">Error Unauthorized</h3>
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
