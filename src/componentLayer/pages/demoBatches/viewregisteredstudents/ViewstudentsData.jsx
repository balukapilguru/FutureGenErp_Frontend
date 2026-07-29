import { useLoaderData, useSearchParams } from 'react-router-dom';
import CustomPage from '../../../../utils/Custompage';

const ViewstudentsData = () => {
  const { demoRegistrations } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const students = demoRegistrations?.data || [];

  // ✅ Columns
  const STUDENT_COLUMNS = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (demoRegistrations.currentPage - 1) *
          demoRegistrations.pageSize +
        index +
        1,
    },
    {
      id: "name",
      header: "Name",
      accessor: (row) => row.name,
    },
    {
      id: "email",
      header: "Email",
      accessor: (row) => row.email,
    },
    {
      id: "phone",
      header: "Phone",
      accessor: (row) => row.phone,
    },
    // {
    //   id: "applications",
    //   header: "Applications",
    //   accessor: (row) => row.totalApplications,
    // },
    // {
    //   id: "batch",
    //   header: "Batch",
    //   accessor: (row) =>
    //     row.demo_Student_Fields?.[0]?.batchId || "-",
    // },
    {
      id: "slot",
      header: "Slot",
      accessor: (row) => {
        const slot = row.demo_Student_Fields?.[0];
        return slot
          ? `${slot.slotDate} ${slot.startTime}`
          : "-";
      },
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) =>
        row.demo_Student_Fields?.[0]?.status || "-",
    },
    {
      id: "counsellorName",
      header: "Counsellor Name",
      accessor: (row) =>
        row?.counsellorName || "-",
    },
  ];

  // ✅ Pagination mapping
  const pagination = {
    page: demoRegistrations?.currentPage || 1,
    pageSize: demoRegistrations?.pageSize || 10,
    totalPages: demoRegistrations?.totalPages || 1,
    length: students.length,
    start: demoRegistrations?.start || 0,
    end: demoRegistrations?.end || 0,
    searchResult: demoRegistrations?.totalRecords || 0,
  };

  // ✅ Handlers
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  const handlePerPageChange = (e) => {
    const pageSize = parseInt(e.target.value, 10);

    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);
      return {
        ...params,
        page: 1,
        pageSize,
      };
    });
  };

  return (
    <CustomPage
      heading="Students"
      backButtonText="Back"

      // ✅ Data
      tableData={students}
      tableColum={STUDENT_COLUMNS}

      // ✅ Search
      isSearch={true}
      searchPlaceHolder="Search by name, email, phone..."

      // ✅ Pagination
      tablePagination={pagination}
      onPageChange={handlePageChange}
      handlePerPageChange={handlePerPageChange}
    />
  );
};

export default ViewstudentsData;