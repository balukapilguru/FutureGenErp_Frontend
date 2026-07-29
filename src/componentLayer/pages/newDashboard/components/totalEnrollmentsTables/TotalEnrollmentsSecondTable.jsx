import React, { useMemo } from "react";
import CustomTable from "../../../../../utils/CustomTable";

const TotalEnrollmentsSecondTable = ({
  enrollmentsByCouncellors = [],
  activeCouncellor,
  handleCouncellorSubmit,
  councellerLoading
}) => {
  /* =========================
     COLUMNS CONFIG
  ========================= */
  const columns = useMemo(
    () => [
      {
        id: "sno",
        header: "S.No",
        accessor: (_, index) => index + 1,
        sortable: false,
        hideable: false
      },
      {
        id: "counsellor",
        header: "Counsellors",
        sortable: true,
        hideable: true,
        accessor: (row) => (
          <span
            href="#scrollspyHeading"
            style={{ cursor: "pointer", maxWidth: "100px" }}
            title={row?.enquirytakenby}
            onClick={() => handleCouncellorSubmit(row?.user_id)}
          >
            {row?.enquirytakenby}
          </span>
        )
      },
      {
        id: "enrollments",
        header: "Enrollments",
        accessor: "enrollments",
        sortable: true,
        hideable: true
      },
      {
        id: "bookingAmount",
        header: "Booking Amount",
        sortable: true,
        hideable: true,
        accessor: (row) =>
          row?.finalTotal?.toLocaleString("en-IN") || "0"
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
        header: "Fee Yet To Received",
        sortable: true,
        hideable: true,
        accessor: (row) =>
          row?.feeYetToReceive?.toLocaleString("en-IN") || "0"
      }
    ],
    [handleCouncellorSubmit]
  );

  /* =========================
     ROW CLASS HANDLING
  ========================= */

  return (
    <div className="col-12">
      <div className="card" id="navbar-example2">
        <div className="card-header">
          <h6>Enrollments By Counsellors</h6>
        </div>

        <div className="card-body">
          {councellerLoading ? (
            <div className="text-center fs-13">Loading...</div>
          ) : (
            <CustomTable
              data={enrollmentsByCouncellors}
              columns={columns}
              enableColumnToggle={false} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalEnrollmentsSecondTable;













// import React from 'react'

// const TotalEnrollmentsSecondTable = ({enrollmentsByCouncellors, activeCouncellor, handleCouncellorSubmit, councellerLoading}) => {
//     return (

//         <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
//             <div className="card" id="navbar-example2">
//                 <div className="card-header">
//                     <h6>Enrollments By Counsellors</h6>
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
//                                             Counsellors
//                                         </th>
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs  fw-600 text-truncate"
//                                         >
//                                             Enrollments
//                                         </th>
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs  fw-600 text-truncate "
//                                             style={{ maxWidth: "100px" }}
//                                             title="  Booking Amount"
//                                         >
//                                             Booking Amount
//                                         </th>
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs  fw-600  text-truncate "
//                                             style={{ maxWidth: "100px" }}
//                                             title="   Fee Received  "
//                                         >
//                                             Fee Received
//                                         </th>
//                                         <th
//                                             scope="col"
//                                             className="fs-13 lh-xs  fw-600 text-truncate "
//                                             style={{ maxWidth: "100px" }}
//                                             title="     Fee Yet To Received  "
//                                         >
//                                             Fee Yet To Received
//                                         </th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {enrollmentsByCouncellors &&
//                                         enrollmentsByCouncellors?.length >
//                                         0 ? (
//                                         councellerLoading ? (
//                                             <tr>
//                                                 <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                                                     Loading...
//                                                 </td>
//                                             </tr>
//                                         ) : (
//                                             enrollmentsByCouncellors.map(
//                                                 (item, index) => {
//                                                     const councellerDetails =
//                                                         item?.user_id;
//                                                     return (
//                                                         <tr
//                                                             key={index}
//                                                             className={
//                                                                 activeCouncellor ===
//                                                                     item?.enquirytakenby
//                                                                     ? "table-active"
//                                                                     : ""
//                                                             }
//                                                         >
//                                                             <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                                                                 {index + 1}
//                                                             </td>
//                                                             <td
//                                                                 className="fs-13 black_300  lh-xs bg_light text-truncate"
//                                                                 style={{
//                                                                     cursor: "pointer",
//                                                                     maxWidth: "100px",
//                                                                 }}
//                                                                 title={item?.enquirytakenby}
//                                                             >
//                                                                 <a
//                                                                     href="#scrollspyHeading"
//                                                                     onClick={() =>
//                                                                         handleCouncellorSubmit(
//                                                                             councellerDetails
//                                                                         )
//                                                                     }
//                                                                 >
//                                                                     {" "}
//                                                                     {item?.enquirytakenby}
//                                                                 </a>
//                                                             </td>
//                                                             <td className="fs-13 black_300  lh-xs bg_light">
//                                                                 {item?.enrollments}
//                                                             </td>
//                                                             <td className="fs-13 black_300  lh-xs bg_light">
//                                                                 {item?.finalTotal?.toLocaleString(
//                                                                     "en-IN"
//                                                                 )}
//                                                             </td>
//                                                             <td className="fs-13 black_300  lh-xs bg_light">
//                                                                 {item?.feeReceived?.toLocaleString(
//                                                                     "en-IN"
//                                                                 )}
//                                                             </td>
//                                                             <td className="fs-13 black_300  lh-xs bg_light">
//                                                                 {item?.feeYetToReceive?.toLocaleString(
//                                                                     "en-IN"
//                                                                 )}
//                                                             </td>
//                                                         </tr>
//                                                     );
//                                                 }
//                                             )
//                                         )
//                                     ) : (
//                                         <tr>
//                                             <td className="fs-13 black_300  lh-xs bg_light">
//                                                 No data
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default TotalEnrollmentsSecondTable