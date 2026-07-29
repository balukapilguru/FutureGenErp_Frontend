import React, { useMemo } from "react";
import CustomTable from "../../../../../utils/CustomTable";

const TotalEnrollmentsStudentTable = ({
    councellerWiseStudentsDetails = [],
    studentLoading
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
                id: "studentName",
                header: "Student Name",
                sortable: true,
                hideable: false,
                accessor: (row) => (
                    <span
                        className="text-truncate d-inline-block"
                        style={{ maxWidth: "150px" }}
                        title={row?.name}
                    >
                        {row?.name}
                    </span>
                )
            },
            {
                id: "course",
                header: "Course",
                accessor: "course",
                sortable: true,
                hideable: false,
            },
            {
                id: "admissionDate",
                header: "Admission Date",
                accessor: "admissiondate",
                sortable: true,
                hideable: false,
            },
            {
                id: "bookingAmount",
                header: "Booking Amount",
                sortable: true,
                hideable: false,
                accessor: (row) =>
                    row?.finalTotal?.toLocaleString("en-IN") || "0"
            },
            {
                id: "paidFee",
                header: "Paid Fee",
                sortable: true,
                hideable: false,
                accessor: (row) =>
                    row?.totalPaidAmount?.toLocaleString("en-IN") || "0"
            },
            {
                id: "dueAmount",
                header: "Fee Yet To Receive",
                sortable: true,
                hideable: false,
                accessor: (row) =>
                    row?.dueAmount?.toLocaleString("en-IN") || "0"
            }
        ],
        []
    );

    return (
        <div className="row">
            <div className="col-12">
                <div
                    className="card scrollspy-example"
                    data-bs-spy="scroll"
                    data-bs-target="#navbar-example2"
                    data-bs-offset="70"
                    tabIndex="0"
                >
                    <div className="card-header">
                        <h6>Student Details</h6>
                    </div>

                    <div className="card-body">
                        {studentLoading ? (
                            <div className="text-center fs-13">Loading...</div>
                        ) : (
                            <CustomTable
                                data={councellerWiseStudentsDetails}
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

export default TotalEnrollmentsStudentTable;

























// import React from 'react'

// const TotalEnrollmentsStudentTable = ({councellerWiseStudentsDetails,studentLoading}) => {
//     return (
//         <div className="row">
//             <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
//                 <div
//                     className="card scrollspy-example"
//                     data-bs-spy="scroll"
//                     data-bs-target="#navbar-example2"
//                     data-bs-offset="70"
//                     tabIndex="0"
//                 >
//                     <div className="card-header">
//                         <h6>Student Details</h6>
//                         <div className="card-body">
//                             <div className="table-responsive dashboard-tables table-scroll table-card border-0">
//                                 <table className="table table-hover table-centered align-middle table-nowrap equal-cell-table  table-hover">
//                                     {" "}
//                                     <thead>
//                                         <tr className="" id="scrollspyHeading">
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs fw-600 "
//                                             >
//                                                 S.No
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs fw-600"
//                                                 style={{ maxWidth: "100px" }}
//                                                 title=" Student Name"
//                                             >
//                                                 Student Name
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs fw-600 text-truncate "
//                                                 style={{ maxWidth: "100px" }}
//                                                 title=" course"
//                                             >
//                                                 Course
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs fw-600 text-truncate "
//                                                 style={{ maxWidth: "100px" }}
//                                                 title=" Admission Date"
//                                             >
//                                                 Admission Date
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs fw-600 text-truncate "
//                                                 style={{ maxWidth: "100px" }}
//                                                 title=" Booking Amount"
//                                             >
//                                                 Booking Amount
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs fw-600 text-truncate "
//                                                 style={{ maxWidth: "100px" }}
//                                                 title=" Paid Fee"
//                                             >
//                                                 Paid Fee
//                                             </th>
//                                             <th
//                                                 scope="col"
//                                                 className="fs-13 lh-xs fw-600 text-truncate "
//                                                 style={{ maxWidth: "100px" }}
//                                                 title=" Fee Yet to Recieved"
//                                             >
//                                                 Fee Yet To Receive
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {councellerWiseStudentsDetails &&
//                                             councellerWiseStudentsDetails?.length > 0 ? (
//                                             studentLoading ? (
//                                                 <tr>
//                                                     <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                                                         Loading...
//                                                     </td>
//                                                 </tr>
//                                             ) : (
//                                                 councellerWiseStudentsDetails.map(
//                                                     (item, index) => {
//                                                         return (
//                                                             <tr key={index}>
//                                                                 <td className="fs-13 black_300  lh-xs bg_light ">
//                                                                     {index + 1}
//                                                                 </td>
//                                                                 <td
//                                                                     className="fs-13 black_300  lh-xs bg_light text-truncate"
//                                                                     style={{ maxWidth: "150px" }}
//                                                                 >
//                                                                     {item?.name}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300  lh-xs bg_light">
//                                                                     {item?.course}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300  lh-xs bg_light">
//                                                                     {item?.admissiondate}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300  lh-xs bg_light">
//                                                                     {item?.finalTotal?.toLocaleString(
//                                                                         "en-IN"
//                                                                     )}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300  lh-xs bg_light">
//                                                                     {item?.totalPaidAmount?.toLocaleString(
//                                                                         "en-IN"
//                                                                     )}
//                                                                 </td>
//                                                                 <td className="fs-13 black_300  lh-xs bg_light">
//                                                                     {item?.dueAmount?.toLocaleString(
//                                                                         "en-IN"
//                                                                     )}
//                                                                 </td>
//                                                             </tr>
//                                                         );
//                                                     }
//                                                 )
//                                             )
//                                         ) : (
//                                             <tr>
//                                                 <td className="fs-13 black_300  lh-xs bg_light">
//                                                     No data
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default TotalEnrollmentsStudentTable
