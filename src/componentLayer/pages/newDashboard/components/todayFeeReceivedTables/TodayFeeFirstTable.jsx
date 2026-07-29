import React, { useMemo } from "react";
import CustomTable from "../../../../../utils/CustomTable"; // adjust path if needed

const TodayFeeFirstTable = ({
  activeBranchTodayFeeRecevied,
  handleBranchTodayFeeRecevied,
  todayFeeBranchesList = [],
  todayFeeBranchLoading
}) => {
  /* =========================
     DATA + TOTAL ROW
  ========================= */
  const tableData = useMemo(() => {
    if (!todayFeeBranchesList || todayFeeBranchesList.length === 0) return [];

    const totalFeeReceived = todayFeeBranchesList.reduce(
      (acc, item) => acc + (item.feeReceived || 0),
      0
    );

    const totalFeeYetToReceive = todayFeeBranchesList.reduce(
      (acc, item) => acc + (item.feeYetToReceive || 0),
      0
    );

    return [
      ...todayFeeBranchesList,
      {
        isTotal: true,
        branch: "Total",
        feeReceived: totalFeeReceived,
        feeYetToReceive: totalFeeYetToReceive
      }
    ];
  }, [todayFeeBranchesList]);

  /* =========================
     COLUMNS
  ========================= */
  const columns = useMemo(
    () => [
      {
        id: "sno",
        header: "S.No",
        sortable: false,
        hideable: false,
        accessor: (row, index) => (row.isTotal ? "#" : index + 1)
      },
      {
        id: "branch",
        header: "Branch",
        sortable: true,
        hideable: true,
        accessor: (row) =>
          row.isTotal ? (
            <span className="fw-600">Total</span>
          ) : (
            <span
              className="fs-13 black_300 lh-xs"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleBranchTodayFeeRecevied(row?.branchId)
              }
            >
              {row?.branch}
            </span>
          )
      },
      {
        id: "feeReceived",
        header: "Fee Received",
        sortable: true,
        hideable: true,
        accessor: (row) =>
          row?.feeReceived?.toLocaleString("en-IN") || "0"
      },
      {
        id: "feeYetToReceive",
        header: "Fee Yet To Receive",
        sortable: true,
        hideable: true,
        accessor: (row) =>
          row?.feeYetToReceive?.toLocaleString("en-IN") || "0"
      }
    ],
    [handleBranchTodayFeeRecevied]
  );

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h6>Today Fee Received In Branches</h6>
          </div>

          <div className="card-body">
            {todayFeeBranchLoading ? (
              <div className="fs-13 black_300">Loading...</div>
            ) : (
              <CustomTable
                data={tableData}
                columns={columns}
                enableColumnToggle={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodayFeeFirstTable;























// import React from 'react'

// const TodayFeeFirstTable = ({
//     activeBranchTodayFeeRecevied,
//     handleBranchTodayFeeRecevied,
//     todayFeeBranchesList,
//     todayFeeBranchLoading
// }) => {
//     return (
//         <div div className="row" >
//             <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
//                 <div className="card">
//                     <div className="card-header">
//                         <h6>Today Fee Received In Branches</h6>
//                         <div className="card-body">
//                             <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
//                                 <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover ">
//                                     <thead>
//                                         <tr className="">
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs fw-600 "
//                                             >
//                                                 S.No
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs fw-600 "
//                                             >
//                                                 Branch
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs  fw-600  text-truncate"
//                                             >
//                                                 Fee Received
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs  fw-600 text-truncate"
//                                             >
//                                                 Fee Yet To Receive
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {(() => {
//                                             if (todayFeeBranchLoading) {
//                                                 return (
//                                                     <tr>
//                                                         <td
//                                                             colSpan="6"
//                                                             className="fs-13 black_300 fw-500 lh-xs bg_light"
//                                                         >
//                                                             Loading...
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             }

//                                             if (
//                                                 todayFeeBranchesList &&
//                                                 todayFeeBranchesList.length > 0
//                                             ) {
//                                                 const totalFeeReceived =
//                                                     todayFeeBranchesList.reduce(
//                                                         (acc, branch) =>
//                                                             acc + (branch.feeReceived || 0),
//                                                         0
//                                                     );
//                                                 const totalFeeYetToReceive =
//                                                     todayFeeBranchesList.reduce(
//                                                         (acc, branch) =>
//                                                             acc +
//                                                             (branch.feeYetToReceive || 0),
//                                                         0
//                                                     );

//                                                 return (
//                                                     <>
//                                                         {todayFeeBranchesList.map(
//                                                             (item, index) => (
//                                                                 <tr
//                                                                     className={
//                                                                         activeBranchTodayFeeRecevied ===
//                                                                             item.branch
//                                                                             ? "table-active"
//                                                                             : ""
//                                                                     }
//                                                                     key={index}
//                                                                 >
//                                                                     <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                                                                         {index + 1}
//                                                                     </td>
//                                                                     <td
//                                                                         className="fs-13 black_300  lh-xs bg_light"
//                                                                         style={{
//                                                                             cursor: "pointer",
//                                                                         }}
//                                                                         onClick={() =>
//                                                                             handleBranchTodayFeeRecevied(
//                                                                                 item?.branchId
//                                                                             )
//                                                                         }
//                                                                     >
//                                                                         {item?.branch}
//                                                                     </td>
//                                                                     <td className="fs-13 black_300  lh-xs bg_light">
//                                                                         {item?.feeReceived?.toLocaleString(
//                                                                             "en-IN"
//                                                                         )}
//                                                                     </td>
//                                                                     <td className="fs-13 black_300  lh-xs bg_light">
//                                                                         {item?.feeYetToReceive?.toLocaleString(
//                                                                             "en-IN"
//                                                                         )}
//                                                                     </td>
//                                                                 </tr>
//                                                             )
//                                                         )}

//                                                         {/* Totals Row */}
//                                                         <tr className="table-active ">
//                                                             <td className="fs-13 black_300 fw-500 lh-xs bg_light">
//                                                                 #
//                                                             </td>
//                                                             <td className="fs-13 black_300 lh-xs bg_light">
//                                                                 Total
//                                                             </td>

//                                                             <td className="fs-13 black_300 lh-xs bg_light">
//                                                                 {totalFeeReceived.toLocaleString(
//                                                                     "en-IN"
//                                                                 )}
//                                                             </td>
//                                                             <td className="fs-13 black_300 lh-xs bg_light">
//                                                                 {totalFeeYetToReceive.toLocaleString(
//                                                                     "en-IN"
//                                                                 )}
//                                                             </td>
//                                                         </tr>
//                                                     </>
//                                                 );
//                                             }

//                                             // No data condition
//                                             return (
//                                                 <tr>
//                                                     <td
//                                                         colSpan="6"
//                                                         className="fs-13 black_300 fw-500 lh-xs bg_light"
//                                                     >
//                                                         No data
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })()}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div >
//     )
// }

// export default TodayFeeFirstTable