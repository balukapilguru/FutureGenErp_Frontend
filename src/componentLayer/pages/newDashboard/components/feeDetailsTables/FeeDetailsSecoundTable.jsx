import React, { useMemo } from "react";
import CustomTable from "../../../../../utils/CustomTable";

const FeeDetailsSecoundTable = ({
  secoundTableData = [],
  activeCouncellorFeeDetails,
  handleCouncellorSubmitfeeDetails
}) => {
  /* =========================
     DATA (NO TOTAL ROW HERE)
  ========================= */
  const tableData = useMemo(() => {
    return secoundTableData || [];
  }, [secoundTableData]);

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
        accessor: (_, index) => index + 1
      },
      {
        id: "counsellor",
        header: "Counsellor",
        sortable: true,
        hideable: true,
        accessor: (row) => (
          <span
            className="fs-13 black_300 lh-xs"
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleCouncellorSubmitfeeDetails(row?.user_id)
            }
          >
            {row?.enquirytakenby}
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
    [handleCouncellorSubmitfeeDetails]
  );

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h6>Fee Received By Counsellors</h6>
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

export default FeeDetailsSecoundTable;




























// import React, { useEffect } from 'react'

// const FeeDetailsSecoundTable = ({ secoundTableData, activeCouncellorFeeDetails, handleCouncellorSubmitfeeDetails }) => {
//     useEffect(() => {
//     }, [secoundTableData])
//     return (
//         <div>
//             <div>
//                 <div className="row">
//                     <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
//                         <div className="card">
//                             <div className="card-header">
//                                 <h6>Fee Received By Counsellors</h6>
//                                 <div className="card-body">
//                                     <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
//                                         <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
//                                             <thead>
//                                                 <tr className="">
//                                                     <th
//                                                         scope="col"
//                                                         className="fs-13 lh-xs fw-600  "
//                                                     >
//                                                         S.No
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="fs-13 lh-xs fw-600  "
//                                                     >
//                                                         Counsellor
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="fs-13 lh-xs fw-600 text-truncate"
//                                                     >
//                                                         Fee Received
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="fs-13 lh-xs fw-600 text-truncate"
//                                                     >
//                                                         Fee Yet To Receive
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {secoundTableData &&
//                                                     secoundTableData.length > 0 ? (
//                                                     secoundTableData?.map(
//                                                         (item, index) => {
//                                                             return (
//                                                                 <tr
//                                                                     key={index}
//                                                                     className={
//                                                                         activeCouncellorFeeDetails ===
//                                                                             item?.enquirytakenby
//                                                                             ? "table-active"
//                                                                             : ""
//                                                                     }
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
//                                                                             handleCouncellorSubmitfeeDetails(
//                                                                                 item?.user_id
//                                                                             )
//                                                                         }
//                                                                     >
//                                                                         {item?.enquirytakenby}
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
//                                                             );
//                                                         }
//                                                     )

//                                                 ) : (
//                                                     <tr>
//                                                         <td className="fs-13 black_300  lh-xs bg_light">
//                                                             no data
//                                                         </td>
//                                                     </tr>
//                                                 )}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default FeeDetailsSecoundTable