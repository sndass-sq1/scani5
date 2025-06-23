import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import FormComp from './FormComp';
import { useFormModalContext } from '../context/FormModalContext';

const ModalComp = ({
    isOpen = false,
    title = '',
    children = '',
    buttons = [],
    content = {},
    closeFn,
}) => {
    const { closeFormModalFn } = useFormModalContext();
    if (!isOpen) return null;

    const getCloseModalFunction = () => {
        if (!!closeFn) {
            return closeFn;
        } else if (buttons.length > 0) {
            return buttons?.find((val) => val.varient === 'secondary')?.function;
        }
        return closeFormModalFn;
    };

    return (
        <div className="fixed">
            <Modal centered show={isOpen} onHide={getCloseModalFunction()}>
                <Modal.Header closeButton>
                    {!!title && <Modal.Title className="fs-20 fw-semibold">{title}</Modal.Title>}
                </Modal.Header>
                {!!children && (
                    <Modal.Body className="modal-design text-center text-dark fs-16 fw-medium">
                        {children}
                    </Modal.Body>
                )}
                {Object.keys(content).length > 0 && !!content?.comp && (
                    <Modal.Body className="modal-design text-dark p-0-imp">
                        {content?.comp === 'FormComp' && (
                            <FormComp from={content?.from} rowValues={content?.row} />
                        )}
                    </Modal.Body>
                )}
                {buttons.length > 0 && (
                    <Modal.Footer className="justify-content-center">
                        <div className="primary-btn d-flex gap-4 w-100">
                            {buttons.map((val, index) => (
                                <button
                                    onClick={val.function}
                                    key={`${val.label}_${index}_modal_button`}
                                    disabled={val?.disable}
                                    className={`${val.varient === 'primary' ? 'submit-btn' : 'outline-btn'}`}>
                                    {val.label}
                                </button>
                            ))}
                        </div>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
};

export default React.memo(ModalComp);

ModalComp.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string,
    children: PropTypes.any,
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            function: PropTypes.func.isRequired,
            disable: PropTypes.bool,
        })
    ),
};
