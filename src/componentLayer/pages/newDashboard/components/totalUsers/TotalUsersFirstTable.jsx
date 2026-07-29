import React from 'react'

const TotalUsersFirstTable = ({
    activeUsersInTotalUsers,
    handleBranchSubmitInUsers,
    AllBranchesTableData
}) => {
    return (
        <div className="col-lg-6 "
        style={activeUsersInTotalUsers ? { order: 1 } : {}}
        >
            <div className="card">
                <div className="card-header">
                    <div className="card-body">
                        <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                            <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                <thead>
                                    <tr className="">
                                        <th
                                            scope="col"
                                            className="fs-13 lh-xs fw-600 "
                                        >
                                            S.No
                                        </th>
                                        <th
                                            scope="col"
                                            className="fs-13 lh-xs  fw-600  "
                                        >
                                            Branch
                                        </th>
                                        <th
                                            scope="col"
                                            className="fs-13 lh-xs  fw-600  "
                                        >
                                            Users Count
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AllBranchesTableData &&
                                        AllBranchesTableData
                                            .length > 0 ? (
                                        // TotalUsersInDashboad?.loading ? (
                                        //     <tr>
                                        //         <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                        //             Loading...
                                        //         </td>
                                        //     </tr>
                                        // ) : (
                                        AllBranchesTableData.map(
                                            (item, index) => {
                                                const branch = item?.branchId;

                                                return (
                                                    <tr
                                                        key={index}
                                                        className={
                                                            activeUsersInTotalUsers ===
                                                                item?.branch
                                                                ? "table-active"
                                                                : ""
                                                        }
                                                    >
                                                        <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                            {index + 1}
                                                        </td>
                                                        <td
                                                            className="fs-13 black_300  lh-xs bg_light"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() =>
                                                                handleBranchSubmitInUsers(
                                                                    branch
                                                                )
                                                            }
                                                        >
                                                            {item?.branch}
                                                        </td>
                                                        <td className="fs-13 black_300  lh-xs bg_light">
                                                            {item?.users}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )
                                        // )
                                    ) : (
                                        <tr>
                                            <td className="fs-13 black_300  lh-xs bg_light">
                                                No data
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TotalUsersFirstTable
