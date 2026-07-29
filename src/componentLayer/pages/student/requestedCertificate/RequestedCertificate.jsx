import "../../../../assets/css/Table.css";
import { Link, useFetcher, useLoaderData, useNavigation, useSearchParams, useSubmit } from "react-router-dom";
import BackButton from "../../../components/backbutton/BackButton";
import { MdFilterList } from "react-icons/md";
import { PiCertificateBold } from "react-icons/pi";
import GateKeeper from "../../../../rbac/GateKeeper";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "../../../../utils/Utils";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Pagination from "../../../../utils/Pagination";
import CustomFilters from "../../../../utils/CustomFilters";
import SearchInputField from "../../../../utils/SearchInputField";
import { Offcanvas } from "bootstrap";
import Filter from "../../../../utils/FilterWithSearchParams";
import CustomTable from "../../../../utils/CustomTable";
import { BsLayoutThreeColumns } from "react-icons/bs";

export const requestCertificateLoader = async ({ request, params }) => {
  const url = new URL(request.url); // Extract the URL
  const queryParams = url.search;


  try {
    const [requestCertificateData, BranchesData, coursesData] =
      await Promise.all([
        ERPApi.get(
          `/sc/requiestedcertificates${queryParams ? queryParams : `?page=1&pageSize=10&search=`
          }`
        ),
        ERPApi.get(`/settings/getbranch`),
        ERPApi.get(`/batch/course`, {
          params: {
            search: url.searchParams.get('course_label') || ''
          }
        }),
      ]);

    const BranchsList = BranchesData?.data?.branchData?.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    }));

    const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
      label: item?.course_name,
      value: item.id,
    }));

    const requestCertificateStundentsList = requestCertificateData.data;

    return { coursesList, BranchsList, requestCertificateStundentsList };
  } catch (error) {
    console.error(error);
  }
};

