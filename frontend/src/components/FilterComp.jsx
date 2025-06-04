import { Dropdown, Accordion, Form } from 'react-bootstrap';
import { filterFields } from '../utils/constant';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import useDynamicQuery from '../services/useDynamicQuery';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';

const FilterComp = ({ from, setFilter, filterList }) => {
    const filterDetails = filterFields.find((val) => val[from])?.[from];
    const [tempFilter, setTempFilter] = useState({});
    const user = useAuth();
    const decrypytActiveRole = useDecrypt(user?.activeRole);

    const { data: getFilterData = {} } = useDynamicQuery({
        type: 'get',
        url: 'organizations/filter-roles',
        query_name: filterDetails.find((val) => val.title === 'Role')?.apiDetails?.query_name,
        params: filterDetails
            .find((val) => val?.title === 'Role')
            ?.apiDetails?.params(decrypytActiveRole),
        enabled: ['users', 'orgUsers'].includes(from),
    });

    const handleFilterChange = (category, val) => {
        const updatedFilters = { ...tempFilter };
        if (!updatedFilters[category]) {
            updatedFilters[category] = []; // Initialize array if not present
        }

        if (updatedFilters[category].includes(val)) {
            updatedFilters[category] = updatedFilters[category].filter((item) => item !== val);
            if (updatedFilters[category].length === 0) {
                delete updatedFilters[category]; // Remove key if no values remain
            }
        } else {
            updatedFilters[category].push(val);
        }
        setFilter(updatedFilters);
        setTempFilter(updatedFilters);
    };

    const getFilterList = (category) => {
        if ('apiDetails' in category) {
            return getFilterData?.data || [];
        } else if ('list_from_backend' in category) {
            return filterList;
        }
        return category?.list;
    };

    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle
                    className="filter-btn d-flex align-items-center gap-2"
                    id="dropdown-basic">
                    <span className="hover-effect filter-icon">
                        <img src="/images/filtericon.svg" alt="Filter Icon" width={12} />
                    </span>
                    <span className="header-btn-text"> Filter</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Accordion defaultActiveKey="0">
                        {filterDetails?.map((category, index) => (
                            <Accordion.Item
                                eventKey={index.toString()}
                                key={`${category.title}_${index}`}>
                                <Accordion.Header>{category.title}</Accordion.Header>
                                <Accordion.Body>
                                    {getFilterList(category).length > 0 ? (
                                        getFilterList(category)?.map((val, list_index) => (
                                            <div
                                                className="filter-opt "
                                                key={`${val.value}_${list_index}`}>
                                                <label
                                                    htmlFor={val.value}
                                                    className="d-flex align-items-center gap-2 cursor-pointer">
                                                    <Form.Check type="checkbox">
                                                        <Form.Check.Input
                                                            type="checkbox"
                                                            id={val.value}
                                                            name={val.value}
                                                            checked={
                                                                tempFilter?.[
                                                                    category.key
                                                                ]?.includes(val.value) || false
                                                            }
                                                            onChange={() =>
                                                                handleFilterChange(
                                                                    category.key,
                                                                    val.value
                                                                )
                                                            }
                                                        />
                                                    </Form.Check>
                                                    <span className=" text-cap">{val.name}</span>
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No data</p>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default React.memo(FilterComp);

FilterComp.propTypes = {
    from: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
    setFilter: PropTypes.func.isRequired,
};
