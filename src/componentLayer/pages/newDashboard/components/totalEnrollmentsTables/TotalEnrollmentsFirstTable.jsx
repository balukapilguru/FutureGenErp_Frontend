import React, { useMemo } from "react";
import CustomTable from "../../../../../utils/CustomTable";

const TotalEnrollmentsFirstTable = ({
  enrolmentsInBranch,
  activeBranch,
  handleBranchSubmit,
  filterDatesTotalEnrollments
}) => {
  /* =========================
     Prepare data with totals
  ========================= */
  const dataWithTotals = useMemo(() => {
    if (!enrolmentsInBranch || enrolmentsInBranch.length === 0) return [];

    // Copy the original data
    const data = [...enrolmentsInBranch];

    // Calculate totals
    const totalEnrollments = enrolmentsInBranch.reduce(
      (acc, b) => acc + (b.enrollments || 0),
      0
    );
    const totalFinal = enrolmentsInBranch.reduce(
      (acc, b) => acc + (b.finalTotal || 0),
      0
    );
    const totalFeeReceived = enrolmentsInBranch.reduce(
      (acc, b) => acc + (b.feeReceived || 0),
      0
    );
    const totalFeeYetToReceive = enrolmentsInBranch.reduce(
      (acc, b) => acc + (b.feeYetToReceive || 0),
      0
    );

    // Add totals row
    data.push({
      branchId: "total",
      branch: "Total",
      enrollments: totalEnrollments,
      finalTotal: totalFinal,
      feeReceived: totalFeeReceived,
      feeYetToReceive: totalFeeYetToReceive
    });

    return data;
  }, [enrolmentsInBranch]);

  /* =========================
     Define columns
  ========================= */
  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) => index + 1
    },
    {
      id: "branch",
      header: "Branch",
      accessor: (row) => (
        <span
          className="fs-13 black_300 lh-xs "
          style={{
            cursor: row.branchId !== "total" ? "pointer" : "default",
            display: "inline-block",
            width: "100%"
          }}
          onClick={() =>
            row.branchId !== "total" &&
            handleBranchSubmit(row.branchId, filterDatesTotalEnrollments)
          }
        >
          {row.branch}
        </span>
      ),
      sortable: true
    },
    {
      id: "enrollments",
      header: "Enrollments",
      accessor: (row) => row.enrollments || 0,
      sortable: true,
      hideable: false,
    },
    {
      id: "finalTotal",
      header: "Booking Amount",
      accessor: (row) => (row.finalTotal || 0).toLocaleString("en-IN"),
      sortable: true,
      hideable: false,
    },
    {
      id: "feeReceived",
      header: "Fee Received",
      accessor: (row) => (row.feeReceived || 0).toLocaleString("en-IN"),
      sortable: true,
      hideable: false,
    },
    {
      id: "feeYetToReceive",
      header: "Fee Yet To Receive",
      accessor: (row) => (row.feeYetToReceive || 0).toLocaleString("en-IN"),
      sortable: true,
      hideable: false,
    }
  ];

  return (
    <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
      <div className="card">
        <div className="card-header">
          <h6>Enrollments In Branch</h6>
        </div>
        <div className="card-body">
          <CustomTable
            data={dataWithTotals}
            columns={columns}
            enableColumnToggle={false} // optional, keep off
          />
        </div>
      </div>
    </div>
  );
};

export default TotalEnrollmentsFirstTable;

























// import React from 'react'

