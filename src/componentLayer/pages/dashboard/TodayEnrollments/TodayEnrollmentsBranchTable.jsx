import CustomTable from "../../../../utils/CustomTable";

const TodayEnrollmentsBranchTable = ({
  enrolmentsInBranch,
  handleBranchSubmit,
}) => {
  const columns = [
    { id: "sno", header: "S.No", accessor: (_, i) => i + 1 },

    { id: "branch", header: "Branch", accessor: "branch", sortable: true },

    { id: "enrollments", header: "Enrollments", accessor: "enrollments", sortable: true },

    {
      id: "booking",
      header: "Booking Amount",
      accessor: (r) => r.finalTotal?.toLocaleString(),
      sortable: true,
    },

    {
      id: "received",
      header: "Fee Received",
      accessor: (r) => r.feeReceived?.toLocaleString(),
      sortable: true,
    },

    {
      id: "due",
      header: "Fee Yet To Receive",
      accessor: (r) => r.feeYetToReceive?.toLocaleString(),
      sortable: true,
    },
  ];

  return (
    <div className="card">
      <div className="card-header">Enrollments In Branch</div>
      <div className="card-body p-3">
        <CustomTable
          data={enrolmentsInBranch}
          columns={columns}
          onRowClick={(row) => handleBranchSubmit(row.branchId)}
        />
      </div>
    </div>
  );
};

export default TodayEnrollmentsBranchTable;