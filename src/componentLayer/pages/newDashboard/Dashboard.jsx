// Dashboard.jsx
import { useEffect, useState } from "react";
import DashboardTabs from "./components/DashboardTabs";
import {
  getAllBranches,
  getAllBranchesListOfTotalUsers,
  getCurrentTabData,
  getFeeDetailsGraph,
  getFeeReceivedByBranchWise,
  getFeeReceivedByCouncellorWise,
  getLiveUsers,
  getTodayDate,
  getTotalEnrollmentDeatils,
  getTotalEnrollmentGraph,
  getTodayEnrollmentsCount,
  getTodayEnrollmentsList,
} from "./utils/DataUtilities";
import TotalEnrollmentsStatusGraph from "./components/TotalEnrollmentsStatusGraph";
import FeeDetails from "./components/FeeDetails";
import TodayFeeReceived from "./components/TodayFeeReceived";
import TotalUsers from "./components/TotalUsers";
import TodayEnrollments from "../dashboard/TodayEnrollments"; // adjust path

export const LoadingSpinner = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 z-3">
      <div className="text-center position-relative">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "5rem", height: "5rem", borderWidth: "0.5rem" }}
        ></div>
        <p className="text-white fs-5 fw-semibold mt-4 mb-0">Loading...</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [staticDashboardData, setStaticDashboardData] = useState({
    totalEnrollments: 0,
    withoutGstCurrentFeeReceived: 0,
    currentFeeReceived: "",
    todayOverallFeeReceived: 0,
    currentFeeYetToReceived: 0,
    totalUsers: 0,
    liveUsers: 0,
    todayEnrollments: 0,
  });

  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  const [activeTabs, setActiveTabs] = useState({ TotalEnrollments: true });
  const [activeData, setActiveData] = useState();
  const [AllBranchState, setBranchState] = useState([]);
  const [TotalEnrollments, setTotalEntollments] = useState({
    TotalEnrollments: {},
    TopEnrollers: [],
  });

  const [todayFeeDetailsBranches, setTodayFeeDetailsBranches] = useState();
  const [todayFeeDetailsCounsellors, setTodayFeeDetailsCounsellors] = useState();
  const [todayFeedetailsActiveBranch, setTodayFeedetailsActiveBranch] = useState();

  const [feeDetailsData, setFeeDetailsData] = useState({
    graphData: {},
    topFeeReceivers: {},
  });

  // State for Today Enrollments – now matches the output of getTodayEnrollmentsList
  const [todayEnrollmentsData, setTodayEnrollmentsData] = useState({
    count: 0,
    branches: [],
    counsellors: [],
  });

  const [allBranchesTableData, setAllBranchesTableData] = useState();
  const [studentsTableData, setStudentsTableData] = useState();
  const [activeUsersTabledData, setActiveUsersTabledData] = useState();
  const [totalUsersCount, setTotalUsersCount] = useState();

  const [isPageLoading, setIsPageLoading] = useState(true);

  // ========== HANDLE TAB CLICKS ==========
  const handleTabs = async (tab) => {
    setIsPageLoading(true);
    setActiveTabs({ [tab]: true });

    if (tab === "Today Enrollments") {
      try {
        // getTodayEnrollmentsList returns { count, branches, counsellors }
        const data = await getTodayEnrollmentsList();
        setTodayEnrollmentsData({
          count: data.count || 0,
          branches: data.branches || [],
          counsellors: data.counsellors || [],
        });
        setStaticDashboardData((prev) => ({
          ...prev,
          todayEnrollments: data.count || 0,
        }));
      } catch (err) {
        console.error("Failed to load today's enrollments data", err);
        setTodayEnrollmentsData({ count: 0, branches: [], counsellors: [] });
      }
    } else {
      const currentTabData = await getCurrentTabData(tab);
      setActiveData(currentTabData);
    }

    setIsPageLoading(false);
  };

  // ========== POPULATE OTHER TABS FROM activeData ==========
  useEffect(() => {
    if (activeTabs.TotalEnrollments) {
      setTotalEntollments((prev) => ({
        ...prev,
        TotalEnrollments: activeData?.totalEnrollmantsGraphData || [],
        TopEnrollers: activeData?.topEnrollersData || [],
      }));
      setBranchState(activeData?.branchData);
    }
    if (activeTabs.FeeDetails) {
      setFeeDetailsData((prev) => ({
        ...prev,
        graphData: activeData?.graphData,
        topFeeReceivers: activeData?.topFeeReceivers,
      }));
      setBranchState(activeData?.branchData);
    }
    if (activeTabs.TodayFeeReceived) {
      setTodayFeeDetailsBranches(activeData?.branches);
      setTodayFeeDetailsCounsellors(activeData?.topEnquiryTakenBy);
      if (activeData?.branches?.length > 0) {
        setTodayFeedetailsActiveBranch(activeData?.branches?.[0].branchId);
      }
    }
    if (activeTabs.TotalUsers) {
      setAllBranchesTableData(activeData?.allBranches?.branches);
      setActiveUsersTabledData(activeData?.totalUsersAndStudents?.data?.activeUsers);
      setStudentsTableData(activeData?.totalUsersAndStudents?.data?.activestudents);
      setTotalUsersCount({
        studentcount: activeData?.totalUsersAndStudents?.data?.studentcount,
        totalStudentCount: activeData?.totalUsersAndStudents?.data?.totalStudentCount,
        totalactiveCount: activeData?.totalUsersAndStudents?.data?.totalactiveCount,
        userCount: activeData?.totalUsersAndStudents?.data?.userCount,
      });
    }
  }, [activeData, activeTabs]);

  // ========== INITIAL DATA FETCH ==========
  useEffect(() => {
    const fetchData = async () => {
      setIsPageLoading(true);
      const today = getTodayDate();

      try {
        const graphRes = await getTotalEnrollmentGraph();
        setTotalEntollments((prev) => ({
          ...prev,
          TotalEnrollments: graphRes?.data,
        }));

        const branchesRes = await getAllBranches();
        setBranchState(branchesRes?.data);

        const enrollDetails = await getTotalEnrollmentDeatils();
        setTotalEntollments((prev) => ({
          ...prev,
          TopEnrollers: enrollDetails?.data,
        }));
        setStaticDashboardData((prev) => ({
          ...prev,
          totalEnrollments: enrollDetails?.data?.overallEnrollments ?? 0,
        }));

        const feeGraph = await getFeeDetailsGraph();
        const feeData = feeGraph?.data;
        setStaticDashboardData((prev) => ({
          ...prev,
          withoutGstCurrentFeeReceived: feeData?.withoutGstCurrentFeeReceived,
          currentFeeReceived: feeData?.currentFeeReceived,
          currentFeeYetToReceived: feeData?.currentFeeYetToReceived,
        }));

        const todayFee = await getFeeReceivedByBranchWise({
          fromDate: today,
          toDate: today,
        });
        setStaticDashboardData((prev) => ({
          ...prev,
          todayOverallFeeReceived: todayFee?.data?.overallFeeReceived ?? 0,
        }));

        const live = await getLiveUsers();
        setStaticDashboardData((prev) => ({
          ...prev,
          liveUsers: live?.data?.data?.totalactiveCount ?? 0,
        }));

        const totalUsersRes = await getAllBranchesListOfTotalUsers();
        setStaticDashboardData((prev) => ({
          ...prev,
          totalUsers: totalUsersRes?.data?.overallUsers ?? 0,
        }));

        const todayCount = await getTodayEnrollmentsCount();
        setStaticDashboardData((prev) => ({
          ...prev,
          todayEnrollments: todayCount,
        }));
      } catch (err) {
        console.error("Initial data fetch error:", err);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions (unchanged)
  const handleBranchTodayFeeRecevied = async (branch) => {
    setTodayFeedetailsActiveBranch(branch);
    const today = getTodayDate();
    const data = await getFeeReceivedByCouncellorWise({
      branch: branch,
      toDate: today,
      fromDate: today,
    });
    setTodayFeeDetailsCounsellors(data?.data?.enquirytakenbyData);
    return data;
  };

  const [feeDetailBranchGraph, setBranchGraph] = useState({ branch: "" });

  const handleBranchFeeDetailGraph = async (e) => {
    const { name, value } = e.target;
    setBranchGraph((prev) => ({ ...prev, [name]: value }));
    const newGraph = await getFeeDetailsGraph({ branch: value });
    setFeeDetailsData((prev) => ({
      ...prev,
      graphData: newGraph?.data,
    }));
    setStaticDashboardData((prev) => ({
      ...prev,
      withoutGstCurrentFeeReceived: newGraph?.data?.withoutGstCurrentFeeReceived,
      currentFeeReceived: newGraph?.data?.currentFeeReceived,
      currentFeeYetToReceived: newGraph?.data?.currentFeeYetToReceived,
    }));
  };

  const getCurrentTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  const getTaboneData = (data) => {
    setStaticDashboardData((prev) => ({
      ...prev,
      totalEnrollments: data,
    }));
  };

  return (
    <div className="container-fluid mt-3">
      {/* <LoadingSpinner isLoading={isPageLoading} /> */}
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

      <DashboardTabs
        staticDashboardData={staticDashboardData}
        activeTabs={activeTabs}
        handleTabs={handleTabs}
      />

      {activeTabs.TotalEnrollments && (
        <TotalEnrollmentsStatusGraph
          userData={userData}
          BranchState={AllBranchState?.branchData}
          TotalEnrollmentGraphData={TotalEnrollments}
          getTaboneData={getTaboneData}
        />
      )}

      {activeTabs.FeeDetails && (
        <FeeDetails
          userData={userData}
          feeDetailsData={feeDetailsData}
          BranchState={AllBranchState?.branchData}
          branchGraph={feeDetailBranchGraph}
          handleBranchFeeDetailGraph={handleBranchFeeDetailGraph}
        />
      )}

      {activeTabs.TodayFeeReceived && (
        <TodayFeeReceived
          userData={userData}
          branchData={todayFeeDetailsBranches}
          counsellorData={todayFeeDetailsCounsellors}
          todayFeedetailsActiveBranch={todayFeedetailsActiveBranch}
          handleBranchTodayFeeRecevied={handleBranchTodayFeeRecevied}
        />
      )}

      {activeTabs.FeeFollowUps && <div>Fee FollowUps Content</div>}

      {activeTabs.TotalUsers && (
        <TotalUsers
          AllBranchesTableData={allBranchesTableData}
          ActiveUsersTabledData={activeUsersTabledData}
          StudentsTableData={studentsTableData}
          totalUsersCount={totalUsersCount}
        />
      )}

      {/* TODAY ENROLLMENTS TAB – using TodayEnrollments component with CustomTable */}
      {activeTabs["Today Enrollments"] && (
        <TodayEnrollments data={todayEnrollmentsData} />
      )}
    </div>
  );
};

export default Dashboard;