// const TotalEnrollmentsFirstTable = ({
//     enrolmentsInBranch, 
//     activeBranch,
//     handleBranchSubmit,
//     filterDatesTotalEnrollments
// }) => {
//     return (
//         <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
//             <div className="card">
//                 <div className="card-header">
//                     <h6>Enrollments In Branch</h6>
//                     <div className="card-body">
//                         <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
//                             <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
//                                 <thead>
//                                     <tr className="">
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs fw-600  "
//                                         >
//                                             S.No
//                                         </th>
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs  fw-600  "
//                                         >
//                                             Branch
//                                         </th>
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs  fw-600 text-truncate"
//                                         >
//                                             Enrollments
//                                         </th>
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs  fw-600 text-truncate"
//                                         >
//                                             Booking Amount
//                                         </th>
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs fw-600  text-truncate"
//                                         >
//                                             Fee Received
//                                         </th>
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs  fw-600 text-truncate"
//                                         >
//                                             Fee Yet To Receive
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {(() => {

//                                         if (
//                                             enrolmentsInBranch && enrolmentsInBranch.length > 0
//                                         ) {
//                                             // Calculate totals
//                                             const totalEnrollments =
//                                                 enrolmentsInBranch.reduce(
//                                                     (acc, branch) =>
//                                                         acc + (branch.enrollments || 0),
//                                                     0
//                                                 );
//                                             const totalFinal =
//                                                 enrolmentsInBranch.reduce(
//                                                     (acc, branch) =>
//                                                         acc + (branch.finalTotal || 0),
//                                                     0
//                                                 );
//                                             const totalFeeReceived =
//                                                 enrolmentsInBranch.reduce(
//                                                     (acc, branch) =>
//                                                         acc + (branch.feeReceived || 0),
//                                                     0
//                                                 );
//                                             const totalFeeYetToReceive =
//                                                 enrolmentsInBranch.reduce(
//                                                     (acc, branch) =>
//                                                         acc +
//                                                         (branch.feeYetToReceive || 0),
//                                                     0
//                                                 );

//                                             return (
//                                                 <>
//                                                     {enrolmentsInBranch && enrolmentsInBranch.map(
//                                                         (item, index) => (
//                                                             <tr
//                                                                 className={
//                                                                     activeBranch ===
//                                                                         item.branchId
//                                                                         ? "table-active"
//                                                                         : ""
//                                                                 }
//                                                                 key={item.branchId || index}
//                                                             >
//                                                                 <td className="fs-13 black_300 fw-500 lh-xs bg_light">
//                                                                     {index + 1}
//                                                                 </td>
//                                                                 <td
//                                                                     className="fs-13 black_300 lh-xs bg_light"
//                                                                     style={{
//                                                                         cursor: "pointer",
//                                                                     }}
//                                                                     onClick={() =>
//                                                                         handleBranchSubmit(
//                                                                             item.branchId,filterDatesTotalEnrollments
//                                                                         )
//                                                                     }
//                                                                 >
//                                                                     {item.branch}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300 lh-xs bg_light">
//                                                                     {item.enrollments || 0}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300 lh-xs bg_light">
//                                                                     {(
//                                                                         item.finalTotal || 0
//                                                                     ).toLocaleString("en-IN")}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300 lh-xs bg_light">
//                                                                     {(
//                                                                         item.feeReceived || 0
//                                                                     ).toLocaleString("en-IN")}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300 lh-xs bg_light">
//                                                                     {(
//                                                                         item.feeYetToReceive || 0
//                                                                     ).toLocaleString("en-IN")}
//                                                                 </td>
//                                                             </tr>
//                                                         )
//                                                     )}

//                                                     {/* Totals Row */}
//                                                     <tr className="table-active ">
//                                                         <td className="fs-13 black_300 fw-500 lh-xs bg_light">
//                                                             #
//                                                         </td>
//                                                         <td className="fs-13 black_300 lh-xs bg_light">
//                                                             Total
//                                                         </td>
//                                                         <td className="fs-13 black_300 lh-xs bg_light">
//                                                             {totalEnrollments.toLocaleString(
//                                                                 "en-IN"
//                                                             )}
//                                                         </td>
//                                                         <td className="fs-13 black_300 lh-xs bg_light">
//                                                             {totalFinal.toLocaleString(
//                                                                 "en-IN"
//                                                             )}
//                                                         </td>
//                                                         <td className="fs-13 black_300 lh-xs bg_light">
//                                                             {totalFeeReceived.toLocaleString(
//                                                                 "en-IN"
//                                                             )}
//                                                         </td>
//                                                         <td className="fs-13 black_300 lh-xs bg_light">
//                                                             {totalFeeYetToReceive.toLocaleString(
//                                                                 "en-IN"
//                                                             )}
//                                                         </td>
//                                                     </tr>
//                                                 </>
//                                             );
//                                         }

//                                         // No data condition
//                                         return (
//                                             <tr>
//                                                 <td
//                                                     colSpan="6"
//                                                     className="fs-13 black_300 fw-500 lh-xs bg_light"
//                                                 >
//                                                     No data
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })()}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default TotalEnrollmentsFirstTable;