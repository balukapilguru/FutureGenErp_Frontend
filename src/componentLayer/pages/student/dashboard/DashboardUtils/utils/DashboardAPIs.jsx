
import { ERPApi } from "../../../../../../serviceLayer/interceptor.jsx";

// total enrollments default  branch list
export const getTotalEnrollmentDeatils = async (filterDate) => {
  // axios.put(`${import.meta.env.VITE_API_URL}/updatestudentdata/${id}`, student)
  const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesfee`;
  return ERPApi.post(url, filterDate);
};

// total enrollements councellers list
export const getCouncellersListInTotalEnrollments = async (
  sendBranchDetails
) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/branchecounsellorsfee`;
  //   const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesfee`;
  return ERPApi.post(url, sendBranchDetails);
};

// total Enrollements student list
export const getStudentsListInTotalEnrollments = async (
  sendCouncellerDetails
) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/counsellorstudentfee`;
  return ERPApi.post(url, sendCouncellerDetails);
};

// enrollment Graph
export const getTotalEnrollemetGraph = async (branch) => {
  const url = `${import.meta.env.VITE_API_URL
    }/dashboard/allbranchesyearlyenrollmentsgraph`;
  return ERPApi.post(url, branch);
};

//-------------------- default fee details  branch list----------------------------

export const getTotalFeeDetails = async (filters) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/allbranchesfeedetails`;
  return ERPApi.post(url, filters);
};

// fee details  councellers list
export const getCouncellorsListInFeeDetails = async (mergedObject) => {
  const url = `${import.meta.env.VITE_API_URL
    }/dashboard/branchecounsellorsfeedetails`;
  return ERPApi.post(url, mergedObject);
};

// fee details students list
export const getStudentsListInFeeDetails = async (mergedObject) => {
  
  const url = `/dashboard/counsellorstudentfeedetails`;
  return ERPApi.post(url, mergedObject);
};

// feeDetails graph

export const getFeeDetailsGraph = async (branch) => {
  const url = `${import.meta.env.VITE_API_URL
    }/dashboard/allbranchesYearlyfeedetailsgraph`;
  return ERPApi.post(url, branch);
};

// ---------------------Total users Branches List------------------------------

export const getAllBranchesListOfTotalUsers = async () => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/brancheswishusers`;
  return ERPApi.get(url);
};

export const getAllBranchwiseUsersList = async (branchDetails) => {
  const url = `${import.meta.env.VITE_API_URL}/dashboard/singlebranchusers`;
  return ERPApi.post(url, branchDetails);
};



// ------------------------Today Fee Recieved ----------------------------


export const getTodayFeeReceivedByBranchWise = async (filters) => {
  const url = `/dashboard/allbranchesfeedetails`;
  return ERPApi.post(url, filters);
}

export const getTodayFeeReceivedByCouncellorWise = async (filters) => {
  const url = `/dashboard/branchecounsellorsfeedetails`;
  return ERPApi.post(url, filters);
}


export const getTodayFeeReceivedByStudentsWise = async (filters) => {
  const url = `/dashboard/counsellorstudentfeedetails`;
  return ERPApi.post(url, filters);
}