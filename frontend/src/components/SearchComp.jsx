import { useEffect, useState } from 'react';
import { useSearch } from '../context/SearchContext';
import useDebounce from '../utils/useDebounce';
import { tableDetails } from '../utils/constant';
import PropTypes from 'prop-types';

export const SearchComp = ({ from = '' }) => {
    const { setDebouncedSearchValue } = useSearch();
    const [searchValue, setSearchValue] = useState('');
    const debouncedValue = useDebounce(searchValue, 500);
    const tableInfo = tableDetails.find((val) => val[from])?.[from];

    useEffect(() => {
        setDebouncedSearchValue(debouncedValue);
    }, [debouncedValue]);

    const changeSearchValue = (e) => {
        const { value } = e.target;
        setSearchValue(value);
    };

    return (
        <div className="search-input position-relative">
            <span className="pos-search-icon">
                <img src="/images/search.svg" alt="Search" />
            </span>
            <input
                type="search"
                onChange={changeSearchValue}
                value={searchValue}
                placeholder="Search"
            />
            {tableInfo?.search_filter}
        </div>
    );
};

SearchComp.propTypes = {
    from: PropTypes.string.isRequired,
};
