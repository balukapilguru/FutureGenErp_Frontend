import { useEffect } from "react";
import "../../../../assets/css/Table.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MdFilterList, MdOutlinePeople } from "react-icons/md";
import { FaUsers, FaWpforms } from "react-icons/fa6";
import { FaIndianRupeeSign } from "react-icons/fa6";
import ReactApexChart from "react-apexcharts";
import { FiArrowDownRight } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import Button from "../../../components/button/Button";
import DashboardProvider from "./DashboardUtils/DashboardProvider";
import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import GateKeeper from "../../../../rbac/GateKeeper";
import { Offcanvas } from "bootstrap";
import CountUp from "../../../../utils/CountUp";

const StudentManagementDasboard = () => {
  const { BranchState } = useBranchContext();

  const {
    Dashboardstate: {
      TotalEnrollementDetails,
      TotalFeeDetails,
      BranchwiseCouncellers,
      CouncellerwiseStudents,
      TotalUsersInDashboad,
      UsersListInBranchWise,
      FeeDetailsBranchwiseCouncellers,
      FeeDetailsCouncellerwiseStudents,
      TotalEnrollmentGraph,
      TotalFeeDetailsGraph,
      TodayFeeRecevied,
      TodayFeeReceviedByCouncellors,
      TodayFeeReceviedByStudents,
    },
    DispatchDashboard,
  } = DashboardProvider();


  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  useEffect(() => {
    function settingCouncellorname() {
      if (
        userData?.user?.profile === "Counsellor" ||
        userData?.user?.profile === "counsellor"
      ) {
        let enquirytakenby = userData?.user?.id;
        let counceller = { enquirytakenby };

        DispatchDashboard({
          type: "SET_COUNCELLOR_DETAILS",
          payload: {
            data: counceller,
            context: "TOTAL_ENROLLMENTS_DETAILS_COUNCELLOR_WISE_STUDENTS",
          },
        });

        DispatchDashboard({
          type: "SET_COUNCELLOR_DETAILS",
          payload: {
            data: counceller,
            context: "FEE_DETAILS_COUNCELLORS_WISE_STUDENTS",
          },
        });

        DispatchDashboard({
          type: "SET_COUNCELLOR_DETAILS",
          payload: {
            data: counceller,
            context: "SET_COUNCELLOR_ID_IN_TODAY_FEE_RECEVIED",
          },
        });
      }

      if (userData?.user?.profile === "Branch Manager") {
        let branch = userData?.user?.branchId;
        let BranchDetails = { branch };

        DispatchDashboard({
          type: "SET_BRANCH_DETAILS",
          payload: {
            data: BranchDetails,
            context: "TOTAL_ENROLLMENTS_DETAILS_BRANCH_WISE_COUNCELLERS",
          },
        });

        DispatchDashboard({
          type: "SET_BRANCH_DETAILS",
          payload: {
            data: BranchDetails,
            context: "FEE_DETAILS_BRANCH_WISE_COUNCELLORS",
          },
        });
      }
      if (
        userData?.user?.profile === "Branch Manager" ||
        userData?.user?.profile === "counsellor" ||
        userData?.user?.profile === "Counsellor"
      ) {
        setFilterDateFeeDetails();
      }
    }

    settingCouncellorname();
  }, []);

  const setFilterDateFeeDetails = () => {
    DispatchDashboard({
      type: "SET_FILTER_DATE",
      payload: {
        data: {
          fromDate: filteredDatesFeeDetails?.fromDate,
          toDate: filteredDatesFeeDetails?.toDate,
          admissionFromDate: filteredDatesFeeDetails?.admissionFromDate,
          admissionToDate: filteredDatesFeeDetails?.admissionToDate,
        },
        context: "TOTAL_FEE_DETAILS",
      },
    });
  };

  //------------------------------Total Enrollemts Tab Details---------------------------------------------------
  const [filterDatesTotalEnrollments, setFilterDatesTotalEnrollments] =
    useState({
      fromDate: "",
      toDate: "",
    });

  // handle Branch submit in TotalEnrollemts
  const [activeBranch, setActiveBranch] = useState(null);
  const [activeCouncellor, setActiveCouncellor] = useState(null);
  const [activeUsersInTotalUsers, setactiveUsersInTotalUsers] = useState(null);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilterDatesTotalEnrollments((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filterResetTotalEnrollementDates = () => {
    setFilterDatesTotalEnrollments({
      fromDate: "",
      toDate: "",
    });
    DispatchDashboard({
      type: "SET_FILTER_DATE",
      payload: {
        data: {
          fromDate: "",
          toDate: "",
        },
        context: "TOTAL_ENROLLMENTS_DETAILS",
      },
    });
  };

  const filterSubmitTotalEnrollemntDates = () => {
    if (
      !filterDatesTotalEnrollments.fromDate &&
      !filterDatesTotalEnrollments.toDate
    ) {
      toast.error("Please fill in at least one filter criteria.");
      return;
    }
    DispatchDashboard({
      type: "SET_FILTER_DATE",
      payload: {
        data: {
          fromDate: filterDatesTotalEnrollments?.fromDate,
          toDate: filterDatesTotalEnrollments?.toDate,
        },
        context: "TOTAL_ENROLLMENTS_DETAILS",
      },
    });
    const offcanvasElement = document.getElementById("offcanvasRight");
    const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
    offcanvasInstance.hide();
  };

  const handleBranchSubmit = (branch) => {
    setActiveBranch(branch);
    const BranchDetails = { branch };
    DispatchDashboard({
      type: "SET_BRANCH_DETAILS",
      payload: {
        data: BranchDetails,
        context: "TOTAL_ENROLLMENTS_DETAILS_BRANCH_WISE_COUNCELLERS",
      },
    });
  };

  const handleCouncellorSubmit = (enquirytakenby) => {
    setActiveCouncellor(enquirytakenby);
    const counceller = { enquirytakenby };
    DispatchDashboard({
      type: "SET_COUNCELLOR_DETAILS",
      payload: {
        data: counceller,
        context: "TOTAL_ENROLLMENTS_DETAILS_COUNCELLOR_WISE_STUDENTS",
      },
    });
  };

  //------------------Total fee Details tab----------------

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const formattedFirstDay = firstDay.toISOString().slice(0, 10); // Format to YYYY-MM-DD
  const formattedLastDay = lastDay.toISOString().slice(0, 10);
  const currentMonthYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(today);

  const [filteredDatesFeeDetails, setFilteredDatesFeeDetails] = useState({
    fromDate: formattedFirstDay,
    toDate: formattedLastDay,
    admissionFromDate: "",
    admissionToDate: "",
  });

  const [activeBranchFeeDetails, setactiveBranchFeeDetails] = useState(null);
  const [activeCouncellorFeeDetails, setactiveCouncellorFeeDetails] =
    useState(null);

  useEffect(() => {
    DispatchDashboard({
      type: "SET_FILTER_DATE",
      payload: {
        data: {
          fromDate: filteredDatesFeeDetails?.fromDate,
          toDate: filteredDatesFeeDetails?.toDate,
          admissionFromDate: filteredDatesFeeDetails?.admissionFromDate,
          admissionToDate: filteredDatesFeeDetails?.admissionToDate,
        },
        context: "TOTAL_FEE_DETAILS",
      },
    });
  }, []);

  const handleDateChangeInFeeDeatils = (e) => {
    const { name, value } = e.target;
    setFilteredDatesFeeDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filterReset_FeeDetailsDates = () => {
    setFilteredDatesFeeDetails({
      fromDate: formattedFirstDay,
      toDate: formattedLastDay,
      admissionFromDate: "",
      admissionToDate: "",
    });
    DispatchDashboard({
      type: "SET_FILTER_DATE",
      payload: {
        data: {
          fromDate: formattedFirstDay,
          toDate: formattedLastDay,
          admissionFromDate: "",
          admissionToDate: "",
        },
        context: "TOTAL_FEE_DETAILS",
      },
    });
  };

  const filterSubmit_FeeDetailsDates = () => {
    if (
      !filteredDatesFeeDetails.fromDate &&
      !filteredDatesFeeDetails.toDate &&
      !filteredDatesFeeDetails.admissionFromDate &&
      !filteredDatesFeeDetails.admissionToDate
    ) {
      toast.error("Please fill in at least one filter criteria.");
      return;
    }
    DispatchDashboard({
      type: "SET_FILTER_DATE",
      payload: {
        data: {
          fromDate: filteredDatesFeeDetails?.fromDate,
          toDate: filteredDatesFeeDetails?.toDate,
          admissionFromDate: filteredDatesFeeDetails?.admissionFromDate,
          admissionToDate: filteredDatesFeeDetails?.admissionToDate,
        },
        context: "TOTAL_FEE_DETAILS",
      },
    });
    const offcanvasElement = document.getElementById("offcanvasRightOne");
    const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
    offcanvasInstance?.hide();
  };

  const handleBranchSubmitFeeDetails = (branch) => {
    setactiveBranchFeeDetails(branch);
    const BranchDetails = { branch };
    DispatchDashboard({
      type: "SET_BRANCH_DETAILS",
      payload: {
        data: BranchDetails,
        context: "FEE_DETAILS_BRANCH_WISE_COUNCELLORS",
      },
    });
  };

  const handleCouncellorSubmitfeeDetails = (enquirytakenby) => {
    setactiveCouncellorFeeDetails(enquirytakenby);
    const counceller = { enquirytakenby };

    DispatchDashboard({
      type: "SET_COUNCELLOR_DETAILS",
      payload: {
        data: counceller,
        context: "FEE_DETAILS_COUNCELLORS_WISE_STUDENTS",
      },
    });
  };

  //  --------------------Today Fee Received Tab-------------

  const [activeBranchTodayFeeRecevied, setActiveBranchTodayFeeRecevied] =
    useState(null);
  const [
    activeCouncellorTodayFeeRecevied,
    setActiveCouncellorTodayFeeRecevied,
  ] = useState(null);

  const handleBranchTodayFeeRecevied = (branch) => {
    setActiveBranchTodayFeeRecevied(branch);
    const BranchId = { branch };
    DispatchDashboard({
      type: "SET_BRANCH_DETAILS",
      payload: {
        data: BranchId,
        context: "SET_BRANCH_ID_IN_TODAY_FEE_RECEVIED",
      },
    });
  };

  const handleCouncellorIdTodayFeeRecevied = (enquirytakenby) => {
    setActiveCouncellorTodayFeeRecevied(enquirytakenby);
    const counceller = { enquirytakenby };

    DispatchDashboard({
      type: "SET_COUNCELLOR_DETAILS",
      payload: {
        data: counceller,
        context: "SET_COUNCELLOR_ID_IN_TODAY_FEE_RECEVIED",
      },
    });
  };

  // ---------------------Total Users tab---------------------------

  const handleBranchSubmitInUsers = (branch) => {
    setactiveUsersInTotalUsers(branch);
    const branchName = { branch };
    DispatchDashboard({
      type: "SET_BRANCH_DETAILS",
      payload: {
        data: branchName,
        context: "ALL_USERS_LIST_IN_BRANCH_WISE",
      },
    });
  };

  // Enrollement graph--------------
  const [formDataGraph, setFormDataGraph] = useState({
    branch: "",
  });
  const HandleBranchGraph = (e) => {
    const { name, value } = e.target;
    setFormDataGraph((prev) => ({
      ...prev,
      [name]: value,
    }));
    const branch = e.target.value;

    const branchDetails = { branch };
    DispatchDashboard({
      type: "SET_BRANCH_DETAILS",
      payload: {
        data: branchDetails,
        context: "TOTAL_ENROLLMENTS_GRAPH",
      },
    });
  };

  useEffect(() => {
    if (TotalEnrollmentGraph?.yearlyEnrollments) {
      setChartData((prev) => ({
        ...prev,
        Enrollements: transformData([TotalEnrollmentGraph?.yearlyEnrollments]),
      }));
    }
  }, [TotalEnrollmentGraph?.yearlyEnrollments]);

  const transformData = (monthlyData) => {
    const categories = Object.keys(monthlyData[0]);
    const data = categories.map((month) => monthlyData[0][month]);
    return [{ data }];
  };

  const [chartData, setChartData] = useState({
    Enrollements: [
      {
        name: "Total Enrollments Count",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -18,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
        formatter: function (val) {
          return val;
        },
      },
      colors: ["#405189"],
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {},
        axisTicks: {
          show: true,
          style: {
            colors: "#405189",
            lineAtIndex: 1,
            beginAtZero: true,
          },
        },
      },
      yaxis: {
        gridLines: {
          zeroLineColor: "#ffcc33",
        },
      },
    },
  });

  const [branchGraph, setBranchGraph] = useState({
    branch: "",
  });

  const handleBranchFeeDetailGraph = (e) => {
    const { name, value } = e.target;
    setBranchGraph((prev) => ({
      ...prev,
      [name]: value,
    }));
    const branch = e.target.value;

    const branchDetails = { branch };
    DispatchDashboard({
      type: "SET_BRANCH_DETAILS",
      payload: {
        data: branchDetails,
        context: "TOTAL_FEEDETAILS_GRAPH",
      },
    });
  };

  useEffect(() => {
    if (
      TotalFeeDetailsGraph?.yearlyFeeReceived &&
      TotalFeeDetailsGraph?.yearlyFeeYetRecevie
    ) {
      setChartDatas((prev) => ({
        ...prev,
        Enrollments: {
          ...prev.Enrollments,
          series: transformData1(
            [TotalFeeDetailsGraph?.yearlyFeeReceived],
            [TotalFeeDetailsGraph?.yearlyFeeYetRecevie]
          ),
        },
      }));
    }
  }, [
    TotalFeeDetailsGraph?.yearlyFeeReceived,
    TotalFeeDetailsGraph?.yearlyFeeYetRecevie,
  ]);
  const transformData1 = (feeReceive, feeYetToRecive) => {
    const feeCategories = Object.keys(feeReceive[0]);
    const enrollmentCategories = Object.keys(feeYetToRecive[0]);
    const feeReceivedValues = feeCategories.map(
      (month) => feeReceive[0][month]
    );
    const feeYetToReciveValues = enrollmentCategories.map(
      (month) => feeYetToRecive[0][month]
    );

    const transformedData = [
      { name: "Fee Received", data: feeReceivedValues, color: "#405189" },
      { name: "Fee Yet Recevie", data: feeYetToReciveValues, color: "#eb6329" },
    ];
    return transformedData;
  };
  const [chartDatas, setChartDatas] = useState({
    Enrollments: {
      series: [
        {
          name: "FeeReceived",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: "#405189",
        },
        {
          name: "FeeYetRecevie",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: "#eb6329",
        },
      ],
    },
    yaxis: [
      {
        min: 1000000,
        max: 500000000,
        tickAmount: 4,
        logarithmic: true,
        seriesName: "FeeReceived",
      },
      {
        min: 1000000,
        max: 500000000,
        opposite: true,
        tickAmount: 4,
        seriesName: "FeeYetRecevie",
      },
    ],
    options: {
      yAxes: [
        {
          gridLines: {
            zeroLineColor: "#eb6329",
          },
        },
      ],
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "100%",
          dataLabels: {
            position: "top", // Position the data labels inside the bars
          },
        },
      },
      colors: ["#405189", "#eb6329"],
      dataLabels: {
        enabled: false, // Enable data labels
        offsetY: -18,
        style: {
          fontSize: "12px", // Decrease font size here
          colors: ["#fff"],
        },
        formatter: function (val) {
          return val;
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {},
        axisTicks: {
          show: true,
          style: {
            colors: "#405189",
            lineAtIndex: 1,
            beginAtZero: true,
          },
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        },
      },

      responsive: [
        {
          breakpoint: 1000,
          options: {
            maintainAspectRatio: false,
            scales: {
              xAxes: [
                {
                  ticks: {
                    autoSkip: false,
                    minRotation: 45,
                    maxRotation: 90,
                  },
                },
              ],
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    autoSkip: false,
                    rotation: -45,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  });

  //  Greeeting Message
  const getCurrentTime = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Morning";
    else if (currentHour < 18) return "Afternoon";
    else return "Evening";
  };
  useEffect(() => {
    const greetingTime = getCurrentTime();
  }, []);

  // handle the Tabs
  const [activeTabs, setActiveTable] = useState({
    TotalEnrollments: true,
    FeeDetails: false,
    FeeFollowUps: false,
    TotalUsers: false,
    TodayFeeRecieved: false,
  });

  const handleTabs = (tab) => {
    setActiveTable((prevState) => ({
      ...prevState,
      TotalEnrollments: tab === "TotalEnrollments",
      FeeDetails: tab === "FeeDetails",
      FeeFollowUps: tab === "FeeFollowUps",
      TotalUsers: tab === "TotalUsers",
      TodayFeeRecieved: tab === "TodayFeeRecieved",
    }));
  };

  return (
    <div>
      <div className="container-fluid mt-3">
        <div className="row mb-1 pb-1">
          <div className="col-12">
            <div className="d-flex align-items-lg-center flex-lg-row flex-column">
              <div className="flex-grow-1">
                <h4 className="fs-16 fw-500 black_300 mb-1">
                  Good {getCurrentTime()}, {userData?.user?.fullname}!
                </h4>
                <p className="fs-13 text-mute mb-0 mt-0 fw-100">
                  Here's what happened till now.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Dashboard Tabs*/}

        <ul
          className="row nav mb-3 nav-tabs nav-justified mb-3 nav-fill"
          id="pills-tab"
          role="tablist"
        >
          <GateKeeper
            requiredModule="Student Management"
            submenumodule="Enrolled Students"
            submenuReqiredPermission="canRead"
          >
            <li
              className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
              role="presentation"
            >
              <button
                className={`card nav-link card_animate ${
                  activeTabs.TotalEnrollments ? "active" : ""
                }`}
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected={activeTabs.TotalEnrollments}
                onClick={() => handleTabs("TotalEnrollments")}
              >
                <div className="d-flex align-items-center w-100 justify-content-between">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                      Total Enrollments{" "}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-end">
                    <h5 className="text-success fs-14 mb-0">
                      {/* < MdArrowOutward className="text-success " /> */}
                      {/* +16.24 % */}
                    </h5>
                  </div>
                </div>
                <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
                  <div className="text-start">
                    <h4 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                      <span className="counter-value" data-target="559.25">
                        <CountUp
                          finalValue={
                            TotalEnrollmentGraph?.currentmonthEnrollments
                          }
                        />
                      </span>{" "}
                    </h4>
                    <Link to="" className="fs-xs fw-500 mb-0">
                      View Enrollments
                    </Link>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-success-subtle rounded fs-3">
                      <FaWpforms className="text-success fs-20" />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          </GateKeeper>

          {/* <GateKeeper
            requiredModule="Student Management"
            submenumodule="Fee Details"
            submenuReqiredPermission="canRead"
          >
            <li
              className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12  nav-item mt-2"
              role="presentation"
            >
              <button
                className={`card nav-link card_animate ${
                  activeTabs.FeeDetails ? "active" : ""
                }`}
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected={activeTabs.FeeDetails}
                onClick={() => handleTabs("FeeDetails")}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                      Fee Details
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-end">
                    <h5 className="text-danger fs-14 mb-0">
                     
                    </h5>
                  </div>
                </div>
                <div className="d-flex align-items-end mt-2 mb-2 justify-content-between w-100">
                  <div className="text-start">
                   


                    <h6 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                      <span className="counter-value" data-target="36894">

                        <span className="fs-14"> With GST<span className="ms-3"><LiaRupeeSignSolid /><CountUp
                          finalValue={TotalFeeDetailsGraph?.currentFeeReceived}
                        /></span>  </span>

                        <br />

                        <span className="fs-14">without GST<LiaRupeeSignSolid />


                          <CountUp
                            finalValue={TotalFeeDetailsGraph?.withoutGstCurrentFeeReceived}
                          
                            
                          />
                        </span>


                      </span>
                    </h6>
                    <Link to="" className="fs-xs fw-500">
                      View Fee Details
                    </Link>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-info-subtle rounded fs-3">
                      <FaIndianRupeeSign className="light-blue-color fs-20" />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          </GateKeeper> */}



          <GateKeeper
            requiredModule="Student Management"
            submenumodule="Fee Details"
            submenuReqiredPermission="canRead"
          >
            <li
              className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
              role="presentation"
            >
              <button
                className={`card nav-link card_animate ${activeTabs.FeeDetails ? "active" : ""
                  }`}
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected={activeTabs.FeeDetails}
                onClick={() => handleTabs("FeeDetails")}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="">
                    <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                      Fee Details
                    </p>

                    <div className="fs-20 fw-semibold ff-secondary">
                      <span className="counter-value" data-target="36894">

                        <span className="fs-xs fw-500">With GST<span className="ms-3"><LiaRupeeSignSolid /><CountUp className="fs-xs fw-500"
                          finalValue={TotalFeeDetailsGraph?.currentFeeReceived}
                        /></span></span>

                        <br />

                        <span className="fs-xs fw-500">without GST<LiaRupeeSignSolid />
                          <CountUp className="fs-xs fw-500"
                            finalValue={TotalFeeDetailsGraph?.withoutGstCurrentFeeReceived}
                          />
                        </span>


                      </span>
                    </div>

                  </div>
                  <div className="flex-shrink-0 text-end">
                    <h5 className="text-danger fs-14 mb-0"></h5>
                  </div>
                </div>
                <div className="d-flex align-items-end justify-content-between w-100">
                  <div className="text-start">

                    <Link to="" className="fs-xs fw-500">
                      View Fee Details
                    </Link>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-info-subtle rounded fs-3">
                      <FaIndianRupeeSign className="light-blue-color fs-20" />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          </GateKeeper>

          <GateKeeper
            requiredModule="Student Management"
            submenumodule="Fee Details"
            submenuReqiredPermission="canRead"
          >
            <li
              className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12  nav-item mt-2"
              role="presentation"
            >
              <button
                className={`card nav-link card_animate ${
                  activeTabs.TodayFeeRecieved ? "active" : ""
                }`}
                id="pills-todayFeeRecevied-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-todayFeeRecevied"
                type="button"
                role="tab"
                aria-controls="pills-todayFeeRecevied"
                aria-selected={activeTabs.TodayFeeRecieved}
                onClick={() => handleTabs("TodayFeeRecieved")}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                      Today Fee Received
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-end">
                    <h5 className="text-danger fs-14 mb-0"></h5>
                  </div>
                </div>
                <div className="d-flex align-items-end mt-2 mb-2 justify-content-between w-100">
                  <div className="text-start">
                    <h4 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                      <span className="counter-value" data-target="36894">
                        <LiaRupeeSignSolid />
                        <CountUp
                          finalValue={TodayFeeRecevied?.todayOverallFeeReceived}
                        />
                      </span>
                    </h4>
                    <Link to="" className="fs-xs fw-500">
                      View Fee Received
                    </Link>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-info-subtle rounded fs-3">
                      <FaIndianRupeeSign className="light-blue-color fs-20" />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          </GateKeeper>

          <GateKeeper
            requiredModule="Student Management"
            submenumodule="Fee Details"
            submenuReqiredPermission="canRead"
          >
            <li
              className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
              role="presentation"
            >
              <Link 
              // to={"/student/feedetailspage"}
              to={"/student/feefollowUps/today/list?search=&page=1&pageSize=10"}
              >
                <button
                  className={`card nav-link card_animate ${
                    activeTabs.FeeFollowUps ? "active" : ""
                  }`}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected={activeTabs.FeeFollowUps}
                  // onClick={() => handleTabs("FeeFollowUps")}
                >
                  <div className="d-flex align-items-center w-100 justify-content-between">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                        Fee FollowUps
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-end">
                      <h5 className="text-success fs-14 mb-0">
                        <i className="ri-arrow-right-up-line fs-14 align-middle"></i>{" "}
                        {/* +29.08 % */}
                      </h5>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
                    <div className="text-start">
                      <h4 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                        <span className="counter-value" data-target="183.35">
                          <LiaRupeeSignSolid />
                          <CountUp
                            finalValue={
                              TotalFeeDetailsGraph?.currentFeeYetToReceived
                            }
                          />
                        </span>
                      </h4>
                      <Link
                        // to={"/student/feedetailspage"}
                        to="/student/feefollowUps/today/list?search=&page=1&pageSize=10"

                        className="fs-xs fw-500"
                      >
                        View Fee FollowUps
                      </Link>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                      <span className="avatar-title bg-warning-subtle rounded fs-3">
                        <TbMoneybag className="text_yellow fs-20" />
                      </span>
                    </div>
                  </div>
                </button>
              </Link>
            </li>
          </GateKeeper>

          <GateKeeper
            requiredModule="User Mangement"
            requiredPermission="all"
            submenumodule="User Details"
            submenuReqiredPermission="canRead"
          >
            <li
              className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
              role="presentation"
            >
              <button
                className={`card nav-link user-card card_animate ${
                  activeTabs.TotalUsers ? "active" : ""
                }`}
                id="pills-fee-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-fee"
                type="button"
                role="tab"
                aria-controls="pills-fee"
                aria-selected={activeTabs.TotalUsers}
                onClick={() => handleTabs("TotalUsers")}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                      Total Users
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <h5 className="text-muted fs-14 mb-0">{/* +0.00 % */}</h5>
                  </div>
                </div>
                <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
                  <div className="text-start">
                    <h4 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                      <span className="counter-value" data-target="165.89">
                        <CountUp
                          finalValue={TotalUsersInDashboad?.totalNoOfUsers}
                        />
                      </span>
                    </h4>
                    <Link to="" className="fs-xs fw-500">
                      View Total Users
                    </Link>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-primary-subtle rounded fs-3">
                      <FaUsers className="dwnld_icon fs-18" />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          </GateKeeper>
        </ul>

        <div className="tab-content" id="pills-tabContent">
          {/* ---------------------------------------------------------------------- */}
          {/*---------------------  Total enrollments -------------------------------*/}
          {/* ---------------------------------------------------------------------- */}

          {activeTabs.TotalEnrollments && (
            <div
              className={`tab-pane fade ${
                activeTabs.TotalEnrollments ? "show active" : ""
              }`}
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div>
                <div className="row">
                  {/* Enrollement Graph */}
                  <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="card">
                      <div className="card-body mb-3">
                        <div className=" d-flex justify-content-between">
                          <div>
                            {" "}
                            <h6 className="">Overall Status Graph</h6>
                          </div>
                          <div className="col-lg-3 mb-2">
                            {userData &&
                              userData?.user &&
                              userData?.user?.profile !== "Counsellor" &&
                              userData?.user?.profile !== "counsellor" &&
                              userData?.user?.profile !== "Branch Manager" && (
                                <select
                                  className="form-control fs-s bg-form text_color input_bg_color select form-select"
                                  aria-label=""
                                  placeholder=""
                                  id="branch"
                                  name="branch"
                                  value={formDataGraph?.branch}
                                  onChange={HandleBranchGraph}
                                  required
                                >
                                  <option value="allbranches" selected>
                                    All
                                  </option>
                                  {BranchState.branches &&
                                  BranchState.branches.length > 0
                                    ? BranchState.branches.map(
                                        (item, index) => (
                                          <option key={index} value={item.id}>
                                            {item?.branch_name}
                                          </option>
                                        )
                                      )
                                    : null}
                                </select>
                              )}
                          </div>
                        </div>

                        <div className="row g-0 text-center text_background">
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-1 h-100">
                              <p className="mb-0 fs-7 text-mute">
                                Total Enrollments
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="7585"
                                >
                                  <CountUp
                                    finalValue={
                                      TotalEnrollmentGraph?.totalEnrollments
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                              <p className="mb-0 fs-7 text-mute">
                                Last Month Total Enrollments
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500 "
                                  data-target="22.89"
                                >
                                  <CountUp
                                    finalValue={
                                      TotalEnrollmentGraph?.lastMonthEnrollments
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                              <p className=" mb-0 fs-7 text-mute ">
                                Current Month Enrollments - As on Date
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <CountUp
                                    finalValue={
                                      TotalEnrollmentGraph?.currentmonthEnrollments
                                    }
                                  />
                                  <span className="bract-sz"> {"("}</span>
                                  {TotalEnrollmentGraph?.difference &&
                                  TotalEnrollmentGraph?.difference > 0 ? (
                                    <>
                                      <span className="text-success">
                                        <CountUp
                                          finalValue={
                                            TotalEnrollmentGraph?.difference
                                          }
                                        />
                                      </span>
                                      <MdArrowOutward className="text-success fs-14  mb-0" />
                                    </>
                                  ) : TotalEnrollmentGraph?.difference < 0 ? (
                                    <>
                                      <span className="text-danger fs-12">
                                        <CountUp
                                          finalValue={
                                            TotalEnrollmentGraph?.difference
                                          }
                                        />
                                      </span>
                                      <FiArrowDownRight className="text-danger fs-12" />
                                    </>
                                  ) : (
                                    <span className="">
                                      <CountUp
                                        finalValue={
                                          TotalEnrollmentGraph?.difference
                                        }
                                      />
                                    </span>
                                  )}
                                  <span className="bract-sz">{" )"}</span>
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-3 border border-dashed border-start-0">
                              <p className=" mb-0 fs-7 text-mute bottom_space">
                                Current Month Booking Amount - As On Date
                              </p>

                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalEnrollmentGraph?.currentMonthBookingAmountAsOnDate
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                        </div>

                        <div className="row g-0 text-center text_background">
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start- h-100">
                              <p className="mb-0 fs-7 text-mute">
                                Total Booking Amount
                              </p>
                              <h5
                                className="mb-1 fs-16 display_no"
                                data-target="7585"
                              >
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalEnrollmentGraph?.totalBookingAmount
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>

                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                              <p className="mb-0 fs-7 text-mute">
                                Last Month Total Booking Amount
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalEnrollmentGraph?.lastMonthBookingAmount
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                              <p className=" mb-0 fs-7 text-mute ">
                                Last Month Enrollements - As On Date
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <CountUp
                                    finalValue={
                                      TotalEnrollmentGraph?.lastMonthEnrollmentsAsOnDate
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                              <p className="mb-0 fs-7 text-mute">
                                Current Month Fee Received - As On Date
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />

                                  <CountUp
                                    finalValue={
                                      TotalEnrollmentGraph?.currentMonthFeeRecievedAsOnDate
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div id="chart">
                            <ReactApexChart
                              className="apex-charts"
                              options={chartData.options}
                              series={chartData?.Enrollements}
                              type="bar"
                              height={350}
                            />
                          </div>
                          <div id="html-dist"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ProgressiveBar Branches Count   and percentage*/}
                  {userData &&
                    userData?.user &&
                    userData?.user?.profile !== "Counsellor" &&
                    userData?.user?.profile !== "counsellor" &&
                    userData?.user?.profile !== "Branch Manager" && (
                      <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                          <div className="card-body">
                            <h6 className="mt-1">
                              {" "}
                              Top Enrollers for{" "}
                              {currentMonthYear && currentMonthYear}
                            </h6>
                            <div className="table-container-one table-responsive">
                              <div className="p-2 ">
                                {TotalEnrollementDetails?.PaginatedBranchs
                                  ?.length > 0 &&
                                  TotalEnrollementDetails?.PaginatedBranchs?.map(
                                    (item, index) => {
                                      return (
                                        <div key={index}>
                                          <li className="" role="presentation">
                                            <Link>
                                              <button
                                                className={`card nav-link card_animate cardcol-bg w-100 p-1
                                                `}
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-home"
                                              >
                                                <div className="d-flex align-items-centerjustify-content-between">
                                                  <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3">
                                                      {item.branch}
                                                    </p>
                                                  </div>
                                                  <div className="flex-shrink-0 text-end">
                                                    <h5 className="text-success fs-14 mb-0"></h5>
                                                  </div>
                                                </div>
                                                <div className="d-flex  align-items-center   w-100 tab-bg p-1">
                                                  <div className="d-flex align-items-center me-2 white-border">
                                                    <div className="">
                                                      <MdOutlinePeople className="fs-14 dwnld_icon ms-3" />
                                                      <span className="text-black fs-14 me-3 ms-1">
                                                        <CountUp
                                                          finalValue={
                                                            item?.enrollments
                                                          }
                                                        />
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="d-flex align-items-center white-border">
                                                    <div className="me-2">
                                                      <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                      <span className="text-black fs-14  me-2">
                                                        <CountUp
                                                          finalValue={
                                                            item?.finalTotal
                                                          }
                                                        />
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="d-flex align-items-center">
                                                    <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                    <span className="text-black fs-14  me-2">
                                                      <CountUp
                                                        finalValue={
                                                          item?.feeReceived
                                                        }
                                                      />
                                                    </span>
                                                  </div>
                                                </div>
                                              </button>
                                            </Link>
                                          </li>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Progressivebar Branch Manager */}
                  {userData &&
                    userData?.user &&
                    userData?.user?.profile === "Branch Manager" && (
                      <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        
                        <div className="card">
                          <div className="card-body">
                            <h6 className="mt-1">
                              Top Enrollers for{" "}
                              {currentMonthYear && currentMonthYear}
                            </h6>
                            <div className="table-container-one table-responsive ">
                              <div className="p-2 ">
                                {BranchwiseCouncellers
                                  ?.paginatedBranchwiseCouncellers.length > 0 &&
                                  BranchwiseCouncellers?.paginatedBranchwiseCouncellers.map(
                                    (item, index) => {
                                      return (
                                        <div key={index}>
                                          <li className="" role="presentation">
                                            <Link>
                                              <button
                                                className={`card nav-link card_animate cardcol-bg w-100 p-1
                                                  `}
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-home"
                                              >
                                                <div className="d-flex align-items-centerjustify-content-between">
                                                  <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3">
                                                      {item?.enquirytakenby}
                                                    </p>
                                                  </div>
                                                  <div className="flex-shrink-0 text-end">
                                                    <h5 className="text-success fs-14 mb-0"></h5>
                                                  </div>
                                                </div>
                                                <div className="d-flex  align-items-center   w-100 tab-bg p-1">
                                                  <div className="d-flex align-items-center me-2 white-border">
                                                    <div className="">
                                                      <MdOutlinePeople className="fs-14 dwnld_icon ms-3 " />
                                                      <span className="text-black fs-14 me-3 ms-1 ">
                                                        <CountUp
                                                          finalValue={
                                                            item?.enrollments
                                                          }
                                                        />
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="d-flex align-items-center  white-border">
                                                    <div className="me-5">
                                                      <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                      <span className="text-black fs-14  me-3 ">
                                                        <CountUp
                                                          finalValue={
                                                            item?.finalTotal
                                                          }
                                                        />
                                                      </span>
                                                    </div>
                                                  </div>

                                                  <div className="d-flex align-items-center">
                                                    <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                    <span className="text-black fs-14  me-2">
                                                      <CountUp
                                                        finalValue={
                                                          item?.feeReceived
                                                        }
                                                      />
                                                    </span>
                                                  </div>
                                                </div>
                                              </button>
                                            </Link>
                                          </li>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {userData &&
                    userData?.user &&
                    (userData?.user?.profile === "Counsellor" ||
                      userData?.user?.profile === "counsellor") && (
                      <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                          <div className="card-body">
                            <h6 className="mt-1">
                              Enrolled Students in{" "}
                              {currentMonthYear && currentMonthYear}
                            </h6>
                            <div className="table-container-one table-responsive ">
                              <div className="p-2 ">
                                {CouncellerwiseStudents
                                  ?.paginatedCouncellerwiseStudents?.length >
                                  0 &&
                                  CouncellerwiseStudents?.paginatedCouncellerwiseStudents?.map(
                                    (item, index) => {
                                      return (
                                        <div key={index}>
                                          <li className="" role="presentation">
                                            <Link>
                                              <button
                                                className={`card nav-link card_animate cardcol-bg w-100 p-1
                                                  `}
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-home"
                                              >
                                                <div className="d-flex align-items-centerjustify-content-between">
                                                  <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3">
                                                      {item?.name}
                                                    </p>
                                                  </div>
                                                  <div className="flex-shrink-0 text-end">
                                                    <h5 className="text-success fs-14 mb-0"></h5>
                                                  </div>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center   w-100 tab-bg p-1">
                                                  <div className="d-flex align-items-center me-3 white-border">
                                                    <span className="text-black fs-14  me-2">
                                                      Booking Amount: <br />
                                                      <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />{" "}
                                                      <CountUp
                                                        finalValue={
                                                          item?.finalTotal
                                                        }
                                                      />
                                                    </span>
                                                  </div>

                                                  <div className="d-flex align-items-center">
                                                    <span className="text-black fs-14  me-2">
                                                      Fee Received :<br />
                                                      <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                      <CountUp
                                                        finalValue={
                                                          item?.totalPaidAmount
                                                        }
                                                      />
                                                    </span>
                                                  </div>
                                                </div>
                                              </button>
                                            </Link>
                                          </li>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {/* Enrollement Filters */}
                <div className="mt-2 mb-2 mt-lg-0">
                  <div className="mb-0 card">
                    <div className="card-body">
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvasRight"
                          aria-controls="offcanvasRight"
                        >
                          <MdFilterList className="me-1 mb-1 text_white" />
                          Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="offcanvas offcanvas-end bg_light"
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
                    <div>
                      <label className="form-label fs-s fw-medium text_color">
                        From Date
                      </label>
                      <input
                        className="  form-control input_bg_color  date_input_color "
                        id="rdob"
                        name="fromDate"
                        type="date"
                        value={filterDatesTotalEnrollments?.fromDate}
                        onChange={handleDateChange}
                      />
                    </div>

                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        To Date
                      </label>
                      <input
                        className=" form-control input_bg_color  date_input_color "
                        id="rdob"
                        name="toDate"
                        type="date"
                        onChange={handleDateChange}
                        value={filterDatesTotalEnrollments?.toDate}
                      />
                    </div>

                    <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                      <button
                        className="btn btn_primary"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={filterResetTotalEnrollementDates}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                      <Button
                        className="btn btn_primary"
                        onClick={filterSubmitTotalEnrollemntDates}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tables */}

                {userData &&
                  userData?.user &&
                  userData?.user?.profile !== "Counsellor" &&
                  userData?.user?.profile !== "counsellor" && (
                    <div className="row">
                      {/* Enrollements Branch Table */}
                      <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card">
                          <div className="card-header">
                            <h6>Enrollments In Branch</h6>
                            <div className="card-body">
                              <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                  <thead>
                                    <tr className="">
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600  "
                                      >
                                        S.No
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Branch
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600 text-truncate"
                                      >
                                        Enrollments
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600 text-truncate"
                                      >
                                        Booking Amount
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600  text-truncate"
                                      >
                                        Fee Received
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600 text-truncate"
                                      >
                                        Fee Yet To Receive
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(() => {
                                      const { PaginatedBranchs, loading } =
                                        TotalEnrollementDetails || {};

                                      if (loading) {
                                        return (
                                          <tr>
                                            <td
                                              colSpan="6"
                                              className="fs-13 black_300 fw-500 lh-xs bg_light"
                                            >
                                              Loading...
                                            </td>
                                          </tr>
                                        );
                                      }

                                      if (
                                        PaginatedBranchs &&
                                        PaginatedBranchs.length > 0
                                      ) {
                                        // Calculate totals
                                        const totalEnrollments =
                                          PaginatedBranchs.reduce(
                                            (acc, branch) =>
                                              acc + (branch.enrollments || 0),
                                            0
                                          );
                                        const totalFinal =
                                          PaginatedBranchs.reduce(
                                            (acc, branch) =>
                                              acc + (branch.finalTotal || 0),
                                            0
                                          );
                                        const totalFeeReceived =
                                          PaginatedBranchs.reduce(
                                            (acc, branch) =>
                                              acc + (branch.feeReceived || 0),
                                            0
                                          );
                                        const totalFeeYetToReceive =
                                          PaginatedBranchs.reduce(
                                            (acc, branch) =>
                                              acc +
                                              (branch.feeYetToReceive || 0),
                                            0
                                          );

                                        return (
                                          <>
                                            {PaginatedBranchs.map(
                                              (item, index) => (
                                                <tr
                                                  className={
                                                    activeBranch ===
                                                    item.branchId
                                                      ? "table-active"
                                                      : ""
                                                  }
                                                  key={item.branchId || index}
                                                >
                                                  <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                                                    {index + 1}
                                                  </td>
                                                  <td
                                                    className="fs-13 black_300 lh-xs bg_light"
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                      handleBranchSubmit(
                                                        item.branchId
                                                      )
                                                    }
                                                  >
                                                    {item.branch}
                                                  </td>
                                                  <td className="fs-13 black_300 lh-xs bg_light">
                                                    {item.enrollments || 0}
                                                  </td>
                                                  <td className="fs-13 black_300 lh-xs bg_light">
                                                    {(
                                                      item.finalTotal || 0
                                                    ).toLocaleString("en-IN")}
                                                  </td>
                                                  <td className="fs-13 black_300 lh-xs bg_light">
                                                    {(
                                                      item.feeReceived || 0
                                                    ).toLocaleString("en-IN")}
                                                  </td>
                                                  <td className="fs-13 black_300 lh-xs bg_light">
                                                    {(
                                                      item.feeYetToReceive || 0
                                                    ).toLocaleString("en-IN")}
                                                  </td>
                                                </tr>
                                              )
                                            )}

                                            {/* Totals Row */}
                                            <tr className="table-active ">
                                              <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                                                #
                                              </td>
                                              <td className="fs-13 black_300 lh-xs bg_light">
                                                Total
                                              </td>
                                              <td className="fs-13 black_300 lh-xs bg_light">
                                                {totalEnrollments.toLocaleString(
                                                  "en-IN"
                                                )}
                                              </td>
                                              <td className="fs-13 black_300 lh-xs bg_light">
                                                {totalFinal.toLocaleString(
                                                  "en-IN"
                                                )}
                                              </td>
                                              <td className="fs-13 black_300 lh-xs bg_light">
                                                {totalFeeReceived.toLocaleString(
                                                  "en-IN"
                                                )}
                                              </td>
                                              <td className="fs-13 black_300 lh-xs bg_light">
                                                {totalFeeYetToReceive.toLocaleString(
                                                  "en-IN"
                                                )}
                                              </td>
                                            </tr>
                                          </>
                                        );
                                      }

                                      // No data condition
                                      return (
                                        <tr>
                                          <td
                                            colSpan="6"
                                            className="fs-13 black_300 fw-500 lh-xs bg_light"
                                          >
                                            No data
                                          </td>
                                        </tr>
                                      );
                                    })()}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enrollements Top rated counceller &&  Barch wise Councellors Table */}

                      <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card" id="navbar-example2">
                          <div className="card-header">
                            <h6>Enrollments By Counsellors</h6>
                            <div className="card-body">
                              <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                  <thead>
                                    <tr className="">
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600  "
                                      >
                                        S.No
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Counsellors
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600 text-truncate"
                                      >
                                        Enrollments
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600 text-truncate "
                                        style={{ maxWidth: "100px" }}
                                        title="  Booking Amount"
                                      >
                                        Booking Amount
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  text-truncate "
                                        style={{ maxWidth: "100px" }}
                                        title="   Fee Received  "
                                      >
                                        Fee Received
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600 text-truncate "
                                        style={{ maxWidth: "100px" }}
                                        title="     Fee Yet To Received  "
                                      >
                                        Fee Yet To Received
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {BranchwiseCouncellers?.paginatedBranchwiseCouncellers &&
                                    BranchwiseCouncellers
                                      ?.paginatedBranchwiseCouncellers?.length >
                                      0 ? (
                                      BranchwiseCouncellers?.loading ? (
                                        <tr>
                                          <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                            Loading...
                                          </td>
                                        </tr>
                                      ) : (
                                        BranchwiseCouncellers?.paginatedBranchwiseCouncellers.map(
                                          (item, index) => {
                                            const councellerDetails =
                                              item?.user_id;
                                            return (
                                              <tr
                                                key={index}
                                                className={
                                                  activeCouncellor ===
                                                  item?.enquirytakenby
                                                    ? "table-active"
                                                    : ""
                                                }
                                              >
                                                <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                  {index + 1}
                                                </td>
                                                <td
                                                  className="fs-13 black_300  lh-xs bg_light text-truncate"
                                                  style={{
                                                    cursor: "pointer",
                                                    maxWidth: "100px",
                                                  }}
                                                  title={item?.enquirytakenby}
                                                >
                                                  <a
                                                    href="#scrollspyHeading"
                                                    onClick={() =>
                                                      handleCouncellorSubmit(
                                                        councellerDetails
                                                      )
                                                    }
                                                  >
                                                    {" "}
                                                    {item?.enquirytakenby}
                                                  </a>
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.enrollments}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.finalTotal?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.feeReceived?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.feeYetToReceive?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )
                                      )
                                    ) : TotalEnrollementDetails?.PaginatedTopRatedCouncellers &&
                                      TotalEnrollementDetails
                                        ?.PaginatedTopRatedCouncellers?.length >
                                        0 ? (
                                      TotalEnrollementDetails?.loading ? (
                                        <tr>
                                          <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                            Loading...
                                          </td>
                                        </tr>
                                      ) : (
                                        TotalEnrollementDetails?.PaginatedTopRatedCouncellers.map(
                                          (item, index) => {
                                            const councellerDetails =
                                              item?.enquirytakenby;
                                            return (
                                              <tr
                                                key={index}
                                                className={
                                                  activeCouncellor ===
                                                  item?.enquirytakenby
                                                    ? "table-active"
                                                    : ""
                                                }
                                              >
                                                <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                  {index + 1}
                                                </td>
                                                <td
                                                  className="fs-13 black_300  lh-xs bg_light text-truncate"
                                                  style={{
                                                    cursor: "pointer",
                                                    maxWidth: "100px",
                                                  }}
                                                  title={item?.enquirytakenby}
                                                >
                                                  <a
                                                    href="#scrollspyHeading"
                                                    onClick={() =>
                                                      handleCouncellorSubmit(
                                                        councellerDetails
                                                      )
                                                    }
                                                  >
                                                    {" "}
                                                    {item?.enquirytakenby}
                                                  </a>
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.enrollments}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.finalTotal?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.feeReceived?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.feeYetToReceive?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )
                                      )
                                    ) : (
                                      <tr>
                                        <td className="fs-13 black_300  lh-xs bg_light">
                                          No data
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Enrollement Student table */}

                {CouncellerwiseStudents &&
                  CouncellerwiseStudents?.paginatedCouncellerwiseStudents
                    ?.length > 0 && (
                    <div className="row">
                      <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div
                          className="card scrollspy-example"
                          data-bs-spy="scroll"
                          data-bs-target="#navbar-example2"
                          data-bs-offset="70"
                          tabIndex="0"
                        >
                          <div className="card-header">
                            <h6>Student Details</h6>
                            <div className="card-body">
                              <div className="table-responsive dashboard-tables table-scroll table-card border-0">
                                <table className="table table-hover table-centered align-middle table-nowrap equal-cell-table  table-hover">
                                  {" "}
                                  <thead>
                                    <tr className="" id="scrollspyHeading">
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600 "
                                      >
                                        S.No
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600"
                                        style={{ maxWidth: "100px" }}
                                        title=" Student Name"
                                      >
                                        Student Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600 text-truncate "
                                        style={{ maxWidth: "100px" }}
                                        title=" course"
                                      >
                                        Course
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600 text-truncate "
                                        style={{ maxWidth: "100px" }}
                                        title=" Admission Date"
                                      >
                                        Admission Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600 text-truncate "
                                        style={{ maxWidth: "100px" }}
                                        title=" Booking Amount"
                                      >
                                        Booking Amount
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600 text-truncate "
                                        style={{ maxWidth: "100px" }}
                                        title=" Paid Fee"
                                      >
                                        Paid Fee
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600 text-truncate "
                                        style={{ maxWidth: "100px" }}
                                        title=" Fee Yet to Recieved"
                                      >
                                        Fee Yet To Receive
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {CouncellerwiseStudents &&
                                    CouncellerwiseStudents
                                      ?.paginatedCouncellerwiseStudents
                                      ?.length > 0 ? (
                                      CouncellerwiseStudents?.loading ? (
                                        <tr>
                                          <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                            Loading...
                                          </td>
                                        </tr>
                                      ) : (
                                        CouncellerwiseStudents?.paginatedCouncellerwiseStudents.map(
                                          (item, index) => {
                                            return (
                                              <tr key={index}>
                                                <td className="fs-13 black_300  lh-xs bg_light ">
                                                  {index + 1}
                                                </td>
                                                <td
                                                  className="fs-13 black_300  lh-xs bg_light text-truncate"
                                                  style={{ maxWidth: "150px" }}
                                                >
                                                  {item?.name}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.course}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.admissiondate}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.finalTotal?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.totalPaidAmount?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.dueAmount?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )
                                      )
                                    ) : (
                                      <tr>
                                        <td className="fs-13 black_300  lh-xs bg_light">
                                          No data
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------- */}
          {/*------------------------------ Fee Details start----------------------- */}
          {/* ---------------------------------------------------------------------- */}

          {activeTabs.FeeDetails && (
            <div
              className={`tab-pane fade ${
                activeTabs.FeeDetails ? "show active" : ""
              }`}
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <div>
                <div className="row">
                  {/* FeeDetails Graph-1 */}
                  <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="card">
                      <div className="card-body mb-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            {" "}
                            <h6 className="">Overall Status Graph</h6>
                          </div>
                          <div className="col-lg-3 mb-2">
                            {userData &&
                              userData?.user &&
                              userData?.user?.profile !== "Counsellor" &&
                              userData?.user?.profile !== "counsellor" &&
                              userData?.user?.profile !== "Branch Manager" && (
                                <select
                                  className="form-control fs-s bg-form text_color input_bg_color select form-select"
                                  aria-label=""
                                  placeholder=""
                                  id="branch"
                                  name="branch"
                                  value={branchGraph?.branch}
                                  onChange={handleBranchFeeDetailGraph}
                                  required
                                >
                                  <option value="allbranches" selected>
                                    All
                                  </option>
                                  {BranchState?.branches &&
                                  BranchState?.branches.length > 0
                                    ? BranchState?.branches?.map(
                                        (item, index) => (
                                          <option key={index} value={item?.id}>
                                            {item?.branch_name}
                                          </option>
                                        )
                                      )
                                    : null}
                                </select>
                              )}
                          </div>
                        </div>

                        <div className="row g-0 text-center text_background">
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-1 h-100">
                              <p className="mb-0 fs-7 text-mute">
                                Total Fee Received
                              </p>
                              <h5
                                className="mb-1 fs-16 display_no"
                                data-target="7585"
                              >
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalFeeDetailsGraph?.totalFeeReceived
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                              <p className="mb-0 fs-7 text-mute">
                                Last Month Fee Received
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalFeeDetailsGraph?.lastMonthFeeReceived
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                              <div className="">
                                <p className=" mb-0 fs-7 text-mute ">
                                Last Month Fee Recevied - As on Date
                                </p>
                                <h5 className="mb-1 fs-16 display_no">
                                  <span
                                    className="counter-value fw-500 black_500"
                                    data-target="367"
                                  >
                                    <LiaRupeeSignSolid />
                                    <CountUp
                                      finalValue={
                                        TotalFeeDetailsGraph?.lastMonthFeeReceivedAsOnDate
                                      }
                                    />
                                  </span>
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100 mb-4">
                              <p className="mb-0 fs-7 text-mute">
                                Current Month Fee Received 
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalFeeDetailsGraph?.currentFeeReceived
                                    }
                                  />

                                  {TotalFeeDetailsGraph?.feeReceiveddifference &&
                                  TotalFeeDetailsGraph?.feeReceiveddifference >
                                    0 ? (
                                    <>
                                      <span className="bract-sz"> {"("}</span>
                                      <LiaRupeeSignSolid />
                                      <span className="text-success fs-12 ">
                                        <CountUp
                                          finalValue={
                                            TotalFeeDetailsGraph?.feeReceiveddifference
                                          }
                                        />
                                      </span>
                                      <MdArrowOutward className="text-success fs-12  mb-0" />
                                      <span className="bract-sz"> {")"}</span>
                                    </>
                                  ) : TotalFeeDetailsGraph?.feeReceiveddifference <
                                    0 ? (
                                    <>
                                      <br />
                                      <span className="bract-sz"> {"("}</span>
                                      <LiaRupeeSignSolid />
                                      <span className="text-danger fs-12">
                                        <CountUp
                                          finalValue={
                                            TotalFeeDetailsGraph?.feeReceiveddifference
                                          }
                                        />
                                      </span>
                                      <FiArrowDownRight className="text-danger fs-12" />
                                      <span className="bract-sz"> {")"}</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="bract-sz"> {"("}</span>
                                      <span className="">
                                        <LiaRupeeSignSolid />
                                        <CountUp
                                          finalValue={
                                            TotalFeeDetailsGraph?.feeReceiveddifference
                                          }
                                        />
                                      </span>
                                      <span className="bract-sz"> {")"}</span>
                                    </>
                                  )}
                                </span>
                              </h5>
                            </div>
                          </div>
                        </div>

                        <div className="row g-0 text-center text_background">
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start- h-100">
                              <p className="mb-0 fs-7 text-mute">
                                Total Fee Yet To Receive
                              </p>
                              <h5
                                className="mb-1 fs-16 display_no"
                                data-target="7585"
                              >
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalFeeDetailsGraph?.totalFeeYetToReceive
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>

                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                              <p className="mb-0 fs-7 text-mute">
                                Last Month Fee Yet to Receive
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalFeeDetailsGraph?.lastMonthFeeYetToReceived
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-1 border border-dashed border-start-0 h-100 mb-4">
                              <p className=" mb-0 fs-7 text-mute ">
                                Current Month Fee Yet to Receive
                              </p>
                              <h5 className="mb-0 fs-12 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalFeeDetailsGraph?.currentFeeYetToReceived
                                    }
                                  />

                                  {TotalFeeDetailsGraph?.feeYetToReceiveddifference &&
                                  TotalFeeDetailsGraph?.feeYetToReceiveddifference >
                                    0 ? (
                                    <>
                                      <br />
                                      <span className="bract-sz"> {"("}</span>
                                      <LiaRupeeSignSolid />
                                      <span className="text-success fs-12">
                                        <CountUp
                                          finalValue={
                                            TotalFeeDetailsGraph?.feeYetToReceiveddifference
                                          }
                                        />
                                      </span>
                                      <MdArrowOutward className="text-success fs-12  mb-0" />
                                      <span className="bract-sz"> {")"}</span>
                                    </>
                                  ) : TotalFeeDetailsGraph?.feeYetToReceiveddifference <
                                    0 ? (
                                    <>
                                      <br />
                                      <span className="bract-sz"> {"("}</span>
                                      <LiaRupeeSignSolid />
                                      <span className="text-danger fs-12">
                                        <CountUp
                                          finalValue={
                                            TotalFeeDetailsGraph?.feeYetToReceiveddifference
                                          }
                                        />
                                      </span>
                                      <FiArrowDownRight className="text-danger fs-12" />
                                      <span className="bract-sz"> {")"}</span>
                                    </>
                                  ) : (
                                    <>
                                      <br />
                                      <span className="bract-sz"> {"("}</span>

                                      <span className="">
                                        <LiaRupeeSignSolid />
                                        <CountUp
                                          finalValue={
                                            TotalFeeDetailsGraph?.feeYetToReceiveddifference
                                          }
                                        />
                                      </span>
                                      <span className="bract-sz"> {")"}</span>
                                    </>
                                  )}
                                </span>
                              </h5>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                              <p className="mb-0 fs-7 text-mute">
                                {`Last Three Months Fee Yet to Receive (${Array.from(
                                  { length: 3 },
                                  (_, i) =>
                                    new Date(
                                      new Date().setMonth(
                                        new Date().getMonth() - (2 - i)
                                      )
                                    ).toLocaleString("default", {
                                      month: "short",
                                    })
                                ).join(", ")})`}
                              </p>
                              <h5 className="mb-1 fs-16 display_no">
                                <span
                                  className="counter-value fw-500 black_500"
                                  data-target="367"
                                >
                                  <LiaRupeeSignSolid />
                                  <CountUp
                                    finalValue={
                                      TotalFeeDetailsGraph?.lastThreeMonthsFeeYetToReceive
                                    }
                                  />
                                </span>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div id="chart">
                          <ReactApexChart
                            className="apex-charts"
                            options={chartDatas.options}
                            series={chartDatas?.Enrollments.series}
                            type="bar"
                            height={350}
                          />
                        </div>
                        <div id="html-dist"></div>
                      </div>
                    </div>
                  </div>

                  {/* FeeDetails ProgressiveBar For Branches */}
                  {userData &&
                    userData?.user &&
                    userData?.user?.profile !== "Counsellor" &&
                    userData?.user?.profile !== "counsellor" &&
                    userData?.user?.profile !== "Branch Manager" && (
                      <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                          <div className="card-body">
                            <h6 className="mt-1">
                              Top Fee Receivers for{" "}
                              {currentMonthYear && currentMonthYear}
                            </h6>

                            <div className="table-container-two table-responsive ">
                              <div className="p-2 ">
                                {TotalFeeDetails?.PaginatedBranchs.length > 0 &&
                                  TotalFeeDetails?.PaginatedBranchs.map(
                                    (item, index) => {
                                      return (
                                        <div key={index}>
                                          <li className="" role="presentation">
                                            <Link>
                                              <button
                                                className={`card nav-link card_animate cardcol-bg w-100 p-1
                                                `}
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-home"
                                              >
                                                <div className="d-flex align-items-centerjustify-content-between">
                                                  <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3">
                                                      {item?.branch}
                                                    </p>
                                                  </div>
                                                  <div className="flex-shrink-0 text-end">
                                                    <h5 className="text-success fs-14 mb-0"></h5>
                                                  </div>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center   w-100 tab-bg p-1">
                                                  <div className="d-flex align-items-center me-3 white-border">
                                                    <span className="text-black fs-12  me-2">
                                                      Fee Recevied : <br />
                                                      <LiaRupeeSignSolid className="fs-12 dwnld_icon " />{" "}
                                                      <CountUp
                                                        finalValue={
                                                          item?.feeReceived
                                                        }
                                                      />
                                                    </span>
                                                  </div>

                                                  <div className="d-flex align-items-center">
                                                    <span className="text-black fs-12  me-3">
                                                      Fee Yet To Recevie :{" "}
                                                      <br />
                                                      <LiaRupeeSignSolid className="fs-12 dwnld_icon " />{" "}
                                                      <CountUp
                                                        finalValue={
                                                          item?.feeYetToReceive
                                                        }
                                                      />
                                                    </span>
                                                  </div>
                                                </div>
                                              </button>
                                            </Link>
                                          </li>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* FeeDetails for Branch Mananger Wise */}

                  {userData &&
                    userData?.user &&
                    userData?.user?.profile === "Branch Manager" && (
                      <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                          <div className="card-body">
                            <h6 className="mt-1">
                              Top Fee Receivers for{" "}
                              {currentMonthYear && currentMonthYear}
                            </h6>

                            <div className="table-container-two table-responsive ">
                              <div className="p-2 ">
                                {FeeDetailsBranchwiseCouncellers
                                  ?.paginatedFeeDetailsBranchwiseCouncellers
                                  .length > 0 &&
                                  FeeDetailsBranchwiseCouncellers?.paginatedFeeDetailsBranchwiseCouncellers.map(
                                    (item, index) => {

                                      return (
                                        <div key={index}>
                                          <li className="" role="presentation">
                                            <Link>
                                              <button
                                                className={`card nav-link card_animate cardcol-bg w-100 p-1
                                                `}
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-home"
                                              >
                                                <div className="d-flex align-items-centerjustify-content-between">
                                                  <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3">
                                                      {item?.enquirytakenby}
                                                    </p>
                                                  </div>
                                                  <div className="flex-shrink-0 text-end">
                                                    <h5 className="text-success fs-14 mb-0"></h5>
                                                  </div>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center   w-100 tab-bg p-1">
                                                  <div className="d-flex align-items-center me-3 white-border">
                                                    <span className="text-black fs-12  me-2">
                                                      Fee Recevied : <br />
                                                      <LiaRupeeSignSolid className="fs-12 dwnld_icon me-2" />
                                                      <CountUp
                                                        finalValue={
                                                          item?.feeReceived
                                                        }
                                                      />
                                                    </span>
                                                  </div>

                                                  <div className="d-flex align-items-center">
                                                    <span className="text-black fs-12  me-2">
                                                      Fee Yet To Recevie :<br />
                                                      <LiaRupeeSignSolid className="fs-12 dwnld_icon me-2" />{" "}
                                                      <CountUp
                                                        finalValue={
                                                          item?.feeYetToReceive
                                                        }
                                                      />
                                                    </span>
                                                  </div>
                                                </div>
                                              </button>
                                            </Link>
                                          </li>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/*FeeDetails ProgressiveBar For Counsellors */}
                  {userData &&
                    userData?.user &&
                    (userData?.user?.profile === "Counsellor" ||
                      userData?.user?.profile === "counsellor") && (
                      <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                          <div className="card-body">
                            <h6 className="mt-1">
                              Top Fee Receivers for{" "}
                              {currentMonthYear && currentMonthYear}
                            </h6>

                            <div className="table-container-two table-responsive ">
                              <div className="p-2 ">
                                {FeeDetailsCouncellerwiseStudents
                                  ?.paginatedFeeDetailsCouncellerwiseStudents
                                  .length > 0 &&
                                  FeeDetailsCouncellerwiseStudents?.paginatedFeeDetailsCouncellerwiseStudents.map(
                                    (item, index) => {

                                      return (
                                        <div key={index}>
                                          <li className="" role="presentation">
                                            <Link>
                                              <button
                                                className={`card nav-link card_animate cardcol-bg w-100 p-1
                                                `}
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-home"
                                              >
                                                <div className="d-flex align-items-centerjustify-content-between">
                                                  <div className="flex-grow-1 overflow-hidden">
                                                    <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3">
                                                      {item?.branch}
                                                    </p>
                                                  </div>
                                                  <div className="flex-shrink-0 text-end">
                                                    <h5 className="text-success fs-14 mb-0"></h5>
                                                  </div>
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center   w-100 tab-bg p-1">
                                                  <div className="d-flex align-items-center me-3 white-border">
                                                    <span className="text-black fs-12  me-2">
                                                      {" "}
                                                      Fee Recevied :<br />
                                                      <LiaRupeeSignSolid className="fs-12 dwnld_icon me-2" />{" "}
                                                      <CountUp
                                                        finalValue={
                                                          item?.totalpaidamount
                                                        }
                                                      />
                                                    </span>
                                                  </div>

                                                  <div className="d-flex align-items-center">
                                                    <span className="text-black fs-12  me-2">
                                                      {" "}
                                                      Fee Yet To Receive :<br />
                                                      <LiaRupeeSignSolid className="fs-12 dwnld_icon me-2" />{" "}
                                                      <CountUp
                                                        finalValue={
                                                          item?.dueamount
                                                        }
                                                      />
                                                    </span>
                                                  </div>
                                                </div>
                                              </button>
                                            </Link>
                                          </li>
                                        </div>
                                      );
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {/* FeeDetails Filters */}
                <div className="mt-2 mb-2 mt-lg-0">
                  <div className="mb-0 card">
                    <div className="card-body">
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white"
                          type="button"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvasRightOne"
                          aria-controls="offcanvasRight"
                        >
                          <MdFilterList className="me-1 mb-1 text_white" />
                          Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="offcanvas offcanvas-end bg_light"
                  id="offcanvasRightOne"
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
                    {/* Profile filter */}
                    <div>
                      <label className="form-label fs-s fw-medium text_color">
                        From Date
                      </label>
                      <input
                        className="  form-control input_bg_color  date_input_color "
                        id="rdob"
                        name="fromDate"
                        type="date"
                        onChange={handleDateChangeInFeeDeatils}
                        value={filteredDatesFeeDetails?.fromDate}
                      />
                    </div>

                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        To Date
                      </label>
                      <input
                        className=" form-control input_bg_color  date_input_color "
                        id="rdob"
                        name="toDate"
                        type="date"
                        onChange={handleDateChangeInFeeDeatils}
                        value={filteredDatesFeeDetails?.toDate}
                      />
                    </div>

                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Admission From Date
                      </label>
                      <input
                        className=" form-control input_bg_color  date_input_color "
                        id="rdob"
                        name="admissionFromDate"
                        type="date"
                        onChange={handleDateChangeInFeeDeatils}
                        value={filteredDatesFeeDetails?.admissionFromDate}
                      />
                    </div>
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Admission To Date
                      </label>
                      <input
                        className=" form-control input_bg_color  date_input_color "
                        id="rdob"
                        name="admissionToDate"
                        type="date"
                        onChange={handleDateChangeInFeeDeatils}
                        value={filteredDatesFeeDetails?.admissionToDate}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                      <button
                        className="btn btn_primary"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={filterReset_FeeDetailsDates}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                      <Button
                        className="btn btn_primary"
                        onClick={filterSubmit_FeeDetailsDates}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>

                {userData &&
                  userData?.user &&
                  userData?.user?.profile !== "Counsellor" &&
                  userData?.user?.profile !== "counsellor" && (
                    <>
                      {/* FeeDetails Branches Table */}
                      <div className="row">
                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <div className="card">
                            <div className="card-header">
                              <h6>Fee Received In Branch</h6>
                              <div className="card-body">
                                <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                  <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover ">
                                    <thead>
                                      <tr className="">
                                        <th
                                          scope="col"
                                          className="fs-13 lh-xs fw-600 "
                                        >
                                          S.No
                                        </th>
                                        <th
                                          scope="col"
                                          className="fs-13 lh-xs fw-600 "
                                        >
                                          Branch
                                        </th>
                                        <th
                                          scope="col"
                                          className="fs-13 lh-xs  fw-600  text-truncate"
                                        >
                                          Fee Received
                                        </th>
                                        <th
                                          scope="col"
                                          className="fs-13 lh-xs  fw-600 text-truncate"
                                        >
                                          Fee Yet To Receive
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(() => {
                                        const { PaginatedBranchs, loading } =
                                          TotalFeeDetails || {};

                                        if (loading) {
                                          return (
                                            <tr>
                                              <td
                                                colSpan="6"
                                                className="fs-13 black_300 fw-500 lh-xs bg_light"
                                              >
                                                Loading...
                                              </td>
                                            </tr>
                                          );
                                        }

                                        if (
                                          PaginatedBranchs &&
                                          PaginatedBranchs.length > 0
                                        ) {
                                          const totalFeeReceived =
                                            PaginatedBranchs.reduce(
                                              (acc, branch) =>
                                                acc + (branch.feeReceived || 0),
                                              0
                                            );
                                          const totalFeeYetToReceive =
                                            PaginatedBranchs.reduce(
                                              (acc, branch) =>
                                                acc +
                                                (branch.feeYetToReceive || 0),
                                              0
                                            );

                                          return (
                                            <>
                                              {PaginatedBranchs.map(
                                                (item, index) => (
                                                  <tr
                                                    className={
                                                      activeBranchFeeDetails ===
                                                      item.branch
                                                        ? "table-active"
                                                        : ""
                                                    }
                                                    key={index}
                                                  >
                                                    <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                      {index + 1}
                                                    </td>
                                                    <td
                                                      className="fs-13 black_300  lh-xs bg_light"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleBranchSubmitFeeDetails(
                                                          item?.branchId
                                                        )
                                                      }
                                                    >
                                                      {item?.branch}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeReceived?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeYetToReceive?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                  </tr>
                                                )
                                              )}

                                              {/* Totals Row */}
                                              <tr className="table-active ">
                                                <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                                                  #
                                                </td>
                                                <td className="fs-13 black_300 lh-xs bg_light">
                                                  Total
                                                </td>

                                                <td className="fs-13 black_300 lh-xs bg_light">
                                                  {totalFeeReceived.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300 lh-xs bg_light">
                                                  {totalFeeYetToReceive.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        }

                                        // No data condition
                                        return (
                                          <tr>
                                            <td
                                              colSpan="6"
                                              className="fs-13 black_300 fw-500 lh-xs bg_light"
                                            >
                                              No data
                                            </td>
                                          </tr>
                                        );
                                      })()}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Feedetails TopRated Councellors && Councellors Table */}

                      <div>
                        <div className="row">
                          <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="card">
                              <div className="card-header">
                                <h6>Fee Received By Counsellors</h6>
                                <div className="card-body">
                                  <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                    <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                      <thead>
                                        <tr className="">
                                          <th
                                            scope="col"
                                            className="fs-13 lh-xs fw-600  "
                                          >
                                            S.No
                                          </th>
                                          <th
                                            scope="col"
                                            className="fs-13 lh-xs fw-600  "
                                          >
                                            Counsellor
                                          </th>
                                          <th
                                            scope="col"
                                            className="fs-13 lh-xs fw-600 text-truncate"
                                          >
                                            Fee Received
                                          </th>
                                          <th
                                            scope="col"
                                            className="fs-13 lh-xs fw-600 text-truncate"
                                          >
                                            Fee Yet To Receive
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {FeeDetailsBranchwiseCouncellers?.paginatedFeeDetailsBranchwiseCouncellers &&
                                        FeeDetailsBranchwiseCouncellers
                                          ?.paginatedFeeDetailsBranchwiseCouncellers
                                          .length > 0 ? (
                                          FeeDetailsBranchwiseCouncellers?.loading ? (
                                            <tr>
                                              <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                Loading...
                                              </td>
                                            </tr>
                                          ) : (
                                            FeeDetailsBranchwiseCouncellers?.paginatedFeeDetailsBranchwiseCouncellers?.map(
                                              (item, index) => {
                                                return (
                                                  <tr
                                                    key={index}
                                                    className={
                                                      activeCouncellorFeeDetails ===
                                                      item?.enquirytakenby
                                                        ? "table-active"
                                                        : ""
                                                    }
                                                  >
                                                    <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                      {index + 1}
                                                    </td>
                                                    <td
                                                      className="fs-13 black_300  lh-xs bg_light"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleCouncellorSubmitfeeDetails(
                                                          item?.user_id
                                                        )
                                                      }
                                                    >
                                                      {item?.enquirytakenby}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeReceived?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeYetToReceive?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )
                                          )
                                        ) : TotalFeeDetails?.PaginatedTopRatedCouncellers &&
                                          TotalFeeDetails
                                            ?.PaginatedTopRatedCouncellers
                                            ?.length > 0 ? (
                                          TotalFeeDetails?.loading ? (
                                            <tr>
                                              <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                Loading...
                                              </td>
                                            </tr>
                                          ) : (
                                            TotalFeeDetails?.PaginatedTopRatedCouncellers.map(
                                              (item, index) => {
                                                return (
                                                  <tr
                                                    key={index}
                                                    className={
                                                      activeCouncellorFeeDetails ===
                                                      item?.enquirytakenby
                                                        ? "table-active"
                                                        : ""
                                                    }
                                                  >
                                                    <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                      {index + 1}
                                                    </td>
                                                    <td
                                                      className="fs-13 black_300  lh-xs bg_light"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleCouncellorSubmitfeeDetails(
                                                          item?.user_id
                                                        )
                                                      }
                                                    >
                                                      {item?.enquirytakenby}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeReceived?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeYetToReceive?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )
                                          )
                                        ) : (
                                          <tr>
                                            <td className="fs-13 black_300  lh-xs bg_light">
                                              no data
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                {/* Feedetails Students  table */}

                {FeeDetailsCouncellerwiseStudents?.paginatedFeeDetailsCouncellerwiseStudents &&
                  FeeDetailsCouncellerwiseStudents
                    ?.paginatedFeeDetailsCouncellerwiseStudents.length > 0 && (
                    <div className="row">
                      <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card">
                          <div className="card-header">
                            <h6>Student Details</h6>
                            <div className="card-body">
                              <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                  <thead>
                                    <tr className="">
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600  "
                                      >
                                        S.No
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Student Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Admission Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Paid Fee
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Next Due Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600 "
                                      >
                                        Due Amount
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {FeeDetailsCouncellerwiseStudents?.paginatedFeeDetailsCouncellerwiseStudents &&
                                    FeeDetailsCouncellerwiseStudents
                                      ?.paginatedFeeDetailsCouncellerwiseStudents
                                      .length > 0 ? (
                                      FeeDetailsCouncellerwiseStudents?.loading ? (
                                        <tr>
                                          <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                            Loading...
                                          </td>
                                        </tr>
                                      ) : (
                                        FeeDetailsCouncellerwiseStudents?.paginatedFeeDetailsCouncellerwiseStudents?.map(
                                          (item, index) => {
                                            return (
                                              <tr key={index}>
                                                <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                  {index + 1}
                                                </td>
                                                <td
                                                  className="fs-13 black_300  lh-xs bg_light text-truncate"
                                                  style={{ maxWidth: "150px" }}
                                                >
                                                  {item?.name}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.admissiondate}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.totalpaidamount?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.nextduedate}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.dueamount?.toLocaleString(
                                                    "en-IN"
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
                                          no data
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* -------------------------------------------- */}
          {/* ----------Today Fee Recevied --------------- */}
          {/* --------------------------------------------*/}

          {activeTabs.TodayFeeRecieved && (
            <div
              className={`tab-pane fade ${
                activeTabs.TodayFeeRecieved ? "show active" : ""
              }`}
              id="pills-todayFeeRecevied"
              role="tabpanel"
              aria-labelledby="pills-todayFeeRecevied-tab"
            >
              <div>
                {userData &&
                  userData?.user &&
                  userData?.user?.profile !== "Counsellor" &&
                  userData?.user?.profile !== "counsellor" && (
                    <>
                      {/* Today Fee Recevied Branches Table */}
                      <div className="row">
                        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                          <div className="card">
                            <div className="card-header">
                              <h6>Today Fee Received In Branches</h6>
                              <div className="card-body">
                                <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                  <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover ">
                                    <thead>
                                      <tr className="">
                                        <th
                                          scope="col"
                                          className="fs-13 lh-xs fw-600 "
                                        >
                                          S.No
                                        </th>
                                        <th
                                          scope="col"
                                          className="fs-13 lh-xs fw-600 "
                                        >
                                          Branch
                                        </th>
                                        <th
                                          scope="col"
                                          className="fs-13 lh-xs  fw-600  text-truncate"
                                        >
                                          Fee Received
                                        </th>
                                        <th
                                          scope="col"
                                          className="fs-13 lh-xs  fw-600 text-truncate"
                                        >
                                          Fee Yet To Receive
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(() => {
                                        const {
                                          paginatedBranchesList,
                                          loading,
                                        } = TodayFeeRecevied || {};

                                        if (loading) {
                                          return (
                                            <tr>
                                              <td
                                                colSpan="6"
                                                className="fs-13 black_300 fw-500 lh-xs bg_light"
                                              >
                                                Loading...
                                              </td>
                                            </tr>
                                          );
                                        }

                                        if (
                                          paginatedBranchesList &&
                                          paginatedBranchesList.length > 0
                                        ) {
                                          const totalFeeReceived =
                                            paginatedBranchesList.reduce(
                                              (acc, branch) =>
                                                acc + (branch.feeReceived || 0),
                                              0
                                            );
                                          const totalFeeYetToReceive =
                                            paginatedBranchesList.reduce(
                                              (acc, branch) =>
                                                acc +
                                                (branch.feeYetToReceive || 0),
                                              0
                                            );

                                          return (
                                            <>
                                              {paginatedBranchesList.map(
                                                (item, index) => (
                                                  <tr
                                                    className={
                                                      activeBranchTodayFeeRecevied ===
                                                      item.branch
                                                        ? "table-active"
                                                        : ""
                                                    }
                                                    key={index}
                                                  >
                                                    <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                      {index + 1}
                                                    </td>
                                                    <td
                                                      className="fs-13 black_300  lh-xs bg_light"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleBranchTodayFeeRecevied(
                                                          item?.branchId
                                                        )
                                                      }
                                                    >
                                                      {item?.branch}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeReceived?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeYetToReceive?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                  </tr>
                                                )
                                              )}

                                              {/* Totals Row */}
                                              <tr className="table-active ">
                                                <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                                                  #
                                                </td>
                                                <td className="fs-13 black_300 lh-xs bg_light">
                                                  Total
                                                </td>

                                                <td className="fs-13 black_300 lh-xs bg_light">
                                                  {totalFeeReceived.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300 lh-xs bg_light">
                                                  {totalFeeYetToReceive.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                              </tr>
                                            </>
                                          );
                                        }

                                        // No data condition
                                        return (
                                          <tr>
                                            <td
                                              colSpan="6"
                                              className="fs-13 black_300 fw-500 lh-xs bg_light"
                                            >
                                              No data
                                            </td>
                                          </tr>
                                        );
                                      })()}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Feedetails TopRated Councellors && Councellors Table */}

                      <div>
                        <div className="row">
                          <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="card">
                              <div className="card-header">
                                <h6>Today Fee Received By Counsellors</h6>
                                <div className="card-body">
                                  <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                    <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                      <thead>
                                        <tr className="">
                                          <th
                                            scope="col"
                                            className="fs-13 lh-xs fw-600  "
                                          >
                                            S.No
                                          </th>
                                          <th
                                            scope="col"
                                            className="fs-13 lh-xs fw-600  "
                                          >
                                            Counsellor
                                          </th>
                                          <th
                                            scope="col"
                                            className="fs-13 lh-xs fw-600 text-truncate"
                                          >
                                            Fee Received
                                          </th>
                                          <th
                                            scope="col"
                                            className="fs-13 lh-xs fw-600 text-truncate"
                                          >
                                            Fee Yet To Receive
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {TodayFeeReceviedByCouncellors?.paginatedCouncellorsList &&
                                        TodayFeeReceviedByCouncellors
                                          ?.paginatedCouncellorsList.length >
                                          0 ? (
                                          TodayFeeReceviedByCouncellors?.loading ? (
                                            <tr>
                                              <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                Loading...
                                              </td>
                                            </tr>
                                          ) : (
                                            TodayFeeReceviedByCouncellors?.paginatedCouncellorsList?.map(
                                              (item, index) => {
                                                return (
                                                  <tr
                                                    key={index}
                                                    className={
                                                      activeCouncellorTodayFeeRecevied ===
                                                      item?.enquirytakenby
                                                        ? "table-active"
                                                        : ""
                                                    }
                                                  >
                                                    <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                      {index + 1}
                                                    </td>
                                                    <td
                                                      className="fs-13 black_300  lh-xs bg_light"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleCouncellorIdTodayFeeRecevied(
                                                          item?.user_id
                                                        )
                                                      }
                                                    >
                                                      {item?.enquirytakenby}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeReceived?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeYetToReceive?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )
                                          )
                                        ) : TodayFeeRecevied?.paginatedTopRatedCouncellors &&
                                          TodayFeeRecevied
                                            ?.paginatedTopRatedCouncellors
                                            ?.length > 0 ? (
                                          TodayFeeRecevied?.loading ? (
                                            <tr>
                                              <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                Loading...
                                              </td>
                                            </tr>
                                          ) : (
                                            TodayFeeRecevied?.paginatedTopRatedCouncellors.map(
                                              (item, index) => {
                                                return (
                                                  <tr
                                                    key={index}
                                                    className={
                                                      activeCouncellorTodayFeeRecevied ===
                                                      item?.enquirytakenby
                                                        ? "table-active"
                                                        : ""
                                                    }
                                                  >
                                                    <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                      {index + 1}
                                                    </td>
                                                    <td
                                                      className="fs-13 black_300  lh-xs bg_light"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() =>
                                                        handleCouncellorIdTodayFeeRecevied(
                                                          item?.user_id
                                                        )
                                                      }
                                                    >
                                                      {item?.enquirytakenby}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeReceived?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                    <td className="fs-13 black_300  lh-xs bg_light">
                                                      {item?.feeYetToReceive?.toLocaleString(
                                                        "en-IN"
                                                      )}
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )
                                          )
                                        ) : (
                                          <tr>
                                            <td className="fs-13 black_300  lh-xs bg_light">
                                              no data
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                {/* Feedetails Students  table */}

                {TodayFeeReceviedByStudents?.paginatedStudentsList &&
                  TodayFeeReceviedByStudents?.paginatedStudentsList.length >
                    0 && (
                    <div className="row">
                      <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="card">
                          <div className="card-header">
                            <h6>Today Fee Recevied Student Details</h6>
                            <div className="card-body">
                              <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                  <thead>
                                    <tr className="">
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600  "
                                      >
                                        S.No
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Student Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Admission Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Paid Fee
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600  "
                                      >
                                        Next Due Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs  fw-600 "
                                      >
                                        Due Amount
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {TodayFeeReceviedByStudents?.paginatedStudentsList &&
                                    TodayFeeReceviedByStudents
                                      ?.paginatedStudentsList.length > 0 ? (
                                      TodayFeeReceviedByStudents?.loading ? (
                                        <tr>
                                          <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                            Loading...
                                          </td>
                                        </tr>
                                      ) : (
                                        TodayFeeReceviedByStudents?.paginatedStudentsList?.map(
                                          (item, index) => {
                                            return (
                                              <tr key={index}>
                                                <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                  {index + 1}
                                                </td>
                                                <td
                                                  className="fs-13 black_300  lh-xs bg_light text-truncate"
                                                  style={{ maxWidth: "150px" }}
                                                >
                                                  {item?.name}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.admissiondate}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.totalpaidamount?.toLocaleString(
                                                    "en-IN"
                                                  )}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.nextduedate}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.dueamount?.toLocaleString(
                                                    "en-IN"
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
                                          no data
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------- */}
          {/*----------------- T0TAL USERS  TAB -------------*/}
          {/* ---------------------------------------------- */}

          {activeTabs.TotalUsers && (
            <div
              className={`tab-pane fade ${
                activeTabs.TotalUsers ? "show active" : ""
              }`}
              id="pills-fee"
              role="tabpanel"
              aria-labelledby="pills-fee-tab"
            >
              <div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="card">
                      <div className="card-header">
                        <div className="card-body">
                          <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                            <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                              <thead>
                                <tr className="">
                                  <th
                                    scope="col"
                                    className="fs-13 lh-xs fw-600 "
                                  >
                                    S.No
                                  </th>
                                  <th
                                    scope="col"
                                    className="fs-13 lh-xs  fw-600  "
                                  >
                                    Branch
                                  </th>
                                  <th
                                    scope="col"
                                    className="fs-13 lh-xs  fw-600  "
                                  >
                                    Users Count
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {TotalUsersInDashboad?.paginatedBranchesList &&
                                TotalUsersInDashboad?.paginatedBranchesList
                                  .length > 0 ? (
                                  TotalUsersInDashboad?.loading ? (
                                    <tr>
                                      <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                        Loading...
                                      </td>
                                    </tr>
                                  ) : (
                                    TotalUsersInDashboad?.paginatedBranchesList.map(
                                      (item, index) => {
                                        const branch = item?.branchId;

                                        return (
                                          <tr
                                            key={index}
                                            className={
                                              activeUsersInTotalUsers ===
                                              item?.branch
                                                ? "table-active"
                                                : ""
                                            }
                                          >
                                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                              {index + 1}
                                            </td>
                                            <td
                                              className="fs-13 black_300  lh-xs bg_light"
                                              style={{ cursor: "pointer" }}
                                              onClick={() =>
                                                handleBranchSubmitInUsers(
                                                  branch
                                                )
                                              }
                                            >
                                              {item?.branch}
                                            </td>
                                            <td className="fs-13 black_300  lh-xs bg_light">
                                              {item?.users}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td className="fs-13 black_300  lh-xs bg_light">
                                      No data
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    {/* Branchwise Councelloers */}
                    {UsersListInBranchWise?.paginatedUsersListInBranchWise &&
                      UsersListInBranchWise?.paginatedUsersListInBranchWise
                        .length > 0 && (
                        <div className="card">
                          <div className="card-header">
                            <div className="card-body">
                              <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                                <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                  <thead>
                                    <tr className="">
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600  "
                                      >
                                        S.No
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600  "
                                      >
                                        Username
                                      </th>
                                      <th
                                        scope="col"
                                        className="fs-13 lh-xs fw-600  "
                                      >
                                        Profile
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {UsersListInBranchWise?.paginatedUsersListInBranchWise &&
                                    UsersListInBranchWise
                                      ?.paginatedUsersListInBranchWise.length >
                                      0 ? (
                                      UsersListInBranchWise?.loading ? (
                                        <tr>
                                          <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                            Loading...
                                          </td>
                                        </tr>
                                      ) : (
                                        UsersListInBranchWise?.paginatedUsersListInBranchWise?.map(
                                          (item, index) => {
                                            return (
                                              <tr key={index}>
                                                <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                                  {index + 1}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.fullname}
                                                </td>
                                                <td className="fs-13 black_300  lh-xs bg_light">
                                                  {item?.profile}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )
                                      )
                                    ) : (
                                      <tr className="fs-13 black_300  lh-xs bg_light">
                                        No data / Select the Branch
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagementDasboard;
