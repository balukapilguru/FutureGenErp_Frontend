import CustomTable from "../../../../utils/CustomTable";

const TodayEnrollmentsStudentTable = ({ councellerWiseStudentsDetails }) => {
  const columns = [
    { id: "sno", header: "S.No", accessor: (_, i) => i + 1 },

    { id: "name", header: "Student Name", accessor: "name" },

    { id: "course", header: "Course", accessor: "course" },

    {
      id: "date",
      header: "Admission Date",
      accessor: (r) => r.admissiondate?.split("T")[0],
    },

    {
      id: "booking",
      header: "Booking Amount",
      accessor: (r) => r.finalTotal?.toLocaleString(),
    },

    {
      id: "paid",
      header: "Paid Fee",
      accessor: (r) => r.totalPaidAmount?.toLocaleString(),
    },

    {
      id: "due",
      header: "Fee Yet To Receive",
      accessor: (r) => r.dueAmount?.toLocaleString(),
    },
  ];

  return (
    <div className="card mt-3">
      <div className="card-header">Student Details</div>
      <div className="card-body p-3">
        <CustomTable
          data={councellerWiseStudentsDetails}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default TodayEnrollmentsStudentTable;