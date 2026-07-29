import { current } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";

// Total students
export const getAllStudents = async () => {
  const url = `${import.meta.env.VITE_API_URL}/student/getstudent_data`;

  return ERPApi.get(url);
};

// &filter[course]=

// Enrolled Students
export const getEnrolledStudents = async (
  currentPage,
  perPage,
  search,
  filters
) => {

  const url = `${
    import.meta.env.VITE_API_URL
  }/student/list_students?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[admissionFromDate]=${
    filters.fromDate
  }&filter[admissionToDate]=${filters.toDate}&filter[modeOfTraining]=${
    filters.modeOfTraining
  }&filter[branch]=${filters.branch}&filter[enquiryTakenby]=${
    filters.enquiry
  }&filter[leadsource]=${filters.lead}&filter[course]=${filters.course}&filter[coursepackageId]=${filters.coursepackage}`;
  return ERPApi.get(url);
};

// certificte students
export const getCertificateStudents = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/sc/listStudentCertificate?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[admissionFromDate]=${
    filters?.fromDate
  }&filter[admissionToDate]=${filters?.toDate}&filter[branch]=${
    filters?.branch
  }&filter[course]=${filters?.course}&filter[certificateStatus]=${
    filters?.certificateStatus
  }&filter[enquiryTakenby]=${filters?.enquiry}&filter[oldornew]=${
    filters?.studentType
  }`;
  return ERPApi.get(url);
};

// Requestetd Certificate Students
export const getRequested_CertificateStudents = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/sc/requiestedcertificates?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[branch]=${
    filters.branch
  }&filter[course]=${filters.course}&filter[admissionFromDate]=${
    filters?.fromDate
  }&filter[admissionToDate]=${filters?.toDate}&filter[oldornew]=${
    filters?.studentType
  }`;

  return ERPApi.get(url);
};

// Issued Certificate Students
export const getIssuedCertificateStudents = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/sc/issuedcertificates?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[branch]=${
    filters.branch
  }&filter[course]=${filters.course}&filter[admissionFromDate]=${
    filters?.fromDate
  }&filter[admissionToDate]=${filters?.toDate}&filter[oldornew]=${
    filters?.studentType
  }`;
  return ERPApi.get(url);
};

// feeDetails stuents
export const getFeeDetailsStudents = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/student/list_students?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[admissionFromDate]=${
    filters.fromDate
  }&filter[admissionToDate]=${filters.toDate}&filter[modeOfTraining]=${
    filters.modeOfTraining
  }&filter[branch]=${filters.branch}&filter[enquiryTakenby]=${
    filters.enquiry
  }&filter[leadsource]=${filters.lead}`;
  return ERPApi.get(url);
};

export const createStudentRecord = async (studentdata) => {
  //reqiure toast
  const url = `${import.meta.env.VITE_API_URL}/student_form`;
  return await toast.promise(ERPApi.post(url, studentdata), {
    pending: "verifying data",
    success: {
      render(data) {
        return `Student Enrolled Successfully`;
      },
    },
    error: "Error in creating Student Record 🤯",
  });
  // return axios.post(url, studentdata)
};

export const getStudentById = async (studentId) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/student/viewstudentdata/${studentId}`;
  return ERPApi.get(url);
};

export const UpdateStudentdata = async (student) => {
  // axios.put(`${import.meta.env.VITE_API_URL}/updatestudentdata/${id}`, student)
  //reqire toast
  const url = "";
  return ERPApi.put(url, student);
};

export const getNoDueFeeRecordsStudents = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/fee/noduefeerecords?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[branch]=${
    filters.branch
  }&filter[fromDate]=${filters.fromDate}&filter[toDate]=${
    filters.toDate
  }&filter[modeOfTraining]=${filters.modeOfTraining}&filter[enquiryTakenby]=${
    filters.enquiry
  }&filter[leadsource]=${filters.lead}`;
  return ERPApi.get(url);
};

export const getTodayFeeDetailsStudents = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/fee/todayduefeerecords?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[branch]=${
    filters.branch
  }&filter[course]=${filters.course}&filter[fromDate]=${
    filters.fromDate
  }&filter[toDate]=${filters.toDate}&filter[enquiryTakenby]=${
    filters.enquiry
  }&filter[leadsource]=${filters.lead}`;
  return ERPApi.get(url);
};

export const getOverDueFeeDetailsStudents = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/fee/overduefeerecords?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[branch]=${
    filters.branch
  }&filter[course]=${filters.course}&filter[fromDate]=${
    filters.fromDate
  }&filter[toDate]=${filters.toDate}&filter[enquiryTakenby]=${
    filters.enquiry
  }&filter[leadsource]=${filters.lead}&filter[admissionFromDate]=${
    filters.admissionfromDate
  }&filter[admissionToDate]=${filters.admissiontoDate}`;
  return ERPApi.get(url);
};

export const getUpComingFeeDetailsStudents = async (
  currentPage,
  perPage,
  search,
  filters
) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/fee/upcomingduefeerecords?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[branch]=${
    filters.branch
  }&filter[course]=${filters.course}&filter[fromDate]=${
    filters.fromDate
  }&filter[toDate]=${filters.toDate}&filter[enquiryTakenby]=${
    filters.enquiry
  }&filter[leadsource]=${filters.lead}&filter[admissionFromDate]=${
    filters.admissionfromDate
  }&filter[admissionToDate]=${filters.admissiontoDate}`;
  return ERPApi.get(url);
};