function RequestedCertificate() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();

  const navigation = useNavigation();

  const { coursesList = [], BranchsList = [], requestCertificateStundentsList = [] } = data;

  const initialState = [
    {
      label: "From Date",
      type: "date",
      inputname: "filter[admissionFromDate]",
      value: "",
    },
    { label: "TO Date", type: "date", inputname: "filter[admissionToDate]", value: "" },
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
      label: "Branch",
      type: "select",
      value: "",
      inputname: "filter[branch]",
      options: BranchsList,
    },
    {
      label: "Student's Type",
      type: "select",
      inputname: "filter[oldornew]",
      value: "",
      options: [
        { label: "Existing Students", value: "newStudents" },
        { label: "Old Students", value: "oldStudents" },
      ],
    },
  ];

  const [filterData, setFilterData] = useState(initialState);
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
    admissionFromDate: "",
    admissionToDate: "",
    branch: "",
    course: "",
    oldornew: "",
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
        "filter[admissionFromDate]": param.admissionFromDate || "",
        "filter[admissionToDate]": param.admissionToDate || "",
        "filter[branch]": param.branch || "",
        "filter[course]": param.course || "",
        "filter[oldornew]": param.oldornew || "",
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );

  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (requestCertificateStundentsList?.currentPage - 1) *
        requestCertificateStundentsList?.pageSize +
        index +
        1,
    },

    {
      id: "name",
      header: "Name",
      accessor: (row) => row?.name || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "course",
      header: "Course",
      accessor: (row) => row?.courses || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "registrationId",
      header: "Registration ID",
      accessor: (row) => row?.registrationnumber || "-",
      sortable: true,
      hideable: true,
    },

    {
      id: "courseCertificate",
      header: "Course Certificate Status",
      accessor: (row) => {
        if (!row) return "-";

        let obj = row.certificate_status;
        if (typeof obj === "string") {
          try {
            obj = JSON.parse(obj);
          } catch {
            return "-";
          }
        }

        const status = obj?.map((i) => i.certificateStatus).join(", ");

        if (!status) return "Not Issued";
        if (status === "request Submitted") return "Pending";
        if (status === "issued") return "Issued";
        return "-";
      },
      sortable: true,
      hideable: true,
    },

    {
      id: "internshipCertificate",
      header: "Internship Certificate Status",
      accessor: (row) => {
        const status =
          row?.certificate_status?.[0]?.internShip
            ?.internShipCertificateStatus;

        if (!status) return "Not Issued";
        if (status === "InternShip Not Issued") return "Not Issued";
        if (status === "InternShip Request Submitted") return "Pending";
        return "Issued";
      },
      sortable: true,
      hideable: true,
    },

    {
      id: "iepCertificate",
      header: "IEP Certificate Status",
      accessor: (row) => {
        const status =
          row?.certificate_status?.[0]?.iep?.iepCertificateStatus;

        if (!status) return "Not Issued";
        if (status === "IEP Not Issued") return "Not Issued";
        if (status === "IEP Request Submitted") return "Pending";
        return "Issued";
      },
      sortable: true,
      hideable: true,
    },

    {
      id: "requestedDate",
      header: "Requested Date",
      accessor: (row) => {
        const date = row?.certificate_status?.[0]?.RequestedDate;
        return date ? date.split(" ")[0] : "NA";
      },
      sortable: true,
      hideable: true,
    },

    {
      id: "requestedTime",
      header: "Requested Time",
      accessor: (row) => {
        const date = row?.certificate_status?.[0]?.RequestedDate;
        return date ? date.split(" ")[1] : "NA";
      },
      sortable: true,
      hideable: true,
    },
  ];
  const actions = (row) => {
    const item = row;
    if (!item) return null;

    let obj = item.certificate_status;
    if (typeof obj === "string") {
      try {
        obj = JSON.parse(obj);
      } catch {
        return null;
      }
    }

    const certificateStatus =
      obj?.map((i) => i.certificateStatus).join(", ");

    return (
      <GateKeeper
        requiredModule="Student Management"
        submenumodule="Requested Certificate"
        submenuReqiredPermission="canUpdate"
      >
        {certificateStatus === "request Submitted" && (
          <Link
            to={`/student/certificateissueform/issue/${item.registrationnumber}`}
            className="rounded btn_issue_certificate font-size-xxs text-white px-2 py-1"
          >
            Issue Certificate
          </Link>
        )}
      </GateKeeper>
    );
  };

  return (
    <div>
      <BackButton heading=" Requested Certificate" content="Back" to="/" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      {/* <input
                        type="text"
                        className="form-control search text_color bg_input_color"
                        placeholder="Search for..."
                        name="search"
                        required
                        onChange={handleSearch}
                      /> */}

                      <SearchInputField setSearchParams={setSearchParams} searchParams={searchParams} />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="buttons_alignment">
                      <div className="fs-13 me-2 mt-2 text_color">
                        <button
                          className="btn btn-sm btn_primary fs-13  margin_top_12 button-res"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#columnOffcanvas"
                          title="Column Filter"
                        >
                          <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
                        </button>
                      </div>

                      <button
                        className="btn btn-sm btn_primary fs-13 me-1 margin_top_12 button-res"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <MdFilterList className="me-1 mb-1" />
                        Filters
                      </button>

                      <GateKeeper
                        requiredModule="Student Management"
                        submenumodule="Issued Certificate"
                        submenuReqiredPermission="canRead"
                      >
                        <button
                          type="button"
                          className="btn btn_primary btn-sm fs-13 margin_top_12 button-res"
                        >
                          <Link
                            to="/student/issuedcertificates"
                            className="btn_primary"
                          >
                            <PiCertificateBold className="me-1 mb-1" />
                            Issued Certificates
                          </Link>
                        </button>
                      </GateKeeper>
                    </div>
                  </div>
                </div>

                <div
                  className="offcanvas offcanvas-end  bg_white"
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header">
                    <h5
                      className="offcanvas-title text_color"
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
                <div className="table-container table-scroll table-responsive table-card  border-0">
                  <CustomTable
                    data={requestCertificateStundentsList?.students || []}
                    columns={columns}
                    actions={actions}
                    enableColumnToggle={true}
                  />

                </div>

                <div className=" mt-4 align-items-center d-flex justify-content-between row text-center text-sm-start">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length:
                          requestCertificateStundentsList?.students?.length,
                        start: requestCertificateStundentsList?.startStudent,
                        end: requestCertificateStundentsList?.endStudent,
                        total:
                          requestCertificateStundentsList?.searchResultStudents,
                      }}
                      loading={navigation?.state === "loading"}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 text_color bg_input_color pagination-select"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
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
                        currentPage={
                          requestCertificateStundentsList?.currentPage
                        }
                        totalPages={requestCertificateStundentsList?.totalPages}
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
    </div>
  );
}

