import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as XLSX from "xlsx";
import PaginationInfo from '../../../../../utils/PaginationInfo';
import CustomFilters from '../../../../../utils/CustomFilters';
import GateKeeper from '../../../../../rbac/GateKeeper';
import { MdFilterList } from 'react-icons/md';
import { Link, useFetcher, useLoaderData, useNavigation, useSearchParams, useSubmit } from 'react-router-dom';
import { debounce } from '../../../../../utils/Utils';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { AiFillEye } from 'react-icons/ai';
import Pagination from '../../../../../utils/Pagination';
import { BiExport } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { Offcanvas } from 'bootstrap';
import Filter from '../../../../../utils/FilterWithSearchParams';
import CustomTable from '../../../../../utils/CustomTable';
import { BsLayoutThreeColumns } from 'react-icons/bs';


export const TodayFeeRecordsListLoader = async ({ request, params }) => {
  const url = new URL(request.url);
  const queryParams = url.search || "?page=1&pageSize=10&search=";
  try {
    const [
      TodayFeeRecordsData,
      BranchesData,
      coursesData,
      counsellorsData,
      leadSourceData,
    ] = await Promise.all([
      ERPApi.get(`/fee/todayduefeerecords${queryParams}`),
      ERPApi.get(`/settings/getbranch`),
      ERPApi.get(`/batch/course`, { params: { search: url.searchParams.get('course_label') ?? "" } }),
      ERPApi.get(`/user/userswithcounsellors`),
      ERPApi.get(`/settings/getleadsource`),
    ]);

    const BranchsList = BranchesData?.data?.branchData?.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    })) || [];

    const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
      label: item?.course_name,
      value: item.id,
    })) || [];

    const counsellorsList = counsellorsData?.data?.userswithcounselor?.map(
      (item) => ({
        label: item?.fullname,
        value: item.id,
      })
    ) || [];

    const leadSourceList = leadSourceData?.data?.leadSourceData?.map((item) => ({
      label: item?.leadsource,
      value: item?.leadsource,
    }))

    const TodayFeeRecordsList = TodayFeeRecordsData.data || [];

    return {
      leadSourceList,
      coursesList,
      BranchsList,
      counsellorsList,
      TodayFeeRecordsList,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}



