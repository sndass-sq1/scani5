import React, { Fragment, useMemo, useState, useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import Pagination from './Pagination';
import TableHeader from './TableHeader';
import useDynamicQuery from '../services/useDynamicQuery';
import ModalComp from './ModalComp';
import { Highlighter } from '../utils/Highlighter';
import { formAPIData, tableHeaders, tableDetails } from '../utils/constant';
import { NoData } from '../shared/NoData';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
// import MultiSelectDropdown from './MultiSelectDropdown';
// import TooltipComp from './TooltipComp';
import { IoCaretDownOutline, IoCaretUpOutline } from 'react-icons/io5';
import { useSearch } from '../context/SearchContext';
import { useFormModalContext } from '../context/FormModalContext';
import { useAuth } from '../context/AuthContext';
import useDecrypt from '../utils/useDecrypt';
import { useNavigate, useParams } from 'react-router-dom';

const tableData = [];
const { selectedFilters, resetFilterQuery } = {
    selectedFilters: {},
    resetFilterQuery: () => {},
};

const TableComp = ({ from = '', status, getSelectedTab }) => {
    const user = useAuth();
    const routeParam = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sorting, setSorting] = useState([]);
    const [row, setRow] = useState('');
    const [modalContent, setModalContent] = useState();
    // const [editableRowId, setEditableRowId] = useState(null);
    // const [deleteRowId, setDeleteRowId] = useState(null);
    const [filter, setFilter] = useState({});
    const navigate = useNavigate();
    const { debouncedSearchValue } = useSearch();
    const { openFormModal, OpenFormModalFn } = useFormModalContext();
    // const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [editModalOpen, setEditModalOpen] = useState(false);
    // const [editMultiDropDownModal, setEditMultiDropDownModal] = useState({
    //     name: null,
    //     type: 'add',
    //     id: null,
    // });
    const decrypytActiveRole = useDecrypt(user?.activeRole);
    const decrypytUserData = useDecrypt(user?.userdata);
    const decrypytOrgData = useDecrypt(user?.orgData);
    // const [params, setParams] = useState('');
    const [goToPage, setGoToPage] = useState('');
    const [mutateDetails, setMutateDetails] = useState({
        type: 'post',
    });
    // const [dateRange, setDateRange] = useState({
    //     start: null,
    //     end: null,
    // });
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    // const queryClient = useQueryClient();

    const orgId = useDecrypt(user?.activeOrgId);

    const tableHeader = useMemo(() => {
        return tableHeaders.find((val) => val[from])?.[from];
    }, [from]);
    const tableUrl = useMemo(() => {
        return tableDetails.find((val) => val[from])?.[from];
    }, [from]);
    const rowsPerPage = 10;
    // const tableInfo = tableDetails.find((val) => val[from])?.[from];
    // const [dropdownOption, setDropdownOption] = useState({
    //     type: 'get',
    //     query_type: 'queries'
    // });
    // const queriesResult = useDynamicQuery(dropdownOption);

    const {
        mutate: dynamicMutate,
        isSuccess: dynamicSuccess,
        isError: dynamicError,
    } = useDynamicQuery(mutateDetails);

    // const queries = useMemo(() => {
    //     let editId = null;
    //     if (!!editableRowId) {
    //         editId = editableRowId;
    //         return tableHeader
    //             ?.map((config) => {
    //                 if (config?.editDetails && Object.keys(config?.editDetails).length > 0) {
    //                     const { editDetails } = config;
    //                     if (
    //                         editDetails?.addedDetails &&
    //                         Object.keys(editDetails?.addedDetails).length > 0
    //                     ) {
    //                         const { addedDetails } = editDetails;
    //                         return {
    //                             query_name: addedDetails?.query_name, // Unique key for each API
    //                             url: `${addedDetails?.url}/${editableRowId}`,
    //                             params: {
    //                                 id: editableRowId
    //                             }
    //                         };
    //                     }
    //                 }
    //             })
    //             .filter(Boolean);
    //     }

    //     return null;
    // }, [editableRowId, tableHeader]);

    // useEffect(() => {
    //     if (queries?.length > 0) {
    //         setDropdownOption({
    //             type: 'get',
    //             query_type: 'queries',
    //             queries: queries
    //         });
    //     }
    // }, [queries]);
    const mapUrlParams = {
        // id,
        orgId,
        routeParam,
    };

    const handleActionModal = (row, action) => {
        setRow(row?.original);
        const { modal_details, ...rest } = action;
        let modalContent = { ...rest, modal_details: { ...modal_details } };

        if ('modal_details' in action && modalContent.modal_details) {
            if (typeof modal_details?.title === 'function') {
                modalContent.modal_details.title = modal_details.title(row);
            } else {
                modalContent.modal_details.title = modal_details.title;
            }
            if (typeof modal_details?.label === 'function') {
                modalContent.modal_details.label = modal_details.label(row);
            } else {
                modalContent.modal_details.label = modal_details.label;
            }
        }
        setModalContent(modalContent);

        const { id } = row.original;
        mapUrlParams.id = id;

        if (action.type === 'modal') {
            setIsModalOpen(true);
            setMutateDetails({
                url: 'customApi' in action ? action.customApi(mapUrlParams) : action.api,
                type: action?.api_type,
                invalidateQuery: action?.invalidateQuery,
                mutationKey: action?.mutationKey,
            });
        } else if (action.type === 'modalForm') {
            OpenFormModalFn(action?.from);
        }
    };

    // const getDetailsFromTableHeader = (value, type = 'backend_name') => {
    //     if (type === 'client_name') {
    //         return tableHeader.find((val) => {
    //             return val.editDetails[type] === value;
    //         });
    //     } else {
    //         return tableHeader.find((val) => {
    //             return val[type] === value;
    //         });
    //     }
    // };

    // const showMultiDropDown = (backend_name, id) => {
    //     const details = getDetailsFromTableHeader(backend_name);
    //     const { removeDetails } = details?.editDetails;
    //     const { editDetails } = details;
    //     setMutateDetails({
    //         type: 'post',
    //         url: `${removeDetails.url}/${id}`,
    //         invalidateQuery: removeDetails.invalidateQuery,
    //     });
    //     setEditMultiDropDownModal({
    //         name: editDetails?.client_name,
    //         type: 'remove',
    //         id,
    //     });
    // };

    // const showEditMultiDropdownPopup = (backend_name, id) => {
    //     const details = getDetailsFromTableHeader(backend_name);
    //     const { addDetails } = details?.editDetails;
    //     const { editDetails } = details;
    //     setMutateDetails({
    //         type: 'post',
    //         url: `${addDetails.url}/${id}`,
    //         invalidateQuery: addDetails.invalidateQuery,
    //     });
    //     setEditMultiDropDownModal({
    //         name: editDetails?.client_name,
    //         type: 'add',
    //         id,
    //     });
    // };

    // const getSelectedCheckboxValues = (selected_value) => {
    //     const id_list = selected_value.filter((val) => val.selected === false).map((val) => val.id);
    //     let param_name = 'auditor_id';
    //     if (editMultiDropDownModal?.name === 'coder') {
    //         param_name = 'coder_id';
    //     }
    //     dynamicMutate({
    //         [param_name]: id_list,
    //     });
    //     // formikEdit.setFieldValue(`${editMultiDropDownModal?.name}_removed`, id_list);
    // };

    // const CA_action_buttons = (row, backend_name, label) => {
    //     // if (editableRowId === row.original.id) {
    //     return (
    //         <div className="flex items-center gap-x-2">
    //             <button
    //                 type="button"
    //                 onClick={() => showMultiDropDown(backend_name, row.original.id)}>
    //                 <TooltipComp
    //                     text={<FaMinusSquare className="text-red-600" />}
    //                     tooltipContent={`Remove ${label}`}
    //                 />
    //             </button>
    //             <span>{row.original[backend_name]}</span>
    //             <button
    //                 type="button"
    //                 onClick={() => showEditMultiDropdownPopup(backend_name, row.original.id)}>
    //                 <TooltipComp
    //                     text={<FaPlusSquare className="text-blue-700" />}
    //                     tooltipContent={`Add ${label}`}
    //                 />
    //             </button>
    //         </div>
    //     );
    //     // } else {
    //     //     return <span>{row.original[backend_name]}</span>;
    //     // }
    // };

    // const getTitleOfMultiSelectPopup = () => {
    //     if (editMultiDropDownModal?.name === 'coder') {
    //         return 'Coder(s)';
    //     }
    //     return 'Auditor(s)';
    // };

    // const addCATemp = (selected) => {
    //     formikEdit.setFieldValue(
    //         `${editMultiDropDownModal?.name}_addTemp`,
    //         selected ? selected.map((val) => val.value) : []
    //     );
    // };

    // const refreshTable = () => {
    //     setCurrentPage(1);
    //     setDebouncedSearchValue('');
    //     resetFilterQuery();
    // };

    // const apiData = React.useMemo(() => {
    //     return {
    //         url: 'customApi' in tableUrl ? tableUrl?.customApi(mapUrlParams) : tableUrl?.url,
    //         query_name: tableUrl?.query_name,
    //     };
    // }, [tableUrl, mapUrlParams]);

    const [queryParams, setQueryParams] = useState({
        search: debouncedSearchValue, // Default to empty string if undefined
        sort_direction: sorting[0]?.desc ? 'desc' : sorting?.[0]?.desc === false ? 'asc' : '',
        page: currentPage, // Ensure there's always a page value
        limit: perPage,
        sort_column: sorting[0]?.id, // Default to empty string if no sorting
        ...(Object.keys(filter).length !== 0 && { filter: JSON.stringify(filter) }),
        orgId: orgId,
        ...(decrypytActiveRole?.includes('org') && { orgId: orgId }),
        ...(status ? status : ''),
        ...('date_range' in tableUrl &&
            tableUrl?.date_range && {
                // ...dateRange,
                start: startDate,
                end: endDate,
            }),
    });

    const getParams = () => {
        if ('params' in tableUrl) {
            return {
                ...queryParams,
                ...tableUrl?.params(mapUrlParams),
            };
        } else {
            return queryParams;
        }
    };

    const {
        data = {},
        status: tableStatus,
        isPending: tablePending,
    } = useDynamicQuery({
        type: 'get',
        url: 'customApi' in tableUrl ? tableUrl?.customApi(mapUrlParams) : tableUrl?.url,
        query_name: tableUrl?.query_name,
        params: getParams(),
    });

    const pagination = data?.data?.meta || {};
    const totalRecords = pagination?.total || 0;
    const showingEntries = Math.min(currentPage * perPage, totalRecords);
    const totalPage = pagination?.last_page || Math.ceil(totalRecords / perPage);

    // //sorting
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchValue]);

    useEffect(() => {
        setQueryParams((prevParams) => ({
            ...prevParams,
            page: currentPage,
            limit: perPage,
        }));
    }, [currentPage, perPage]);

    useEffect(() => {
        // search
        let dateChanged = false,
            filterChanged = false,
            searchChanged = false;

        setQueryParams((prev) => {
            // date range changed

            if ('date_range' in tableUrl && 'start' in prev === false && dateRange.start !== null) {
                dateChanged = true;
            }

            if (
                'date_range' in tableUrl &&
                'start' in prev &&
                (dateRange.start !== prev.start || dateRange.end !== prev.end)
            ) {
                dateChanged = true;
            }

            // search
            if (debouncedSearchValue !== prev?.search) {
                searchChanged = true;
            }

            const prevFilter = 'filter' in prev ? JSON.parse(prev?.filter) : {};

            const checkFilterChanged = () => {
                if (
                    'filter' in prev &&
                    Object.keys(filter).length !== Object.keys(prevFilter).length
                ) {
                    filterChanged = true;
                    return;
                }

                Object.keys(filter).every((key, index) => {
                    if ('filter' in prev && key in prevFilter) {
                        if (filter[key].length !== prevFilter[key].length) {
                            filterChanged = true;
                            return;
                        } else {
                            filterChanged = filter[key].every((val, index) => {
                                prevFilter[key].includes((prev_val) => val === prev_val);
                            });
                            return;
                        }
                    } else {
                        filterChanged = true;
                        return;
                    }
                });
            };

            // filter changed
            if ('filter' in prev && Object.keys(prevFilter).length > 0) {
                checkFilterChanged();
            } else if ('filter' in prev === false && Object.keys(filter).length > 0) {
                filterChanged = true;
            }

            const search =
                totalRecords <= 0 &&
                debouncedSearchValue?.length > prev?.search?.length &&
                searchChanged &&
                !dateChanged &&
                !filterChanged;

            return {
                ...(search ? { ...prev } : { search: debouncedSearchValue }),
                sort_direction: sorting[0]?.desc
                    ? 'desc'
                    : sorting?.[0]?.desc === false
                      ? 'asc'
                      : '',
                page: currentPage,
                limit: perPage,
                ...(Object.keys(filter).length !== 0 && { filter: JSON.stringify(filter) }),
                orgId: orgId,
                sort_column: sorting[0]?.id,
                ...(decrypytActiveRole?.includes('org') && {
                    orgId: orgId,
                }),
                ...(status ? status : ''),
                ...('date_range' in tableUrl &&
                    tableUrl?.date_range && {
                        start: startDate,
                        end: endDate,
                    }),
            };
        });
    }, [
        debouncedSearchValue,
        selectedFilters,
        sorting,
        currentPage,
        perPage,
        filter,
        status,
        // dateRange,
        endDate,
    ]);

    // const totalCount = data?.pagination?.total || 0;

    // const editApiData = useMemo(() => {
    //     return {
    //         url: `${tableHeader?.find((val) => val?.label === 'Actions')?.actions?.find((val) => val.button === 'edit')?.api}/${editableRowId ?? ''}`,
    //         invalidateQuery: tableHeader
    //             ?.find((val) => val?.label === 'Actions')
    //             ?.actions?.find((val) => val.button === 'edit')?.invalidateQuery,
    //     };
    // }, [tableHeader, editableRowId]);

    // const deleteApiData = useMemo(() => {
    //     return {
    //         url: `${tableHeader?.find((val) => val?.label === 'Actions')?.actions?.find((val) => val.button === 'delete')?.api}/${deleteRowId ?? ''}/${orgId}`,
    //         invalidateQuery: tableHeader
    //             ?.find((val) => val?.label === 'Actions')
    //             ?.actions?.find((val) => val?.button === 'delete')?.invalidateQuery,
    //     };
    // }, [tableHeader, deleteRowId]);

    // const {
    //     mutate,
    //     isPending: editPending,
    //     error: editFormErrors,
    //     isSuccess: editFormSuccess,
    // } = useDynamicQuery({
    //     type: 'post',
    //     ...editApiData,
    // });

    // const {
    //     mutate: deleteMutate,
    //     isPending: deletePending,
    //     isError: deleteError,
    // } = useDynamicQuery({
    //     type: 'delete',
    //     ...deleteApiData,
    // });

    // const handleCancel = () => {
    //     setEditableRowId(null);
    // };

    // const resetDelete = () => {
    //     deleteRowId && setDeleteRowId(null);
    //     isModalOpen && setIsModalOpen(false);
    // };

    // const handleDelete = (id) => {
    //     setIsModalOpen(true);
    //     setDeleteRowId(id);
    // };

    // const handleResend = (id) => {
    //     setIsModalOpen(true);
    //     setDeleteRowId(id);
    // };

    // if (deleteError) {
    //     resetDelete();
    // }

    // const deleteAPIHandle = async () => {
    //     try {
    //         await deleteMutate();
    //     } catch (error) {
    //         console.log('delete error : ', error);
    //     } finally {
    //         resetDelete();
    //     }
    // };

    // const deleteButtons = [
    //     {
    //         label: 'Yes',
    //         function: deleteAPIHandle,
    //     },
    //     {
    //         label: 'No',
    //         function: () => setIsModalOpen(false),
    //     },
    // ];

    const mapAdditionalParam = {
        row,
        orgId,
        routeParam,
    };

    const confirmActionModalFn = async () => {
        try {
            let params = {};

            if ('additional_api_params' in modalContent) {
                modalContent?.additional_api_params?.forEach((item) => {
                    if ('customValue' in item) {
                        params[item.name] = item.customValue(mapAdditionalParam);
                    } else if (item.bind === 'row') {
                        params[item.name] = row[item.value]; // Dynamically map item.name to row[item.name]
                    } else {
                        params[item.name] = item.value; // Return null if bind is false
                    }
                });
            }

            await dynamicMutate(params);
        } catch (error) {
            console.log('delete error : ', error);
        } finally {
            // resetDelete();
        }
    };

    const cancelActionModalFn = () => {
        setIsModalOpen(false);
        setRow('');
        setModalContent(null);
    };

    const actionModalButtons = [
        {
            label: 'No',
            function: cancelActionModalFn,
            varient: 'secondary',
        },
        {
            label: 'Yes',
            function: confirmActionModalFn,
            varient: 'primary',
        },
    ];

    // const handleEdit = (row) => {
    //     // console.log('row:', row);
    //     const apiParam = {};
    //     setEditableRowId(row.id);
    //     tableHeader.forEach((element) => {
    //         if (element.editDetails.type === 'dropdown') {
    //             apiParam[`${element.editDetails.client_name}_label`] = row[element.backend_name];
    //             apiParam[element.editDetails.client_name] = row[element.value_backend_name];
    //         } else if (element.editDetails.type === 'multi_select_dropdown') {
    //             apiParam[element.editDetails.client_name] = [];
    //         } else {
    //             apiParam[element?.editDetails?.client_name] = row[element.backend_name];
    //         }
    //     });
    //     // console.log('apiParam : ',apiParam);
    //     // console.log('apiParam : ',apiParam);
    //     formikEdit.setValues(apiParam);
    //     // formikEdit.setValues((prev) => {
    //     //     return ({ ...prev, ...apiParam } = row);
    //     // });
    // };

    // const getMultiDropdownSelectedValue = (dropdownDetails) => {
    //     const { addedDetails } = dropdownDetails?.editDetails;
    //     const { editDetails } = dropdownDetails;
    //     let final_values = [];
    //     // if (!!formikEdit.values[editDetails.client_name]) {
    //     //     final_values = formikEdit.values[editDetails.client_name];
    //     // } else {

    //     // if(){

    //     // }
    //     const cachedData = queryClient.getQueryData([
    //         addedDetails?.query_name,
    //         {
    //             id: editableRowId
    //         }
    //     ]);
    //     console.log('cachedData : ', cachedData);

    //     if (cachedData && cachedData?.data?.length > 0) {
    //         let options = cachedData?.data?.map((val) => val.id);
    //         final_values = options || [];
    //     } else {
    //         final_values = [];
    //         console.log(`No data found for query: ${addedDetails?.query_name} `);
    //     }
    //     // }
    //     return final_values;
    // };

    // const editAPIHandle = async () => {
    //     const apiParam = {};
    //     tableHeader.forEach((element) => {
    //         // if (element?.editDetails?.type === 'multi_select_dropdown') {
    //         //     apiParam[element.editDetails.backend_name] = getMultiDropdownSelectedValue(element);
    //         // } else {
    //         if (element?.editDetails?.type !== 'multi_select_dropdown') {
    //             apiParam[element.editDetails.backend_name] =
    //                 params[element.editDetails.client_name];
    //         }
    //         // }
    //     });
    //     try {
    //         const response = await mutate(apiParam);
    //     } catch (error) {
    //         console.log('edit error', error);
    //     }
    //     setEditModalOpen(false);
    // };

    // const editButtons = [
    //     {
    //         label: 'Yes',
    //         function: editAPIHandle,
    //     },
    //     {
    //         label: 'No',
    //         function: () => setEditModalOpen(false),
    //     },
    // ];

    // const validationHandling = (val) => {
    //     if (val.mandatory) {
    //         if (val.type === 'dropdown') {
    //             return Yup.number()
    //                 .required(`Please select a ${val.label}`)
    //                 .nullable(false) // Allow null if no selection is made
    //                 .typeError(`${val.label} must be a number`);
    //         }
    //         // else if (val.type === 'multi_select_dropdown') {
    //         //     return Yup.array()
    //         //         .min(1, `Please select at least one ${val.label}`)
    //         //         .required(`Please select at least one ${val.label}`);
    //         // }
    //         else if (val.type !== 'multi_select_dropdown') {
    //             return Yup.string().required(`${val.label} is required!`);
    //         }
    //     }
    //     return null;
    // };

    // const editFormValues = useCallback(
    //     (type) => {
    //         return tableHeader?.reduce((acc, val) => {
    //             if (val.editable) {
    //                 if (type === 'validation') {
    //                     acc[val.editDetails.client_name] = validationHandling(val.editDetails);
    //                 } else {
    //                     let initial_value = '';
    //                     if (row?.id) {
    //                         if (val.type === 'multi_select_dropdown') {
    //                             acc[`${val.editDetails.client_name}_addTemp`] = [];
    //                         } else {
    //                             // console.log('val : ', val);

    //                             const tableEditableData = data?.data?.data?.find(
    //                                 (val) => val.id === row?.id
    //                             );
    //                             initial_value = tableEditableData?.[val.editDetails.backend_name];
    //                             if (val.editDetails.type === 'dropdown') {
    //                                 acc[`${val.editDetails.client_name}_label`] =
    //                                     tableEditableData[val.backend_name];
    //                             }
    //                         }
    //                     }
    //                     acc[val.editDetails.client_name] = initial_value;
    //                 }
    //             }
    //             // console.log('acc in editFormValues: ',acc);

    //             return acc;
    //         }, {});
    //     },
    //     [row?.id]
    // );

    // const formikEdit = useFormik({
    //     initialValues: editFormValues(''),
    //     enableReinitialize: true,
    //     validationSchema: Yup.object(editFormValues('validation')),
    //     onSubmit: async (values) => {
    //         setEditModalOpen(true);
    //         setParams(values);
    //     },
    // });

    const navigateToOrgUsers = (id, name) => {
        navigate(`/organization/users/${id}`, { state: name });
    };

    const mapActionFun = {
        routeParam,
        handleActionModal,
        data,
        navigateToOrgUsers,
        decrypytUserData,
        decrypytActiveRole,
        decrypytOrgData,
        searchVal: queryParams?.search,
        getSelectedTab,
    };

    const columns = React.useMemo(() => {
        const dynamicBind = tableHeader.map((item) => {
            return {
                accessorKey: `${item.backend_name}`,
                ...(!item.backend_name && {
                    id: `${item.label}`,
                }),
                header: ({ table }) => {
                    return 'headerCustomRender' in item ? (
                        item.headerCustomRender(table)
                    ) : (
                        <span
                            className={`${item.label === 'Organizations' || item.label === 'Vulnerabilities' ? 'cus-count-header' : ''}`}>
                            {item.label}
                        </span>
                    );
                },
                enableSorting: item.enableSorting && totalRecords > 0,
                cell: ({ row, cell }) => {
                    if (item.customRender) {
                        return item.customRender(row, cell, mapActionFun);
                    }
                    const cellValue = cell.renderValue();
                    return queryParams.search && item.searchable ? (
                        <Highlighter searchVal={queryParams.search} text={cellValue} />
                    ) : (
                        <span>{cellValue}</span>
                    );
                },
            };
        });

        return dynamicBind;
    }, [
        tableHeader,
        // setEditableRowId,
        // editableRowId,
        data?.pagination?.from,
        queryParams.search,
        // formikEdit?.dirty,
        // editPending,
        data,
        mapActionFun,
    ]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
        // setGoToPage('');
    };

    // const handleGoToPageChange = (page) => {
    //     setCurrentPage(page);
    // };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when perPage changes
        setGoToPage('');
    };

    const table = useReactTable({
        data: data?.data?.data ?? tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        initialState: {
            pageIndex: currentPage,
            pageSize: rowsPerPage,
            ...('hideColumns' in tableUrl && {
                columnVisibility: tableUrl.hideColumns(mapActionFun),
            }),
        },
        ...(tableUrl?.canSort &&
            totalRecords > 0 && {
                state: {
                    sorting,
                },
            }),
        ...(tableUrl?.canSort &&
            totalRecords > 0 && {
                manualSorting: true,
            }),
        ...(tableUrl?.canSort &&
            totalRecords > 0 && {
                onSortingChange: setSorting,
            }),
        ...(tableUrl?.canExpand && {
            getSubRows: (row) => row?.activity_logs || [],
        }),
        ...(tableUrl?.canExpand && {
            getExpandedRowModel: getExpandedRowModel(),
        }),
        // ...(tableUrl?.canSort &&
        //     totalRecords > 0 && {
        //         enableSortingRemoval: false,
        //     }),
        ...(tableUrl?.rowselect && {
            enableRowSelection: true,
        }),
    });

    // edit form start
    // const textFieldValue = (val) => {
    //     return formikEdit.values[val.editDetails.client_name];
    // };

    // const textFieldDisable = (val) => {
    //     return false;
    // };

    // const dropDownValue = useCallback(
    //     (val) => {
    //         // const editableTableData = data?.data?.find(tableData => tableData.id === editableRowId);
    //         return (
    //             {
    //                 value: formikEdit.values[val?.editDetails?.client_name],
    //                 label: formikEdit.values[`${val.editDetails.client_name}_label`],
    //             } || {}
    //         );
    //         // return formikEdit.values[val.editDetails.client_name];
    //     },
    //     [formikEdit.values]
    // );

    // useEffect(() => {
    //     if (editFormSuccess) {
    //         setEditableRowId(null);
    //         // tableRefetch();
    //         formikEdit.resetForm();
    //     }
    // }, [editFormSuccess]);

    // const cancelMultiSelectDropDown = () => {
    //     setEditMultiDropDownModal({
    //         name: null,
    //         type: 'add',
    //         id: null,
    //     });
    // };

    // const cancelAddCAModal = () => {
    //     formikEdit.setFieldValue(`${editMultiDropDownModal?.name}_addTemp`, []);
    //     setEditMultiDropDownModal({
    //         name: null,
    //         type: 'add',
    //         id: null,
    //     });
    // };

    useEffect(() => {
        if (dynamicSuccess) {
            // if (editMultiDropDownModal?.type === 'add') {
            //     cancelAddCAModal();
            // }

            if (modalContent?.type === 'modal') {
                cancelActionModalFn();
            }
        }
    }, [dynamicSuccess]);

    useEffect(() => {
        if (dynamicError) {
            if (modalContent?.type === 'modal') {
                cancelActionModalFn();
            }
        }
    }, [dynamicError]);

    // useEffect(() => {

    //     if (editFormErrors) {
    //         setEditableRowId(null);
    //         formikEdit.resetForm();
    //     }

    // }, [editFormErrors]);

    // if (editFormErrors) {
    //     const errors = editFormErrors.response?.data?.errors || {};
    //     if (Object.keys(errors).length > 0) {
    //         const formikErrors = {};
    //         tableHeader.forEach((element) => {
    //             formikErrors[element.editDetails.backend_name] =
    //                 errors[element.editDetails.client_name];
    //         });
    //         if (Object.keys(formikErrors).length > 0) {
    //             formikEdit.setErrors(formikErrors);
    //         }
    //     }
    // }

    // const editableCell = (cell) => {
    //     const result = tableHeader.find((header) => {
    //         if (header?.backend_name === cell.column.id) {
    //             if (header?.edit_condition_field) {
    //                 // console.log('!!cell.row.original[header?.edit_condition_field] : ',!!cell.row.original[header?.edit_condition_field]);
    //                 // console.log('{ ...header, editable: false } : ',{ ...header, editable: false });

    //                 if (!!cell.row.original[header?.edit_condition_field]) {
    //                     header.editable = false;
    //                 } else {
    //                     header.editable = true;
    //                 }
    //             }
    //             return header;
    //         }
    //     });
    //     return result || {};
    // };

    // const selectChange = (selected = {}, val = {}) => {
    //     if (val.type === 'multi_select_dropdown') {
    //         let param_name = 'auditor_id';
    //         if (editMultiDropDownModal?.name === 'coder') {
    //             param_name = 'coder_id';
    //         }

    //         dynamicMutate({
    //             [param_name]: formikEdit.values[`${editMultiDropDownModal?.name}_addTemp`],
    //         });

    //         // const { addedDetails } = val;
    //         // const cachedData = queryClient.getQueryData([
    //         //     addedDetails?.query_name,
    //         //     {
    //         //         id: editableRowId
    //         //     }
    //         // ]);
    //         // console.log('cachedData : ', cachedData);
    //         // let final_values = [];
    //         // if (cachedData && cachedData?.data?.length > 0) {
    //         //     let options = cachedData?.data
    //         //         ?.map((val) => val.id)
    //         //         .concat(formikEdit.values[`${editMultiDropDownModal?.name}_addTemp`]);
    //         //     final_values = options || [];
    //         // } else {
    //         //     final_values = [];
    //         //     console.log(`No data found for query: ${addedDetails?.query_name} `);
    //         // }

    //         // formikEdit.setFieldValue(`${editMultiDropDownModal?.name}`, final_values);

    //         // formikEdit.setFieldValue(
    //         //     `${val.client_name}`,
    //         //     selected ? selected.map((selected_val) => selected_val.value) : []
    //         // );
    //     } else {
    //         formikEdit.setFieldValue(`${val.client_name}`, selected ? selected.value : '');
    //         formikEdit.setFieldValue(`${val.client_name}_label`, selected ? selected.label : '');

    //         setTimeout(() => {
    //             formikEdit.validateField(val.client_name);
    //         }, 5);
    //     }
    // };

    // const submitAddCAModal = () => {
    //     formikEdit.setFieldValue(
    //         `${editMultiDropDownModal?.name}`,
    //         formikEdit.values[`${editMultiDropDownModal?.name}_addTemp`] ? selected.map((val) => val.value) : []
    //     );
    // }

    // const CAAddModalButtons = [
    //     {
    //         label: 'Submit',
    //         function: () =>
    //             selectChange(
    //                 {},
    //                 getDetailsFromTableHeader(editMultiDropDownModal?.name, 'client_name')
    //                     ?.editDetails
    //             ),
    //         disable: formikEdit?.values[`${editMultiDropDownModal?.name}_addTemp`]?.length <= 0,
    //     },
    //     {
    //         label: 'Cancel',
    //         function: cancelAddCAModal,
    //     },
    // ];

    // const singleSelectDropdown = useCallback(
    //     (val) => {
    //         return (
    //             <MultiSelectDropdown
    //                 dropdownDetails={val.editDetails}
    //                 selectChange={selectChange}
    //                 dropdownValue={dropDownValue(val)}
    //                 // editID={editableRowId}
    //             />
    //         );
    //     },
    //     [editableRowId, formikEdit]
    // );

    // const editableComp = (row) => {
    //     return (
    //         <tr>
    //             {row.getVisibleCells().map((cell, index) => (
    //                 <td key={`${from}-${cell.id}-${index}`}>
    //                     {editableCell(cell).editable &&
    //                     editableCell(cell).editDetails.type !== 'multi_select_dropdown' ? (
    //                         <>
    //                             {editableCell(cell).editDetails.type == 'dropdown' ? (
    //                                 singleSelectDropdown(editableCell(cell))
    //                             ) : (
    //                                 <input
    //                                     type={editableCell(cell).editDetails.type}
    //                                     className={`block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 ${
    //                                         formikEdit.touched[
    //                                             editableCell(cell).editDetails.client_name
    //                                         ] &&
    //                                         formikEdit.errors[
    //                                             editableCell(cell).editDetails.client_name
    //                                         ]
    //                                             ? 'border-rose-600'
    //                                             : 'border-gray-300'
    //                                     } appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-400 focus:outline-none focus:ring-0 focus:border-blue-400 peer`}
    //                                     name={editableCell(cell).editDetails.client_name}
    //                                     onChange={formikEdit.handleChange}
    //                                     onBlur={formikEdit.handleBlur}
    //                                     value={textFieldValue(editableCell(cell))}
    //                                     disabled={textFieldDisable(editableCell(cell))}
    //                                     placeholder={editableCell(cell).editDetails.placeholder}
    //                                 />
    //                             )}

    //                             {formikEdit.errors[editableCell(cell).editDetails.client_name] ? (
    //                                 <div className="text-rose-600 mt-3 text-xs">
    //                                     {
    //                                         formikEdit.errors[
    //                                             editableCell(cell).editDetails.client_name
    //                                         ]
    //                                     }
    //                                 </div>
    //                             ) : (
    //                                 <div className="text-rose-600 mt-3 text-xs invisible">
    //                                     <p>Invisible error</p>
    //                                 </div>
    //                             )}
    //                         </>
    //                     ) : (
    //                         <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
    //                     )}
    //                 </td>
    //             ))}
    //         </tr>
    //     );
    // };

    useEffect(() => {
        table.resetRowSelection();
    }, [from]);

    const getFormModalTitle = (from) => {
        return formAPIData.find((val) => val[from])?.[from]?.header_details['header'];
    };

    return (
        <div>
            <TableHeader
                from={from}
                filter={filter}
                setFilter={setFilter}
                table={table}
                setDateRange={setDateRange}
                status={status}
                startDate={startDate}
                endDate={endDate}
            />
            <div className="table-section">
                <div className="table-br">
                    <table className="table" border="1">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={`${from}-${headerGroup.id}-headerRowId`}>
                                    {headerGroup.headers.map((header, index) => {
                                        return (
                                            <th
                                                key={`${from}-${index}`}
                                                colSpan={header.colSpan}
                                                className={`px-6 py-2`}>
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={
                                                            header.column.getCanSort()
                                                                ? 'cursor-pointer'
                                                                : ''
                                                        }
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key === 'Enter' ||
                                                                e.key === ' '
                                                            ) {
                                                                header.column.getToggleSortingHandler()();
                                                            }
                                                        }}>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}

                                                        {/* Sorting Icons */}
                                                        {
                                                            header.column.columnDef.enableSorting &&
                                                                ({
                                                                    asc: <IoCaretUpOutline />,
                                                                    desc: <IoCaretDownOutline />,
                                                                }[header.column.getIsSorted()] ?? (
                                                                    <img
                                                                        className="sorrt-icons"
                                                                        src="/images/sorticon.svg"
                                                                        alt="sort icon"
                                                                    />
                                                                ))
                                                            //   'test'
                                                        }
                                                    </div>
                                                )}
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>

                        <tbody className="overflow-y-auto max-h-80">
                            {tablePending &&
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={`${from}-skeleton-${index}-row`}>
                                        {table.getAllColumns().map((cell, cell_ind) => (
                                            <td
                                                className="px-6 py-2"
                                                key={`${from}-skeleton-${cell.id}-cell-${cell_ind}-${index}`}>
                                                <Skeleton />
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                            {table.getRowModel().rows.map((rowval) => {
                                // const isEditable =
                                //     row?.id === rowval.original.id &&
                                //     modalContent?.type === 'inlineEdit';

                                return (
                                    <Fragment key={`${from}-${rowval.id}-fragment`}>
                                        {/* {isEditable ? (
                                            editableComp(rowval)
                                        ) : ( */}
                                        <tr key={`${from}-${rowval.id}-row`}>
                                            {rowval.getVisibleCells().map((cell, index) => {
                                                return (
                                                    <td
                                                        className={`px-6 py-2`}
                                                        key={`${from}-${cell.id}-cell-${index}`}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                        {/* )} */}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                    {(data?.data?.data?.length <= 0 || tableStatus === 'error') && <NoData />}
                </div>
            </div>
            <div className="d-flex justify-content-end align-items-center pagination-pos">
                {data?.data?.meta?.total > 0 && (
                    <>
                        <Pagination
                            totalPage={totalPage}
                            totalRecords={totalRecords}
                            perPage={perPage}
                            showingEntries={showingEntries}
                            currentPage={currentPage}
                            goToPage={goToPage}
                            setGoToPage={setGoToPage}
                            onPageChange={handlePageChange}
                            onPerPageChange={handlePerPageChange}
                            // onGoToPageChange={handleGoToPageChange}
                        />
                    </>
                )}
            </div>
            {isModalOpen && (
                <ModalComp
                    isOpen={isModalOpen}
                    title={modalContent?.modal_details?.title || ''}
                    buttons={'showModalButtons' in modalContent ? [] : actionModalButtons}
                    closeFn={cancelActionModalFn}>
                    {modalContent?.modal_details?.label && (
                        <p>{modalContent?.modal_details?.label}</p>
                    )}
                    {'customRender' in modalContent && modalContent?.customRender(row)}
                </ModalComp>
            )}

            {openFormModal === modalContent?.from && (
                <ModalComp
                    isOpen={openFormModal === modalContent?.from}
                    title={getFormModalTitle(modalContent?.from)}
                    content={{
                        comp: modalContent?.comp,
                        from: modalContent?.from,
                        row: row,
                    }}></ModalComp>
            )}
        </div>
    );
};

export default React.memo(TableComp);

TableComp.propTypes = {
    from: PropTypes.string.isRequired,
};
