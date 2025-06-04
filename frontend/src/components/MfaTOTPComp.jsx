import { useEffect, useRef, useState } from 'react';
import useDynamicQuery from '../services/useDynamicQuery';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ModalComp from './ModalComp';
import { useEncrypt } from '../utils/useEncrypt';
import { toast } from 'react-toastify';

export const MfaTOTPComp = () => {
    const user = useAuth();
    const encrypt = useEncrypt();
    const navigate = useNavigate();
    const [openNotifyAdminModal, setOpenNotifyAdminModal] = useState(false);
    const [openExitModal, setOpenExitModal] = useState(false);
    const otpRef = useRef([]);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const disableForm = otp.every((val) => val !== '');
    const [confirmRegenerate, setConfirmRegenerate] = useState(false);
    const [reason, setReason] = useState('');

    const {
        mutate: TOTPMutate,
        data: TOTPData,
        isPending: TOTPPendig,
        isSuccess: TOTPSuccess,
    } = useDynamicQuery({
        type: 'post',
        url: 'mfa/verify/totp',
        mutationKey: 'TOTPAuth',
    });

    const { isSuccess: regenerateSuccess, mutate: regenerateTOTPMutate } = useDynamicQuery({
        type: 'post',
        url: `/mfa/request-regenerate/totp`,
        mutationKey: 'RequestRegenerateTOTP',
        // enabled: confirmRegenerate,
        staleTime: Infinity,
        cacheTime: Infinity,
    });

    useEffect(() => {
        if (TOTPSuccess) {
            const { data } = TOTPData;
            user.SetOtp_Status(encrypt('verified'));
            user?.setTotpToken('');
            localStorage.setItem('otp_status', encrypt('verified'));
            const user_encrypt = encrypt(data);
            localStorage.setItem('user', user_encrypt);
            const en_role = encrypt(data.role);
            localStorage.setItem('usermainrole', en_role);
            localStorage.setItem('activeRole', en_role);
            localStorage.setItem('token', data?.token);

            localStorage?.setItem('logo', data?.logo ? data?.logo : null);
            user?.setToken(data?.token);
            localStorage.setItem('activeOrgId', encrypt(data.orgId));
            user.setActiveOrgId(encrypt(data.orgId));
            user.setActiveOrgName(encrypt(data.orgName));
            localStorage.setItem('activeOrgName', encrypt(data.orgName));
            user.setActiveRole(en_role);
            user.setUserdata(user_encrypt);
            navigate('/');
        }
    }, [TOTPSuccess]);

    useEffect(() => {
        if (regenerateSuccess) {
            setReason('');
            setConfirmRegenerate(false);
            user.afterSuccessLogout();
        }
    }, [regenerateSuccess]);

    const openNotifyAdminModalFn = () => {
        setOpenNotifyAdminModal(true);
    };

    const openExistModalFn = () => {
        setOpenExitModal(true);
    };

    const confirmNotifyAdmin = () => {
        regenerateTOTPMutate({ reason, route: `${window?.location?.origin}/login` });
        setConfirmRegenerate(true);
    };

    const confirmVerifyLogout = () => {
        setOpenExitModal(false);
        user.confirmLogout();
    };

    const verifyTOTP = () => {
        try {
            TOTPMutate({
                otp: otp.join(''),
            });
        } catch (error) {
            toast.error('error in TOTP verify', error);
        }
    };

    const handleInputChange = (e, index) => {
        const { value } = e.target;

        if (!/^[0-9]$/.test(value)) {
            return;
        }

        setOtp((prev) =>
            prev.map((val, ind) => {
                if (index === ind) {
                    return value;
                } else {
                    return val;
                }
            })
        );
        if (e.target.value && otpRef.current[index + 1]) {
            otpRef.current[index + 1]?.focus();
        }
    };

    const handleInputKeyUp = (e, index) => {
        // Move to previous input on backspace if the current input is empty
        if (e.key === 'Backspace') {
            if (otpRef.current[index - 1]) {
                otpRef.current[index - 1]?.focus();
            }
            setOtp((prev) =>
                prev.map((val, ind) => {
                    if (index === ind) {
                        return '';
                    } else {
                        return val;
                    }
                })
            );
        } else if (e.key === 'Enter' && disableForm) {
            verifyTOTP();
        }
    };

    const cancelNotifyAdminModal = () => {
        setOpenNotifyAdminModal(false);
    };

    const cancelExitModal = () => {
        setOpenExitModal(false);
    };

    const diableCase = () => {
        return reason.length < 10 || reason.length > 255;
    };

    const NotifyAdminModalButtons = [
        {
            label: 'No',
            varient: 'secondary',
            function: cancelNotifyAdminModal,
        },
        {
            label: 'Yes',
            varient: 'primary',
            function: confirmNotifyAdmin,
            disable: diableCase(),
        },
    ];

    const ExistModalButtons = [
        {
            label: 'No',
            varient: 'secondary',
            function: cancelExitModal,
        },
        {
            label: 'Yes',
            varient: 'primary',
            function: confirmVerifyLogout,
        },
    ];

    const getReason = (e) => {
        setReason(e.target.value);
    };

    return (
        <>
            <div className="login-form-card totp-card">
                <p id="para-3">Enter Verification code</p>
                <form>
                    <div className="otp-bx">
                        {[...Array(6)].map((_, index) => (
                            <input
                                type="tel"
                                value={otp[index]}
                                onFocus={(e) => e.target.select()}
                                inputMode="numeric"
                                maxLength="1"
                                key={`otp_${index}`}
                                onKeyUp={(e) => handleInputKeyUp(e, index)}
                                onChange={(e) => handleInputChange(e, index)}
                                ref={(el) => (otpRef.current[index] = el)}
                                autoFocus={index === 0 ? true : false}
                            />
                        ))}
                    </div>
                    <div className="m-t-50">
                        <div className="primary-btn d-flex gap-4">
                            <button
                                type="button"
                                className="outline-btn"
                                onClick={openExistModalFn}>
                                Exit
                            </button>
                            <button
                                type="button"
                                className="submit-btn"
                                disabled={!disableForm || TOTPPendig}
                                onClick={verifyTOTP}>
                                Next
                            </button>
                        </div>
                    </div>
                </form>
                {sessionStorage.getItem('user_role') !== 'sq1 super admin' && (
                    <div className="admin-notify m-t-50">
                        If you do not have MFA,&thinsp;
                        <span
                            onClick={openNotifyAdminModalFn}
                            className="cursor-pointer underline"
                            tabIndex="0">
                            click here
                        </span>
                        &thinsp; to notify the administrator.
                    </div>
                )}
            </div>
            {openExitModal && (
                <ModalComp isOpen={openExitModal} buttons={ExistModalButtons} title="Exit Scani5">
                    <a>Are you sure want to exit from Scani5?</a>
                </ModalComp>
            )}

            {openNotifyAdminModal && (
                <ModalComp isOpen={openNotifyAdminModal} buttons={NotifyAdminModalButtons}>
                    <p className="m-b-20">Are you sure want to notify the administrator?</p>
                    <div className="form-floating height-textarea">
                        <textarea className="form-control" onChange={getReason} rows={5}></textarea>
                        <label required>Reason</label>
                        {reason.length > 0 && reason.length <= 10 && (
                            <div className="err-label">
                                Reason must be at least 10 characters long
                            </div>
                        )}
                        {reason.length > 0 && reason.length > 255 && (
                            <div className="err-label">
                                Reason must must not exceed 255 characters
                            </div>
                        )}
                    </div>
                </ModalComp>
            )}
        </>
    );
};
