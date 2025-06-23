import { LoginSlider } from '../../shared/LoginSlider';
import { MfaTOTPComp } from '../../components/MfaTOTPComp';

export const MfaTOTP = () => {
    return (
        <>
            <title>Scani5 - MFA TOTP</title>
            <div className="registration-container">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 col-lg-5 d-none d-sm-none d-lg-block pr-0 mobile-view-none">
                            <LoginSlider />
                        </div>
                        <div className="col-12 col-sm 12 col-md-12 col-lg-7">
                            <div className="login-form">
                                <div className="logo">
                                    <img src="/images/logo.png" alt="scani5_logo" />
                                </div>
                                <MfaTOTPComp />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