const TodayFeeRecordsList = () => {
  const data = useLoaderData();
  const submit = useSubmit();
  const fetcher = useFetcher();

  const {
    leadSourceList = [],
    coursesList = [],
    BranchsList = [],
    counsellorsList = [],
    TodayFeeRecordsList = [],
  } = data || {};




  const navigation = useNavigation();

  const initialState = [
    // {
    //   label: "From Date",
    //   type: "date",
    //   inputname: "admissionFromDate",
    //   value: "",
    // },
    // { label: "TO Date", type: "date", inputname: "admissionToDate", value: "" },
    // {
    //   label: "Course",
    //   type: "select",
    //   inputname: "course",
    //   value: "",
    //   options: coursesList,
    // },
    {
      label: "Course",
      type: "search-select",
      inputname: "filter[course]",
      urlParam: "filter[course]",
      urlSearchParam: "course_label",
      options: coursesList ?? [],
      fetchOptions: async (search) => {
        const coursesData = await ERPApi.get(`/batch/course`, {
          params: { search: search ? search : searchParams.get('course_label') ?? "" }
        });
        const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
          label: item?.course_name,
          value: item?.id,
        }));

        // Map different keys here
        return coursesList || [];
      }
    },
    {
      label: "Counsellor",
      type: "select",
      inputname: "filter[enquiryTakenby]",
      value: "",
      options: counsellorsList,
    },
    {
      label: "Branch",
      type: "select",
      value: "",
      inputname: "filter[branch]",
      options: BranchsList,
    },
    {
      label: "Mode Of Training",
      type: "select",
      inputname: "filter[modeOfTraining]",
      value: "",
      options: [
        { label: "Online", value: "online" },
        // { label: "not Issued", value: " " },
        { label: "Offline", value: "offline" },
      ],
    },

    {
      label: "Lead Source",
      type: "select",
      inputname: "filter[leadsource]",
      value: "",
      options: leadSourceList,
    },
    {
      label: "Status",
      type: "select",
      inputname: "filter[status]",
      value: "",
      options: [
        { label: "All", value: 2 },
        { label: "Active", value: 1 },
        { label: "In Active", value: 0 },
      ],
    },

  ];

  const [filterData, setFilterData] = useState(initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const HandleFilters = (index, name, value) => {
    setFilterData(prevState => {
      let showToast = false;

      let updated = prevState.map((item, idx) =>
        idx === index ? { ...item, value } : item
      );

      // When From Date changes
      if (name === "fromDate") {
        updated = updated.map(item => {
          if (item.inputname === "toDate") {
            if (item.value && item.value < value) {
              showToast = true;
              return {
                ...item,
                min: value,
                value: "", // reset invalid To Date
              };
            }

            return {
              ...item,
              min: value, // always update min
            };
          }
          return item;
        });
      }

      // Fire toast AFTER state calculation
      if (showToast) {
        toast.warning("To Date cannot be earlier than From Date");
      }

      return updated;
    });
  };



  const FilterReset = () => {
    const resetFilterData = filterData?.map((item) => ({
      ...item,
      value: "",
    }));
    setFilterData(resetFilterData);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    initialFilterStructure.forEach(filter => {
      newSearchParams.delete(filter.urlParam || filter.inputname || filter?.urlSearchParam);
    });
    newSearchParams.delete("filter[course_label]");
    newSearchParams.delete("filter[course]_label");

    setSearchParams(newSearchParams);
  };

  const filterSubmit = () => {
    const offcanvasElement = document.getElementById("offcanvasRight");
    const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  };

  const [Qparams, setQParams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    // admissionFromDate: "",
    // admissionToDate: "",
    branch: "",
    course: "",
    modeOfTraining: "",
    enquiryTakenby: "",
    leadsource: "",
    status: "",
  });

  const handleSearch = (event) => {
    setQParams({
      ...Qparams,
      search: event.target.value,
    });
  };

  const handlePage = (page) => {
    setQParams({
      ...Qparams,
      page,
    });
  };

  const handlePerPageChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setQParams({
      ...Qparams,
      page: 1,
      pageSize: selectedValue,
    });
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    debouncedParams(Qparams);
  }, [Qparams]);

  const debouncedParams = useCallback(
    debounce((param) => {
      const searchParams = new URLSearchParams({
        page: param.page,
        pageSize: param.pageSize,
        search: param.search,
        // "filter[admissionFromDate]": param.admissionFromDate || "",
        // "filter[admissionToDate]": param.admissionToDate || "",
        "filter[branch]": param.branch || "",
        "filter[course]": param.course || "",
        "filter[modeOfTraining]": param.modeOfTraining || "",
        "filter[enquiryTakenby]": param.enquiryTakenby || "",
        "filter[leadsource]": param.leadsource || "",
        "filter[status]": param.status || "",
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );

  const [excelLoading, setExcelLoading] = useState(false);

  const exportToExcel = async () => {
    setExcelLoading(true);

    try {
      const {
        page = 1,
        pageSize = 10,
        search = "",
        branch = "",
        course = "",
        modeOfTraining = "",
        enquiryTakenby = "",
        leadsource = "",
        status = "",
      } = Qparams || {};

      const baseUrl = import.meta.env.VITE_API_URL;
      const endpoint = "/fee/todayduefeerecords";
      const BranchFriler = filterData?.find((filter) => filter.inputname === "branch");
      const branchLabel = BranchFriler?.options?.find((option) => option.value == branch)?.label || "";

      const url = `${baseUrl}${endpoint}?page=${page}&pageSize=${TodayFeeRecordsList?.searchResultStudents}&search=${search}&&filters[branch]=${branch}&filters[course]=${course}&filters[modeOfTraining]=${modeOfTraining}&filters[enquiryTakenby]=${enquiryTakenby}&filters[leadsource]=${leadsource}&filters[status]=${status}`;

      const { data } = await toast.promise(ERPApi.get(url), {
        pending: "Exporting due fee records...",
        success: "Export successful!",
        error: "Export failed. Please try again.",
      });

      // Extract array of student records (assuming API returns an array)
      const records = Array.isArray(data) ? data : data?.todayDueFeeRecords || [];

      const formattedData = records.map((item, index) => {
        const dueInstallment = item.dueTodayInstallments?.[0] || {}; // today's due record
        const leadSource =
          item.studentDetails?.leadsource[0]?.source || "N/A";

        return {
          "S.No": index + 1,
          Name: item.studentDetails?.name || "",
          Branch: item.studentDetails?.branches?.branch_name || "",
          Counsellor: item.studentDetails?.user?.fullname ?? "N/A",
          Contact: item.studentDetails?.mobilenumber || "",
          Course: item.studentDetails?.course?.[0]?.course_name || "",
          "Lead Source": leadSource,
          "Due Date": item.duedate || "",
          "Due Amount": item.dueamount || 0,
          "Paid Status": dueInstallment.paymentdone ? "Paid" : "Unpaid",
        };
      });

      // Generate Excel sheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      worksheet["!cols"] = [
        { wpx: 50 },  // S.No
        { wpx: 180 }, // Name
        { wpx: 150 }, // Branch
        { wpx: 150 }, // Counsellor
        { wpx: 130 }, // Contact
        { wpx: 150 }, // Course
        { wpx: 150 }, // Lead Source
        { wpx: 130 }, // Due Date
        { wpx: 130 }, // Due Amount
        { wpx: 120 }, // Paid Status
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TodayDueFees");

      XLSX.writeFile(workbook, `${branchLabel ? branchLabel + "_" : ""}TodayDueFeeRecords.xlsx`);
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Something went wrong while exporting.");
    } finally {
      setExcelLoading(false);
    }
  };

  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (TodayFeeRecordsList?.currentPage - 1) * TodayFeeRecordsList?.pageSize + index + 1,
    },
    {
      id: "name",
      header: "Name",
      accessor: (row) => row.studentDetails?.name || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "branch",
      header: "Branch",
      accessor: (row) => row.studentDetails?.branches?.branch_name || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "counsellor",
      header: "Counsellor",
      accessor: (row) => row.studentDetails?.user?.fullname || "N/A",
      sortable: true,
      hideable: true,
    },
    {
      id: "contact",
      header: "Contact",
      accessor: (row) => row.studentDetails?.mobilenumber || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "course",
      header: "Course",
      accessor: (row) => row.studentDetails?.course?.[0]?.course_name || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "leadSource",
      header: "Lead Source",
      accessor: (row) => row.studentDetails?.leadsource?.[0]?.source || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "dueDate",
      header: "Due Date",
      accessor: (row) => row.duedate || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "dueAmount",
      header: "Due Amount",
      accessor: (row) =>
        Number(parseFloat(row.dueamount).toFixed(2)).toLocaleString("en-IN") || "-",
      sortable: true,
      hideable: true,
    },
    {
      id: "paidStatus",
      header: "Paid Status",
      accessor: (row) => {
        const installments = row.studentDetails?.totalinstallments?.[0];
        return installments
          ? `${installments.totalinstallmentspaid}/${installments.totalinstallments}`
          : "-";
      },
      sortable: true,
      hideable: true,
    },
  ];


  const TodayFeeRecordsListData = TodayFeeRecordsList?.todayDueFeeRecords?.map((item) => ({
    ...item,
    rawItem: item,
  })) || [];


  const actions = (row) => {
    const item = row;

    return (
      <GateKeeper
        requiredModule="Student Management"
        submenumodule="Fee Details"
        submenuReqiredPermission="canUpdate"
      >
        <Link to={`/student/feeUpdate?studentId=${item?.studentId}`}>
          <AiFillEye className="me-3" title="View" />
        </Link>
      </GateKeeper>
    );
  };




  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card border-0">
            <div className="card-header">
              <div className="row justify-content-between">
                <div className="col-sm-4">
                  <div className="search-box">
                    <input
                      type="search"
                      className="form-control search text_color input_bg_color select"
                      placeholder="Search for..."
                      name="search"
                      required
                      onChange={(e) => handleSearch(e)}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="buttons_alignment">
                    <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
                      <div style={{ cursor: excelLoading ? "not-allowed" : "pointer" }}>
                        <button
                          className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
                          type="button"
                          onClick={() => exportToExcel(Qparams)}
                          disabled={excelLoading}
                        ><BiExport className="me-1 mb-1" />
                          Export
                        </button>
                      </div>
                    </GateKeeper>
                    <button
                      className="btn btn-sm btn_primary fs-13 me-2  margin_top_12 button-res"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#columnOffcanvas"
                      title="Column Filter"
                    >
                      <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
                    </button>
                    <button
                      className="btn btn-sm btn_primary fs-13 me-1"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      <MdFilterList className="me-1 mb-1" />
                      Filters
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="offcanvas offcanvas-end bg_white text_color"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
              >
                <div className="offcanvas-header">
                  <h5
                    className="offcanvas-title"
                    id="offcanvasRightLabel"
                  >
                    Filters
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="offcanvas-body p-2">
                  <Filter
                    filterData={filterData}
                    HandleFilters={HandleFilters}
                    filterReset={FilterReset}
                    filterSubmit={filterSubmit}
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive table-container table-scroll table-card  border-0">

                <CustomTable
                  data={TodayFeeRecordsListData}
                  columns={columns}
                  actions={actions}
                  enableColumnToggle={true}
                />

              </div>

              {/* pagination */}
              <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                <div className="col-sm">
                  <PaginationInfo
                    data={{
                      length: TodayFeeRecordsList?.todayDueFeeRecords?.length,
                      start: TodayFeeRecordsList?.startStudent,
                      end: TodayFeeRecordsList?.endStudent,
                      total: TodayFeeRecordsList?.searchResultStudents,
                    }}
                    loading={navigation?.state === "loading"}
                  />
                </div>
                <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                  <div className="mt-3">
                    <select
                      className="form-select form-control me-3 text_color input_bg_color pagination-select"
                      aria-label="Default select example"
                      placeholder="Branch*"
                      name="branch"
                      id="branch"
                      required
                      onChange={(e) => handlePerPageChange(e)}
                      value={Qparams?.pageSize}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="75">75</option>
                      <option value="100">100</option>
                    </select>
                  </div>

                  <div className="">
                    <Pagination
                      currentPage={TodayFeeRecordsList?.currentPage}
                      totalPages={TodayFeeRecordsList?.totalPages}
                      loading={navigation?.state === "loading"}
                      onPageChange={handlePage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodayFeeRecordsList
// < table className = "table table-centered align-middle  table-nowrap equal-cell-table table-hover" >
//                 <thead>
//                   <tr className="">
//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs fw-600 "
//                     >
//                       S.No
//                     </th>
//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs fw-600  "
//                     >
//                       Name
//                     </th>
//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs  fw-600  "
//                     >
//                       Branch
//                     </th>
//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs fw-600  "
//                     >
//                       Counsellor
//                     </th>
//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs  fw-600  "
//                     >
//                       Contact
//                     </th>
//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs  fw-600 "
//                     >
//                       Course
//                     </th>

//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs  fw-600 "
//                     >
//                       Lead Source
//                     </th>
//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs  fw-600 "
//                     >
//                       Due&nbsp;Date
//                     </th>
//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs  fw-600 "
//                     >
//                       Due&nbsp;Amount
//                     </th>
//                     <th
//                       scope="col"
//                       className="fs-13 lh-xs  fw-600 "
//                     >
//                       Paid&nbsp;Status
//                     </th>
//                     <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
//                       <th
//                         scope="col"
//                         className="fs-13 lh-xs  fw-600 "
//                       >
//                         Action
//                       </th>
//                     </GateKeeper>
//                   </tr>
//                 </thead>
//                 <tbody>


//                   {
//                     TodayFeeRecordsList?.todayDueFeeRecords && TodayFeeRecordsList?.todayDueFeeRecords?.length > 0 ?
//                       TodayFeeRecordsList?.todayDueFeeRecords?.map((item, index) => {
//                         return (
//                           <tr key={index + 1}>
//                             <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                               {(TodayFeeRecordsList?.currentPage - 1) * TodayFeeRecordsList.pageSize + index + 1}
//                             </td>
//                             <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }}>
//                               {item?.studentDetails?.name}
//                             </td>
//                             <td className="fs-13 black_300  lh-xs bg_light">
//                               {item?.studentDetails?.branches?.branch_name}
//                             </td>
//                             <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item?.studentDetails?.enquirytakenby}>
//                               {item?.studentDetails?.user?.fullname ?? "N/A"}
//                             </td>
//                             <td className="fs-13 black_300  lh-xs bg_light">
//                               {item?.studentDetails?.mobilenumber}
//                             </td>
//                             <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item?.studentDetails?.course?.[0]?.course_name}>
//                               {item?.studentDetails?.course?.[0]?.course_name}
//                             </td>

//                             <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item?.studentDetails?.leadsource[0]?.source}>
//                               {item?.studentDetails?.leadsource[0]?.source}
//                             </td>
//                             <td className="fs-13 black_300  lh-xs bg_light ">
//                               {item?.duedate}
//                             </td>
//                             <td className="fs-13 black_300  lh-xs  bg_light">
//                               {Number(
//                                 parseFloat(item.dueamount).toFixed(2)
//                               ).toLocaleString("en-IN")}
//                             </td>
//                             <td className="fs-13 black_300  lh-xs bg_light ">
//                               {item?.studentDetails?.totalinstallments && item?.studentDetails?.totalinstallments.length > 0 ?
//                                 `${item?.studentDetails?.totalinstallments[0].totalinstallmentspaid}/${item?.studentDetails?.totalinstallments[0]?.totalinstallments}` :
//                                 '-'
//                               }
//                             </td>
//                             <GateKeeper requiredModule="Student Management" submenumodule="Fee Details" submenuReqiredPermission="canUpdate">
//                               <td className="fs_14 text_mute bg_light lh-xs ">
//                                 <Link
//                                   // to={`/student/feeview/${item.id}`}
//                                   to={`/student/feeUpdate?studentId=${item?.studentId}`}
//                                 >
//                                   <AiFillEye className=" me-3" />
//                                 </Link>
//                               </td>
//                             </GateKeeper>
//                           </tr>

//                         )
//                       })
//                       :
//                       (<tr>
//                         <td className="fs-13 black_300  lh-xs bg_light ">
//                           No Data
//                         </td>
//                       </tr>)
//                   }



//                 </tbody>
//               </ >