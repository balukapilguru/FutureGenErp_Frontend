import React, { useEffect, useState, useCallback } from "react";
import { ERPApi } from "../../../../../serviceLayer/interceptor";
import CustomTable from "../../../../../utils/CustomTable";

const TillTodayAttendance = ({ BatchState }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ total: 0, attended: 0 });
  const [currentPage, setCurrentPage] = useState(1);
const [filters, setFilters] = useState({
  listType: "TILL_TODAY",
  slotDate: "",
  fromDate: "",
  toDate: "",
});
  const pageSize = 10;
const isSpecific = filters.listType === "ALL";
const isRange = filters.listType === "SPECIFIC"; // ONLY where range is allowed
  // ✅ Query Builder
  const buildQueryParams = ({
    page = 1,
    pageSize = 10,
    search,
    batchId,
    formUuid,
    listType = "ALL",
    fromDate,
    toDate,
    slotDate,
  }) => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("pageSize", pageSize);

    if (search) params.append("search", search);
    if (batchId) params.append("batchId", batchId);
    if (formUuid) params.append("formUuid", formUuid);
    if (listType) params.append("listType", listType);

    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    if (listType === "SPECIFIC" && slotDate) {
      params.append("slotDate", slotDate);
    }
if (filters.fromDate && !filters.toDate) {
  console.warn("Select To Date");
  return;
}

if (!filters.fromDate && filters.toDate) {
  console.warn("Select From Date");
  return;
}
    return params.toString();
  };

  const query = buildQueryParams({
  page: currentPage,
  pageSize,
  batchId: BatchState.id,
  ...filters,
});

console.log("Final Query:", query);
console.log("Final URL:", `/demo-enrollment/registrations?${query}`);
  // ✅ API Call (memoized)
  const fetchTillTodayData = useCallback(async () => {
    if (!BatchState?.id) return;
    if (filters.fromDate && !filters.toDate) return;
    if (!filters.fromDate && filters.toDate) return;

    setLoading(true);

    try {
      const query = buildQueryParams({
        page: currentPage,
        pageSize,
        batchId: BatchState.id,
        ...filters ,
      });

      const response = await ERPApi.get(
        `/demo-enrollment/registrations?${query}`
      );

      if (response.status === 200) {
        // ✅ Normalize data (critical fix)
        const normalized = (response.data?.data || []).map((student) => {
          const field = student.demo_Student_Fields?.[0] || {};

          return {
            ...student,
            slotDate: field.slotDate,
            status: field.status,
          };
        });

        setData(normalized);

        setSummary({
          total: response.data?.totalRecords || 0,
          attended: response.data?.attendedCount || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [BatchState?.id, currentPage,filters]);

  useEffect(() => {
    fetchTillTodayData();
  }, [fetchTillTodayData]);

  // ✅ Columns (clean now)
  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (_, index) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      id: "name",
      header: "Student Name",
      accessor: (row) => (
        <span className="fw-semibold">{row.name}</span>
      ),
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      sortable: true,
    },
    {
      id: "phone",
      header: "Phone",
      accessor: (row) => row.phone || "N/A",
    },
    {
      id: "slotDate",
      header: "Scheduled Date",
      accessor: (row) => row.slotDate || "N/A",
      sortable: true,
    },
    {
      id: "status",
      header: "Attendance",
      accessor: (row) => (
        <span
          className={`badge ${
            row.attendanceRecords.some((record) => record.markedAt == row.slotDate) ? "bg-success" : "bg-danger"
          }`}
        >
          {row.attendanceRecords.some((record) => record.markedAt == row.slotDate) ? "ATTENDED" : "ABSENT"}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="mt-4">
    <div className="mb-3 d-flex gap-2 flex-wrap">
  {[{ label: "All", value: "ALL" },
    { label: "Today", value: "TODAY" },
    { label: "Till Today", value: "TILL_TODAY" },
    { label: "Future", value: "FUTURE" },
    { label: "Specific", value: "SPECIFIC" }
    
  ].map((tab) => (
    <button
      key={tab.value}
      className={`btn btn-md ${
        filters.listType === tab.value
          ? "btn_primary"
          : "bg_white "
      }`}
      onClick={() => {
        setCurrentPage(1); // reset pagination
        setFilters((prev) => ({
          ...prev,
          listType: tab.value,
          slotDate: "", // reset specific date
          fromDate: "",
  toDate: "",
        }));
      }}
    >
      {tab.label}
    </button>
  ))}
<div className="d-flex gap-2 mt-2 flex-wrap">
  {/* {isSpecific && (
    <input
      type="date"
      className="form-control w-auto"
      value={filters.slotDate}
      onChange={(e) => {
        setCurrentPage(1);
        setFilters((prev) => ({
          ...prev,
          slotDate: e.target.value,
        }));
      }}
    />
  )} */}

  {isRange && (
    <>
      <input
        type="date"
        className="form-control w-auto"
        value={filters.fromDate}
        onChange={(e) => {
          setCurrentPage(1);
          setFilters((prev) => ({
            ...prev,
            fromDate: e.target.value,
          }));
        }}
      />

      <input
        type="date"
        className="form-control w-auto"
        value={filters.toDate}
        onChange={(e) => {
          setCurrentPage(1);
          setFilters((prev) => ({
            ...prev,
            toDate: e.target.value,
          }));
        }}
      />
    </>
  )}
</div>
</div>


      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" />
          <div className="mt-2">Loading Attendance Report...</div>
        </div>
      ) : (
        <CustomTable
          data={data}
          columns={columns}
          enableColumnToggle
        />
      )}
    </div>
  );
};

export default TillTodayAttendance;