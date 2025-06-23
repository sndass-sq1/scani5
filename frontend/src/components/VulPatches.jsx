import React from 'react';
import { NoData } from '../shared/NoData';

export const VulPatches = ({ data }) => {
    return (
        <>
            <div className="tabs-table-container">
                <div className="row">
                    <div className="col-md-8 col-lg-10 col-sm-8">
                        <div className="table-section">
                            <div className="table-responsive">
                                <div className="scrollable-table">
                                    <table className="table patches-table">
                                        <thead>
                                            <tr>
                                                <th
                                                    scope="colspan=1"
                                                    className="px-6 py-2 text-center">
                                                    Vulnerability Description
                                                </th>
                                                <th
                                                    scope="colspan=1"
                                                    className="px-6 py-2 text-center">
                                                    Affected OS
                                                </th>
                                                <th
                                                    scope="colspan=1 "
                                                    className="px-6 py-2 text-center">
                                                    Complexity
                                                </th>
                                                <th
                                                    scope="colspan=1"
                                                    className="px-6 py-2 text-center">
                                                    Type
                                                </th>
                                                <th
                                                    scope="colspan=1"
                                                    className="px-6 py-2 text-center">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!data?.patches?.data?.length && (
                                                <tr>
                                                    <td colSpan={5}>
                                                        <NoData />
                                                    </td>
                                                </tr>
                                            )}
                                            {data?.patches?.data?.map((value, index) => (
                                                <tr key={index}>
                                                    <td className="text-width">
                                                        {value?.description}
                                                    </td>
                                                    <td className="text-center">
                                                        {/* <img
                                                            className="affected-os align-content-center"
                                                            src={value.os}
                                                            alt="Affected OS"
                                                        /> */}
                                                        {value?.os}
                                                    </td>
                                                    <td className="text-center ">
                                                        <button
                                                            className={`patches-complex severity-${value?.complexity}`}>
                                                            {value?.complexity}
                                                        </button>
                                                    </td>
                                                    <td className="type-table text-center">
                                                        {value?.type}
                                                    </td>
                                                    <td className="btn-action">
                                                        <button className="action-btn text-center ">
                                                            {/* {update.action} */}
                                                            patch
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-lg-2 col-sm-4">
                        <div className="table-section">
                            <div className="table-responsive">
                                <div className="scrollable-table">
                                    <table className="table CVE">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="cves px-6 py-2">
                                                    Total CVEs ({data?.cves?.length})
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {!data?.cves?.length && (
                                                <tr>
                                                    <td colSpan={1}>
                                                        <NoData />
                                                    </td>
                                                </tr>
                                            )}
                                            {data?.cves?.map((user, index) => (
                                                <tr key={index}>
                                                    <td className="CVE">
                                                        {' '}
                                                        <div className="text-center">
                                                            {user}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
