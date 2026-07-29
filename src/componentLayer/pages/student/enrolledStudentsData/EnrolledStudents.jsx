import {
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import BackButton from "../../../components/backbutton/BackButton";
import Button from "../../../components/button/Button";
import { HiMiniPlus } from "react-icons/hi2";
import {
  MdFilterList,
  MdLocalPrintshop,
  MdOutlinePersonAddDisabled,
} from "react-icons/md";
import { BiExport } from "react-icons/bi";
import SearchInputField from "../../../../utils/SearchInputField";
import { useEffect, useMemo, useState } from "react";
import GateKeeper from "../../../../rbac/GateKeeper";
import Filter from "../../../../utils/FilterWithSearchParams";
import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import * as XLSX from "xlsx";
import Pagination from "../../../../utils/Pagination";
import PaginationInfo from "../../../../utils/PaginationInfo";
import CustomTable from "../../../../utils/CustomTable";
import { Offcanvas } from "bootstrap";
import { RiEdit2Line, RiSendPlaneFill, RiUserAddFill } from "react-icons/ri";
import { FaRegIdCard } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { IoAddCircleSharp } from "react-icons/io5";
import { AiFillEye } from "react-icons/ai";
import AssignBatch from "./AssignBatch";
import Swal from "sweetalert2";
import { BsLayoutThreeColumns } from "react-icons/bs";

const EnrolledStudents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    enrolledStudentsData,
    branchData,
    coursesData,
    leadSourceData,
    coursePackageData,
    usersWithCounsellorsData,
    logsData,
      logsPagination,
  } = useLoaderData();
  const userActiveFetcher = useFetcher();
  const userInActiveFetcher = useFetcher();
  const isPreonboard = searchParams.get("preOnboard") == 1;

  // const [logsData, setLogsData] = useState([]);
  // const [logsPagination, setLogsPagination] = useState({});
  // const [logsLoading, setLogsLoading] = useState(false);

  const EnquirytakenByData = useMemo(
    () =>
      usersWithCounsellorsData?.userswithcounselor?.map((item) => ({
        label: item?.fullname,
        value: item?.id,
      })) || [],
    [usersWithCounsellorsData?.userswithcounselor],
  );

  const FbranchData = useMemo(
    () =>
      branchData?.branchData?.map((item) => ({
        label: item?.branch_name,
        value: item?.id,
      })) || [],
    [branchData],
  );

  const FleadSourceData = useMemo(
    () =>
      leadSourceData?.leadSourceData?.map((item) => ({
        label: item?.leadsource,
        value: item?.leadsource,
      })) || [],
    [leadSourceData],
  );

  const coursesPackageData = useMemo(
    () =>
      coursePackageData?.coursePackageData?.map((item) => ({
        label: item?.coursepackages_name,
        value: item?.id,
      })) || [],
    [coursePackageData],
  );

  const FcoursesData = useMemo(
    () =>
      coursesData?.reversedCourses?.map((item) => ({
        label: item?.course_name,
        value: item?.id,
      })) || [],
    [coursesData?.reversedCourses],
  );

  const initialFilterStructure = useMemo(
    () => [
      {
        label: "From Date",
        type: "date",
        inputname: "fromDate",
        urlParam: "admissionFromDate",
        value: "",
        min: "",
        max: "",
      },
      {
        label: "TO Date",
        type: "date",
        inputname: "toDate",
        urlParam: "admissionToDate",
        value: "",
        min: "",
        max: "",
      },
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
          { label: "Online", value: "online" },
          { label: "Offline", value: "offline" },
          { label: "Self learning", value: "self-learning" },
        ],
      },
      {
        label: "Course",
        type: "search-select",
        inputname: "course",
        urlParam: "course",
        urlSearchParam: "course_label",
        options: FcoursesData ?? [],
        fetchOptions: async (search) => {
          const coursesData = await ERPApi.get(`/batch/course`, {
            params: {
              search: search
                ? search
                : (searchParams.get("course_label") ?? ""),
            },
          });
          const coursesList = coursesData?.data?.reversedCourses?.map(
            (item) => ({
              label: item?.course_name,
              value: item?.id,
            }),
          );
          return coursesList || [];
        },
      },
      {
        label: "Course Package",
        type: "select",
        value: "",
        inputname: "coursepackage",
        urlParam: "coursepackageId",
        options: [],
      },
    ],
    [],
  );

  const [filterData, setFilterData] = useState(initialFilterStructure);
  const [excelLoading, setExcelLoading] = useState(false);

  const [admissionDetails, setAdmissionDetails] = useState(() => {
    const data = JSON.parse(localStorage.getItem("admissionDetails"));
    return data || "";
  });

  const HandleFilters = (index, name, value) => {
    setFilterData((prevState) => {
      let showToast = false;
      let updated = prevState.map((item, idx) =>
        idx === index ? { ...item, value } : item,
      );
      if (name === "fromDate") {
        updated = updated.map((item) => {
          if (item.inputname === "toDate") {
            if (item.value && item.value < value) {
              showToast = true;
              return {
                ...item,
                min: value,
                value: "",
              };
            }
            return {
              ...item,
              min: value,
            };
          }
          return item;
        });
      }
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
    initialFilterStructure.forEach((filter) => {
      newSearchParams.delete(
        filter.urlParam || filter.inputname || filter?.urlSearchParam,
      );
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

  const exportToExcel = async () => {
    setExcelLoading(true);
    const page = searchParams.get("page") || 1;
    const pageSize = enrolledStudentsData?.searchResultStudents || 10;
    const search = searchParams.get("search") || "";
    const admissionFromDate = searchParams.get("admissionFromDate") || "";
    const admissionToDate = searchParams.get("admissionToDate") || "";
    const modeOfTraining = searchParams.get("modeOfTraining") || "";
    const branch = searchParams.get("branch") || "";
    const enquiryTakenby = searchParams.get("enquiryTakenby") || "";
    const leadsource = searchParams.get("leadsource") || "";
    const course = searchParams.get("course") || "";
    const coursepackageId = searchParams.get("coursepackageId") || "";

    const url = `${import.meta.env.VITE_API_URL}/student/list_students?page=${page}&pageSize=${pageSize}&search=${search}&filter[admissionFromDate]=${admissionFromDate}&filter[admissionToDate]=${admissionToDate}&filter[modeOfTraining]=${modeOfTraining}&filter[branch]=${branch}&filter[enquiryTakenby]=${enquiryTakenby}&filter[leadsource]=${leadsource}&filter[course]=${course}&filter[coursepackageId]=${coursepackageId}`;
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
            [`${i + 1} Invoice Number`]:
              installment?.invoice?.adminInvoiceNo || "N/A",
          }))
          .reduce((acc, cur) => ({ ...acc, ...cur }), {});
        return {
          "S.No": index + 1,
          "Student Name": student.name,
          Contact: student.mobilenumber,
          Email: student.email,
          Branch: student.branch,
          Counsellor: student.enquirytakenby,
          CoursePackage: student?.course[0]?.course_package,
          CourseName: student?.course[0]?.course_name,
          LeadSource: student?.leadsource?.[0].source,
          InitialDiscount:
            student?.feedetails?.find((fee) => fee.feetype === "fee")
              ?.discount || 0,
          ExtraDiscount:
            student?.extra_discount?.map((d) => `${d.Discount}`).join(", ") ||
            "0",
          TrainingMode: student?.modeoftraining,
          AdmissionDate: student.admissiondate,
          CourseEndDate:
            student.certificate_status?.[0]?.courseEndDate || "N/A",
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
        { wpx: 50 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 200 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 100 },
        ...Array(16).fill({ wpx: 150 }),
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      XLSX.writeFile(workbook, "EnrolledStudents.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setExcelLoading(false);
    }
  };

  useEffect(() => {
    setFilterData((prevState) =>
      prevState.map((item) => {
        if (item.inputname === "lead") {
          return { ...item, options: FleadSourceData };
        }
        if (item.inputname === "enquiry") {
          return { ...item, options: EnquirytakenByData };
        }
        if (item.inputname === "branch") {
          return { ...item, options: FbranchData };
        }
        if (item.inputname === "course") {
          return { ...item, options: FcoursesData };
        }
        if (item.inputname === "coursepackage") {
          return { ...item, options: coursesPackageData };
        }
        return item;
      }),
    );
  }, [
    leadSourceData,
    EnquirytakenByData,
    branchData,
    coursesPackageData,
    coursesData,
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [userStatus, setUserStatus] = useState({});
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [reasons, setReasons] = useState([]);

  const handlePerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("pageSize", selectedvalue.toString());
    newSearchParams.set("page", 1);
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);
  };

  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

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
    const formData = new FormData();
    formData.set("type", "activation");
    formData.set("selectedUserId", selectedUserId);
    formData.set("status", 1);
    formData.set("description", text);
    userActiveFetcher.submit(formData, {
      method: "put",
      encType: "multipart/form-data",
    });
  };

  const handleInActivate = async () => {
    if (!text) {
      toast.error("Please provide a reason for deactivation.");
      return;
    }
    const formData = new FormData();
    formData.set("type", "deactivation");
    formData.set("reasonText", text);
    formData.set("selectedUserId", selectedUserId);
    formData.set("status", 0);
    userInActiveFetcher.submit(formData, {
      method: "put",
      encType: "multipart/form-data",
    });
  };

  useEffect(() => {
    if (userInActiveFetcher.data) {
      if (userInActiveFetcher.data.error) {
        toast.error("There was an error deactivating the user.");
      }
      if (userInActiveFetcher.data.status == 200) {
        toast.success("User has been successfully deactivated!");
        setText("");
        setUserStatus(false);
        setOpenModal(false);
        setError("");
      }
    }
  }, [userInActiveFetcher.data]);

  useEffect(() => {
    if (userActiveFetcher.data) {
      if (userActiveFetcher.data.error) {
        toast.error("There was an error deactivating the user.");
      }
      if (userActiveFetcher.data.status == 200) {
        toast.success("User has been successfully activated!");
        setText("");
        setUserStatus(false);
        setOpenModal(false);
        setError("");
      }
    }
  }, [userActiveFetcher.data]);

  // const fetchLogs = async (page = 1, pageSize = 10) => {
  //   setLogsLoading(true);
  //   try {
  //     const response = await ERPApi.get(
  //       `/preadmission/logs?page=${page}&pageSize=${pageSize}`,
  //     );
  //     if (response.data.success) {
  //       setLogsData(response.data.data);
  //       setLogsPagination(response.data.pagination);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching logs:", error);
  //     toast.error("Failed to fetch logs");
  //   } finally {
  //     setLogsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (searchParams.get("preOnboard") == 2) {
  //     const page = searchParams.get("logsPage") || 1;
  //     const pageSize = searchParams.get("logsPageSize") || 10;
  //     fetchLogs(page, pageSize);
  //   }
  // }, [
  //   searchParams.get("preOnboard"),
  //   searchParams.get("logsPage"),
  //   searchParams.get("logsPageSize"),
  // ]);

  const handleLogsPerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    // newSearchParams.set("logsPageSize", selectedvalue.toString());
    newSearchParams.set("pageSize", selectedvalue.toString());
    newSearchParams.set("logsPage", 1);
    setSearchParams(newSearchParams);
  };

  const handleLogsPageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    // newSearchParams.set("logsPage", page.toString());
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);
  };

  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (enrolledStudentsData?.currentPage - 1) *
          enrolledStudentsData?.pageSize +
        index +
        1,
    },
    {
      id: "studentName",
      header: "Student Name",
      accessor: "name",
      sortable: true,
      hideable: true,
    },
    {
      id: "registrationNumber",
      header: "Registration Number",
      accessor: (row) => (
        <div style={{ width: "160px" }}>{row.registrationnumber}</div>
      ),
      sortable: true,
      hideable: true,
    },
    {
      id: "mobile",
      header: "Mobile",
      accessor: "mobilenumber",
      sortable: true,
      hideable: true,
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      sortable: true,
      hideable: true,
    },
    {
      id: "branch",
      header: "Branch",
      accessor: "branches.branch_name",
      sortable: true,
      hideable: true,
    },
    {
      id: "package",
      header: "Package",
      accessor: "coursepackage",
      sortable: true,
      hideable: true,
    },
    {
      id: "modeoftraining",
      header: "Mode of training",
      accessor: "modeoftraining",
      sortable: true,
      hideable: true,
    },
    {
      id: "course",
      header: "Course",
      accessor: (row) => row.course?.[0]?.course_name || "N/A",
      sortable: true,
      hideable: true,
    },
    {
      id: "leadsource",
      header: "Lead Source",
      accessor: (row) => row.leadsource?.[0].source || "N/A",
      sortable: true,
      hideable: true,
    },
    {
      id: "counsellor",
      header: "Counsellor",
      accessor: "enquirytakenby",
      sortable: true,
      hideable: true,
    },
    {
      id: "joiningDate",
      header: "Joining Date",
      accessor: (row) => (
        <div style={{ width: "120px" }}>{row.admissiondate}</div>
      ),
      sortable: true,
      hideable: true,
    },
  ];

  const preOnBoardColumns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (enrolledStudentsData?.pagination?.currentPage - 1) *
          enrolledStudentsData?.pagination?.pageSize +
        index +
        1,
    },
    {
      id: "name",
      header: "Student Name",
      accessor: "name",
      sortable: true,
      hideable: true,
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      sortable: true,
      hideable: true,
    },
    {
      id: "mobile",
      header: "Mobile",
      accessor: "mobilenumber",
      sortable: true,
      hideable: true,
    },
    {
      id: "package",
      header: "Package",
      accessor: "coursepackage",
      sortable: true,
      hideable: true,
    },
    {
      id: "course",
      header: "Course",
      accessor: "courses",
      sortable: true,
      hideable: true,
    },
    {
      id: "counsellor",
      header: "Counsellor",
      accessor: "counsellor",
      sortable: true,
      hideable: true,
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => (
        <div>
          {row?.status == 1 ? (
            <span title="Enrolled">Enrolled</span>
          ) : (
            <span title="Pending">Pending</span>
          )}
        </div>
      ),
      sortable: true,
      hideable: true,
    },
  ];

  const logsColumns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (logsPagination?.currentPage - 1) * logsPagination?.pageSize +
        index +
        1,
      sortable: true,
      hideable: true,
    },
    {
      id: "name",
      header: "Student Name",
      accessor: "name",
      sortable: true,
      hideable: true,
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      sortable: true,
      hideable: true,
    },
    {
      id: "mobilenumber",
      header: "Mobile",
      accessor: "mobilenumber",
      sortable: true,
      hideable: true,
    },
    {
      id: "courses",
      header: "Course",
      accessor: "courses",
      sortable: true,
      hideable: true,
    },
    {
      id: "coursepackage",
      header: "Package",
      accessor: "coursepackage",
      sortable: true,
      hideable: true,
    },
    {
      id: "user_email",
      header: "User Email",
      accessor: "user_email",
      sortable: true,
      hideable: true,
    },
    {
      id: "status",
      header: "Status",
      accessor: (row) => (
        <span
          className={`badge ${
            row.status === "SUCCESS"
              ? "bg-gray text-success"
              : "bg-gray text-danger"
          }`}
          title={row.status}
        >
          {row.status}
        </span>
      ),
      sortable: true,
      hideable: true,
    },
    {
      id: "error_message",
      header: "Error Message",
      accessor: (row) => row.error_message || "N/A",
      sortable: true,
      hideable: true,
    },
    {
      id: "created_at",
      header: "Created At",
      accessor: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : "N/A",
      sortable: true,
      hideable: true,
    },
  ];

  const [showModal2, setShowModal2] = useState(false);
  const [singleStudent, setSingleStudent] = useState({});

  const handleCloseModal2 = () => setShowModal2(false);

  const handleStudentToBatch = async (item) => {
    if (item) {
      setSingleStudent(item);
      setShowModal2(true);
    }
  };

  const preOnBoardingActions = (item) => (
    <div className="d-flex align-items-center">
      <GateKeeper
        requiredModule="Student Management"
        submenumodule="Enrolled Students"
        submenuReqiredPermission="canRead"
      >
        {item?.status == 1 ? (
          <RiUserAddFill
            className="eye_icon text-muted table_icons me-3 cursor_pointer_not_allowed"
            title="Add Enrollment"
          />
        ) : (
          <Link to={`/student/enrollment/${item.id}?active=0`}>
            <RiUserAddFill
              className="eye_icon table_icons me-3"
              title="Add Enrollment"
            />
          </Link>
        )}
      </GateKeeper>
    </div>
  );

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
            },
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

  useEffect(() => {
    if (!openModal) return;
    const fetchInactiveReasons = async () => {
      try {
        const res = await ERPApi.get("/student/getInactiveReasons");
        setReasons(res.data);
      } catch (error) {
        console.error("Failed to fetch inactive reasons", error);
        toast.error("Failed to load inactive reasons");
      }
    };
    fetchInactiveReasons();
  }, [openModal]);

  const actions = (item) => (
    <div className="d-flex align-items-center">
      <GateKeeper
        requiredModule="Student Management"
        submenumodule="Enrolled Students"
        submenuReqiredPermission="canRead"
      >
        <Link to={`/student/views?studentId=${item.id}`}>
          <AiFillEye
            className="eye_icon table_icons me-3"
            data-bs-toggle="tooltip"
            title="view"
          />
        </Link>
      </GateKeeper>

      <GateKeeper
        requiredModule="Demo batches"
        submenumodule="Batches"
        submenuReqiredPermission="canUpdate"
      >
        {item?.branches?.id ? (
          item?.batches?.length > 0 ? (
            <IoAddCircleSharp
              className="eye_icon fw-500 table_icons me-3 text-success"
              style={{ cursor: "pointer" }}
              onClick={() => handleStudentToBatch(item)}
              data-bs-toggle="tooltip"
              title="Assign Batch (Already in batch)"
            />
          ) : (
            <HiMiniPlus
              className="eye_icon fw-500 table_icons me-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleStudentToBatch(item)}
              data-bs-toggle="tooltip"
              title="Assign Batch"
            />
          )
        ) : (
          <MdOutlinePersonAddDisabled
            className="eye_icon fw-500 table_icons me-3"
            style={{ cursor: "not-allowed" }}
          />
        )}
      </GateKeeper>

      <GateKeeper
        requiredModule="Student Management"
        submenumodule="Enrolled Students"
        submenuReqiredPermission="canUpdate"
      >
        <Link to={`/student/editstudent/${item?.id}`}>
          <RiEdit2Line
            className="edit_icon table_icons me-3"
            data-bs-toggle="tooltip"
            title="Edit"
          />
        </Link>
      </GateKeeper>

      <GateKeeper
        requiredModule="Student Management"
        submenumodule="Fee Details"
        submenuReqiredPermission="canUpdate"
      >
        <Link to={`/student/feeUpdate?studentId=${item?.id}`}>
          <FaRupeeSign
            className="rupee_icon table_icons me-3"
            data-bs-toggle="tooltip"
            title="Rupee"
          />
        </Link>
      </GateKeeper>

      <GateKeeper
        requiredModule="Student Management"
        submenumodule="Enrolled Students"
        submenuReqiredPermission="canRead"
      >
        <Link to={`/student/applicationprint/${item.id}`}>
          <MdLocalPrintshop
            className="text-mute table_icons me-3"
            data-bs-toggle="tooltip"
            title="Print"
          />
        </Link>
      </GateKeeper>

      <GateKeeper
        requiredModule="Student Management"
        submenumodule="Enrolled Students"
        submenuReqiredPermission="canRead"
      >
        <Link to={`/student/studentidcard/${item.id}`}>
          <FaRegIdCard
            className="id_card table_icons me-3"
            data-bs-toggle="tooltip"
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
          className="edit_icon table_icons me-3 cursor-pointer"
          data-bs-toggle="tooltip"
          title="Send Credentials"
          onClick={() => handleSendCredentials(item)}
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
              onChange={(e) => handleToggleChange(item.id, e)}
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            />
          </span>
        </GateKeeper>
      )}
    </div>
  );

  const tableColumns =
    searchParams.get("preOnboard") == 1
      ? preOnBoardColumns
      : searchParams.get("preOnboard") == 2
        ? logsColumns
        : columns;

  const tableData =
    searchParams.get("preOnboard") == 1
      ? enrolledStudentsData?.data
      : searchParams.get("preOnboard") == 2
        ? logsData
        : enrolledStudentsData?.students || [];

  const tableActions =
    searchParams.get("preOnboard") == 1
      ? preOnBoardingActions
      : searchParams.get("preOnboard") == 2
        ? null
        : actions;

  const renderPagination = () => {
    if (searchParams.get("preOnboard") == 2) {
      return (
        <div className="mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
          <div className="col-sm">
            <PaginationInfo
              data={{
                length: logsData.length,
                start: logsPagination?.start,
                end: logsPagination?.end,
                total: logsPagination?.totalResult,
              }}
            />
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0 d-flex align-items-center">
            <select
              className="form-select form-control me-3 input_bg_color pagination-select"
              onChange={handleLogsPerPage}
              value={logsPagination?.pageSize || 10}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="75">75</option>
              <option value="100">100</option>
            </select>
            <Pagination
              currentPage={logsPagination?.currentPage || 1}
              totalPages={logsPagination?.totalPages || 1}
              onPageChange={handleLogsPageChange}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
          <div className="col-sm">
            <PaginationInfo
              data={
                searchParams.get("preOnboard") == 1
                  ? {
                      length: enrolledStudentsData?.data?.length,
                      start: enrolledStudentsData?.pagination?.start,
                      end: enrolledStudentsData?.pagination?.end,
                      total: enrolledStudentsData?.pagination?.totalResult,
                    }
                  : {
                      length: enrolledStudentsData?.students?.length,
                      start: enrolledStudentsData?.startStudent,
                      end: enrolledStudentsData?.endStudent,
                      total: enrolledStudentsData?.searchResultStudents,
                    }
              }
            />
          </div>
          <div className="col-sm-auto mt-3 mt-sm-0 d-flex align-items-center">
            <select
              className="form-select form-control me-3 input_bg_color pagination-select"
              onChange={(e) => {
                handlePerPage(e);
              }}
              value={
                searchParams.get("preOnboard") == 1
                  ? enrolledStudentsData?.pagination?.pageSize || 10
                  : enrolledStudentsData?.perPage
              }
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="75">75</option>
              <option value="100">100</option>
            </select>
            <Pagination
              currentPage={
                searchParams.get("preOnboard") == 1
                  ? enrolledStudentsData?.pagination?.currentPage
                  : enrolledStudentsData?.pagination?.currentPage
              }
              totalPages={
                searchParams.get("preOnboard") == 1
                  ? enrolledStudentsData?.pagination?.totalPages
                  : enrolledStudentsData?.totalPages
              }
              onPageChange={(page) => {
                handlePageChange(page);
              }}
            />
          </div>
        </div>
      );
    }
  };

  const renderActionButtons = () => {
    if (searchParams.get("preOnboard") == 2) {
      return null;
    }
    return (
      <>
        <GateKeeper
          requiredModule="Student Management"
          submenumodule="Enrolled Students"
          submenuReqiredPermission="canUpdate"
        >
          <div style={{ cursor: excelLoading ? "not-allowed" : "pointer" }}>
            <button
              className="btn btn-sm btn_primary fs-13 me-1 margin_top_12 button-res"
              type="button"
              onClick={() => exportToExcel()}
              disabled={excelLoading}
            >
              <BiExport className="me-1 mb-1" />
              Export
            </button>
          </div>
        </GateKeeper>

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

        <button
          className="btn btn-sm btn_primary fs-13 me-1 margin_top_12 button-res"
          data-bs-toggle="offcanvas"
          data-bs-target="#columnOffcanvas"
          title="Column Filter"
        >
          <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
        </button>

        <GateKeeper
          requiredModule="Student Management"
          submenumodule="Enrolled Students"
          submenuReqiredPermission="canCreate"
        >
          <Button
            type="button"
            className="btn btn-sm btn_primary fs-13  margin_top_12 button-res"
          >
            <Link
              to={`/student/enrollment?active=1&coursepackageId=${admissionDetails?.coursepackageId ? admissionDetails?.coursepackageId : null}`}
              className="button_color"
            >
              <HiMiniPlus /> Add Enrollment
            </Link>
          </Button>
        </GateKeeper>
      </>
    );
  };

  return (
    <div>
      <BackButton heading="Enrolled Students " content="Back" />
      <div className="container-fluid">
        <div className="row response">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row d-flex justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      {searchParams.get("preOnboard") != 2 && (
                        <SearchInputField
                          searchParams={searchParams}
                          setSearchParams={setSearchParams}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6 response-btn">
                    <div className="buttons_alignment">
                      {renderActionButtons()}

                      <GateKeeper
                        requiredModule="Student Management"
                        submenumodule="Enrolled Students"
                        submenuReqiredPermission="canCreate"
                      >
                        <div className="status-toggle-container button">
                          <div
                            className="status-toggle-wrapper"
                            style={{
                              display: "flex",
                              flexWrap: "nowrap",
                              gap: "0",
                            }}
                          >
                            <button
                              className={`status-toggle-btn ${searchParams.get("preOnboard") == 1 ? "active" : ""}`}
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => {
                                setSearchParams((prev) => {
                                  const newParams = new URLSearchParams(prev);
                                  newParams.set("preOnboard", 1);
                                  newParams.delete("logsPage");
                                  newParams.delete("logsPageSize");
                                  return newParams;
                                });
                              }}
                            >
                              Pre Onboarding
                            </button>
                            <button
                              className={`status-toggle-btn ${searchParams.get("preOnboard") == 0 || !searchParams.get("preOnboard") ? "active" : ""}`}
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => {
                                setSearchParams((prev) => {
                                  const newParams = new URLSearchParams(prev);
                                  newParams.set("preOnboard", 0);
                                  newParams.delete("logsPage");
                                  newParams.delete("logsPageSize");
                                  return newParams;
                                });
                              }}
                            >
                              Enrolled
                            </button>
                            <button
                              className={`status-toggle-btn ${searchParams.get("preOnboard") == 2 ? "active" : ""}`}
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => {
                                setSearchParams((prev) => {
                                  const newParams = new URLSearchParams(prev);
                                  newParams.set("preOnboard", 2);
                                  return newParams;
                                });
                              }}
                            >
                              Logs
                            </button>
                          </div>
                        </div>
                      </GateKeeper>
                    </div>
                  </div>
                </div>

                {searchParams.get("preOnboard") != 2 && (
                  <div
                    className="offcanvas offcanvas-end bg_white"
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
                    <div className="offcanvas-body p-2 bg_white">
                      <Filter
                        filterData={filterData}
                        HandleFilters={HandleFilters}
                        filterReset={FilterReset}
                        filterSubmit={filterSubmit}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="card-body">
                <div className="table-responsive table-card table-container table-scroll border-0">
                 
                    <CustomTable
                      columns={tableColumns}
                      data={tableData}
                      actions={tableActions}
                      enableColumnToggle={true}
                    />
                
                </div>

                {renderPagination()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal2 === true && singleStudent && (
        <AssignBatch
          branch={branchData}
          show={showModal2}
          handleClose={handleCloseModal2}
          student={singleStudent}
        />
      )}
      {openModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="staticBackdropLabel"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setOpenModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-body bg_white">
                <div className="d-flex justify-content-between">
                  <label className="form-label fs-s fw-medium black_300">
                    {userStatus ? "Enter Description* :" : "Select Reason* :"}
                  </label>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setOpenModal(false)}
                  ></button>
                </div>

                {userStatus === true ? (
                  <textarea
                    rows="4"
                    cols="10"
                    name="description"
                    className={`form-control fs-s bg-form text_color input_bg_color ${
                      error ? "error-input" : ""
                    }`}
                    placeholder="Enter a description"
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                  ></textarea>
                ) : (
                  <select
                    name="reason"
                    className={`form-control fs-s bg-form text_color input_bg_color ${
                      error ? "error-input" : ""
                    }`}
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
                  onClick={() => setOpenModal(false)}
                >
                  Close
                </button>

                {userStatus === true && (
                  <button className="btn btn_primary" onClick={handleActivate}>
                    Activate
                  </button>
                )}

                {userStatus === false && (
                  <button
                    className="btn btn_primary"
                    onClick={handleInActivate}
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default EnrolledStudents;