import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaAngleLeft } from 'react-icons/fa6';
import { FaAngleRight } from 'react-icons/fa6';
import ReactPaginate from 'react-paginate';
import useDebounce from '../utils/useDebounce';

const perPageLists = [10, 20, 30];

const Pagination = ({
    totalPage = 0,
    totalRecords = 0,
    perPage = 5,
    showingEntries = 5,
    currentPage = 1,
    goToPage,
    setGoToPage,
    onPageChange = () => console.log('Pagination default onPageChange function'),
    onPerPageChange = () => console.log('Default onPerPageChange function'),
    // onGoToPageChange = () => console.log('Default onGoToPageChange function'),
}) => {
    // Debounce the goToPage state
    const debouncedGoToPage = useDebounce(goToPage, 500);
    const perPageList = process.env.REACT_APP_PAGINATION?.split(',').map(Number) || perPageLists;

    useEffect(() => {
        const page = parseInt(debouncedGoToPage, 10);
        if (page >= 1 && page <= totalPage && page !== currentPage) {
            onPageChange({ selected: page - 1 });
            // onGoToPageChange(page); // ReactPaginate uses 0-based index
        }
    }, [debouncedGoToPage]);
    // Handle "Go to Page" input change
    const handleGoToPageChange = (e) => {
        setGoToPage(e.target.value);
    };

    // Handle "Per Page" change
    const handlePerPageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        onPerPageChange(value); // Notify parent about the change
        setGoToPage('');
    };

    const [pageRange, setPageRange] = useState(window.innerWidth < 768 ? 1 : 2);

    useEffect(() => {
        const handleResize = () => {
            setPageRange(window.innerWidth < 768 ? 1 : 2);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [window.innerWidth]);

    return (
        <div className="d-flex between align-items-center gap-2 m-t-15 mobile-pagination">
            <div className="d-flex align-items-center gap-2">
                {/* Per Page Dropdown */}
                <div className="d-flex align-items-center gap-2 position-relative bg-img">
                    <label htmlFor="perPage" className="per-page-label">
                        Per Page
                    </label>
                    <select
                        id="perPage"
                        value={perPage}
                        onChange={handlePerPageChange}
                        className="bg-white page-select">
                        {perPageList?.map((val) => (
                            <option value={val} key={`${val}_perPage`}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <p className="per-page-label">
                    Showing
                    <span className="wh-20 text-center d-inline-block">{showingEntries}</span> of
                    <span className="wh-20 text-center d-inline-block m-l-3">{totalRecords}</span>
                </p>
            </div>
            {/* Pagination Component */}
            <ReactPaginate
                previousLabel={<FaAngleLeft />}
                nextLabel={<FaAngleRight />}
                breakLabel={'...'}
                pageCount={totalPage}
                onPageChange={onPageChange}
                forcePage={currentPage - 1}
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                activeClassName="active bg-blue-400"
                disabledClassName="disabled opacity-50"
                pageRangeDisplayed={pageRange}
                marginPagesDisplayed={pageRange}
            />
            {/* Go to Page Input */}
            <div className="d-flex align-items-center gap-2">
                <input
                    type="number"
                    id="goToPage"
                    value={goToPage}
                    onChange={handleGoToPageChange}
                    className="bg-white goto-page text-center"
                    min={1}
                    max={totalPage}
                />
                <label
                    htmlFor="goToPage"
                    className="per-page-label goto-bg d-flex align-items-center gap-1 m-l-6">
                    Go{' '}
                    <span>
                        <FaAngleRight />
                    </span>
                </label>
            </div>
        </div>
    );
};

export default Pagination;

Pagination.propTypes = {
    totalPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired, // Records per page
    showingEntries: PropTypes.number.isRequired, // Number of entries displayed
    onPageChange: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPerPageChange: PropTypes.func.isRequired, // Per page change handler
};
