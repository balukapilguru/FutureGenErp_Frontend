// DataUtilities.js
import { ERPApi } from "../../../../serviceLayer/interceptor";

export const getCurrentTabData = async (activeTab) => {
  switch (activeTab) {
    case "TotalEnrollments":
      try {
        const [
          totalEnrollmantsGraphData,
          branchData,
          topEnrollersData,
        ] = await Promise.all([
          getTotalEnrollmentGraph(),
          getAllBranches(),
          getTotalEnrollmentDeatils(),
        ]);
        return {
          totalEnrollmantsGraphData: totalEnrollmantsGraphData?.data,
          branchData: branchData?.data,
          topEnrollersData: topEnrollersData?.data,
        };
      } catch (error) {
        console.error("Error fetching TotalEnrollmentGraph:", error);
      }
      break;

    case "FeeDetails":
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const formatDateLocal = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };
        const startDate = formatDateLocal(startOfMonth);
        const endDate = formatDateLocal(endOfMonth);
        const data = {
          admissionFromDate: "",
          admissionToDate: "",
          toDate: endDate,
          fromDate: startDate,
        };
        const [graphData, topFeeReceiversData, branchData] = await Promise.all([
          getFeeDetailsGraph(),
          getFeeReceivedByBranchWise(data),
          getAllBranches(),
        ]);
        return {
          graphData: graphData.data,
          topFeeReceivers: topFeeReceiversData.data,
          branchData: branchData?.data,
        };
      } catch (error) {
        console.error(error);
      }
      break;

    case "TodayFeeReceived":
      try {
        const today = getTodayDate();
        const branchData = await getFeeReceivedByBranchWise({
          toDate: today,
          fromDate: today,
        });
        return branchData?.data;
      } catch (error) {
        console.error(error);
      }
      break;

    case "FeeFollowUps":
      return { title: "Fee FollowUps", apiKey: "currentFeeYetToReceived", showRupee: true };

    case "TotalUsers":
      try {
        const [allBranches, totalUsersAndStudents] = await Promise.all([
          getAllBranchesListOfTotalUsers(),
          getLiveUsers(),
        ]);
        const response = {
          allBranches: allBranches?.data,
          totalUsersAndStudents: totalUsersAndStudents?.data,
        };
        return response;
      } catch (error) {
        console.error(error);
      }
      break;

    case "Today Enrollments":
      try {
        const today = getTodayDate();
        const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesfee`;
        const payload = { fromDate: today, toDate: today };
        const response = await ERPApi.post(url, payload);
        const data = response?.data || {};
        const count = data.overallEnrollments || 0;
        const list = data.branches || [];
        return { count, list };
      } catch (error) {
        console.error("Error fetching today's enrollments:", error);
        return { count: 0, list: [] };
      }

    default:
      return { title: "", apiKey: "", showRupee: false };
  }
};

export const getTotalEnrollments = (data) => {
  return data?.totalEnrollments || 0;
};

export const getTotalEnrollmentGraph = async (branch) => {
  const data = { branch: branch };
  const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesyearlyenrollmentsgraph`;
  return ERPApi.post(url, data);
};

export const getAllBranches = async () => {
  try {
    const { status, data } = await ERPApi.get(
      `${import.meta.env.VITE_API_URL}/settings/getbranch`
    );
    return { data, status };
  } catch (error) {
    console.error(error);
  }
};

export const getStudentsListInTotalEnrollments = async (sendCouncellerDetails) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/counsellorstudentfee`;
  return ERPApi.post(url, sendCouncellerDetails);
};

export const getCouncellersListInTotalEnrollments = async (sendBranchDetails) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/branchecounsellorsfee`;
  return ERPApi.post(url, sendBranchDetails);
};

export const getTotalEnrollmentDeatils = async (filterDate) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesfee`;
  return ERPApi.post(url, filterDate);
};

export const getFeeDetailsGraph = async (branch) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesYearlyfeedetailsgraph`;
  return ERPApi.post(url, branch);
};

export const getFeeReceivedByCouncellorWise = async (filters) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/branchecounsellorsfeedetails`;
  return ERPApi.post(url, filters);
};

export const getFeeReceivedByBranchWise = async (filters) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesfeedetails`;
  return ERPApi.post(url, filters);
};

export const getCurrentMonthDates = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const startDate = formatDateLocal(startOfMonth);
  const endDate = formatDateLocal(endOfMonth);
  return { fromDate: startDate, toDate: endDate };
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getStudentsListInFeeDetails = async (mergedObject) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/counsellorstudentfeedetails`;
  return ERPApi.post(url, mergedObject);
};

// Total Users APIs
export const getLiveUsers = async () => {
  const url = `${import.meta.env.VITE_API_URL}/auth/activecount`;
  return ERPApi.get(url);
};

export const getAllBranchesListOfTotalUsers = async () => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/brancheswishusers`;
  return ERPApi.get(url);
};

export const getAllBranchwiseUsersList = async (branchDetails) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/singlebranchusers`;
  return ERPApi.post(url, branchDetails);
};

export const getTodayEnrollmentsCount = async () => {
  const today = getTodayDate();
  const payload = { fromDate: today, toDate: today };
  const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesfee`;
  const response = await ERPApi.post(url, payload);
  return response?.data?.overallEnrollments || 0;
};

export const getTodayEnrollmentsList = async () => {
  const today = getTodayDate();
  const payload = { fromDate: today, toDate: today };
  const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesfee`;

  try {
    const response = await ERPApi.post(url, payload);
    const data = response?.data || {};
    const count = data.overallEnrollments || 0;
    const branches = data.branches || [];
    const counsellors = data.topEnquiryTakenBy || [];
    return { count, branches, counsellors };
  } catch (error) {
    console.error("Failed to fetch today's enrollments list:", error);
    return { count: 0, branches: [], counsellors: [] };
  }
};