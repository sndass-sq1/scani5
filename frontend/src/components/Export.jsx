import React, { useState } from 'react';
import { Modal, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';

export default function Export({ from, table }) {
    let user = useAuth();
    const orgId = useDecrypt(user?.activeOrgId);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let token = localStorage.getItem('token');
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const selectedRows = table.getSelectedRowModel().rows.map((row) => row?.original?.id);

    const formik = useFormik({
        initialValues: {
            ispassword: 'off',
            password: '',
            confirm_password: '',
        },
        validationSchema: Yup.object().shape({
            password: Yup.string().when('ispassword', {
                is: 'on',
                then: () =>
                    Yup.string()
                        .required('Please enter password')
                        .matches(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one symbol'
                        ),
            }),
            confirm_password: Yup.string().when('ispassword', {
                is: 'on',
                then: () =>
                    Yup.string()
                        .oneOf([Yup.ref('password'), null], 'Passwords must match')
                        .required('Please enter confirm password'),
            }),
        }),
        onSubmit: async (values, { resetForm }) => {
            let type = from.includes('assets') ? 'assets' : 'vulnerabilities';
            let retired =
                from === 'retiredassets'
                    ? `is_retired=true`
                    : from === 'reportassets'
                      ? `is_reported=true`
                      : from === 'vulnerabilityassets'
                        ? `is_vulnerability_asset=true`
                        : '';
            let password =
                values?.ispassword === 'on' ? `&password=${values?.password}&is_password=true` : '';
            try {
                let api_url = `${process.env.REACT_APP_BACKEND_BASE_URL}${type}/export?orgId=${orgId}&selectedId=${selectedRows}${password}&${retired}`;
                let response = await axios.get(api_url, headers);

                toast.success(response.data.message, { autoClose: 3000 });
                window.open(
                    `${process.env.REACT_APP_EXPORT_PATH}${values?.ispassword === 'on' ? '' : '/storage'}/exports/` +
                        response?.data?.data?.file,
                    '_blank'
                );

                // if (resetSelectionRef.current) resetSelectionRef.current();
                // setSelectedRows([]);
                table.resetRowSelection();
                handleClose();
                resetForm();
            } catch (error) {
                toast.error(error.message, { autoClose: 3000 });
                handleClose();
                resetForm();
                table.resetRowSelection();
            }
        },
    });

    return (
        <>
            <OverlayTrigger placement="top" overlay={<Tooltip>Export</Tooltip>}>
                <img
                    src={'/images/export.svg'}
                    alt="Icon"
                    onClick={handleShow}
                    className="export hov-pointer"
                />
            </OverlayTrigger>
            <Modal show={show} onHide={handleClose} centered className="expot-modal">
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                    {/* <img
                        // src={closeButtonIcon}
                        alt="Close"
                        onClick={handleClose}
                        className="hov-pointer"
                    /> */}
                </Modal.Header>
                <Modal.Body>
                    <h4 className="text-center">Export</h4>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group>
                            <div className="text-center">
                                Do you want to protect it with a password?
                            </div>
                            <div className="d-flex gap-3 justify-content-center m-t-20 m-b-20">
                                <div className="d-flex gap-2 m-b-5">
                                    <Form.Check
                                        type="radio"
                                        // label="Yes"
                                        name="ispassword"
                                        className="m-t-2"
                                        value="on"
                                        onChange={formik.handleChange}
                                        checked={formik.values.ispassword === 'on'}
                                        id="password-yes"
                                    />
                                    <label htmlFor="password-yes" className="cursor-pointer">
                                        Yes
                                    </label>
                                </div>

                                <div className="d-flex gap-2">
                                    <Form.Check
                                        type="radio"
                                        // label="No"
                                        name="ispassword"
                                        className="m-t-2"
                                        value="off"
                                        onChange={formik.handleChange}
                                        checked={formik.values.ispassword === 'off'}
                                        id="password-no"
                                    />
                                    <label htmlFor="password-no" className="cursor-pointer">
                                        No
                                    </label>
                                </div>
                            </div>
                        </Form.Group>

                        {formik.values.ispassword === 'on' && (
                            <>
                                <div class="form-floating m-b-24">
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                        className="form-control"
                                        placeholder="Password"
                                    />
                                    <label for="floatingInput" required>
                                        Password{' '}
                                    </label>
                                    {formik.touched.password && formik.errors.password && (
                                        <Form.Text className="text-danger">
                                            {formik.errors.password}
                                        </Form.Text>
                                    )}
                                </div>

                                <div className="form-floating m-b-24">
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirm_password}
                                        className="form-control"
                                        placeholder="Confirm Password"
                                    />
                                    <label for="floatingInput" required>
                                        Confirm Password
                                    </label>
                                    {formik.touched.confirm_password &&
                                        formik.errors.confirm_password && (
                                            <Form.Text className="text-danger">
                                                {formik.errors.confirm_password}
                                            </Form.Text>
                                        )}
                                </div>
                            </>
                        )}

                        <div className="text-center mt-3 primary-btn">
                            <button type="submit" className="submit-btn w-50">
                                Export
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
