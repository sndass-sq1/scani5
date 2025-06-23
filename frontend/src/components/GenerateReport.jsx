import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { Modal, Button, Form, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';
import Select from 'react-select';
const GenerateReport = ({ table }) => {
    const user = useAuth();
    const orgId = useDecrypt(user?.activeOrgId);
    let token = localStorage.getItem('token');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [assetType, setAssetType] = useState('');
    const [dropdownList, setDropdownList] = useState([]);
    const [selectedDropdown, setSelectedDropdown] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [loading, setLoading] = useState(false);
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const selectedRows = table.getSelectedRowModel().rows.map((row) => row?.original?.id);

    const formik = useFormik({
        initialValues: { filename: '' },
        validationSchema: Yup.object().shape({
            filename: Yup.string().required('Please enter filename'),
        }),
        onSubmit: async (values, { resetForm }) => {
            let newvalue = {
                ...values,
                fromDate: startDate?.toLocaleDateString('en-GB'),
                toDate: endDate?.toLocaleDateString('en-GB'),
                type: assetType,
                tagValue: selectedDropdown,
            };
            try {
                setLoading(true);
                let response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}reports/generate?orgId=${orgId}&selectedId=${selectedRows}`,
                    newvalue,
                    headers
                );
                if (response.status === 200) {
                    toast.success('Report generated successfully');
                    const byteArray = new Uint8Array(
                        atob(response.data.data.pdf_base64)
                            .split('')
                            .map((c) => c.charCodeAt(0))
                    );
                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = response.data.data.filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    handleClose();
                    table.resetRowSelection();
                }
            } catch (error) {
                toast.error(error.message);
                handleClose();
            }
            setLoading(false);
            resetForm();

            setDropdownList([]);
            table.resetRowSelection();
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl =
                    assetType === 'ip'
                        ? `reports/ip?orgId=${orgId}`
                        : `tags/report-tags?type=${assetType}&orgId=${orgId}`;
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}${apiUrl}`,
                    headers
                );
                setDropdownList(response?.data?.data);
            } catch (error) {
                toast.error('Error fetching data');
            }
        };
        if (assetType !== '') fetchData();
    }, [assetType]);

    return (
        <>
            <OverlayTrigger placement="top" overlay={<Tooltip>Report</Tooltip>}>
                <img
                    src={'/images/generate-report.svg'}
                    alt="Icon"
                    onClick={handleShow}
                    className="hov-pointer"
                    // width={findHeaderIconWidth(from)}
                />
            </OverlayTrigger>
            <Modal show={show} onHide={handleClose} centered className="expot-modal">
                <Modal.Header closeButton className="report-header">
                    <Modal.Title>Generate Report</Modal.Title>
                    {/* <img
                        // src={closeButtonIcon}
                        onClick={handleClose}
                        className="hov-pointer"
                        alt="Close"
                    /> */}
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <div className="form-floating m-b-24">
                            <input
                                type="text"
                                name="filename"
                                onChange={formik.handleChange}
                                value={formik.values.filename}
                                className="form-control"
                                placeholder="Report Name"
                            />
                            <label className="floating-input" required>
                                Report Name
                            </label>
                            {formik.touched.filename && formik.errors.filename && (
                                <div className="text-danger">{formik.errors.filename}</div>
                            )}
                        </div>

                        <div className="form-floating m-b-24">
                            <div className="d-flex gap-3">
                                <div className="flex-grow-1">
                                    <label for="floatingInputGrid">Start Date</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={setStartDate}
                                        className="form-control"
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <label for="floatingInputGrid">End Date</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={setEndDate}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-floating">
                            <Form.Group>
                                <Form.Label>Asset Type</Form.Label>
                                <Form.Select
                                    onChange={(e) => setAssetType(e.target.value)}
                                    value={assetType}>
                                    <option value="">Select category</option>
                                    <option value="ip">IPs</option>
                                    <option value="asset">Assets-tags</option>
                                    <option value="vulnerability">Vulnerability-tags</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                        {assetType !== '' && (
                            <div className="mt-3">
                                <Select
                                    isMulti
                                    options={dropdownList?.map((val) => ({
                                        value: val?.id,
                                        label: val?.name,
                                    }))}
                                    onChange={(val) =>
                                        setSelectedDropdown(val?.map((data) => data?.value))
                                    }
                                />
                            </div>
                        )}

                        <div className="text-center mt-3">
                            {loading ? (
                                <Spinner animation="border" />
                            ) : (
                                <div className="primary-btn">
                                    <Button type="submit" className="submit-btn w-50">
                                        Generate
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default GenerateReport;