export default RequestedCertificate;
{/* <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                    <thead>
                      <tr className="">
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          S.No
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                          Name
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                          Course
                        </th>
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          Registration ID
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                          title="Course Certificate Status"
                          style={{ maxWidth: "120px" }}
                        >
                          Course Certificate Status
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                          title="Internship Certificate Status"
                          style={{ maxWidth: "120px" }}
                        >
                          Internship Certificate Status
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                          title="IEP Certificate Status"
                          style={{ maxWidth: "120px" }}
                        >
                          IEP Certificate Status
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                          title="Requested Date"
                          style={{ maxWidth: "120px" }}
                        >
                          Requested Date
                        </th>

                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                          title="Requested Time"
                          style={{ maxWidth: "120px" }}
                        >
                          Requested Time
                        </th>
                        <GateKeeper
                          requiredModule="Student Management"
                          submenumodule="Requested Certificate"
                          submenuReqiredPermission="canUpdate"
                        >
                          <th scope="col" className="fs-13 lh-xs  fw-600 ">
                            Issue Certificate
                          </th>
                        </GateKeeper>
                      </tr>
                    </thead>
                    <tbody className="">
                      {requestCertificateStundentsList?.students &&
                        requestCertificateStundentsList?.students.length > 0 ? (
                        requestCertificateStundentsList?.students.map(
                          (item, index) => {
                            const date =
                              item.certificate_status[0]?.RequestedDate;

                            const [requestedDatePart, requestedtimePart] =
                              date.split(" ");

                            let certificateStatusObj = item.certificate_status;

                            if (typeof certificateStatusObj === "string") {
                              certificateStatusObj =
                                JSON.parse(certificateStatusObj);
                            }
                            const certificateStatus = certificateStatusObj
                              .map((item) => item.certificateStatus)
                              .join(", ");

                            return (
                              <tr key={index + 1}>
                                <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                  {(requestCertificateStundentsList?.currentPage -
                                    1) *
                                    requestCertificateStundentsList.pageSize +
                                    index +
                                    1}
                                </td>
                                <td
                                  className="fs-13 black_300  lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "150px" }}
                                  title={item.name}
                                >
                                  {item?.name}
                                </td>
                                <td
                                  className="fs-13 black_300  lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "150px" }}
                                  title={item.courses}
                                >
                                  {item?.courses}
                                </td>
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {item?.registrationnumber}
                                </td>
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {certificateStatus === ""
                                    ? "Not At Issued"
                                    : certificateStatus === "request Submitted"
                                      ? "Pending"
                                      : certificateStatus === "issued"
                                        ? "Issued"
                                        : ""}
                                </td>
                                <td
                                  className="fs-13 black_300 lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "120px" }}
                                >
                                  {item?.certificate_status[0]?.internShip
                                    ?.internShipCertificateStatus
                                    ? item?.certificate_status[0]?.internShip
                                      ?.internShipCertificateStatus ===
                                      "InternShip Not Issued"
                                      ? "Not Issued"
                                      : item?.certificate_status[0]?.internShip
                                        ?.internShipCertificateStatus ===
                                        "InternShip Request Submitted"
                                        ? "pending"
                                        : "Issued"
                                    : "Not At Issued"}
                                </td>
                                <td
                                  className="fs-13 black_300 lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "120px" }}
                                >
                                  {item?.certificate_status[0]?.iep
                                    ?.iepCertificateStatus
                                    ? item?.certificate_status[0]?.iep
                                      ?.iepCertificateStatus ===
                                      "IEP Not Issued"
                                      ? "Not Issued"
                                      : item?.certificate_status[0]?.iep
                                        ?.iepCertificateStatus ===
                                        "IEP Request Submitted"
                                        ? "pending"
                                        : "Issued"
                                    : "Not At Issued"}
                                </td>

                                <td
                                  className="fs-13 black_300 lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "120px" }}
                                >
                                  {requestedDatePart ? requestedDatePart : "NA"}
                                </td>

                                <td
                                  className="fs-13 black_300 lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "120px" }}
                                >
                                  {requestedtimePart ? requestedtimePart : "NA"}
                                </td>

                                <GateKeeper
                                  requiredModule="Student Management"
                                  submenumodule="Requested Certificate"
                                  submenuReqiredPermission="canUpdate"
                                >
                                  <td className="fs-13 black_300  lh-xs  bg_light">
                                    {certificateStatus ===
                                      "request Submitted" && (
                                        <Link
                                          to={`/student/certificateissueform/issue/${item.registrationnumber}`}
                                        >
                                          <div
                                            className=" rounded  btn_issue_certificate font-size-xxs fw-100 btn-block text-center pt-1 pb-1 text-white"
                                            type="button"
                                          >
                                            Issue Certificate
                                          </div>
                                        </Link>
                                      )}
                                  </td>
                                </GateKeeper>
                              </tr>
                            );
                          }
                        )
                      ) : (
                        <tr>
                          <td className="fs-13 black_300 lh-xs bg_light">
                            No data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table> */}










