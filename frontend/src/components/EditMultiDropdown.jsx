import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ModalComp from './ModalComp';
import useDynamicQuery from '../services/useDynamicQuery';

function EditMultiDropdown({
    openModal = false,
    from = '',
    multiDropdownDetails = {},
    editId = null,
    submitFun,
    cancelFun,
}) {
    const [checkboxId, setCheckboxId] = useState([]);
    const title = from === 'coder' ? 'Coder(s)' : 'Auditor(s)';

    const apiData = React.useMemo(() => {
        return {
            url: `${multiDropdownDetails?.url}/${editId}`,
            query_name: multiDropdownDetails?.query_name,
            params: {
                id: editId,
            },
        };
    }, [multiDropdownDetails, editId]);

    const {
        data: listData = {},
        isSuccess: modalSuccess,
        isPending: modalPending,
        status: modalStatus,
    } = useDynamicQuery({
        type: 'get',
        ...apiData,
    });

    useEffect(() => {
        if (Object.keys(listData).length > 0) {
            const data = listData?.data?.map((val) => {
                return {
                    ...val,
                    selected: true,
                };
            });

            setCheckboxId(data);
        }
    }, [listData]);

    const getCheckboxChange = (val) => {
        setCheckboxId((prev) =>
            prev.map((checkbox) =>
                checkbox.id === val.id ? { ...checkbox, selected: !checkbox.selected } : checkbox
            )
        );
    };

    const getCheckboxDisable = () => {
        return checkboxId?.some((val) => val.selected === true);
    };

    return (
        <>
            {modalSuccess && (
                <ModalComp isOpen={openModal}>
                    <form className=" grid gap-5">
                        <h5>Remove {title}</h5>
                        {checkboxId?.map((val) => (
                            <div key={`${val.name}_${val.id}_${from}_checkbox_container`}>
                                <input
                                    type="checkbox"
                                    checked={val.selected}
                                    onChange={(e) => getCheckboxChange(val)}
                                    id={`${val.name}_${val.id}_${from}_checkbox`}
                                    className=" cursor-pointer"
                                />
                                <label
                                    className=" ml-3 cursor-pointer"
                                    htmlFor={`${val.name}_${val.id}_${from}_checkbox`}>
                                    {val.name}
                                </label>
                            </div>
                        ))}
                        <div className=" flex gap-2 justify-between">
                            <button
                                type="button"
                                onClick={(e) => submitFun(checkboxId)}
                                className={`${
                                    !getCheckboxDisable() || modalPending
                                        ? 'bg-gray-400 text-main-color hover:bg-gray-400'
                                        : 'bg-blue-400 hover:bg-blue-400 text-main-color'
                                } py-1 w-28 text-sm duration-300 hover:scale-110 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1`}
                                disabled={!getCheckboxDisable() || modalPending}>
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={cancelFun}
                                className="bg-gray-400 text-main-color hover:bg-gray-400 py-1 w-28 text-sm duration-300 hover:scale-110 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1">
                                Cancel
                            </button>
                        </div>
                    </form>
                </ModalComp>
            )}
            {modalStatus === 'error' && <div>There is no {title}s list avaible.</div>}
        </>
    );
}

EditMultiDropdown.propTypes = {
    openModal: PropTypes.bool.isRequired,
    from: PropTypes.string.isRequired,
    multiDropdownDetails: PropTypes.shape({
        url: PropTypes.string.isRequired,
        query_name: PropTypes.string.isRequired,
    }),
    editId: PropTypes.number.isRequired,
    submitFun: PropTypes.func.isRequired,
    cancelFun: PropTypes.func.isRequired,
};

export default React.memo(EditMultiDropdown);
