import React, { useState, createContext, use } from 'react';

const FormModalContext = createContext(null);

function FormModalProvider({ children }) {
    const [openFormModal, setOpenFormModal] = useState('');
    const OpenFormModalFn = (value) => {
        setOpenFormModal(value);
    };
    const closeFormModalFn = () => {
        setOpenFormModal('');
    };
    return (
        <FormModalContext
            value={{
                openFormModal,
                OpenFormModalFn,
                closeFormModalFn,
            }}>
            {children}
        </FormModalContext>
    );
}

export default FormModalProvider;

export const useFormModalContext = () => {
    return use(FormModalContext);
};