// import React, { useEffect, useState } from "react";
// import "../../../../assets/css/Table.css";
// import { Link } from "react-router-dom";
// import { Offcanvas } from "bootstrap";
// import BackButton from "../../../components/backbutton/BackButton";
// import { MdFilterList } from "react-icons/md";
// import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
// import { PiCertificateBold } from "react-icons/pi";
// import Usedebounce from "../../../../dataLayer/hooks/useDebounce/Usedebounce";
// import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
// import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext";
// import { toast } from "react-toastify";
// import GateKeeper from "../../../../rbac/GateKeeper";
// import Pagination from "../../../../utils/Pagination";
// import PaginationInfo from "../../../../utils/PaginationInfo";

// function RequestedCertificate() {
//   const { studentState: { Requested_CertificateStudents }, Dispatchstudents } = useStudentsContext();
//   const { BranchState } = useBranchContext();
//   const { courseState } = useCourseContext();

//   //here adding the filters

//   const { debouncesetSearch, debouncesetPage } = Usedebounce(Dispatchstudents);

//   const handleSearch = (e) => {
//     debouncesetSearch({
//       context: "REQUESTED_CERTIFICATE_STUDENTS",
//       data: e.target.value,
//     });
//   };

//   const handlePerPage = (e) => {
//     const selectedvalue = parseInt(e.target.value, 10);

//     Dispatchstudents({
//       type: "SET_PER_PAGE",
//       payload: {
//         context: "REQUESTED_CERTIFICATE_STUDENTS",
//         data: selectedvalue,
//       },
//     });
//   };

//   // filter

//   const [filterCriteria, setfilterCriteria] = useState({
//     fromDate: "",
//     toDate: "",
//     course: "",
//     branch: "",
//     internShipStatus: "",
//     iepStatus: "",
//     studentType: "",
//   });

//   const HandleFilterCertria = (e) => {
//     const { name, value } = e.target;
//     setfilterCriteria((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const FilterReset = () => {
//     setfilterCriteria({
//       fromDate: "",
//       toDate: "",
//       course: "",
//       branch: "",
//       internShipStatus: "",
//       iepStatus: "",
//       studentType: "",
//     });
//     Dispatchstudents({
//       type: "SET_FILTERS",
//       payload: {
//         context: "REQUESTED_CERTIFICATE_STUDENTS",
//         data: {
//           fromDate: "",
//           toDate: "",
//           course: "",
//           branch: "",
//           internShipStatus: "",
//           iepStatus: "",
//           studentType: "",
//         },
//       },
//     });

//   };

//   const filterSubmit = () => {
//     if (!filterCriteria.fromDate && !filterCriteria.toDate && !filterCriteria.course && !filterCriteria.branch && !filterCriteria?.internShipStatus && !filterCriteria?.iepStatus && !filterCriteria?.studentType) {
//       toast.error("Please fill in at least one filter criteria.");
//       return;
//     }

