import React, { useMemo } from "react";
import CustomTable from "../../../../../utils/CustomTable";

const FeeDetailFirstTable = ({
  branchData = [],
  activeBranchFeeDetails,
  handleBranchSubmitFeeDetails
}) => {
  /* =========================
     PREPARE DATA (ADD TOTAL ROW)
  ========================= */
  const tableData = useMemo(() => {
    if (!branchData || branchData.length === 0) return [];

    const totalFeeReceived = branchData.reduce(
      (acc, item) => acc + (item.feeReceived || 0),
      0
    );

    const totalFeeYetToReceive = branchData.reduce(
      (acc, item) => acc + (item.feeYetToReceive || 0),
      0
    );

    return [
      ...branchData,
      {
        branch: "Total",
        feeReceived: totalFeeReceived,
        feeYetToReceive: totalFeeYetToReceive
      }
    ];
  }, [branchData]);

  /* =========================
     COLUMNS CONFIG
  ========================= */
  const columns = useMemo(
    () => [
      {
        id: "sno",
        header: "S.No",
        accessor: (_, index) =>
          index + 1 === tableData.length ? "#" : index + 1,
        sortable: false,
        hideable: false
      },
      {
        id: "branch",
        header: "Branch",
        sortable: true,
        hideable: true,
        accessor: (row) => (
          <span
            className="fs-13 black_300 lh-xs"
            style={{
              cursor: row.branch !== "Total" ? "pointer" : "default"
            }}
            onClick={() => {
              if (row.branch !== "Total") {
                handleBranchSubmitFeeDetails(row?.branchId);
              }
            }}
          >
            {row.branch}
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
    [handleBranchSubmitFeeDetails, tableData.length]
  );

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h6>Fee Received In Branch</h6>
          </div>

          <div className="card-body">
            <CustomTable
              data={tableData}
              columns={columns}
              enableColumnToggle={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetailFirstTable;














// const FeeDetailFirstTable = ({branchData,activeBranchFeeDetails, handleBranchSubmitFeeDetails}) => {
//     return (
//         <div>
//             <div className="row">
//                 <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
//                     <div className="card">
//                         <div className="card-header">
//                             <h6>Fee Received In Branch</h6>
//                             <div className="card-body">
//                                 <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
//                                     <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover ">
//                                         <thead>
//                                             <tr className="">
//                                                 <th
//                                                     scope="col"
//                                                     className="fs-13 lh-xs fw-600 "
//                                                 >
//                                                     S.No
//                                                 </th>
//                                                 <th
//                                                     scope="col"
//                                                     className="fs-13 lh-xs fw-600 "
//                                                 >
//                                                     Branch
//                                                 </th>
//                                                 <th
//                                                     scope="col"
//                                                     className="fs-13 lh-xs  fw-600  text-truncate"
//                                                 >
//                                                     Fee Received
//                                                 </th>
//                                                 <th
//                                                     scope="col"
//                                                     className="fs-13 lh-xs  fw-600 text-truncate"
//                                                 >
//                                                     Fee Yet To Receive
//                                                 </th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {(() => {

//                                                 // if (loading) {
//                                                 //     return (
//                                                 //         <tr>
//                                                 //             <td
//                                                 //                 colSpan="6"
//                                                 //                 className="fs-13 black_300 fw-500 lh-xs bg_light"
//                                                 //             >
//                                                 //                 Loading...
//                                                 //             </td>
//                                                 //         </tr>
//                                                 //     );
//                                                 // }

//                                                 if (
//                                                     branchData &&
//                                                     branchData.length > 0
//                                                 ) {
//                                                     const totalFeeReceived =
//                                                         branchData.reduce(
//                                                             (acc, branch) =>
//                                                                 acc + (branch.feeReceived || 0),
//                                                             0
//                                                         );
//                                                     const totalFeeYetToReceive =
//                                                         branchData.reduce(
//                                                             (acc, branch) =>
//                                                                 acc +
//                                                                 (branch.feeYetToReceive || 0),
//                                                             0
//                                                         );

//                                                     return (
//                                                         <>
//                                                             {branchData.map(
//                                                                 (item, index) => (
//                                                                     <tr
//                                                                         className={
//                                                                             activeBranchFeeDetails ===
//                                                                                 item.branch
//                                                                                 ? "table-active"
//                                                                                 : ""
//                                                                         }
//                                                                         key={index}
//                                                                     >
//                                                                         <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                                                                             {index + 1}
//                                                                         </td>
//                                                                         <td
//                                                                             className="fs-13 black_300  lh-xs bg_light"
//                                                                             style={{
//                                                                                 cursor: "pointer",
//                                                                             }}
//                                                                             onClick={() =>
//                                                                                 handleBranchSubmitFeeDetails(
//                                                                                     item?.branchId
//                                                                                 )
//                                                                             }
//                                                                         >
//                                                                             {item?.branch}
//                                                                         </td>
//                                                                         <td className="fs-13 black_300  lh-xs bg_light">
//                                                                             {item?.feeReceived?.toLocaleString(
//                                                                                 "en-IN"
//                                                                             )}
//                                                                         </td>
//                                                                         <td className="fs-13 black_300  lh-xs bg_light">
//                                                                             {item?.feeYetToReceive?.toLocaleString(
//                                                                                 "en-IN"
//                                                                             )}
//                                                                         </td>
//                                                                     </tr>
//                                                                 )
//                                                             )}

//                                                             {/* Totals Row */}
//                                                             <tr className="table-active ">
//                                                                 <td className="fs-13 black_300 fw-500 lh-xs bg_light">
//                                                                     #
//                                                                 </td>
//                                                                 <td className="fs-13 black_300 lh-xs bg_light">
//                                                                     Total
//                                                                 </td>

//                                                                 <td className="fs-13 black_300 lh-xs bg_light">
//                                                                     {totalFeeReceived.toLocaleString(
//                                                                         "en-IN"
//                                                                     )}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300 lh-xs bg_light">
//                                                                     {totalFeeYetToReceive.toLocaleString(
//                                                                         "en-IN"
//                                                                     )}
//                                                                 </td>
//                                                             </tr>
//                                                         </>
//                                                     );
//                                                 }

//                                                 // No data condition
//                                                 return (
//                                                     <tr>
//                                                         <td
//                                                             colSpan="6"
//                                                             className="fs-13 black_300 fw-500 lh-xs bg_light"
//                                                         >
//                                                             No data
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })()}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default FeeDetailFirstTable