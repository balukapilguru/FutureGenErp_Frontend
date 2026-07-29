import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import CustomPage from "../../../../utils/Custompage";
import { useMemo, useState } from "react";
import Usedebounce from "../../../../dataLayer/hooks/useDebounce/Usedebounce";

import { MdFilterList } from "react-icons/md";
import GateKeeper from "../../../../rbac/GateKeeper";
import { Button, Offcanvas } from "react-bootstrap";
import Filter from "../../../../utils/Filter";
import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
import { toast } from "react-toastify";

const Abroadstudents = () => {
  const { studentData } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );
  const initialFilterStructure =  [
      {
        label: "From Date",
        type: "date",
        inputname: "fromDate",
        urlParam: "filter[admissionFromDate]",
        value: "",
      },
      {
        label: "TO Date",
        type: "date",
        inputname: "toDate",
        urlParam: "filter[admissionToDate]",
        value: "",
      },
      
    ]
  
  
  
  
 
  const students = studentData?.students || [];
  const STUDENT_COLUMNS = [
    {
      id: "sno",
      header: "S.No",
      accessor: (_, index) =>
        ((studentData?.currentPage || 1) - 1) * (studentData?.pageSize || 10) +
        index +
        1,
    },
    { id: "name", header: "Name", accessor: (row) => row.name || "-" },
    { id: "email", header: "Email", accessor: (row) => row.email || "-" },
    {
      id: "mobile",
      header: "Mobile",
      accessor: (row) => row.mobilenumber || "-",
    },
    { id: "course", header: "Course", accessor: (row) => row.courses || "-" },
    {
      id: "branch",
      header: "Branch",
      accessor: (row) => row.branches?.branch_name || "-",
    },
    {
      id: "mode",
      header: "Mode",
      accessor: (row) => row.modeoftraining || "-",
    },
    // { id: "due", header: "Due Amount", accessor: (row) => row.dueamount ?? 0 },
    {
      id: "leadsource",
      header: "Lead Source",
      accessor: (row) => row.leadsource?.[0]?.source || "-",
    },
  ];

  const pagination = {
    currentPage: studentData?.currentPage || 1,
    start: studentData?.startStudent || 1,
    end: studentData?.endStudent || 10,
    totalPages: studentData?.totalPages || 1,
    searchResult: studentData?.searchResultStudents || 0,
  };

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
      tableData={students}
      tableColum={STUDENT_COLUMNS}
      isSearch={true}
      isFilter={true}
      InitialFilterData={initialFilterStructure}
      searchPlaceHolder="Search Student Name..."
      tablePagination={pagination}
      onPageChange={handlePageChange}
      handlePerPageChange={handlePerPageChange}
    />
  );
};

export default Abroadstudents;
