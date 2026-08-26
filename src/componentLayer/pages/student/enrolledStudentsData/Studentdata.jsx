import React, { useEffect, useMemo, useState } from "react";
import "../../../../assets/css/Table.css";
import { AiFillEye } from "react-icons/ai";
import { RiEdit2Line, RiSendPlaneFill } from "react-icons/ri";
import { FaRupeeSign } from "react-icons/fa";
import { MdLocalPrintshop, MdOutlinePersonAddDisabled } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { HiMiniPlus } from "react-icons/hi2";
import BackButton from "../../../components/backbutton/BackButton";
import Usedebounce from "../../../../dataLayer/hooks/useDebounce/Usedebounce";
import { useUserContext } from "../../../../dataLayer/hooks/useUserContext";
import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
import Button from "../../../components/button/Button";
import { MdFilterList } from "react-icons/md";
import GateKeeper from "../../../../rbac/GateKeeper";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { Offcanvas } from "bootstrap";
import { toast } from "react-toastify";
import { useLeadSourceContext } from "../../../../dataLayer/hooks/useLeadSourceContext";
import * as XLSX from "xlsx";
import Pagination from "../../../../utils/Pagination";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Filter from "../../../../utils/Filter";
import AssignBatch from "./AssignBatch";
import FormattedDate from "../../../../utils/FormattedDate";
import { BiExport } from "react-icons/bi";
import { IoAddCircleSharp } from "react-icons/io5";
import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext.jsx";
import { useCoursePackage } from "../../../../dataLayer/hooks/useCoursePackage.jsx";
import Swal from "sweetalert2";
import Defaultimg from "../../../../assets/images/student_idCard_images/DefaultimgBG.png";
import { RxDotFilled } from "react-icons/rx";

