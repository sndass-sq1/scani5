import React, { useEffect, useState } from 'react';
import useDynamicQuery from '../services/useDynamicQuery';
import useDecrypt from '../utils/useDecrypt';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ModalComp from '../components/ModalComp';
import Accordion from 'react-bootstrap/Accordion';
import { useEncrypt } from '../utils/useEncrypt';
import { MdEdit } from 'react-icons/md';
import Offcanvas from 'react-bootstrap/Offcanvas';

const OrganizationInfo = () => {
    const user = useAuth();

    const orgId = useDecrypt(user?.activeOrgId);
    const encrypt = useEncrypt();
    const [step, setStep] = useState(1); // Step state (1 or 2)
    const [selectedTool, setSelectedTool] = useState(''); // State to track selected tool
    const [selectedImage, setSelectedImage] = useState(null);
    const decrypytActiveRole = useDecrypt(user?.activeRole);
    const image_path = `${process.env.REACT_APP_FOLDER_PATH}${orgId}/`;
    const [isModalOpen, setIsModalOpen] = useState({
        status: false,
        type: '',
    });
    const file_formats = ['jpg', 'png'];
    const isSuperAdmin =
        decrypytActiveRole === 'org super admin' || decrypytActiveRole === 'sq1 super admin';

    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };
    //canvas
    const [show, setShow] = useState(false);

    const handleClose = () =>
        setShow({
            status: false,
            type: '',
        });

    // Handle drag events
    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        if (event.dataTransfer.files.length > 0) {
            setSelectedImage(event.dataTransfer.files[0]);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setSelectedImage(null);
    };

    const handleNext = () => {
        if (step < 2) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleRadioChange = (event) => {
        setSelectedTool(event.target.value);
    };

    const { data: orgInfoData = {}, refetch } = useDynamicQuery({
        type: 'get',
        url: `/organizations/info/${orgId}`,
        query_name: 'getOrgInfo',
        params: {
            orgId: orgId,
        },
    });

    const {
        mutate: orgInfoMutate,
        isPending: orgInfoMutatePending,
        error: orgInfoErrors,
        isSuccess: orgInfoSuccess,
    } = useDynamicQuery({
        type: 'post',
        url: `/organizations/info`,
        invalidateQuery: ['getOrgInfo'],
        header: {
            'Content-Type': 'multipart/form-data',
        },
    });

    const setActiveOrgName = async () => {
        const result = await refetch();
        if (result.isSuccess) {
            const org_name = result.data?.data?.name;
            const logo = result.data?.data?.dark_logo;
            localStorage.setItem('activeOrgName', encrypt(org_name));
            user.setActiveOrgName(encrypt(org_name));
            localStorage?.setItem('logo', logo ? encrypt(logo) : null);
            user.setOrgImageURL(true);
        }
    };

    useEffect(() => {
        if (orgInfoSuccess) {
            setActiveOrgName();
        }
    }, [orgInfoSuccess]);

    const checkFileFormat = (file) => {
        return file_formats.indexOf(file?.split('.')?.pop()) > -1;
    };

    const closeModal = () => {
        setIsModalOpen({
            status: false,
            type: '',
        });
    };

    const ticketValues =
        orgInfoData?.data?.tickets?.type === 'jira' ||
        orgInfoData?.data?.tickets?.type === 'freshservice' ||
        orgInfoData?.data?.tickets?.type === 'trello'
            ? orgInfoData?.data.tickets.values
            : '';

    const formik = useFormik({
        initialValues: {
            name: orgInfoData?.data?.name || '',
            short_name: orgInfoData?.data?.short_name || '',
            ticketTool: orgInfoData?.data?.tickets?.type || '',
            orgLogo: null,
            freshservice_url:
                orgInfoData?.data?.tickets?.type === 'freshservice' ? ticketValues.url : '',
            freshservice_key:
                orgInfoData?.data?.tickets?.type === 'freshservice' ? ticketValues.key : '',
            jira_url: orgInfoData?.data?.tickets?.type === 'jira' ? ticketValues.url : '',
            jira_key: orgInfoData?.data?.tickets?.type === 'jira' ? ticketValues.key : '',
            jira_username: orgInfoData?.data?.tickets?.type === 'jira' ? ticketValues.username : '',
            jira_boardname:
                orgInfoData?.data?.tickets?.type === 'jira' ? ticketValues.board_name : '',
            trello_url: 'https://api.trello.com',
            trello_key: orgInfoData?.data?.tickets?.type === 'trello' ? ticketValues.key : '',
            trello_token: orgInfoData?.data?.tickets?.type === 'trello' ? ticketValues.token : '',
            trello_list_name:
                orgInfoData?.data?.tickets?.type === 'trello' ? ticketValues.list_name : '',
            trello_boardname:
                orgInfoData?.data?.tickets?.type === 'trello' ? ticketValues.board_name : '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            name: Yup.string().required('Please enter organization name'),
            short_name: Yup.string().required('Please enter short name'),
            // ticketTool: Yup.string().required('Please select any ticketing tool').nullable(),
            orgLogo: Yup.mixed()
                .notRequired()
                .when('$orgLogo', {
                    is: (val) => !!val?.name,
                    then: (schema) =>
                        schema
                            .test('fileFormat', '.jpg, .png formats only are allowed', (value) => {
                                return checkFileFormat(value?.name);
                            })
                            .test('fileSize', 'File size must be less than 2MB', (value) => {
                                return value?.size <= 2 * 1024 * 1024; // 2MB in bytes
                            }),
                }),
            freshservice_key: Yup.string().when('ticketTool', {
                is: (val) => val === 'freshservice',
                then: (schema) => schema.required('Please enter your key'),
                otherwise: (schema) => schema.notRequired(),
            }),
            freshservice_url: Yup.string().when('ticketTool', {
                is: (val) => val === 'freshservice',
                then: (schema) => schema.required('Please enter your url'),
                otherwise: (schema) => schema.notRequired(),
            }),

            jira_url: Yup.string().when('ticketTool', {
                is: (val) => val === 'jira',
                then: (schema) => schema.required('Please enter your url'),
                otherwise: (schema) => schema.notRequired(),
            }),
            jira_key: Yup.string().when('ticketTool', {
                is: (val) => val === 'jira',
                then: (schema) => schema.required('Please enter your key'),
                otherwise: (schema) => schema.notRequired(),
            }),
            jira_username: Yup.string().when('ticketTool', {
                is: (val) => val === 'jira',
                then: (schema) => schema.required('Please enter your user name'),
                otherwise: (schema) => schema.notRequired(),
            }),
            jira_boardname: Yup.string().when('ticketTool', {
                is: (val) => val === 'jira',
                then: (schema) => schema.required('Please enter your board name'),
                otherwise: (schema) => schema.notRequired(),
            }),

            trello_url: Yup.string().when('ticketTool', {
                is: (val) => val === 'trello',
                then: (schema) => schema.required('Please enter your url'),
                otherwise: (schema) => schema.notRequired(),
            }),
            trello_token: Yup.string().when('ticketTool', {
                is: (val) => val === 'trello',
                then: (schema) => schema.required('Please enter your token'),
                otherwise: (schema) => schema.notRequired(),
            }),
            trello_key: Yup.string().when('ticketTool', {
                is: (val) => val === 'trello',
                then: (schema) => schema.required('Please enter your key'),
                otherwise: (schema) => schema.notRequired(),
            }),
            trello_boardname: Yup.string().when('ticketTool', {
                is: (val) => val === 'trello',
                then: (schema) => schema.required('Please enter your board name'),
                otherwise: (schema) => schema.notRequired(),
            }),
            trello_list_name: Yup.string().when('ticketTool', {
                is: (val) => val === 'trello',
                then: (schema) => schema.required('Please enter your list name'),
                otherwise: (schema) => schema.notRequired(),
            }),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('short_name', values.short_name);

            if (!!selectedImage) {
                formData.append('dark_logo', selectedImage);
            }
            // formData.append("light_logo", lightLogo);
            formData.append('orgId', orgId);
            formData.append('type', values?.ticketTool || '');

            if (values?.ticketTool === 'freshservice') {
                formData.append('domain', values?.freshservice_url);
                formData.append('key', values?.freshservice_key);
            }
            if (values?.ticketTool === 'jira') {
                formData.append('domain', values?.jira_url);
                formData.append('key', values?.jira_key);
                formData.append('username', values?.jira_username);
                formData.append('board_name', values?.jira_boardname);
            }
            if (values?.ticketTool === 'trello') {
                formData.append('url', values?.trello_url);
                formData.append('token', values?.trello_token);
                formData.append('key', values?.trello_key);
                formData.append('board_name', values?.trello_boardname);
                formData.append('list_name', values?.trello_list_name);
            }

            try {
                orgInfoMutate(formData);
            } catch (error) {
                console.log('Error in orgInfoMutate : ', error);
            }
        },
    });

    if (orgInfoErrors) {
        const errors = orgInfoErrors.response?.data?.message || {};
        if (typeof errors === 'object' && Object.keys(errors).length > 0) {
            const formikErrors = {};
            if ('name' in errors) {
                formikErrors['name'] = errors['name'];
            }
            if ('short_name' in errors) {
                formikErrors['short_name'] = errors['short_name'];
            }
            if ('type' in errors) {
                formikErrors['ticketTool'] = errors['type'];
            }
            if ('dark_logo' in errors) {
                formikErrors['orgLogo'] = errors['dark_logo'];
            }
            if (formik.values['ticketTool'] === 'freshservice') {
                if ('domain' in errors) {
                    formikErrors['freshservice_url'] = errors['domain'];
                }
                if ('key' in errors) {
                    formikErrors['freshservice_key'] = errors['key'];
                }
            }

            if (formik.values['ticketTool'] === 'jira') {
                if ('domain' in errors) {
                    formikErrors['jira_url'] = errors['domain'];
                }
                if ('key' in errors) {
                    formikErrors['jira_key'] = errors['key'];
                }
                if ('username' in errors) {
                    formikErrors['jira_username'] = errors['username'];
                }
                if ('board_name' in errors) {
                    formikErrors['jira_boardname'] = errors['board_name'];
                }
            }

            if (formik.values['ticketTool'] === 'trello') {
                if ('url' in errors) {
                    formikErrors['trello_url'] = errors['url'];
                }
                if ('key' in errors) {
                    formikErrors['trello_key'] = errors['key'];
                }
                if ('token' in errors) {
                    formikErrors['trello_token'] = errors['token'];
                }
                if ('board_name' in errors) {
                    formikErrors['trello_boardname'] = errors['board_name'];
                }
                if ('list_name' in errors) {
                    formikErrors['trello_list_name'] = errors['list_name'];
                }
            }
            if (Object.keys(formikErrors).length > 0) {
                formik.setErrors(formikErrors);
            }
        }
    }

    const getImageURL = () => {
        if (!!selectedImage) {
            return URL.createObjectURL(selectedImage);
        }
        return image_path + orgInfoData?.data?.dark_logo;
    };

    return (
        <div>
            <div className="container-fluid org-info">
                <div className="row">
                    {/* Left Panel (org-stepper) */}
                    <div className="col-md-6 col-lg-4 org-left-panel">
                        <div>
                            <div className="organ-logo">
                                <img src="/images/orginfo/scani5-white-logo.png" alt="Logo" />
                            </div>
                            <div className="org-stepper">
                                {/* Step 1 */}
                                <div className="org-step">
                                    <div
                                        className={`org-step-indicator ${
                                            step >= 1 ? 'active' : 'ms-2'
                                        }`}>
                                        <img
                                            src="/images/orginfo/stepper-icon-1.png"
                                            alt="Step 1"
                                        />
                                    </div>
                                    <div className="org-step-description ms-2">
                                        <h4>Organization info</h4>
                                        <span>Provide organization name and logo</span>
                                    </div>
                                </div>

                                {/* Line between steps */}
                                <div
                                    className={`line d-md-block ${
                                        step >= 2 ? 'active-line' : ''
                                    }`}></div>

                                {/* Step 2 */}
                                <div className="org-step ">
                                    <div
                                        className={`org-step-indicator ${step >= 2 ? 'active' : ''}`}>
                                        <img
                                            src="/images/orginfo/stepper-icon-2.png"
                                            alt="Step 2"
                                        />
                                    </div>

                                    <div
                                        className={`org-step-description ${step >= 2 ? 'active' : ''}`}>
                                        <h4 className="ms-2 inactive-tool">
                                            Ticketing tool details
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className=" col-md-6 col-lg-8 org-right-section">
                        <div className="org-right-panel align-content-center">
                            {/* Step 1 Content */}
                            <div
                                className={`org-stepper-container ${step === 1 ? '' : 'org-hidden'}`}>
                                <h2 className="text-black ">More about your organization</h2>
                                <p className="header-text2 m-t-10 ">Organization info</p>
                                <form className="mt-4" onSubmit={formik.handleSubmit}>
                                    <div class="form-floating mb-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="organization-name"
                                            name="name"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.name}
                                            placeholder="apollo healthcare"
                                            disabled={!isSuperAdmin}
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <div className="err-label">{formik.errors.name}</div>
                                        )}
                                        <label for="organization-name" required>
                                            Organization name
                                        </label>
                                    </div>

                                    <div class="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="organization-name"
                                            placeholder="Short Name"
                                            name="short_name"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.short_name}
                                            disabled={!isSuperAdmin}
                                        />
                                        {formik.touched.short_name && formik.errors.short_name && (
                                            <div className="err-label">
                                                {formik.errors.short_name}
                                            </div>
                                        )}
                                        <label for="organization-name">Short name</label>
                                    </div>
                                    <div className="">
                                        {/* <label className="form-label">Organization logo</label> */}
                                        <div className="org-upload-section mt-4">
                                            <h5 className="upload-content">
                                                Upload Organization logo
                                            </h5>
                                            {selectedImage || orgInfoData?.data?.dark_logo ? (
                                                <div className="org-upload-box text-center">
                                                    {isSuperAdmin && (
                                                        <div className="d-flex justify-content-end ">
                                                            <label
                                                                htmlFor="file-reupload"
                                                                className=" cursor-pointer">
                                                                <div className="edit-icon">
                                                                    <MdEdit className="align-items-center e-icon m-t-2" />
                                                                </div>
                                                            </label>
                                                        </div>
                                                    )}

                                                    <img
                                                        src={getImageURL()}
                                                        alt="Uploaded"
                                                        className="upload-image "
                                                    />
                                                    {/* {!!orgInfoData?.data?.dark_logo &&
                                                        selectedImage?.name} */}
                                                    <input
                                                        type="file"
                                                        id="file-reupload"
                                                        name="orgLogo"
                                                        className="dis-none"
                                                        onChange={handleFileSelect}
                                                        accept=".jpg, .png"
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className="org-upload-box text-center"
                                                    onDragOver={handleDragOver}
                                                    onDrop={handleDrop}>
                                                    <img
                                                        src="/images/orginfo/upload-icon.png"
                                                        alt="Upload Icon"
                                                        className="img-fluid mb-2 org-upload-icon"
                                                    />
                                                    <div className="org-file-label">
                                                        <input
                                                            type="file"
                                                            id="file-upload"
                                                            name="orgLogo"
                                                            onChange={handleFileSelect}
                                                            accept=".jpg, .png"
                                                        />
                                                        <label
                                                            className="mb-0 cursor-pointer"
                                                            htmlFor="file-upload">
                                                            Click to upload
                                                        </label>
                                                        <span> or drag and drop</span>
                                                    </div>
                                                    <p className="org-file-size">
                                                        PNG or JPG (max. 800×400px)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn mt-4 w-100 d-flex justify-content-center align-items-center gap-2"
                                            id="btn-next"
                                            onClick={handleNext}>
                                            <p className="org-next-button">Next</p>
                                            <img
                                                src="/images/orginfo/right-arrow.svg"
                                                alt="arrow"
                                            />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Step 2 Content */}
                            <div
                                className={`org-stepper-container ${step === 2 ? '' : 'org-hidden'}`}>
                                <div className="position-relative mb-3 me-5">
                                    <button
                                        onClick={handleBack}
                                        className="org-back d-flex align-items-center justify-content-evenly gap-2">
                                        <img src="/images/orginfo/arrow.svg" alt="arrow" />
                                        <p>Back</p>
                                    </button>
                                </div>
                                <h2 className="text-black ms-2">Select your ticketing tool</h2>
                                <h4 id="header-text2" className="ms-2 mt-4">
                                    Integrations
                                </h4>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="mt-3">
                                        <div className="container me-5">
                                            <div className="row d-flex justify-content-around">
                                                {/* First row (two cards) */}
                                                <div className="col-md-12 col-lg-6 mb-3">
                                                    <div className="org-select card w-100 ">
                                                        <label
                                                            className="card-body d-flex align-items-center cursor-pointer justify-content-between"
                                                            onClick={() =>
                                                                handleRadioChange({
                                                                    target: {
                                                                        value: 'freshservice',
                                                                    },
                                                                })
                                                            }>
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    className="p-1"
                                                                    src="/images/orginfo/freshservice-logo.png"
                                                                    alt="freshservice"
                                                                />
                                                                <span className="ms-2">
                                                                    Freshservice
                                                                </span>
                                                            </div>
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                disabled={!isSuperAdmin}
                                                                value="freshservice"
                                                                id="radio1"
                                                                name="ticketTool"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                // value={formik.values.ticketTool}
                                                                checked={
                                                                    formik.values.ticketTool ===
                                                                    'freshservice'
                                                                }
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-12 col-lg-6 mb-3">
                                                    <div className="org-select card w-100">
                                                        <label
                                                            className="card-body d-flex justify-content-between cursor-pointer align-items-center"
                                                            onClick={() =>
                                                                handleRadioChange({
                                                                    target: { value: 'trello' },
                                                                })
                                                            }>
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    className="Trello-img p-auto trel"
                                                                    src="/images/orginfo/visit-trello-img.png"
                                                                    alt="trello"
                                                                />
                                                                <span className="ms-2">Trello</span>
                                                            </div>
                                                            <input
                                                                className="form-check-input  mt-2"
                                                                type="radio"
                                                                disabled={!isSuperAdmin}
                                                                value="trello"
                                                                id="radio2"
                                                                name="ticketTool"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                // value={formik.values.ticketTool}
                                                                checked={
                                                                    formik.values.ticketTool ===
                                                                    'trello'
                                                                }
                                                                // checked={selectedTool === 'Trello'}
                                                                // onChange={handleRadioChange}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row d-flex justify-content-around">
                                                {/* Second row (two cards) */}
                                                <div className="col-md-12 col-lg-6 mb-3 ">
                                                    <div className="card w-100 org-select ">
                                                        <label
                                                            className="card-body d-flex justify-content-between cursor-pointer align-items-center"
                                                            onClick={() =>
                                                                handleRadioChange({
                                                                    target: { value: 'jira' },
                                                                })
                                                            }>
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    className="p-1"
                                                                    src="/images/orginfo/jira-logo.png"
                                                                    alt="jira"
                                                                />
                                                                <span className="ms-2">Jira</span>
                                                            </div>
                                                            <input
                                                                className="form-check-input  mt-1"
                                                                type="radio"
                                                                disabled={!isSuperAdmin}
                                                                value="jira"
                                                                id="radio3"
                                                                name="ticketTool"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                // value={formik.values.ticketTool}
                                                                checked={
                                                                    formik.values.ticketTool ===
                                                                    'jira'
                                                                }
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="col-md-12 col-lg-6 mb-3">
                                                    <div className="org-select card w-100 ">
                                                        <label
                                                            className="card-body d-flex justify-content-between cursor-pointer  align-items-center"
                                                            onClick={() =>
                                                                handleRadioChange({
                                                                    target: { value: 'none' },
                                                                })
                                                            }>
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    className="none-img none"
                                                                    src="/images/orginfo/lock-profile.svg"
                                                                    alt="lock-profile"
                                                                />
                                                                <span className="ms-2">None</span>
                                                            </div>
                                                            <input
                                                                className="form-check-input mt-2"
                                                                type="radio"
                                                                disabled={!isSuperAdmin}
                                                                value=""
                                                                id="radio4"
                                                                name="ticketTool"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                // value={formik.values.ticketTool}
                                                                checked={
                                                                    formik.values.ticketTool === ''
                                                                }
                                                                // onChange={handleRadioChange}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {formik.touched.ticketTool &&
                                                formik.errors.ticketTool && (
                                                    <div className="err-label">
                                                        {formik.errors.ticketTool}
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* Conditional divs */}
                                    {formik.values.ticketTool === 'trello' && isSuperAdmin && (
                                        <div className="container" id="Trello">
                                            <div className="mb-4">
                                                <label className="custom-label" required>
                                                    URL
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="trello-input"
                                                    // placeholder="Enter the token"
                                                    name="trello_url"
                                                    disabled
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.trello_url}
                                                    readOnly
                                                />
                                                {formik.touched.trello_url &&
                                                    formik.errors.trello_url && (
                                                        <div className="err-label">
                                                            {formik.errors.trello_url}
                                                        </div>
                                                    )}
                                            </div>

                                            <div class="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="trello-input"
                                                    placeholder="Enter the token"
                                                    name="trello_token"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.trello_token}
                                                />
                                                {formik.touched.trello_token &&
                                                    formik.errors.trello_token && (
                                                        <div className="err-label">
                                                            {formik.errors.trello_token}
                                                        </div>
                                                    )}
                                                <p
                                                    id="sub-label"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setShow({
                                                            status: true,
                                                            type: 'trello-token',
                                                        })
                                                    }>
                                                    Where do I find my token?
                                                </p>
                                                <label for="floatingInput" required>
                                                    Token
                                                </label>
                                            </div>

                                            <div class="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="trello-input"
                                                    placeholder="Enter the API key"
                                                    name="trello_key"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.trello_key}
                                                />
                                                {formik.touched.trello_key &&
                                                    formik.errors.trello_key && (
                                                        <div className="err-label">
                                                            {formik.errors.trello_key}
                                                        </div>
                                                    )}
                                                <p
                                                    id="sub-label"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setShow({
                                                            status: true,
                                                            type: 'trello-key',
                                                        })
                                                    }>
                                                    Where do I find my API key?
                                                </p>
                                                <label for="floatingInput" required>
                                                    Key
                                                </label>
                                            </div>

                                            <div class="form-floating my-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="trello-input"
                                                    placeholder="Enter board name"
                                                    name="trello_boardname"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.trello_boardname}
                                                />{' '}
                                                {formik.touched.trello_boardname &&
                                                    formik.errors.trello_boardname && (
                                                        <div className="err-label">
                                                            {formik.errors.trello_boardname}
                                                        </div>
                                                    )}
                                                <label for="floatingInput" required>
                                                    Board name
                                                </label>
                                            </div>

                                            <div class="form-floating my-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="trello-input"
                                                    placeholder="Enter list name"
                                                    name="trello_list_name"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.trello_list_name}
                                                />
                                                {formik.touched.trello_list_name &&
                                                    formik.errors.trello_list_name && (
                                                        <div className="err-label">
                                                            {formik.errors.trello_list_name}
                                                        </div>
                                                    )}
                                                <label for="floatingInput" required>
                                                    List name
                                                </label>
                                            </div>

                                            {/* <div className="col-md-12 col-lg-6">
                                                    <button
                                                        type="submit"
                                                        className="btn mt-3 w-100 "
                                                        id="btn-visit">
                                                        <span>
                                                            <img
                                                                className="me-3"
                                                                src="/images/orginfo/visit-trello-img.png"
                                                                alt="trello"
                                                            />
                                                        </span>
                                                        Visit Trello
                                                        <i className="bi bi-arrow-up-right"></i>
                                                    </button>
                                                </div> */}
                                            <div>
                                                <button
                                                    type="submit"
                                                    className=" btn  mt-3 w-100 h-75"
                                                    id="btn-next"
                                                    disabled={orgInfoMutatePending}>
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {formik.values.ticketTool === 'freshservice' &&
                                        isSuperAdmin && (
                                            <div className="container" id="freshservice">
                                                <div class="form-floating my-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="freshservice-input"
                                                        placeholder="Enter domain"
                                                        name="freshservice_url"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.freshservice_url}
                                                    />
                                                    {formik.touched.freshservice_url &&
                                                        formik.errors.freshservice_url && (
                                                            <div className="err-label">
                                                                {formik.errors.freshservice_url}
                                                            </div>
                                                        )}
                                                    <label for="form-control" required>
                                                        Enter domain
                                                    </label>
                                                </div>

                                                <div class="form-floating my-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="freshservice-input"
                                                        placeholder="Enter API key"
                                                        name="freshservice_key"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.freshservice_key}
                                                    />
                                                    {formik.touched.freshservice_key &&
                                                        formik.errors.freshservice_key && (
                                                            <div className="err-label">
                                                                {formik.errors.freshservice_key}
                                                            </div>
                                                        )}
                                                    <p
                                                        id="sub-label"
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                            setShow({
                                                                status: true,
                                                                type: 'freshservice',
                                                            })
                                                        }>
                                                        Where do I find my API key?
                                                    </p>
                                                    <label for="floatingInput" required>
                                                        Enter key
                                                    </label>
                                                </div>

                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="btn mt-3 w-100 h-75"
                                                        id="btn-next"
                                                        disabled={orgInfoMutatePending}>
                                                        Update
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                    {formik.values.ticketTool === 'jira' && isSuperAdmin && (
                                        <div className="container" id="jira">
                                            <div class="form-floating my-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="jira-input"
                                                    placeholder="Enter domain"
                                                    name="jira_url"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.jira_url}
                                                />
                                                {formik.touched.jira_url &&
                                                    formik.errors.jira_url && (
                                                        <div className="err-label">
                                                            {formik.errors.jira_url}
                                                        </div>
                                                    )}
                                                <label for="form-control" required>
                                                    Domain
                                                </label>
                                            </div>

                                            <div class="form-floating my-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="jira-input"
                                                    placeholder="Enter the API key"
                                                    name="jira_key"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.jira_key}
                                                />
                                                {formik.touched.jira_key &&
                                                    formik.errors.jira_key && (
                                                        <div className="err-label">
                                                            {formik.errors.jira_key}
                                                        </div>
                                                    )}
                                                <p
                                                    id="sub-label"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        setShow({
                                                            status: true,
                                                            type: 'jira',
                                                        })
                                                    }>
                                                    Where do I find my API key?
                                                </p>
                                                <label for="form-control" required>
                                                    {' '}
                                                    API key
                                                </label>
                                            </div>

                                            <div class="form-floating my-2">
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    id="jira-input"
                                                    placeholder="Enter username"
                                                    name="jira_username"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.jira_username}
                                                    autoComplete="new-username"
                                                />{' '}
                                                {formik.touched.jira_username &&
                                                    formik.errors.jira_username && (
                                                        <div className="err-label">
                                                            {formik.errors.jira_username}
                                                        </div>
                                                    )}
                                                <label for="form-control " required>
                                                    {' '}
                                                    User name
                                                </label>
                                            </div>

                                            <div class="form-floating my-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="jira-input"
                                                    name="jira_boardname"
                                                    placeholder="Enter board name"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.jira_boardname}
                                                    autoComplete="new-password"
                                                />{' '}
                                                {formik.touched.jira_boardname &&
                                                    formik.errors.jira_boardname && (
                                                        <div className="err-label">
                                                            {formik.errors.jira_boardname}
                                                        </div>
                                                    )}
                                                <label for="form-control" required>
                                                    Board name
                                                </label>
                                            </div>

                                            <div>
                                                <button
                                                    type="submit"
                                                    className="btn mt-3 w-100 h-75"
                                                    id="btn-next"
                                                    disabled={orgInfoMutatePending}>
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {formik.values.ticketTool === '' && isSuperAdmin && (
                                        <div className="container" id="none">
                                            <div>
                                                <button
                                                    disabled={orgInfoMutatePending}
                                                    type="submit"
                                                    className="btn  mt-3 w-100 h-75"
                                                    id="btn-next">
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalComp
                isOpen={isModalOpen.status}
                closeFn={closeModal}
                title="Follow the follwing steps">
                <div className="org-modal">
                    {/* {isModalOpen.type === 'jira' && (
                        <>
                            <div className="org-accord">
                                <Accordion defaultActiveKey="0 ">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">01</span>{' '}
                                            <p className="accord-step"> Go to Account Settings</p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-account-settings.png"
                                                alt="stepfirst"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">02</span>{' '}
                                            <p className="accord-step">Click manage your account</p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-security.png"
                                                alt="stepsecond"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">03</span>{' '}
                                            <p className="accord-step">
                                                Navigate to security and click “create & manage API
                                                tokens”
                                            </p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-create-api.png"
                                                alt="stepthird"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">04</span>
                                            <p className="accord-step">Click create API token</p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-create-token.png"
                                                alt="stepfour"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">05</span>
                                            <p className="accord-step">
                                                You can copy the token to clipboard & use it in the
                                                password field
                                            </p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-copy-token.png"
                                                alt="stepsix"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>

                        </>
                    )} */}
                    {/* {isModalOpen.type === 'trello-token' && (
                        <>
                            <div className="org-accord">
                                <Accordion defaultActiveKey="1">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">01</span>{' '}
                                            <p className="accord-step">
                                                {' '}
                                                In Api Key page, click on the link to manually
                                                generate a Token.
                                            </p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/trello-create-token.png"
                                                alt="trello-token"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">02</span>{' '}
                                            <p className="accord-step">
                                                {' '}
                                                You have granted access to your Trello account
                                            </p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop" active>
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/trello-token.png"
                                                alt="trello-token-note"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </>
                    )} */}
                </div>
            </ModalComp>
            {show.type === 'freshservice' && (
                <>
                    <Offcanvas show={show} onHide={handleClose} placement="end" className="w-50 info-canvas">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Follow the following steps</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                           
                            <div className="org-accord">
                                <div className="modal-org-freeservice d-flex justify-content-center">
                                    <img className='ms-5 freshservice-asset'
                                        src="../images/org-info/freeservice.png"
                                        alt="freeservice"
                                    />
                                </div>
                                <div className="modal-org-content justify-content-between  m-t-20 ">
                                    <div className="modal-freeservice-toast gap-3 d-flex flex-column justify-content-center align-items-center  mx-5 "> 
                                        <p className="org-title m-b-5 m-l-5">
                                            Where do I find my API key?
                                        </p>
                                        <div className="freeservice-rule d-flex gap-2">
                                            <h4 className="m-b-0">01</h4>
                                            <p>Login to your Support Portal</p>
                                        </div>
                                        <div className="freeservice-rule d-flex gap-2">
                                            <h4 className="m-b-0">02</h4>
                                            <p>
                                                Click on your profile picture on the top right
                                                corner of your portal
                                            </p>
                                        </div>
                                        <div className="freeservice-rule d-flex gap-2">
                                            <h4 className="m-b-0">03</h4>
                                            <p>
                                                Go to Profile settings Page & Your API key will be
                                                available below the Delegate Approvals section to
                                                your right
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            )}
            {show.type === 'jira' && (
                <>
                    <Offcanvas show={show} onHide={handleClose} placement="end" className="w-50 info-canvas">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Follow the following steps</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {' '}
                            <div className="org-accord">
                                <Accordion defaultActiveKey="0 ">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">01</span>{' '}
                                            <p className="accord-step"> Go to Account Settings</p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-account-settings.png"
                                                alt="stepfirst"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">02</span>{' '}
                                            <p className="accord-step">Click manage your account</p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-security.png"
                                                alt="stepsecond"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">03</span>{' '}
                                            <p className="accord-step">
                                                Navigate to security and click “create & manage API
                                                tokens”
                                            </p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-create-api.png"
                                                alt="stepthird"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">04</span>
                                            <p className="accord-step">Click create API token</p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-create-token.png"
                                                alt="stepfour"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>

                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">05</span>
                                            <p className="accord-step">
                                                You can copy the token to clipboard & use it in the
                                                password field
                                            </p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/jira-copy-token.png"
                                                alt="stepsix"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>
                    {/* Trello Canvas */}
                </>
            )}
            {show.type === 'trello-token' && (
                <>
                    <div className="org-accord">
                        <Offcanvas
                            show={show}
                            onHide={handleClose}
                            placement="end"
                            className="w-50 info-canvas">
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Follow the following steps</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <div className="org-accord">
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header className="freeservice-rule">
                                                <span className="accord-numeric">01</span>{' '}
                                                <p className="accord-step">
                                                    {' '}
                                                    In Api Key page, click on the link to manually
                                                    generate a Token.
                                                </p>
                                            </Accordion.Header>
                                            <Accordion.Body className="imgdrop">
                                                <img
                                                    className="accordian-image"
                                                    src="../images/org-info/trello-create-token.png"
                                                    alt="trello-token"
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header className="freeservice-rule">
                                                <span className="accord-numeric">02</span>{' '}
                                                <p className="accord-step">
                                                    {' '}
                                                    You have granted access to your Trello account
                                                </p>
                                            </Accordion.Header>
                                            <Accordion.Body className="imgdrop" active>
                                                <img
                                                    className="accordian-image"
                                                    src="../images/org-info/trello-token.png"
                                                    alt="trello-token-note"
                                                />
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </div>
                </>
            )}
            {show.type === 'trello-key' && (
                <>
                    <Offcanvas show={show} onHide={handleClose} placement="end" className="w-50 info-canvas">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Follow the following steps</Offcanvas.Title>
                        </Offcanvas.Header>

                        <Offcanvas.Body>
                            <div className="org-accord">
                                <Accordion defaultActiveKey="0 ">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">01</span>{' '}
                                            <p className="accord-step">
                                                {' '}
                                                Create a Trello account or login
                                            </p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/trello-trello-login.png"
                                                alt="trello-login"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">02</span>{' '}
                                            <p className="accord-step">
                                                Access your API key page in your Power-Up Admin
                                                Portal
                                            </p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/trello-admin-portal.png"
                                                alt="trello-protocol"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">03</span>{' '}
                                            <p className="accord-step">
                                                Fill the form and click create button
                                            </p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/trello-new-power-up.png"
                                                alt="trello-create"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">04</span>
                                            <p className="accord-step">Generate a new API key</p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <p className="text-left  mt-3 mb-3 fw-bold text-center">
                                                You can get an API key by clicking “Generate a new
                                                API key.”
                                            </p>
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/trello-generate-key.png"
                                                alt="trello-api-generate"
                                            />
                                            <p className="text-left mt-4 mb-3 fw-bold ">
                                                Once you’ve clicked this, you’ll see a pop-up that
                                                confirms that this API key will replace the one used
                                                for GDPR compliance.
                                            </p>
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/trello-generate.png"
                                                alt="trello-api-key"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header className="freeservice-rule">
                                            <span className="accord-numeric">05</span>
                                            <p className="accord-step">Retrieve your API key</p>
                                        </Accordion.Header>
                                        <Accordion.Body className="imgdrop">
                                            <img
                                                className="accordian-image"
                                                src="../images/org-info/trello-key.png"
                                                alt="trello-test"
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>{' '}
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            )}
        </div>
    );
};

export default OrganizationInfo;