//     Dispatchstudents({
//       type: "SET_FILTERS",
//       payload: {
//         context: "REQUESTED_CERTIFICATE_STUDENTS",
//         data: {
//           fromDate: filterCriteria.fromDate,
//           toDate: filterCriteria.toDate,
//           course: filterCriteria.course,
//           branch: filterCriteria.branch,
//           internShipStatus: filterCriteria?.internShipStatus,
//           iepStatus: filterCriteria?.iepStatus,
//           studentType: filterCriteria?.studentType
//         },
//       },
//     });

//     const offcanvasElement = document.getElementById('offcanvasRight');
//     const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
//     offcanvasInstance.hide();
//     // Manually remove the backdro
//   };

//   useEffect(() => {
//     debouncesetSearch({ context: "REQUESTED_CERTIFICATE_STUDENTS", data: "" });
//     debouncesetPage({ context: "REQUESTED_CERTIFICATE_STUDENTS", data: 1 });
//     Dispatchstudents({
//       type: "SET_FILTERS",
//       payload: {
//         context: "REQUESTED_CERTIFICATE_STUDENTS",
//         data: {
//           fromDate: "",
//           toDate: "",
//           course: "",
//           branch: "",
//           internShipStatus: "",
//           iepStatus: "",
//           studentType: "",
//         },
//       },
//     });

//     Dispatchstudents({
//       type: "SET_PER_PAGE",
//       payload: {
//         context: "REQUESTED_CERTIFICATE_STUDENTS",
//         data: 10,
//       },
//     });
//   }, []);

//   // Pagination
//   const handlePageChange = (page) => {
//     debouncesetPage({ context: "REQUESTED_CERTIFICATE_STUDENTS", data: page });
//   };

//   return (
//     <div>
//       <BackButton heading=" Requested Certificate" content="Back" to="/" />
//       <div className="container-fluid">
//         <div className="row">
//           <div className="col-xl-12">
//             <div className="card border-0">
//               <div className="card-header">
//                 <div className="row justify-content-between">
//                   <div className="col-sm-4">
//                     <div className="search-box">
//                       <input
//                         type="text"
//                         className="form-control search text_color bg_input_color"
//                         placeholder="Search for..."
//                         name="search"
//                         required
//                         onChange={handleSearch}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-sm-6">
//                     <div className="buttons_alignment">
//                       <div className="fs-13 me-3 mt-2">{/* 10/40 */}</div>

//                       <button
//                         className="btn btn-sm btn_primary fs-13 me-1 margin_top_12 button-res"
//                         type="button"
//                         data-bs-toggle="offcanvas"
//                         data-bs-target="#offcanvasRight"
//                         aria-controls="offcanvasRight"
//                       >
//                         <MdFilterList className="me-1 mb-1" />
//                         Filters
//                       </button>

//                       <GateKeeper requiredModule="Student Management" submenumodule="Issued Certificate" submenuReqiredPermission="canRead">
//                         <button
//                           type="button"
//                           className="btn btn_primary btn-sm fs-13 margin_top_12 button-res"
//                         >
//                           <Link
//                             to="/student/issuedcertificates"
//                             className="btn_primary"
//                           >

