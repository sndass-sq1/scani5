import { useFormik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import useDynamicQuery from '../services/useDynamicQuery';
import { formAPIData, formFields } from '../utils/constant';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as CryptoJS from 'crypto-js';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useFormModalContext } from '../context/FormModalContext';
import useDecrypt from '../utils/useDecrypt';
import SearchSelect from './SearchSelect';
import { useEncrypt } from '../utils/useEncrypt';

const FormComp = ({ from = '', rowValues }) => {
    const routeParam = useParams();
    const navigate = useNavigate();
    const { closeFormModalFn } = useFormModalContext();
    const user = useAuth();
    const orgId = useDecrypt(user?.activeOrgId);
    const secretkey = process.env.REACT_APP_Encrypt_SECRET_KEY
        ? process.env.REACT_APP_Encrypt_SECRET_KEY
        : 'sq1_12345';
    const decryptUserData = useDecrypt(user?.userdata);
    const decryptActiveOrgName = useDecrypt(user?.activeOrgName);
    const decrypytActiveRole = useDecrypt(user?.activeRole);
    const encrypt = useEncrypt();
    const formData = formFields.find((val) => val[from])?.[from] || [];
    const modalFormList = [
        'users',
        'editorganization',
        'organizations',
        'tags',
        'assettags',
        'vulnerabilitytags',
        'assetDetailsTags',
        'edittags',
        'orgUsers',
        'usersOrg',
        'editOrgUsers',
        'assetsreports',
        'editUsersOrg',
        'retiredassettags',
    ];
    const formAPI = formAPIData.find((val) => val[from])?.[from];
    const mapUrlParams = {
        userId: decryptUserData?.userid,
        routeParam,
        rowValues,
        decrypytActiveRole,
        orgId,
    };

    const apiData = useMemo(() => {
        return {
            url: 'customApi' in formAPI ? formAPI?.customApi(mapUrlParams) : formAPI?.url,
            ...(formAPI?.invalidateQuery && { invalidateQuery: formAPI?.invalidateQuery }),
            type: 'api_type' in formAPI ? formAPI?.api_type : 'post',
            ...(formAPI?.mutationKey && {
                mutationKey: formAPI?.mutationKey,
            }),
        };
    }, [formAPI]);

    const {
        mutate,
        data: addFormData,
        isPending,
        error: addFormErrors,
        isSuccess: addFormSuccess,
    } = useDynamicQuery({
        type: 'post',
        ...apiData,
    });

    const { data: getAPIData = {}, error: getAPIErrors } = useDynamicQuery({
        type: 'get',
        url:
            formAPI?.getAPI && 'customApi' in formAPI?.getAPI
                ? formAPI?.getAPI?.customApi(mapUrlParams)
                : formAPI?.getAPI?.url,
        query_name: formAPI?.getAPI?.query_name || '',
        enabled: ('getAPI' in formAPI && Object.keys(formAPI?.getAPI).length > 0) || false,
    });

    const mapAdditionalAPIParams = {
        userId: decryptUserData?.userid,
        routeParam,
        rowValues,
        orgId,
        decryptUserData,
        decrypytActiveRole,
        getAPIData,
    };

    useEffect(() => {
        if (getAPIErrors) {
            if (from === 'register') {
                navigate('/registration-not-found');
            }
        }
    }, [getAPIErrors]);

    const handleMouseDown = (val) => {
        formikAdd.setFieldValue(`${val.client_name}_show_password`, true);
    };
    const handleMouseUp = (val) => {
        formikAdd.setFieldValue(`${val.client_name}_show_password`, false);
    };

    const textFieldValue = (val) => {
        return formikAdd.values[val.client_name];
    };

    const textFieldDisable = (val) => {
        if (val.disabled) {
            return true;
        }
        return false;
    };

    const validationHandling = (val) => {
        if (val.mandatory) {
            if (val.type === 'dropdown') {
                return Yup.number()
                    .required(`Please select a ${val.label}`)
                    .nullable(false) // Allow null if no selection is made
                    .typeError(`${val.label} must be a number`);
            } else if (val.type === 'multi_select_dropdown') {
                return Yup.array()
                    .min(1, `Please select at least one ${val.label}`)
                    .required(`Please select at least one ${val.label}`);
            } else if ('validation' in val) {
                return val?.validation?.map((validation) => {
                    const { type, value } = validation || {};
                    const label = val.label;

                    switch (type) {
                        case 'password':
                            return Yup.string()
                                .required(`${label} is required!`)
                                .matches(
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one symbol'
                                );

                        case 'confirm_password':
                            return Yup.string()
                                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                                .required('Please enter confirm password');

                        case 'old_password':
                            return Yup.string().required('Old password is required');

                        case 'email':
                            return Yup.string()
                                .required(`${label} is required!`)
                                .matches(
                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    'Invalid email format'
                                )
                                .email('Invalid email address');

                        case 'min':
                            return Yup.string()
                                .required(`${label} is required!`)
                                [type](value, `${label} must be at least ${value} characters long`);
                        case 'max':
                            return Yup.string()
                                .required(`${label} is required!`)
                                [type](value, `${label} must not exceed ${value} characters`);

                        default:
                            return Yup.string().required(`${label} is required!`);
                    }
                });
            } else {
                return Yup.string().required(`${val.label} is required!`);
            }
        }
        return null;
    };

    const editFormValues = (type) => {
        return formData.reduce((acc, val) => {
            if (type === 'validation') {
                if (val.mandatory) {
                    const validation = validationHandling(val);
                    acc[val.client_name] = Array.isArray(validation) ? validation[0] : validation;
                }
            } else {
                if (val.type === 'password') {
                    acc[`${val.client_name}_show_password`] = false;
                }

                if (val.type === 'multi_select_dropdown') {
                    acc[val.client_name] = [];
                } else {
                    if ('value' in val && 'bind' in val) {
                        if (val?.bind) {
                            if (getAPIData && val?.value === 'getAPIData') {
                                const APIData = getAPIData?.data;

                                acc[val.client_name] = APIData ? APIData[val.backend_name] : '';
                            } else if (val?.bind === 'rowValues') {
                                acc[val.client_name] =
                                    mapAdditionalAPIParams[val.bind]?.[val.value];
                            } else if (val?.value === 'decryptActiveOrgName') {
                                acc[val.client_name] = decryptActiveOrgName;
                            }
                        } else {
                            acc[val.client_name] = val.value;
                        }
                    } else {
                        acc[val.client_name] = '';
                    }
                }
            }

            return acc;
        }, {});
    };

    const formikAdd = useFormik({
        initialValues: editFormValues(''),
        enableReinitialize: true,
        validationSchema: Yup.object().shape(editFormValues('validation')),
        onSubmit: async (values) => {
            let apiParam = {};
            formData.forEach((element) => {
                if ('send_to_backend' in element) {
                    if (!element.send_to_backend) {
                        return;
                    }
                }
                apiParam[element.backend_name] = values[element.client_name];
            });
            if ('additional_api_params' in formAPI) {
                formAPI.additional_api_params.forEach((params) => {
                    if ('customValue' in params) {
                        apiParam[params.name] = params.customValue(mapAdditionalAPIParams);
                    } else if (params.bind === 'routeParam' || params.bind === 'rowValues') {
                        const APIParam = mapAdditionalAPIParams[params.bind];
                        apiParam[params.name] = APIParam[params.value];
                    } else if (params.bind === 'getAPIData') {
                        apiParam[params.name] = getAPIData?.data[params.value];
                    } else {
                        apiParam[params.name] = params.value;
                    }
                });
            }

            try {
                await mutate(apiParam);
            } catch (error) {
                toast.error('edit mutate error : ', error);
            }
        },
    });
    // const setFileHandling = (val, e) => {
    //     const file = e.target.files[0];
    //     setFileReader(file);
    //     if (file) {
    //         formikAdd.setErrors({});
    //         formikAdd.setFieldValue(val.client_name, file);
    //     }
    //     if (onFileUpload) {
    //         onFileUpload(file); // Pass the selected file
    //     }
    // };

    const resetErrors = (val, e) => {
        formikAdd.setErrors({});
    };

    const loginSuccess = () => {
        const { data } = addFormData;
        user.setTotpToken(data.token);
        const qr_status = CryptoJS.AES.encrypt(data.status, secretkey).toString();
        user.SetQr_Status(qr_status);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user_role', data.role);
        localStorage.setItem('qr_status', CryptoJS.AES.encrypt(data.status, secretkey));
        localStorage.setItem('expires_at', Date.now());
        if (data.token) {
            if (data.status === 'mfa_otp') {
                navigate('/mfa/totp', { replace: true });
            } else if (data.status === 'mfa_qr') {
                navigate('/mfa/qr', { replace: true });
            } else {
                toast.error('invalid QR Status', data.status);
            }
        }
    };

    const registerSuccess = () => {
        toast.success('Thanks for registering please login to the application', {
            variant: 'success',
        });

        setTimeout(() => {
            navigate('/login', { replace: true });
        }, 1800);
    };

    const changePasswordSuccess = () => {
        user.afterSuccessLogout();
    };

    const changeProfilenameSuccess = () => {
        // const { data } = addFormData;
        let users = { ...decryptUserData, name: formikAdd?.values?.name };
        let encryptuserdata = encrypt(users);
        console.log('changeProfilenameSuccess data : ', users, encryptuserdata);
        user?.setUserdata(encryptuserdata);
        localStorage.setItem('user', encryptuserdata);
    };

    const mapFormSuccessFunction = {
        loginSuccess,
        registerSuccess,
        changePasswordSuccess,
        changeProfilenameSuccess,
    };

    useEffect(() => {
        if (addFormSuccess) {
            if ('successFun' in formAPI) {
                mapFormSuccessFunction[formAPI.successFun]?.();
            }
            formikAdd.resetForm();
            if (modalFormList.includes(from)) {
                closeFormModalFn();
            }
        }
    }, [addFormSuccess]);

    if (addFormErrors) {
        // if (modalFormList.includes(from)) {
        //     closeFormModalFn();
        // }
        const errors = addFormErrors.response?.data?.message || {};
        if (typeof errors === 'object' && Object.keys(errors).length > 0) {
            const formikErrors = {};
            formData.forEach((element) => {
                if (errors[element.backend_name]) {
                    formikErrors[element.client_name] = errors[element.backend_name];
                }
            });
            if (Object.keys(formikErrors).length > 0) {
                formikAdd.setErrors(formikErrors);
            }
        }
    }

    const handleRecaptchaChange = (token, val) => {
        formikAdd.setFieldValue(val.client_name, token || '');
    };

    const inputFieldType = (val) => {
        let final_type = val.type;
        if (final_type === 'password') {
            final_type = formikAdd.values[`${val.client_name}_show_password`] ? 'text' : final_type;
        }
        return final_type;
    };

    const inputField = (val) => {
        if (val.type === 'recaptcha') {
            return (
                <>
                    <div className="recaptcha-wrapper">
                        <ReCAPTCHA
                            sitekey="6Lf1LK4ZAAAAAKS13ESM-HF4Eh4_Aae0WkkxJRjC"
                            onChange={(e) => handleRecaptchaChange(e, val)}
                            size="normal"
                        />
                    </div>
                </>
            );
        } else if (val.type === 'textarea') {
            return (
                <>
                    <textarea
                        className="form-control"
                        name={val.client_name}
                        onChange={formikAdd.handleChange}
                        onBlur={formikAdd.handleBlur}
                        value={textFieldValue(val)}
                        disabled={textFieldDisable(val)}
                        placeholder={val.placeholder}>
                        {textFieldValue(val)}
                    </textarea>
                </>
            );
        } else {
            return (
                <>
                    <input
                        type={inputFieldType(val)}
                        className="form-control"
                        name={val.client_name}
                        onChange={formikAdd.handleChange}
                        onBlur={formikAdd.handleBlur}
                        value={textFieldValue(val)}
                        disabled={textFieldDisable(val)}
                        placeholder={val.placeholder}
                    />
                    {val.type === 'password' && (
                        <div
                            className="pwd-eye cursor-pointer"
                            onMouseDown={() => handleMouseDown(val)}
                            onMouseUp={() => handleMouseUp(val)}
                            onMouseLeave={() => handleMouseUp(val)}>
                            {formikAdd.values[val.client_name] &&
                                (formikAdd.values[`${val.client_name}_show_password`] ? (
                                    <FaRegEyeSlash />
                                ) : (
                                    <FaRegEye />
                                ))}
                        </div>
                    )}
                </>
            );
        }
    };

    const getdropdownValue = () => {
        const mapped = rowValues?.tag_value?.map((val) => ({
            value: val?.id,
            label: val?.name,
        }));
        return mapped || [];
    };

    const selectChange = (selected, val) => {
        if (val.type === 'multi_select_dropdown') {
            formikAdd.setFieldValue(
                `${val.client_name}`,
                selected ? selected.map((val) => val.value) : []
            );
        } else {
            formikAdd.setFieldValue(`${val.client_name}`, selected ? selected.value : '');
        }
        if (val.mandatory) {
            setTimeout(() => {
                formikAdd.validateField(val.client_name);
            }, 5);
        }
    };

    const mapDropdownParam = {
        formikAdd,
        rowValues,
    };

    const dropdownDisabled = (val) => {
        if ('disabled' in val?.optionDetails) {
            return val?.optionDetails?.disabled(mapDropdownParam);
        }
        return false;
    };

    const singleSelectDropdown = (val) => {
        return (
            <SearchSelect
                dropdownDetails={val}
                selectChange={selectChange}
                dropdownValue={getdropdownValue()}
                disabled={dropdownDisabled(val)}
                mapDropdownParam={mapDropdownParam}
            />
        );
    };

    const redirectToForgotPassword = () => {
        navigate('/forgot-password');
    };

    const redirectToLogin = () => {
        navigate('/login');
    };

    const mapFormLableFunction = {
        redirectToForgotPassword,
        redirectToLogin,
    };

    const buttonShowCondition = (button) => {
        if ('customShow' in button) {
            if (button?.customShow(orgId, decryptUserData)) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    };

    return (
        <div className={`${formAPI?.type === 'modalForm' ? 'form-modal' : 'login-form-card'}`}>
            {formAPI?.header_details?.header && formAPI?.type !== 'modalForm' && (
                <h4
                    className={`login-title fw-bold ${formAPI?.header_details?.header_class ? formAPI?.header_details?.header_class : ''}`}>
                    {formAPI?.header_details?.header}
                </h4>
            )}
            {formAPI?.header_details?.sub_header && (
                <p
                    className={`${formAPI?.header_details?.sub_header_class ? formAPI?.header_details?.sub_header_class : ''}`}>
                    {formAPI?.header_details?.sub_header}
                </p>
            )}
            {/* {'has_avatar' in formAPI && formAPI.has_avatar === true && (
                <div className="user-setting-profile m-b-20 text-up">
                    {getAPIData?.data?.['name'].slice(0, 2)}
                </div>
            )} */}

            <form onSubmit={formikAdd.handleSubmit}>
                {formData &&
                    formData.map((val) => (
                        <div
                            key={`${from}-${val.client_name}-input`}
                            className="form-floating m-b-24">
                            {val.type === 'dropdown' || val.type === 'multi_select_dropdown'
                                ? singleSelectDropdown(val)
                                : inputField(val)}
                            {val.show_label && (
                                <label htmlFor={val.client_name} required={val.mandatory}>
                                    {val.label}
                                </label>
                            )}
                            {formikAdd.touched[val.client_name] &&
                                formikAdd.errors[val.client_name] && (
                                    <div className="err-label">
                                        {formikAdd.errors[val.client_name]}
                                    </div>
                                )}
                        </div>
                    ))}
                <div className="primary-btn">
                    {formAPI?.form_buttons?.map(
                        (button, index) =>
                            // {
                            buttonShowCondition(button) && (
                                <button
                                    type={button.type}
                                    key={`${button.label}_${index}`}
                                    disabled={isPending}
                                    onClick={
                                        button?.type === 'button' && modalFormList.includes(from)
                                            ? closeFormModalFn
                                            : undefined
                                    }
                                    className={button.classValue}>
                                    {button.label}
                                </button>
                            )
                    )}
                </div>
            </form>
            {formAPI?.label_details?.length > 0 &&
                formAPI.label_details.map((detail, index) => (
                    <p
                        key={`form_lable_${index}`}
                        className={detail.classValue}
                        onClick={() => mapFormLableFunction[detail.func]?.()}>
                        {detail.value}
                    </p>
                ))}
        </div>
    );
};
export default React.memo(FormComp);

FormComp.propTypes = {
    from: PropTypes.string.isRequired,
    onFileUpload: PropTypes.func,
    onFormSubmit: PropTypes.func,
};
