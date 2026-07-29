import CustomTable from "../../../../utils/CustomTable";

const TodayEnrollmentsCounsellorTable = ({
  enrollmentsByCouncellors,
  handleCouncellorSubmit,
}) => {
  const columns = [
    { id: "sno", header: "S.No", accessor: (_, i) => i + 1 },

    { id: "name", header: "Counsellor", accessor: "enquirytakenby" },

    { id: "enrollments", header: "Enrollments", accessor: "enrollments" },

    {
      id: "booking",
      header: "Booking Amount",
      accessor: (r) => r.finalTotal?.toLocaleString(),
    },

    {
      id: "received",
      header: "Fee Received",
      accessor: (r) => r.feeReceived?.toLocaleString(),
    },

    {
      id: "due",
      header: "Fee Yet To Receive",
      accessor: (r) => r.feeYetToReceive?.toLocaleString(),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">Enrollments By Counsellors</div>
      <div className="card-body p-3">
        <CustomTable
          data={enrollmentsByCouncellors}
          columns={columns}
          onRowClick={(row) => handleCouncellorSubmit(row.user_id)}
        />
      </div>
    </div>
  );
};

export default TodayEnrollmentsCounsellorTable;