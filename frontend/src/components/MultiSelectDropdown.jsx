import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { CustomMenuList } from './CustomMenuList';
import useDynamicInfiniteQuery from '../services/useDynamicInfiniteQuery';
import PropTypes from 'prop-types';
import useDebounce from '../utils/useDebounce';

const defaultMultiSelectDropdown = (selected, dropdownDetails) => {};

const MultiSelectDropdown = ({
    dropdownDetails = {},
    selectChange = defaultMultiSelectDropdown,
    dropdownValue = null,
    addFormSuccess = false,
    editID = null,
}) => {
    // const [debouncedSearch, setDebouncedSearch] = useState('');
    const [searchVal, setSearchVal] = useState('');
    const debouncedSearch = useDebounce(searchVal, 500);
    const [selecteddropDown, setSelecteddropDown] = useState(dropdownValue);

    const apiData = React.useMemo(() => {
        return {
            url: dropdownDetails?.optionDetails?.url,
            query_name: dropdownDetails?.optionDetails?.query_name,
        };
    }, [dropdownDetails]);

    const {
        data: dropdownList,
        isFetching: dropDownPending,
        status,
        error,
        isFetchingNextPage,
        isFetchingPreviousPage,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
        refetch,
    } = useDynamicInfiniteQuery({
        type: 'get',
        query_type: 'infinite',
        ...apiData,
        params: {
            search: debouncedSearch,
        },
    });

    // useEffect(() => {
    //     if (addFormSuccess) {
    //         refetch();
    //         setSelecteddropDown(null);
    //         setSearchVal('');
    //     }
    // }, [addFormSuccess]);

    useEffect(() => {
        refetch();
    }, [editID]);
    const getOptions = () => {
        const cachedData = dropdownList?.pages?.reduce((acc, page) => {
            const mapped = page?.data?.map((val) => ({
                value: val?.id,
                label: val[dropdownDetails?.optionDetails?.label_backend_name],
            }));
            return acc.concat(mapped || []);
        }, []);
        return cachedData;
    };

    // Handle search input change
    const handleSearchInputChange = (value) => {
        setSearchVal(value);
    };

    const handleKeyDown = (e) => {
        // Prevent React Select from intercepting key events
        e.stopPropagation();
    };

    const inputSearch = () => {
        return (
            <input
                type="text"
                placeholder={`Search ${dropdownDetails.label}...`}
                // ref={inputRef}
                id={`${dropdownDetails.client_name}_search`}
                value={searchVal}
                // onKeyDown={handleKeyDown}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                // onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    color: 'black',
                    height: '45px',
                    marginBottom: '20px',
                }}
            />
        );
    };

    const scrollToBottom = () => {
        if (!hasNextPage || isFetchingNextPage) {
        } else {
            fetchNextPage();
        }
    };

    const scrollToTop = () => {
        if (!hasPreviousPage || isFetchingPreviousPage) {
        } else {
            fetchPreviousPage();
        }
    };

    const selectDropdownValue = (val) => {
        setSelecteddropDown(val);
        selectChange(val, dropdownDetails);
    };

    return (
        <div>
            {/* {inputSearch()} */}
            <Select
                isSearchable={false}
                value={selecteddropDown}
                components={{
                    Menu: (props) => <CustomMenuList {...props} />,
                }}
                options={getOptions()}
                isLoading={dropDownPending}
                isMulti={dropdownDetails?.type === 'multi_select_dropdown'}
                onChange={(selected) => selectDropdownValue(selected)}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={`Select ${dropdownDetails.label}...`}
                onMenuScrollToBottom={scrollToBottom}
                onMenuScrollToTop={scrollToTop}
            />
        </div>
    );
};

export default React.memo(MultiSelectDropdown);

MultiSelectDropdown.propTypes = {
    dropdownDetails: PropTypes.shape({
        client_name: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.string,
        optionDetails: PropTypes.shape({
            url: PropTypes.string,
            query_name: PropTypes.string,
            label_backend_name: PropTypes.string,
        }),
    }).isRequired,
    selectChange: PropTypes.func.isRequired,
    dropdownValue: PropTypes.shape({
        value: PropTypes.number,
        label: PropTypes.string,
    }),
    addFormSuccess: PropTypes.bool,
};
