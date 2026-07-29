import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import "../../../../assets/css/Table.css";
import BackButton from "../../../components/backbutton/BackButton";
import { MdFilterList } from "react-icons/md";
import { toast } from "react-toastify";

import Pagination from "../../../../utils/Pagination";
import PaginationInfo from "../../../../utils/PaginationInfo";

import { FaRotate } from "react-icons/fa6";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";

import GateKeeper from "../../../../rbac/GateKeeper";
import { useFetcher, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { debounce } from "../../../../utils/Utils";
import CustomFilters from "../../../../utils/CustomFilters";

export const issuedCertificatesLoader = async ({ request, params }) => {
  const url = new URL(request.url); // Extract the URL
  const queryParams = url.search;

  try {
    const [
      certificateStudentsData,
      BranchesData,
      coursesData,
    ] = await Promise.all([
      ERPApi.get(
        `/sc/issuedcertificates${queryParams ? queryParams : `?page=1&pageSize=10&search=`
        }`
      ),
      ERPApi.get(`/settings/getbranch`),
      ERPApi.get(`/batch/course`),
    ]);

    const BranchsList = BranchesData?.data?.branchData?.map((item) => ({
      label: item?.branch_name,
      value: item.id,
    }));

    const coursesList = coursesData?.data?.reversedCourses?.map((item) => ({
      label: item?.course_name,
      value: item.id,
    }));



    const certificateStudentsList = certificateStudentsData.data;

    return {
      coursesList,
      BranchsList,

      certificateStudentsList,
    };
  }


  catch (error) {
    console.error(error);
    return null;
  }
};

export const issuedCerificateAction = async ({ request, params }) => {

  switch (request.method) {
    case "PUT":
      try {
        const data = await request.json();
        const studentId = data?.studentId;

        const responsePromise = ERPApi.put(`/sc/certificatestatus/${studentId}`, data);
        const response = await toast.promise(responsePromise, {
          pending: "Re-issuing the Certificate , Please wait...",
          success: {
            render({ data }) {
              const successMessage = data?.response?.data?.message || "Certificate re-issued successfully!";
              return successMessage;
            },
          },
          error: {
            render({ data }) {
              const errorMessage = data?.response?.data?.message || "Something went wrong. Please try again.";
              return errorMessage;
            },
          },
        });

        if (response?.status === 200) {
          return { data: response?.data, status: response?.status };
        }



      } catch (error) {
        const message = error?.response?.data?.message;
        const statusCode = error.response?.data?.status;
        return { message, statusCode };
      }
      break;

    default:
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      });

  }
}