//                             <PiCertificateBold className="me-1 mb-1" />
//                             Issued Certificates
//                           </Link>
//                         </button>
//                       </GateKeeper>
//                     </div>
//                   </div>
//                 </div>
//                 <div
//                   className="offcanvas offcanvas-end bg_white"
//                   id="offcanvasRight"
//                   aria-labelledby="offcanvasRightLabel"
//                 >
//                   <div className="offcanvas-header">
//                     <h5
//                       className="offcanvas-title text_color"
//                       id="offcanvasRightLabel"
//                     >
//                       Filters
//                     </h5>
//                     <button
//                       type="button"
//                       className="btn-close"
//                       data-bs-dismiss="offcanvas"
//                       aria-label="Close"
//                     ></button>
//                   </div>
//                   <div className="offcanvas-body p-2">
//                     {/* from calendar */}
//                     <div className="form-group text-start">
//                       <label
//                         className="form-label fs-s text_color"
//                         for="example-text-input "
//                       >
//                         From Date
//                       </label>
//                       <input
//                         className="form-control fs-s bg-form text_color input_bg_color date_input_color"
//                         type="date"
//                         id="exampleInputdate"
//                         name="fromDate"
//                         value={filterCriteria.fromDate}
//                         onChange={HandleFilterCertria}
//                         required
//                       />
//                     </div>
//                     {/* to calendar */}
//                     <div className="form-group text-start mt-2">
//                       <label
//                         className="form-label fs-s text_color"
//                         for="example-text-input "
//                       >
//                         To Date
//                       </label>
//                       <input
//                         className="form-control fs-s bg-form date_input_color"
//                         type="date"
//                         id="exampleInputdate"
//                         value={filterCriteria.toDate}
//                         onChange={HandleFilterCertria}
//                         name="toDate"
//                         required
//                       />
//                     </div>
//                     {/* course */}
//                     <div className="">
//                       <label className="form-label fs-s fw-medium text_color">
//                         Course
//                       </label>
//                       <select
//                         className="form-select form-control text_color input_bg_color select"
//                         aria-label="Default select example"
//                         placeholder="course*"
//                         name="course"
//                         id="course"
//                         value={filterCriteria.course}
//                         onChange={HandleFilterCertria}
//                         required
//                       >
//                         <option value="" disabled selected>
//                           {" "}
//                           Select the Course{" "}
//                         </option>
//                         {courseState?.courses && courseState?.courses.length > 0
//                           ? courseState?.courses.map((item, index) => (
//                             <option key={index} value={item?.id}>
//                               {item?.course_name}
//                             </option>
//                           ))
//                           : null}
//                       </select>
//                     </div>
//                     {/* branch */}
//                     <div className="mt-2">
//                       <label className="form-label fs-s fw-medium text_color">
//                         Branch
//                       </label>
//                       <select
//                         className="form-select form-control text_color input_bg_color select"
//                         aria-label="Default select example"
//                         placeholder="Branch*"
//                         name="branch"
//                         id="branch"
//                         value={filterCriteria.branch}
//                         onChange={HandleFilterCertria}
//                         required
//                       >
//                         <option value="" disabled selected>
//                           {" "}
//                           Select the Branch{" "}
//                         </option>
//                         {BranchState.branches && BranchState.branches.length > 0
//                           ? BranchState.branches.map((item, index) => (
//                             <option key={index} value={item.id}>
//                               {item.branch_name}
//                             </option>
//                           ))
//                           : null}
//                       </select>
//                     </div>

//                     {/* old students */}

//                     <div className="mt-2">
//                       <label className="form-label fs-s fw-medium text_color">
//                         Student's Type
//                       </label>
//                       <select
//                         className="form-select form-control text_color input_bg_color select"
//                         aria-label="Default select example"
//                         placeholder="studentType*"
//                         name="studentType"
//                         id="studentType"
//                         value={filterCriteria.studentType}
//                         onChange={HandleFilterCertria}
//                         required
//                       >

//                         <option value="" disabled selected>{" "}Select the Students Type{" "}</option>
//                         <option value="newStudents" >Existing Students</option>
//                         <option value="oldStudents" >Old Students</option>
//                       </select>
//                     </div>

//                     {/* InternShip Status */}

//                     {/* <div className="mt-2">
//                       <label className="form-label fs-s fw-medium text_color">
//                         InternShip Status
//                       </label>
//                       <select
//                         className="form-select form-control text_color input_bg_color select"
//                         aria-label="Default select example"
//                         placeholder="internShipStatus*"
//                         name="internShipStatus"
//                         id="internShipStatus"
//                         value={filterCriteria.internShipStatus}
//                         onChange={HandleFilterCertria}
//                         required
//                       >
//                         <option value="" disabled selected>{" "}Select the InternShip Status{" "}</option>
//                         <option value="InternShip Request Submitted" >Pending</option>
//                         <option value="InternShip Not Issued" >Not Issued</option>
//                       </select>
//                     </div> */}

//                     {/* Iep status */}
//                     {/* <div className="mt-2">
//                       <label className="form-label fs-s fw-medium text_color">
//                         InternShip Status
//                       </label>
//                       <select
//                         className="form-select form-control text_color input_bg_color select"
//                         aria-label="Default select example"
//                         placeholder="iepStatus*"
//                         name="iepStatus"
//                         id="iepStatus"
//                         value={filterCriteria.iepStatus}
//                         onChange={HandleFilterCertria}
//                         required
//                       >
//                         <option value="" disabled selected>{" "}Select the IEP Status{" "}</option>
//                         <option value="IEP Request Submitted" >Pending</option>
//                         <option value="IEP Not Issued" >Not Issued</option>
//                       </select>
//                     </div> */}