function Studentdata() {
  const {
    studentState: { EnrolledStudents },
    Dispatchstudents,
    getPaginatedStudentsData,
  } = useStudentsContext();
  const { BranchState } = useBranchContext();
  const {
    UsersState: { TotalUsersWithCountellers },
  } = useUserContext();
  const { leadSourceState } = useLeadSourceContext();

  const { courseState } = useCourseContext();
  const { coursePackageState } = useCoursePackage();

  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  const [admissionDetails, setAdmissionDetails] = useState(() => {
    const data = JSON.parse(localStorage.getItem("admissionDetails"));
    return data || "";
  });

  const { debouncesetSearch, debouncesetPage } = Usedebounce(Dispatchstudents);

  const [showModal2, setShowModal2] = useState(false);
  const [singleStudent, setSingleStudent] = useState({});

  const handleStudentToBatch = async (item) => {
    if (item) {
      setSingleStudent(item);
      setShowModal2(true);
    }
  };

  const handleCloseModal2 = () => setShowModal2(false);

  const EnquirytakenByData = useMemo(
    () =>
      TotalUsersWithCountellers?.map((item) => ({
        label: item?.fullname,
        value: item?.id,
      })) || [],
    [TotalUsersWithCountellers]
  );

  const branchData = useMemo(
    () =>
      BranchState?.branches?.map((item) => ({
        label: item?.branch_name,
        value: item?.id,
      })) || [],
    [BranchState?.branches]
  );

  const leadSourceData = useMemo(
    () =>
      leadSourceState?.leadSources?.map((item) => ({
        label: item?.leadsource,
        value: item?.id,
      })) || [],
    [leadSourceState?.leadSources]
  );

  const coursesPackageData = useMemo(
    () =>
      coursePackageState?.coursepackages?.map((item) => ({
        label: item?.coursepackages_name,
        value: item?.id,
      })) || [],
    [coursePackageState?.coursepackages]
  );

  const coursesData = useMemo(
    () =>
      courseState?.courses?.map((item) => ({
        label: item?.course_name,
        value: item?.id,
      })) || [],
    [courseState?.courses]
  );

  // Define the initial state for filters with urlParam mapping
  const initialFilterStructure = useMemo(() => [
    { label: "From Date", type: "date", inputname: "fromDate", urlParam: "admissionFromDate", value: "" },
    { label: "TO Date", type: "date", inputname: "toDate", urlParam: "admissionToDate", value: "" },
    {
      label: "Lead Source",
      type: "select",
      inputname: "lead",
      urlParam: "leadsource",
      value: "",
      options: [],
    },
    {
      label: "Counsellor",
      type: "select",
      inputname: "enquiry",
      urlParam: "enquiryTakenby",
      value: "",
      options: [],
    },
    {
      label: "Branch",
      type: "select",
      value: "",
      inputname: "branch",
      urlParam: "branch",
      options: [],
    },
    {
      label: "Mode Of Training",
      type: "select",
      inputname: "modeOfTraining",
      urlParam: "modeOfTraining",
      value: "",
      options: [
        { label: "online", value: "online" },
        { label: "offline", value: "offline" },
      ],
    },
    {
      label: "Course",
      type: "select",
      value: "",
      inputname: "course",
      urlParam: "course",
      options: [],
    },
    {
      label: "Course Package",
      type: "select",
      value: "",
      inputname: "coursepackage",
      urlParam: "coursepackageId",
      options: [],
    },
  ], []);

  const [filterData, setFilterData] = useState(initialFilterStructure);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  // This useEffect populates the options for select filters
  useEffect(() => {
    setFilterData((prevState) =>
      prevState.map((item) => {
        if (item.inputname === "lead") {
          return { ...item, options: leadSourceData };
        }
        if (item.inputname === "enquiry") {
          return { ...item, options: EnquirytakenByData };
        }
        if (item.inputname === "branch") {
          return { ...item, options: branchData };
        }
        if (item.inputname === "course") {
          return { ...item, options: coursesData };
        }
        if (item.inputname === "coursepackage") {
          return { ...item, options: coursesPackageData };
        }
        return item;
      })
    );
  }, [
    leadSourceData,
    EnquirytakenByData,
    branchData,
    coursesPackageData,
    coursesData,
  ]);

  // HandleFilters: ONLY updates local state, does not touch URL
  const HandleFilters = (index, name, value) => {
    setFilterData(prevState =>
      prevState.map((item, idx) =>
        idx === index ? { ...item, value: value } : item
      )
    );
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newSearchParams.set("search", value);
    } else {
      newSearchParams.delete("search");
    }
    newSearchParams.set("page", 1); // Reset page to 1 on search
    setSearchParams(newSearchParams);

    debouncesetSearch({ context: "ENROLLED_STUDENTS", data: value });
  };

  const handlePerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("pageSize", selectedvalue.toString());
    newSearchParams.set("page", 1); // Reset page to 1 when perPage changes
    setSearchParams(newSearchParams);

    Dispatchstudents({
      type: "SET_PER_PAGE",
      payload: {
        context: "ENROLLED_STUDENTS",
        data: selectedvalue,
      },
    });
  };

  // FilterReset: Clears local state AND URL params for filters
  const FilterReset = () => {
    const resetFilterData = filterData?.map((item) => ({
      ...item,
      value: "",
    }));
    setFilterData(resetFilterData);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    initialFilterStructure.forEach(filter => {
      newSearchParams.delete(filter.urlParam || filter.inputname);
    });
    newSearchParams.set("page", "1");

    setSearchParams(newSearchParams);
    Dispatchstudents({
      type: "SET_FILTERS",
      payload: {
        context: "ENROLLED_STUDENTS",
        data: {
          fromDate: "", toDate: "", branch: "", enquiry: "",
          modeOfTraining: "", lead: "", course: "", coursepackage: "",
        },
      },
    });
  };

  // filterSubmit: Applies filters to URL and closes offcanvas
  const filterSubmit = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const appliedFilters = filterData.reduce((acc, item) => {
      const urlParamName = item.urlParam || item.inputname;
      if (item.value) {
        newSearchParams.set(urlParamName, item.value);
        acc[item.inputname] = item.value;
      } else {
        newSearchParams.delete(urlParamName);
      }
      return acc;
    }, {});

    // Validation check
    if (
      !appliedFilters.fromDate && !appliedFilters.toDate &&
      !appliedFilters.branch && !appliedFilters.modeOfTraining &&
      !appliedFilters?.enquiry && !appliedFilters?.lead &&
      !appliedFilters?.course && !appliedFilters?.coursepackage
    ) {
      toast.error("Please fill in at least one filter criteria.");
      return;
    }
    newSearchParams.set("page", 1);
    setSearchParams(newSearchParams)
    // Close the offcanvas
    const offcanvasElement = document.getElementById("offcanvasRight");
    const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  };

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);

    debouncesetPage({ context: "ENROLLED_STUDENTS", data: page });
  };

  // Main useEffect to read URL params and update context
  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    const fromDateParam = searchParams.get("admissionFromDate") || "";
    const toDateParam = searchParams.get("admissionToDate") || "";
    const modeOfTrainingParam = searchParams.get("modeOfTraining") || "";
    const branchParam = searchParams.get("branch") || "";
    const enquiryParam = searchParams.get("enquiryTakenby") || "";
    const leadParam = searchParams.get("leadsource") || "";
    const courseParam = searchParams.get("course") || "";
    const coursePackageParam = searchParams.get("coursepackageId") || "";
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const pageSizeParam = parseInt(searchParams.get("pageSize")) || 10;

    setSearchValue(searchParam);

    setFilterData((prevState) =>
      prevState.map((item) => {
        let valueToSet = "";
        switch (item.urlParam || item.inputname) {
          case "admissionFromDate":
            valueToSet = fromDateParam;
            break;
          case "admissionToDate":
            valueToSet = toDateParam;
            break;
          case "modeOfTraining":
            valueToSet = modeOfTrainingParam;
            break;
          case "branch":
            valueToSet = branchParam;
            break;
          case "enquiryTakenby":
            valueToSet = enquiryParam;
            break;
          case "leadsource":
            valueToSet = leadParam;
            break;
          case "course":
            valueToSet = courseParam;
            break;
          case "coursepackageId":
            valueToSet = coursePackageParam;
            break;
          default:
            return item;
        }
        return { ...item, value: valueToSet };
      })
    );
    Dispatchstudents({
      type: "SET_SEARCH",
      payload: {
        context: "ENROLLED_STUDENTS",
        data: searchParam,
      },
    });

    Dispatchstudents({
      type: "SET_FILTERS",
      payload: {
        context: "ENROLLED_STUDENTS",
        data: {
          fromDate: fromDateParam,
          toDate: toDateParam,
          branch: branchParam,
          enquiry: enquiryParam,
          modeOfTraining: modeOfTrainingParam,
          lead: leadParam,
          course: courseParam,
          coursepackage: coursePackageParam,
        },
      },
    });

    Dispatchstudents({
      type: "SET_CURRENT_PAGE",
      payload: {
        context: "ENROLLED_STUDENTS",
        data: pageParam,
      },
    });

    Dispatchstudents({
      type: "SET_PER_PAGE",
      payload: {
        context: "ENROLLED_STUDENTS",
        data: pageSizeParam,
      },
    });
  }, [searchParams, Dispatchstudents]);

  const [loading, setLoading] = useState(false);

  const exportToExcel = async () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_API_URL}/student/list_students?page=${EnrolledStudents?.currentPage
      }&pageSize=${EnrolledStudents?.searchResultStudents}&search=${EnrolledStudents?.search
      }&filter[admissionFromDate]=${EnrolledStudents?.filters?.fromDate
      }&filter[admissionToDate]=${EnrolledStudents?.filters?.toDate
      }&filter[modeOfTraining]=${EnrolledStudents?.filters?.modeOfTraining
      }&filter[branch]=${EnrolledStudents?.filters?.branch
      }&filter[enquiryTakenby]=${EnrolledStudents?.filters?.enquiry
      }&filter[leadsource]=${EnrolledStudents?.filters?.lead}`;
    try {
      const { data } = await toast.promise(ERPApi.get(url), {
        pending: "Exporting student data...",
        success: "Export successful!",
        error: "Failed to export. Please try again.",
      });

      const students = data?.students || [];
      const formattedData = students.map((student, index) => {
        const installmentDetails = student.studentInstallments
          .map((installment, i) => ({
            [`${i + 1} Installment`]: installment.paidamount || "N/A",
            [`${i + 1} paidDate`]:
              new Date(installment.paiddate).toLocaleDateString() || "N/A",
            [`${i + 1} Invoice Number`]: installment?.invoice?.adminInvoiceNo || "N/A",
          }))
          .reduce((acc, cur) => ({ ...acc, ...cur }), {});
        return {
          "S.No":
            (EnrolledStudents.currentPage - 1) *
            EnrolledStudents.searchResultStudents +
            index +
            1,
          "Student Name": student.name,
          Contact: student.mobilenumber,
          Email: student.email,
          Branch: student.branch,
          Counsellor: student.enquirytakenby,
          CoursePackage: student?.course[0]?.course_package,
          CourseName: student?.course[0]?.course_name,
          InitialDiscount: student?.feedetails?.find((fee) => fee.feetype === "fee")?.discount || 0,
          ExtraDiscount: student?.extra_discount?.map((d) => `${d.Discount}`).join(", ") || "0",
          TrainingMode: student?.modeoftraining,
          AdmissionDate: student.admissiondate,
          CourseEndDate: student.certificate_status?.[0]?.courseEndDate || "N/A",
          AdmissionFee: `${student.admissionFee?.admissionAmount || 0}`,
          InvoiceNumber: `${student.admissionFee?.invoice?.adminInvoiceNo || 0}`,
          TotalAmount: student.finaltotal,
          PaidAmount: student?.totalpaidamount,
          DueAmount: student?.dueamount,
          ...installmentDetails,
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      worksheet["!cols"] = [
        { wpx: 50 }, // S.No
        { wpx: 150 }, // Student Name
        { wpx: 150 }, // Contact
        { wpx: 150 }, // Email
        { wpx: 150 }, // Branch
        { wpx: 150 }, //Counsellor
        { wpx: 200 }, // Course Package
        { wpx: 150 }, // Course Name
        { wpx: 150 }, // Initial Discount
        { wpx: 150 }, // Extra Discount
        { wpx: 150 }, // Training Mode
        { wpx: 70 }, // AdmissionFee
        { wpx: 70 }, // Invoice Number
        { wpx: 100 }, // TotalAmount
        { wpx: 100 }, // PaidAmount
        { wpx: 100 }, // DueAmount
        ...Array(16).fill({ wpx: 150 }), // Installments
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      XLSX.writeFile(workbook, "EnrolledStudents.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCredentials = async (item) => {
    Swal.fire({
      title: "Confirm Credential Sending",
      text: `Are you sure you want to send credentials to ${item?.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Send Credentials",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data, status } = await toast.promise(
            ERPApi.post(`/auth/student/signup?studentId=${item.id}`),
            {
              pending: `Sending credentials to ${item?.name}...`,
            }
          );

          if (status === 200) {
            Swal.fire({
              title: "Credentials Sent!",
              text: "Please check your email for your credentials.",
              icon: "success",
            });
          }
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            "Sending credentials failed. Please try again.";
          Swal.fire({
            title: "Error Sending Credentials",
            text: errorMessage,
            icon: "error",
          });
        }
      }
    });
  };

  const [openModal, setOpenModal] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [reasons, setReasons] = useState([]);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("data"));
        const token = storedUser?.token;
        if (!token) return;

        const response = await ERPApi.get(
          `${import.meta.env.VITE_API_URL}/student/getInactiveReasons`,
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );
        setReasons(response.data);
      } catch (error) {
        console.error("Error fetching reasons:", error);
      }
    };
    if (openModal) {
      fetchReasons();
    }
  }, [openModal]);

  const handleToggleChange = (id, e) => {
    const isChecked = e.target.checked;
    setSelectedUserId(id);
    setUserStatus(isChecked);
    setOpenModal(true);
    setText("");
  };

  const handleActivate = async () => {
    if (!text) {
      toast.error("Please provide a reason for deactivation.");
      return;
    }

    try {
      const { data, status } = await toast.promise(
        ERPApi.put(
          `${import.meta.env.VITE_API_URL
          }/student/updateStudentsStatus/${selectedUserId}`,
          { description: text, status: 1 }
        ),
        {
          pending: "Activating user, please wait...",
          success: {
            render({ data }) {
              return `User has been successfully activated!`;
            },
          },
          error: "Error activating user. Please try again later.",
        }
      );
      if (status === 200) {
        getPaginatedStudentsData();
        setText("");
        setOpenModal(false);
        setError("");
      }
    } catch (error) {
      toast.error("There was an error activating the user.");
    }
  };

  const handleInActivate = async () => {
    if (!text) {
      toast.error("Please provide a reason for deactivation.");
      return;
    }

    try {
      const { data, status } = await toast.promise(
        ERPApi.put(
          `${import.meta.env.VITE_API_URL
          }/student/updateStudentsStatus/${selectedUserId}`,
          { reasonText: text, status: 0 }
        ),
        {
          pending: "Deactivating student, please wait...",
          success: {
            render({ data }) {
              return `Student has been successfully deactivated!`;
            },
          },
          error: "Error deactivating user. Please try again later.",
        }
      );
      if (status === 200) {
        getPaginatedStudentsData();
        setText("");
        setUserStatus(false);
        setOpenModal(false);
        setError("");
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast.error("There was an error deactivating the user.");
    }
  };


  return (
    <div>
      <BackButton heading="Enrolled Students " content="Back" />
      <div className="container-fluid">
        <div className="row response">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className=" row d-flex justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      <input
                        type="search"
                        className="form-control search input_bg_color text_color"
                        placeholder="Search for..."
                        name="search"
                        required
                        value={searchValue}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 response-btn">
                    <div className="buttons_alignment ">
                      <GateKeeper
                        requiredModule="Student Management"
                        submenumodule="Enrolled Students"
                        submenuReqiredPermission="canUpdate"
                      >
                        <div style={{ cursor: loading ? "not-allowed" : "pointer" }}>
                          <button
                            className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
                            type="button"
                            onClick={() => exportToExcel()}
                            disabled={loading}
                          ><BiExport className="me-1 mb-1" />
                            Export
                          </button>
                        </div>
                      </GateKeeper>
                      <button
                        className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
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
                        submenumodule="Enrolled Students"
                        submenuReqiredPermission="canCreate"
                      >
                        <Button
                          type="button"
                          className="btn btn-sm btn_primary fs-13 mt-2 margin_top_12 button-res"
                        >
                          <Link to={`/student/enrollment?active=1&coursepackageId=${admissionDetails?.coursepackageId ? admissionDetails?.coursepackageId : null}`} className="button_color ">
                            {<HiMiniPlus />} Add Enrollment
                          </Link>
                        </Button>


                      </GateKeeper>
                    </div>
                  </div>
                </div>
                <div
                  className="offcanvas offcanvas-end  bg_white"
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header ">
                    <h5
                      className="offcanvas-title  text_color"
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
                  <div className="offcanvas-body p-2 bg_white">
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
                <div className="table-responsive table-card table-container table-scroll border-0">
                  <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                    <thead>
                      <tr className="">
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          S.No
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                          Student&nbsp;Name
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600  text-truncate"
                          title="Registration Number"
                          style={{ maxWidth: "120px" }}
                        >
                          Registration&nbsp;Number
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                          Branch
                        </th>
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          Package
                        </th>
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          Course
                        </th>
                        <th scope="col" className="fs-13 lh-xs fw-600 ">
                          Counsellor
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600 ">
                          Mobile
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600 ">
                          Email
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                          title=" Training Mode"
                          style={{ maxWidth: "70px" }}
                        >
                          Joining&nbsp;Date
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 action-column"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {EnrolledStudents.PaginatedStudents &&
                        EnrolledStudents.PaginatedStudents.length > 0 ? (
                        EnrolledStudents.loading ? (
                          <tr>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              Loading...
                            </td>
                          </tr>
                        ) : (
                          EnrolledStudents.PaginatedStudents.map(
                            (item, index) => {
                              return (
                                <tr key={item.id} className={item.status ? "" : "style"}>
                                  <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                    {(EnrolledStudents?.currentPage - 1) *
                                      EnrolledStudents.perPage +
                                      index +
                                      1}
                                  </td>

                                  <td


                                    className="fs-13 black_300 lh-xs bg_light text-truncate"


                                    style={{ maxWidth: "150px" }}
                                    title={item.name}
                                  >
                                    {/* <span
                                      style={{
                                        width: "20px", // Adjust the size of the circle
                                        height: "20px", // Adjust the size of the circle
                                        borderRadius: "50%", // Make it circular
                                        overflow: "hidden", // Ensure the image doesn't overflow the circle
                                        display: "inline-block", // Keep the span inline
                                        marginBottom:"-4px",
                                        marginRight:"4px",
                                        border: "1px solid black",
                                        
                                        
                                      }}
                                      
                                    >
                                      <img
                                        src={
                                          item?.studentImg
                                            ? `https://teksacademy.s3.ap-south-1.amazonaws.com/studentManagement/regStudentImgs/${item?.studentImg}`
                                            : Defaultimg
                                        }
                                        alt="Student Img"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = Defaultimg;
                                        }}
                                        style={{
                                          width: "100%", // Make the image fill the container
                                          height: "100%", // Make the image fill the container
                                          objectFit: "cover", // Ensure the image covers the circular area without distortion
                                        }}
                                      />
                                    </span> */}

                                    <span className={item?.studentaactions[0]?.studentActive === 1 ? "fs-13 text-success lh-xs  " : "fs-13  lh-xs  text-danger"}>< RxDotFilled /></span>
                                    {item?.name}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.registrationnumber}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.branches?.branch_name}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "120px" }}
                                    title={item?.course[0]?.course_package}
                                  >
                                    {item.course[0]?.course_package}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "120px" }}
                                    title={item?.course[0]?.course_name
                                      ? item?.course[0]?.course_name
                                      : item?.courses}
                                  >
                                    {item.course[0]?.course_name
                                      ? item.course[0]?.course_name
                                      : item.courses}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "120px" }}
                                    title={item?.enquirytakenby}
                                  >
                                    {item?.enquirytakenby}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light ">
                                    {item?.mobilenumber}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "150px" }}
                                    title={item?.email}
                                  >
                                    {item?.email}
                                  </td>
                                  <td
                                    className="fs-13 black_300 lh-xs bg_light text-truncate"
                                    title={FormattedDate(item?.admissiondate)}
                                    style={{ maxWidth: "100px" }}
                                  >
                                    {FormattedDate(item?.admissiondate)}
                                  </td>
                                  <td className="fs-14 text_mute bg_light lh-xs d-flex align-items-center" >
                                    <GateKeeper
                                      requiredModule="Student Management"
                                      submenumodule="Enrolled Students"
                                      submenuReqiredPermission="canRead"
                                    >
                                      <Link
                                        to={`/student/views?studentId=${item.id}`}

                                      //  onClick={() => sessionStorage.setItem("id", item.id)}

                                      >
                                        {" "}
                                        <AiFillEye
                                          className="eye_icon table_icons me-3"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="view"
                                        />
                                      </Link>
                                    </GateKeeper>

                                    <GateKeeper
                                      requiredModule="Student Management"
                                      submenumodule="Enrolled Students"
                                      submenuReqiredPermission="canUpdate"
                                    >
                                      {item?.branches?.id ? (
                                        item?.batches?.length > 0 ? (
                                          <span>
                                            <IoAddCircleSharp
                                              className="eye_icon fw-500 table_icons me-3 text-success"
                                              style={{ cursor: "pointer" }}
                                              onClick={(e) =>
                                                handleStudentToBatch(item)
                                              }
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="top"
                                              title="Assign Batch (Note: He/She already in batch)"
                                            />
                                          </span>
                                        ) : (
                                          <span>
                                            <HiMiniPlus
                                              className="eye_icon fw-500 table_icons me-3"
                                              style={{ cursor: "pointer" }}
                                              onClick={(e) =>
                                                handleStudentToBatch(item)
                                              }
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="top"
                                              title="Assign Batch"
                                            />
                                          </span>
                                        )
                                      ) : (
                                        <span>
                                          <MdOutlinePersonAddDisabled
                                            className="eye_icon fw-500 table_icons me-3"
                                            style={{ cursor: "not-allowed" }}
                                          />
                                        </span>
                                      )}
                                    </GateKeeper>

                                    {/* <span>
                                      <HiMiniPlus className="eye_icon fw-500 table_icons me-3" onClick={(e) => handleStudentToBatch(item)} data-bs-toggle="tooltip" data-bs-placement="top" title="Assign Batch" />
                                    </span> */}

                                    <GateKeeper
                                      requiredModule="Student Management"
                                      submenumodule="Enrolled Students"
                                      submenuReqiredPermission="canUpdate"
                                    >
                                      <Link
                                        to={`/student/editstudent/${item?.id}`}
                                      >
                                        {" "}
                                        <RiEdit2Line
                                          className="edit_icon table_icons me-3"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="Edit"
                                        />{" "}
                                      </Link>
                                    </GateKeeper>

                                    <GateKeeper
                                      requiredModule="Student Management"
                                      submenumodule="Fee Details"
                                      submenuReqiredPermission="canUpdate"
                                    >
                                      <Link

                                        // to={`/student/feeview/${item.id}`}

                                        to={`/student/feeUpdate?studentId=${item?.id}`}


                                      >
                                        <FaRupeeSign
                                          className="rupee_icon table_icons me-3"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="Rupee"
                                        />
                                      </Link>
                                    </GateKeeper>

                                    <GateKeeper
                                      requiredModule="Student Management"
                                      submenumodule="Enrolled Students"
                                      submenuReqiredPermission="canRead"
                                    >
                                      <Link
                                        to={`/student/applicationprint/${item.id}`}
                                      >
                                        {" "}
                                        <MdLocalPrintshop
                                          className="text-mute table_icons me-3"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="Print"
                                        />{" "}
                                      </Link>
                                    </GateKeeper>

                                    <GateKeeper
                                      requiredModule="Student Management"
                                      submenumodule="Enrolled Students"
                                      submenuReqiredPermission="canRead"
                                    >
                                      <Link
                                        to={`/student/studentidcard/${item.id}`}
                                      >
                                        {" "}
                                        <FaRegIdCard
                                          className="id_card table_icons  me-3"
                                          data-bs-toggle="tooltip"
                                          data-bs-placement="top"
                                          title="ID Card"
                                        />
                                      </Link>
                                    </GateKeeper>

                                    <GateKeeper
                                      requiredModule="Student Management"
                                      submenumodule="Enrolled Students"
                                      submenuReqiredPermission="canUpdate"
                                    >
                                      <RiSendPlaneFill
                                        className="edit_icon table_icons me-3"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Send Credentials"
                                        onClick={(e) =>
                                          handleSendCredentials(item)
                                        }
                                      />
                                    </GateKeeper>

                                    {(userData?.user.profile === "Admin" ||
                                      userData?.user.profile === "Support") && (
                                        <GateKeeper
                                          requiredModule="Student Management"
                                          submenumodule="Enrolled Students"
                                          submenuReqiredPermission="canUpdate"
                                        >
                                          <span
                                            className="form-check form-switch form-switch-right form-switch-md"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="student status"
                                          >
                                            <input
                                              style={{ cursor: "pointer" }}
                                              className="form-check-input code-switcher toggle_btn"
                                              type="checkbox"
                                              id="FormValidationDefault"
                                              checked={item.status === 1}
                                              onChange={(e) =>
                                                handleToggleChange(item.id, e)
                                              }
                                              data-bs-toggle="modal"
                                              data-bs-target="#staticBackdrop"
                                            />
                                          </span>
                                        </GateKeeper>
                                      )}
                                  </td>
                                </tr>
                              );
                            }
                          )
                        )
                      ) : (
                        <tr>
                          <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                            No data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start ">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: EnrolledStudents?.PaginatedStudents?.length,
                        start: EnrolledStudents?.startStudent,
                        end: EnrolledStudents?.endStudent,
                        total: EnrolledStudents?.searchResultStudents,
                      }}
                      loading={EnrolledStudents?.loading}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0  d-flex">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color  pagination-select"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                        onChange={handlePerPage}
                        value={EnrolledStudents?.perPage}
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
                        currentPage={EnrolledStudents?.currentPage}
                        totalPages={EnrolledStudents?.totalPages}
                        loading={EnrolledStudents?.loading}
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
      {showModal2 === true && singleStudent && (
        <AssignBatch
          show={showModal2}
          handleClose={handleCloseModal2}
          student={singleStudent}
        />
      )}

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-keyboard={openModal ? "true" : "false"}
        data-bs-backdrop="static"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden={!openModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body bg_white">
              <div className="d-flex justify-content-between">
                <label className="form-label fs-s fw-medium black_300">
                  {userStatus ? "Enter Description* :" : "Select Reason* :"}
                </label>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setOpenModal(false)} // Close modal on close button click
                ></button>
              </div>

              {/* Conditionally render the input type based on userStatus */}
              {userStatus === true ? (
                // Activate: Use a textarea for description
                <textarea
                  rows="4"
                  cols="10"
                  name="description"
                  form="usrform"
                  className={`form-control fs-s bg-form text_color input_bg_color ${error ? "error-input" : ""}`}
                  placeholder="Enter a description"
                  onChange={(e) => setText(e.target.value)}
                  value={text}

                ></textarea>
              ) : (
                // Deactivate: Use a select dropdown for reason
                <select
                  name="reason"
                  className={`form-control  fs-s bg-form text_color input_bg_color ${error ? "error-input" : ""}`}
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select a reason</option>
                  {reasons.map((reason, index) => (
                    <option key={index} value={reason.reason}>
                      {reason.reason}
                    </option>
                  ))}
                </select>
              )}

              {error && <p className="text-danger m-0 fs-xs">{error}</p>}
            </div>
            <div className="p-2 d-flex justify-content-end bg_white">
              <button
                type="button"
                className="btn btn-secondary me-2"
                data-bs-dismiss="modal"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>

              {/* Conditional Button for Activate/Deactivate */}
              {userStatus === true && (
                <button
                  className="btn btn_primary"
                  onClick={handleActivate}
                  data-bs-dismiss={openModal ? "" : "modal"}
                >
                  Activate
                </button>
              )}

              {userStatus === false && (
                <button
                  className="btn btn_primary"
                  onClick={handleInActivate}
                  data-bs-dismiss={openModal ? "" : "modal"}
                >
                  Deactivate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Studentdata;