const IssuedCertificates = () => {
  const fetcher = useFetcher();
  const data = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const { coursesList, BranchsList, certificateStudentsList } =
    data;
  const Issued_CerificateStudents = certificateStudentsList;

  const initialFilterData = [
    { label: "From Date", type: "date", inputname: "admissionFromDate", value: "" },
    { label: "TO Date", type: "date", inputname: "admissionToDate", value: "" },
    {
      label: "Course",
      type: "select",
      inputname: "course",
      value: "",
      options: coursesList,
    },
    {
      label: "Branch",
      type: "select",
      inputname: "branch",
      value: "",
      options: BranchsList,
    },
    {
      label: "Student's Type",
      type: "select",
      inputname: "oldornew",
      value: "",
      options: [
        { label: "Existing Students", value: "newStudents" },
        { label: "Old Students", value: "oldStudents" },
      ],
    },
    // {
    //     label: "InternShip Status", type: "select", inputname: "internShipStatus", value: "", options: [
    //         { label: "Issued", value: "InternShip Certificate Issued" },
    //         { label: "Not Issued", value: "InternShip Not Issued" },
    //         // { label: "Not At Issued", value: " " },

    //     ],
    // },
    // {
    //     label: "IEP Status", type: "select", inputname: "iepStatus", value: "", options: [
    //         { label: "Issued", value: "IEP Certificate Issued" },
    //         { label: "Not Issued", value: "IEP Not Issued" },
    //         // { label: "Not At Issued", value: " " },
    //     ],
    // },
  ];
  const [filterData, setFilterData] = useState(initialFilterData);

  const [Qparams, setQParams] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    branch: "",
    course: "",

    admissionToDate: "",
    oldornew: "",
    admissionFromDate: "",
  });

  const handleSearch = (event) => {
    setQParams({
      ...Qparams,
      search: event.target.value,
    });
  };

  const handlePageChange = (page) => {
    setQParams({
      ...Qparams,
      page,
    });
  };

  const handlePerPage = (event) => {
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
        "filter[branch]": param.branch || "",
        "filter[course]": param.course || "",
        "filter[admissionFromDate]": param.admissionFromDate || "",
        "filter[admissionToDate]": param.admissionToDate || "",
        "filter[oldornew]": param.oldornew || "",
      }).toString();

      submit(`?${searchParams}`, { method: "get", action: "." });
    }, 500),
    []
  );

  const handleReIssueCertificate = async (e, studentid) => {
    e.preventDefault();

    const data = {
      certificate_status: [],
      studentId: studentid
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to re-issue this certificate. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Re-Issue it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetcher.submit(data, {
            method: "PUT",
            encType: "application/json"
          })
        } catch (error) {
          console.error(error)
        }
      }
    });
  };

  return (
    <div>
      <BackButton
        heading="Issued Certificate"
        content="Back"
        to="/student/requestedcertificate"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for..."
                        name="search"
                        required
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex justify-content-end">
                      <div className="fs-13 me-3 mt-2"></div>

                      <button
                        className="btn btn_primary fs-13 me-2 "
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        {" "}
                        <MdFilterList className="me-1 mb-1" /> Filters
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="offcanvas offcanvas-end  "
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">
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
                    <CustomFilters
                      filterData={filterData}
                      Qparams={Qparams}
                      setQParams={setQParams}
                      setFilterData={setFilterData}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-container table-scroll table-responsive table-card  border-0">
                  <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                    <thead>
                      <tr className="">
                        <th
                          scope="col"
                          className="fs-13 lh-xs fw-600 black_300 "
                        >
                          S.No
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600  "
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600  "
                        >
                          Course
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600  "
                        >
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
                          Issued Date
                        </th>

                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                          title="Requested Time"
                          style={{ maxWidth: "120px" }}
                        >
                          Issued Time
                        </th>

                        <th
                          scope="col"
                          className="fs-13 lh-xs black_300 fw-600 "
                        >
                          Certificate&nbsp;Status
                        </th>

                        <GateKeeper
                          requiredModule="Student Management"
                          submenumodule="Issued Certificate"
                          submenuReqiredPermission="canUpdate"
                        >
                          <th
                            scope="col"
                            className="fs-13 lh-xs black_300 fw-600 text-truncate"
                            title=" Certificate Re-Issue"
                            style={{ maxWidth: "120px" }}
                          >
                            Revoke Certificate
                          </th>
                        </GateKeeper>
                      </tr>
                    </thead>
                    <tbody className="">
                      {Issued_CerificateStudents?.students &&
                        Issued_CerificateStudents?.students.length > 0 ? (
                        Issued_CerificateStudents.loading ? (
                          <tr>
                            <td className="fs-13 black_300  lh-xs bg_light ">
                              loading...
                            </td>
                          </tr>
                        ) : (
                          Issued_CerificateStudents.students.map(
                            (item, index) => {
                              const date =
                                item.certificate_status[0]?.issuedDate;

                              // Split the date and time
                              const [issuedDatePart, issuedtimePart] =
                                date.split(" ");

                              let certificateStatusObj =
                                item.certificate_status;
                              if (typeof certificateStatusObj === "string") {
                                certificateStatusObj =
                                  JSON?.parse(certificateStatusObj);
                              }
                              const certificateStatus = certificateStatusObj
                                ?.map((item) => item?.certificateStatus)
                                ?.join(", ");

                              return (
                                <tr key={index + 1}>
                                  <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                    {(Issued_CerificateStudents?.currentPage -
                                      1) *
                                      Issued_CerificateStudents.pageSize +
                                      index +
                                      1}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "150px" }}
                                    title={item?.name}
                                  >
                                    {item?.name}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "150px" }}
                                    title={item?.courses}
                                  >
                                    {item?.courses}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.registrationnumber}
                                  </td>

                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {certificateStatus === ""
                                      ? "Not At Issued"
                                      : certificateStatus ===
                                        "request Submitted"
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
                                        : item?.certificate_status[0]
                                          ?.internShip
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
                                    {issuedDatePart ? issuedDatePart : "NA"}
                                  </td>

                                  <td
                                    className="fs-13 black_300 lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "120px" }}
                                  >
                                    {issuedtimePart ? issuedtimePart : "NA"}
                                  </td>

                                  <td className="fs-13 black_300  lh-xs  bg_light">
                                    {certificateStatus === "issued" && (
                                      <div
                                        className="text-white rounded font-size-xxs   btn_issued_certificate fw-100 text-center pt-1 pb-1 ps-1"
                                        type="button"
                                        style={{ cursor: "not-allowed" }}

                                      >
                                        Certificate Issued
                                      </div>
                                    )}
                                  </td>
                                  <GateKeeper
                                    requiredModule="Student Management"
                                    submenumodule="Issued Certificate"
                                    submenuReqiredPermission="canUpdate"
                                  >
                                    <td
                                      className="fs-13 black_300 lh-xs bg_light text-center text-truncate"
                                      style={{
                                        maxWidth: "70px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {" "}
                                      <FaRotate
                                        className="edit_icon table_icons me-3"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Re-issue"
                                        onClick={(e) =>
                                          handleReIssueCertificate(
                                            e,
                                            item?.registrationnumber
                                          )
                                        }
                                      />
                                    </td>
                                  </GateKeeper>
                                </tr>
                              );
                            }
                          )
                        )
                      ) : (
                        <tr>
                          <td className="fs-13 black_300  lh-xs  bg_light">
                            No data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: Issued_CerificateStudents?.students?.length,
                        start: Issued_CerificateStudents?.startStudent,
                        end: Issued_CerificateStudents?.endStudent,
                        total: Issued_CerificateStudents?.searchResultStudents,
                      }}
                      loading={navigation?.state === "loading"}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color pagination-select"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                        onChange={handlePerPage}
                        value={Issued_CerificateStudents?.pageSize}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>

                    <div className="ram">
                      <Pagination
                        currentPage={Issued_CerificateStudents?.currentPage}
                        totalPages={Issued_CerificateStudents?.totalPages}
                        loading={navigation?.state === "loading"}
                        onPageChange={handlePageChange}
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
};
export default IssuedCertificates;