//                     <div>
//                       <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
//                         <button
//                           className="btn btn_primary"
//                           data-bs-dismiss="offcanvas"
//                           aria-label="Close"
//                           onClick={FilterReset}
//                         >
//                           Clear
//                         </button>
//                       </div>
//                       <div className="position-absolute bottom-0 end-0 me-2 mb-2">
//                         <button
//                           className="btn btn_primary"
//                           onClick={filterSubmit}
//                         >
//                           Save
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="card-body">

//                 <div className="table-container table-scroll table-responsive table-card  border-0">
//                   <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
//                     <thead>
//                       <tr className="">
//                         <th
//                           scope="col"
//                           className="fs-13 lh-xs fw-600  "
//                         >
//                           S.No
//                         </th>
//                         <th
//                           scope="col"
//                           className="fs-13 lh-xs  fw-600  "
//                         >
//                           Name
//                         </th>
//                         <th
//                           scope="col"
//                           className="fs-13 lh-xs  fw-600  "
//                         >
//                           Course
//                         </th>
//                         <th
//                           scope="col"
//                           className="fs-13 lh-xs fw-600  "
//                         >
//                           Registration ID
//                         </th>
//                         <th scope="col"
//                           className="fs-13 lh-xs  fw-600 text-truncate"
//                           title="Course Certificate Status"
//                           style={{ maxWidth: "120px" }}
//                         >
//                           Course Certificate Status
//                         </th>
//                         <th scope="col"
//                           className="fs-13 lh-xs  fw-600 text-truncate"
//                           title="Internship Certificate Status"
//                           style={{ maxWidth: "120px" }}
//                         >
//                           Internship Certificate Status
//                         </th>
//                         <th scope="col"
//                           className="fs-13 lh-xs  fw-600 text-truncate"
//                           title="IEP Certificate Status"
//                           style={{ maxWidth: "120px" }}
//                         >
//                           IEP Certificate Status
//                         </th>
//                         <th scope="col"
//                           className="fs-13 lh-xs  fw-600 text-truncate"
//                           title="Requested Date"
//                           style={{ maxWidth: "120px" }}
//                         >
//                           Requested Date
//                         </th>

//                         <th scope="col"
//                           className="fs-13 lh-xs  fw-600 text-truncate"
//                           title="Requested Time"
//                           style={{ maxWidth: "120px" }}
//                         >
//                           Requested Time
//                         </th>
//                         <GateKeeper requiredModule="Student Management" submenumodule="Requested Certificate" submenuReqiredPermission="canUpdate">
//                           <th
//                             scope="col"
//                             className="fs-13 lh-xs  fw-600 "
//                           >
//                             Issue Certificate
//                           </th>
//                         </GateKeeper>

//                       </tr>
//                     </thead>
//                     <tbody className="">
//                       {Requested_CertificateStudents.Paginated_Requested_CertificateStudents &&
//                         Requested_CertificateStudents
//                           .Paginated_Requested_CertificateStudents.length > 0 ? (
//                         Requested_CertificateStudents.loading ? (
//                           <td className="fs-13 black_300  lh-xs bg_light ">
//                             loading...
//                           </td>
//                         ) : (
//                           Requested_CertificateStudents.Paginated_Requested_CertificateStudents.map(
//                             (item, index) => {

//                               const date = item.certificate_status[0]?.RequestedDate

//                               // Split the date and time
//                               const [requestedDatePart, requestedtimePart] = date.split(' ');

//                               let certificateStatusObj = item.certificate_status;

