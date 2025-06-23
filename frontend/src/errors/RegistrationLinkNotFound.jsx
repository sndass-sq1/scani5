import { useAuth } from '../context/AuthContext';

const RegistrationLinkNotFound = () => {
    const auth = useAuth();

    return (
        <>
            <title>Scani5 - Registration Link Not Found</title>
            <div className="container d-flex align-items-center justify-content-center flex-column gap-5 vh-100 reg-container">
                <h4 className="text-center">Registration link not found</h4>
                <div c>
                    <img
                        className="img-width"
                        src="/images/error-image/notfound.png"
                        alt="no-email"
                    />
                </div>
                <div className="text-center primary-btn">
                    <p>
                        Using our vulnerability management platform, you can prioritise and share
                        risk across <br />
                        vulnerabilties measure known and undiscovered risks, and patch any device
                        from any location
                    </p>
                    <button onClick={auth?.afterSuccessLogout} className="submit-btn m-t-20 w-half">
                        Back to Login
                    </button>
                </div>
            </div>
        </>
    );
};

export default RegistrationLinkNotFound;
