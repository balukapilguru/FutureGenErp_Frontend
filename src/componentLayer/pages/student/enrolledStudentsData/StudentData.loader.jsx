import { ERPApi } from "../../../../serviceLayer/interceptor"

export const EnrolledStudentsLoader = async ({ request }) => {
  const url = new URL(request.url);

  const page = url.searchParams.get("page") || "1";
  const preOnboard = url.searchParams.get("preOnboard") || "0";
  const pageSize = url.searchParams.get("pageSize") || "10";
  const search = url.searchParams.get("search") || "";
  const admissionFromDate = url.searchParams.get("admissionFromDate") || "";
  const admissionToDate = url.searchParams.get("admissionToDate") || "";
  const modeOfTraining = url.searchParams.get("modeOfTraining") || "";
  const branch = url.searchParams.get("branch") || "";
  const enquiryTakenby = url.searchParams.get("enquiryTakenby") || "";
  const leadsource = url.searchParams.get("leadsource") || "";
  const course = url.searchParams.get("course") || "";
  const coursepackageId = url.searchParams.get("coursepackageId") || "";
  const course_label = url.searchParams.get("course_label") || "";

  const Filterparams = new URLSearchParams({
    page,
    pageSize,
    search,
    "filter[admissionFromDate]": admissionFromDate,
    "filter[admissionToDate]": admissionToDate,
    "filter[modeOfTraining]": modeOfTraining,
    "filter[branch]": branch,
    "filter[enquiryTakenby]": enquiryTakenby,
    "filter[leadsource]": leadsource,
    "filter[course]": course,
    "filter[coursepackageId]": coursepackageId,
  }).toString();

  try {
    let mainApi;

    // ✅ 3 conditions (your requirement)
    if (preOnboard == "0") {
      mainApi = ERPApi.get(`/student/list_students?${Filterparams}`);
    } else if (preOnboard == "1") {
      mainApi = ERPApi.get(`preadmission/getAll?${Filterparams}`);
    } else {
      mainApi = ERPApi.get(
        `/preadmission/logs?page=${page}&pageSize=${pageSize}`
      );
    }

    const [
      enrolledStudentsData,
      branchData,
      coursesData,
      leadSourceData,
      coursePackageData,
      usersWithCounsellorsData,
    ] = await Promise.all([
      mainApi,
      ERPApi.get(`/settings/getbranch`),
      ERPApi.get(`/batch/course`, { params: { search: course_label } }),
      ERPApi.get(`/settings/getleadsource`),
      ERPApi.get(`settings/getcoursespackages`),
      ERPApi.get(`user/userswithcounsellors`),
    ]);

    return {
      // ✅ KEEP SAME KEY (important)
      enrolledStudentsData: enrolledStudentsData?.data,

      branchData: branchData?.data,
      coursesData: coursesData?.data,
      leadSourceData: leadSourceData?.data,
      coursePackageData: coursePackageData?.data,
      usersWithCounsellorsData: usersWithCounsellorsData?.data,

      // ✅ ADDITIONAL (only for logs, safe)
      logsData:
        preOnboard !== "0" && preOnboard !== "1"
          ? enrolledStudentsData?.data?.data || []
          : [],

      logsPagination:
        preOnboard !== "0" && preOnboard !== "1"
          ? enrolledStudentsData?.data?.pagination || {}
          : {},
    };
  } catch (error) {
    console.error(error);

    return {
      enrolledStudentsData: {},
      branchData: [],
      coursesData: [],
      leadSourceData: [],
      coursePackageData: [],
      usersWithCounsellorsData: [],
      logsData: [],
      logsPagination: {},
    };
  }
};

export const EditStudentLoader = async ({ params }) => {
    const { id } = params;
    try {
        const [studentDataResponse, courseDataResponse, leadSourceDataResponse] = await Promise.all([
            ERPApi.get(`/student/viewstudentdata/${id}`),
            ERPApi.get(`/batch/course`),
            ERPApi.get(`/settings/getleadsource`)
        ])
        return {
            studentData: studentDataResponse?.data,
            cousreData: courseDataResponse?.data,
            leadSource: leadSourceDataResponse?.data
        }
    } catch (error) {
        console.error(error)
        return {
            status: "error",
            message: "Failed to fetch student data"
        }
    }
    return {
        status: "success",
        data: {
            name: "Vineeth"
        }
    }
}
export const AbroadstudentsLoader = async({request})=>{
   const url = new URL(request.url);
    try {
         const [abroadStudent] = await Promise.all([
            ERPApi.get(`/student/list_students?filter[isInterestedForAbroad]=true&${url.search.slice(1)}`),
            
        ])
        return {
            studentData: abroadStudent?.data,
        }
        
    } catch (error) {
       console.error(error) 
       return {
        studentData: {}
       }
    }
}