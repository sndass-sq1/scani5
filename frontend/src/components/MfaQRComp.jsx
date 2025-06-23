import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useDynamicQuery from '../services/useDynamicQuery';
import * as CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import ModalComp from './ModalComp';

export const MfaQRComp = () => {
    const user = useAuth();
    const token = sessionStorage.getItem('token');
    const secretkey = process.env.REACT_APP_Encrypt_SECRET_KEY
        ? process.env.REACT_APP_Encrypt_SECRET_KEY
        : 'sq1_12345';
    const navigate = useNavigate();
    const user_qr_status = CryptoJS.AES.decrypt(user?.qr_status, secretkey)?.toString(
        CryptoJS.enc.Utf8
    );
    const [needHelpModal, setNeedHelpModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prevStep) => prevStep + 1);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
    };

    const setStyle = (type, index) => {
        if (type === 'step-indicator') {
            return {
                border: `4px solid ${
                    index < currentStep ? 'var(--stepper-color)' : 'var(--light-grey-color)'
                }`,
            };
        } else if (type === 'step-bar') {
            return {
                backgroundColor:
                    index < currentStep ? 'var(--stepper-color)' : 'var(--light-grey-color)',
                transition: 'background-color 0.3s ease',
            };
        }
    };

    const { data: QRCodeData = {}, isPending: QRCodePending } = useDynamicQuery({
        type: 'get',
        url: 'mfa/qrcode',
        query_name: 'MFAQRcode',
        staleTime: 'Infinity',
        refetchOnWindowFocus: false,
        enabled: !!token && user_qr_status?.toLowerCase() === 'mfa_qr',
    });

    const steps = [
        <div className="stepper-content">
            <p className="mt-5">
                Install the Microsoft authenticator app for Windows Phone, Android, or iOS.
            </p>
            <div className="d-flex justify-content-center gap-5 mt-4">
                <div className="auth-button">
                    <img src="/images/google.png" alt="Google Authenticator" />
                    <p>Google authenticator</p>
                </div>
                <div className="auth-button">
                    <img src="/images/microsoft.png" alt="Microsoft Authenticator" />
                    <p>Microsoft authenticator</p>
                </div>
            </div>
        </div>,
        <div className="stepper-content">
            <p>Add an account and choose "work or school account" & Scan the image below</p>
            <div className="qr-code mt-0">
                <div
                    dangerouslySetInnerHTML={{
                        __html:
                            Object.keys(QRCodeData).length > 0 ? QRCodeData?.data?.qr_code : null,
                    }}
                />
            </div>
            <p className="mt-2">
                If your are unable to scan the image , <br />
                enter the following information in your app.
            </p>
            <p className="qr-code-no">
                Code: <span>{QRCodeData?.data?.secret}</span>
            </p>
        </div>,
        <div className="stepper-content">
            <p className="mt-4">After the previous step you’ll get a six-digit code</p>
            <div className="totp-code mt-4">
                <img src="/images/totp.png" alt="TOTP-example-image" />
            </div>
            <p className="my-5 ">
                If the app displays a six-digit code,
                <br />
                you are good to go!
            </p>
        </div>,
    ];

    const { mutate: QRMutate, isSuccess: QRSuccess } = useDynamicQuery({
        type: 'post',
        url: 'mfa/verify/qr-code',
        mutationKey: 'QRAuth',
        enabled: token && user_qr_status?.toLowerCase() === 'mfa_qr',
    });

    useEffect(() => {
        if (QRSuccess) {
            const qr_status = CryptoJS.AES.encrypt('mfa_otp', secretkey).toString();
            localStorage.setItem('qr_status', qr_status);
            user.SetQr_Status(qr_status);
            navigate('/mfa/totp', { replace: true });
        }
    }, [QRSuccess]);

    const submitQRCode = () => {
        if (token && user_qr_status?.toLowerCase() === 'mfa_qr') {
            QRMutate({ qr_status: 'QR-Verified' });
        }
    };

    const needHelpModalFn = () => {
        setCurrentStep(0);
        setNeedHelpModal(true);
    };

    const closeNeedHelpModal = () => {
        setNeedHelpModal(false);
    };

    return (
        <>
            <div className="login-form-card">
                <p>
                    Open up your google authenticator or microsoft <br />
                    authenticator mobile app and scan the following QR code
                </p>
                <a className="help m-t-30" onClick={needHelpModalFn}>
                    Need Help?
                </a>
                <form>
                    <div
                        dangerouslySetInnerHTML={{
                            __html:
                                Object.keys(QRCodeData).length > 0
                                    ? QRCodeData?.data.qr_code
                                    : null,
                        }}
                    />

                    <p className="para-2 m-t-30  m-b-30">
                        If your 2FA mobile app does not support QR code then enter in the following
                        number:
                        <span> {QRCodeData?.data?.secret}</span>
                    </p>
                    <div className="primary-btn">
                        <button
                            type="button"
                            className="submit-btn"
                            onClick={submitQRCode}
                            disabled={QRCodePending}>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
            {needHelpModal && (
                <ModalComp isOpen={needHelpModal} closeFn={closeNeedHelpModal}>
                    <div className="stepper-container text-center">
                        {/* Progress Bar */}
                        <div className="stepper-progress d-flex justify-content-space-between align-items-center">
                            {steps.map((step, index) => (
                                <React.Fragment key={index}>
                                    {/* Step Indicator */}
                                    <div
                                        className="step-indicator"
                                        style={setStyle('step-indicator', index)}>
                                        {index + 1}
                                    </div>

                                    {/* Render bar only between steps */}
                                    {index < steps.length - 1 && (
                                        <div
                                            className="step-bar"
                                            style={setStyle('step-bar', index)}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Step Content */}
                        <div>{steps[currentStep]}</div>

                        {/* Buttons */}
                        <div className="primary-btn stepper-primary-btn d-flex justify-content-center gap-4 m-t-24 w-100">
                            {currentStep < steps.length - 1 ? (
                                <button
                                    type="button"
                                    className="outline-btn width-120"
                                    onClick={handleNext}>
                                    Next
                                    <span className="next-arw">
                                        <img src="/images/right-arrow.svg" alt="Arrow" width={12} />
                                    </span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="outline-btn width-120 width-140"
                                        onClick={handleReset}>
                                        <span className="next-arw refresh_icon">
                                            <img src="/images/refresh.svg" alt="Arrow" width={16} />
                                        </span>
                                        Play Again
                                    </button>
                                    <button
                                        type="button"
                                        className="submit-btn width-120"
                                        onClick={closeNeedHelpModal}>
                                        Done
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </ModalComp>
            )}
        </>
    );
};
