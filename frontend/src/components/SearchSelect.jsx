import React, { useState } from 'react';
import Select from 'react-select';
import useDynamicQuery from '../services/useDynamicQuery';
import useDebounce from '../utils/useDebounce';
import useDecrypt from '../utils/useDecrypt';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { ucFirst } from '../utils/UcFirst';

const defaultMultiSelectDropdown = () => {};

const SearchSelect = ({
    dropdownDetails = {},
    selectChange = defaultMultiSelectDropdown,
    dropdownValue = null,
    disabled = false,
    mapDropdownParam = {},
}) => {
    const optionDetails = dropdownDetails?.optionDetails;
    const routeParam = useParams();
    const user = useAuth();
    const orgId = useDecrypt(user?.activeOrgId);
    const decrypytActiveRole = useDecrypt(user?.activeRole);
    const mapUrlParams = {
        orgId,
        decrypytActiveRole,
        routeParam,
        ...mapDropdownParam,
    };

    const [isFocused, setIsFocused] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [selecteddropDown, setSelecteddropDown] = useState(dropdownValue);
    const debouncedSearch = useDebounce(searchVal, 500);

    // const apiData = useMemo(() => {
    //     return {
    //         url:
    //             'customApi' in optionDetails
    //                 ? optionDetails?.customApi(mapUrlParams)
    //                 : optionDetails?.url,
    //         query_name: optionDetails?.query_name,
    //         params: {
    //             search: debouncedSearch,
    //             ...('params' in optionDetails && optionDetails?.params(mapDropdownParam)),
    //         },
    //         ...('enabled' in optionDetails && {
    //             enabled: optionDetails?.enabled(mapDropdownParam),
    //         }),
    //     };
    // }
    // , [dropdownDetails]);

    const { data: dropdownList } = useDynamicQuery({
        type: 'get',
        url:
            'customApi' in optionDetails
                ? optionDetails?.customApi(mapUrlParams)
                : optionDetails?.url,
        query_name: optionDetails?.query_name,
        params: {
            search: debouncedSearch,
            ...('params' in optionDetails && optionDetails?.params(mapUrlParams)),
        },
        ...('enabled' in optionDetails && {
            enabled: optionDetails?.enabled(mapDropdownParam),
        }),
    });

    // useEffect(() => {
    //     if (addFormSuccess) {
    //         refetch();
    //         setSelecteddropDown(null);
    //         setSearchVal('');
    //     }
    // }, [addFormSuccess]);

    // useEffect(() => {

    //     refetch();
    // }, [editID]);

    const getOptions = () => {
        {
            const optionList = dropdownList?.data?.data ?? dropdownList?.data;
            const mapped = optionList?.map((val) => ({
                value: val?.id,
                label: ucFirst(val?.name),
            }));
            return mapped || [];
        }
    };
    const selectDropdownValue = (val) => {
        setSelecteddropDown(val);
        selectChange(val, dropdownDetails);
    };
    return (
        <div className="select-container mt-4 ">
            {/* <label className={`floating-label ${selectedOption || isFocused ? 'active' : ''}`}>
                Select a {dropdownDetails.label}
            </label> */}
            <Select
                className={`basic-single cursor-pointer ${dropdownDetails.label}`}
                value={selecteddropDown}
                isMulti={dropdownDetails?.type === 'multi_select_dropdown'}
                classNamePrefix="select"
                onChange={(selected) => selectDropdownValue(selected)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                isDisabled={disabled}
                isSearchable={true}
                options={getOptions()}
                placeholder={`Select a ${dropdownDetails.label}...`}
            />
        </div>
    );
};

export default SearchSelect;
