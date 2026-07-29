import React, { useMemo } from "react";
import CustomTable from "../../../../../utils/CustomTable"; // adjust path if needed

const FeeDetailsStudentTable = ({ studentData = [] }) => {
  /* =========================
     DATA
  ========================= */
  const tableData = useMemo(() => {
    return studentData || [];
  }, [studentData]);

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
        id: "studentName",
        header: "Student Name",
        sortable: true,
        hideable: true,
        accessor: (row) => (
          <span
            className="fs-13 black_300 lh-xs text-truncate d-inline-block"
            style={{ maxWidth: "150px" }}
          >
            {row?.name}
          </span>
        )
      },
      {
        id: "admissionDate",
        header: "Admission Date",
        sortable: true,
        hideable: true,
        accessor: (row) => row?.admissiondate || "-"
      },
      {
        id: "paidFee",
        header: "Paid Fee",
        sortable: true,
        hideable: true,
        accessor: (row) =>
          row?.totalpaidamount?.toLocaleString("en-IN") || "0"
      },
      {
        id: "nextDueDate",
        header: "Next Due Date",
        sortable: true,
        hideable: true,
        accessor: (row) => row?.nextduedate || "-"
      },
      {
        id: "dueAmount",
        header: "Due Amount",
        sortable: true,
        hideable: true,
        accessor: (row) =>
          row?.dueamount?.toLocaleString("en-IN") || "0"
      }
    ],
    []
  );

  /* =========================
     HIDE TABLE IF NO DATA
  ========================= */
  if (!tableData || tableData.length === 0) return null;

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h6>Student Details</h6>
          </div>

          <div className="card-body">
            <CustomTable
              data={tableData}
              columns={columns}
              enableColumnToggle={false}
              initialHiddenColumns={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetailsStudentTable;

























// import React from 'react'

// const FeeDetailsStudentTable = ({ studentData }) => {
//     return (
//         <>
//             {studentData && studentData.length > 0 && (
//                 <div className="row">
//                     <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
//                         <div className="card">
//                             <div className="card-header">
//                                 <h6>Student Details</h6>
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
//                                                         className="fs-13 lh-xs  fw-600  "
//                                                     >
//                                                         Student Name
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="fs-13 lh-xs  fw-600  "
//                                                     >
//                                                         Admission Date
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="fs-13 lh-xs  fw-600  "
//                                                     >
//                                                         Paid Fee
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="fs-13 lh-xs  fw-600  "
//                                                     >
//                                                         Next Due Date
//                                                     </th>
//                                                     <th
//                                                         scope="col"
//                                                         className="fs-13 lh-xs  fw-600 "
//                                                     >
//                                                         Due Amount
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {studentData && studentData.length > 0 ? (
//                                                     studentData?.map(
//                                                         (item, index) => {
//                                                             return (
//                                                                 <tr key={index}>
//                                                                     <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                                                                         {index + 1}
//                                                                     </td>
//                                                                     <td
//                                                                         className="fs-13 black_300  lh-xs bg_light text-truncate"
//                                                                         style={{ maxWidth: "150px" }}
//                                                                     >
//                                                                         {item?.name}
//                                                                     </td>
//                                                                     <td className="fs-13 black_300  lh-xs bg_light">
//                                                                         {item?.admissiondate}
//                                                                     </td>
//                                                                     <td className="fs-13 black_300  lh-xs bg_light">
//                                                                         {item?.totalpaidamount?.toLocaleString(
//                                                                             "en-IN"
//                                                                         )}
//                                                                     </td>
//                                                                     <td className="fs-13 black_300  lh-xs bg_light">
//                                                                         {item?.nextduedate}
//                                                                     </td>
//                                                                     <td className="fs-13 black_300  lh-xs bg_light">
//                                                                         {item?.dueamount?.toLocaleString(
//                                                                             "en-IN"
//                                                                         )}
//                                                                     </td>
//                                                                 </tr>
//                                                             );
//                                                         }
//                                                     )
//                                                 ) : (
//                                                     <tr>
//                                                         <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
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
//             )}
//         </>
//     )
// }

// export default FeeDetailsStudentTable