//                               if (typeof certificateStatusObj === "string") {
//                                 certificateStatusObj = JSON.parse(certificateStatusObj);
//                               }
//                               const certificateStatus = certificateStatusObj.map((item) => item.certificateStatus).join(", ");
//                               return (
//                                 <tr>
//                                   <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
//                                     {(Requested_CertificateStudents?.currentPage - 1) *
//                                       Requested_CertificateStudents.perPage +
//                                       index +
//                                       1}
//                                   </td>
//                                   <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item.name}>
//                                     {item?.name}
//                                   </td>
//                                   <td className="fs-13 black_300  lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }} title={item.courses}>
//                                     {item?.courses}
//                                   </td>
//                                   <td className="fs-13 black_300  lh-xs bg_light">
//                                     {item?.registrationnumber}
//                                   </td>
//                                   <td className="fs-13 black_300  lh-xs bg_light" >
//                                     {certificateStatus === "" ? "Not At Issued" : certificateStatus === "request Submitted" ? "Pending" : certificateStatus === "issued" ? "Issued" : ""}
//                                   </td>
//                                   <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }}>
//                                     {item?.certificate_status[0]?.internShip?.internShipCertificateStatus ? item?.certificate_status[0]?.internShip?.internShipCertificateStatus === "InternShip Not Issued" ? "Not Issued" : item?.certificate_status[0]?.internShip?.internShipCertificateStatus === "InternShip Request Submitted" ? "pending" : "Issued" : "Not At Issued"}
//                                   </td>
//                                   <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }}>
//                                     {item?.certificate_status[0]?.iep?.iepCertificateStatus ? item?.certificate_status[0]?.iep?.iepCertificateStatus === "IEP Not Issued" ? "Not Issued" : item?.certificate_status[0]?.iep?.iepCertificateStatus === "IEP Request Submitted" ? "pending" : "Issued" : "Not At Issued"}
//                                   </td>
//                                   {/* <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }}>
//                                     {item.certificate_status[0]?.RequestedDate}
//                                   </td> */}

//                                   <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }}>
//                                     {requestedDatePart ? requestedDatePart : "NA"}
//                                   </td>

//                                   <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "120px" }}>
//                                     {requestedtimePart ? requestedtimePart : "NA"}
//                                   </td>

//                                   <GateKeeper requiredModule="Student Management" submenumodule="Requested Certificate" submenuReqiredPermission="canUpdate">
//                                     <td className="fs-13 black_300  lh-xs  bg_light">
//                                       {certificateStatus ===
//                                         "request Submitted" && (
//                                           <Link to={`/student/certificateissueform/issue/${item.registrationnumber}`}>
//                                             <div
//                                               className=" rounded  btn_issue_certificate font-size-xxs fw-100 btn-block text-center pt-1 pb-1 text-white"
//                                               type="button"
//                                             >
//                                               Issue Certificate
//                                             </div>
//                                           </Link>
//                                         )}
//                                     </td>
//                                   </GateKeeper>

//                                 </tr>
//                               );
//                             }
//                           )
//                         )
//                       ) : (
//                         <tr>
//                           <td className="fs-13 black_300 lh-xs bg_light">
//                             No data
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 <div className=" mt-4 align-items-center d-flex justify-content-between row text-center text-sm-start">
//                   <div className="col-sm">
//                     <PaginationInfo
//                       data={{
//                         length: Requested_CertificateStudents?.Paginated_Requested_CertificateStudents?.length,
//                         start: Requested_CertificateStudents?.startStudent,
//                         end: Requested_CertificateStudents?.endStudent,
//                         total: Requested_CertificateStudents?.searchResultStudents,
//                       }}
//                       loading={Requested_CertificateStudents?.loading}
//                     />
//                   </div>
//                   <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
//                     <div className="mt-2">
//                       <select
//                         className="form-select form-control me-3 text_color bg_input_color pagination-select"
//                         aria-label="Default select example"
//                         placeholder="Branch*"
//                         name="branch"
//                         required
//                         value={Requested_CertificateStudents?.perPage}
//                         onChange={handlePerPage}
//                       >
//                         <option value="10">10</option>
//                         <option value="25">25</option>
//                         <option value="50">50</option>
//                         <option value="75">75</option>
//                         <option value="100">100</option>
//                       </select>
//                     </div>

//                     <div className=''>
//                       <Pagination
//                         currentPage={Requested_CertificateStudents?.currentPage}
//                         totalPages={Requested_CertificateStudents?.totalPages}
//                         loading={Requested_CertificateStudents?.loading}
//                         onPageChange={handlePageChange}
//                       />
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RequestedCertificate;
