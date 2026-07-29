import React, { createContext, useEffect } from "react";
import { useReducer } from "react";
import { InitialState } from "./utils/StudentConfi";
import StudentsReducer from "./StudentsReducer";
import * as api from "./utils/StudentsAPIs";
import * as Actions from "./utils/StudentsActions";

export const StudentsContext = createContext();

const StudentsContextProvider = ({ children }) => {
  const [studentState, Dispatchstudents] = useReducer(
    StudentsReducer,
    InitialState
  );

  // All Students
  
  const getAllStudents = async () => {
    try {
      const { status, data } = await api.getAllStudents();
      if (status === 200) {
        Dispatchstudents(Actions.setStudentsData(data, "ALL_STUDENTS"));
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  // Enrolled Students
  const getPaginatedStudentsData = async () => {
    const { filters, perPage, search, currentPage, } = studentState?.EnrolledStudents;
    Dispatchstudents(Actions.setLoading("ENROLLED_STUDENTS"))
    try {
      const { data, status } = await api.getEnrolledStudents(
        currentPage,
        perPage,
        search,
        filters
      );
      if (status === 200) {
        Dispatchstudents(
          Actions.getEnrolledStudents(data, "ENROLLED_STUDENTS")
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      Dispatchstudents(Actions.setLoading("ENROLLED_STUDENTS"));
    }
  };

  //  Certificate Students
  const getPaginatedCertificateData = async () => {
    const { currentPage, perPage, search, filters } = studentState?.CertificateStudents;
    Dispatchstudents(Actions.setLoading("CERTIFICATE_STUDENTS"))
    try {
      const { data, status } = await api.getCertificateStudents(
        currentPage,
        perPage,
        search,
        filters
      );
      if (status === 200) {
        Dispatchstudents(
          Actions.getCertificateStudents(data, "CERTIFICATE_STUDENTS")
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      Dispatchstudents(Actions.setLoading("CERTIFICATE_STUDENTS"));
    }
  };

  // Requested Certificate Students
  const getPaginated_Requested_CertificateStudents = async () => {
    const { currentPage, perPage, search, filters } = studentState?.Requested_CertificateStudents;
    Dispatchstudents(Actions.setLoading("REQUESTED_CERTIFICATE_STUDENTS"));
    try {
      const { data, status } = await api.getRequested_CertificateStudents(
        currentPage,
        perPage,
        search,
        filters
      );
      if (status === 200) {
        Dispatchstudents(
          Actions.getRequested_CertificateStudents(
            data,
            "REQUESTED_CERTIFICATE_STUDENTS"
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      Dispatchstudents(Actions.setLoading("REQUESTED_CERTIFICATE_STUDENTS"));
    }
  };

  // Issued Certificates Students
  const get_Issued_CertificateStudents = async () => {
    const { filters, perPage, search, currentPage, } = studentState?.Issued_CerificateStudents;
    Dispatchstudents(Actions.setLoading("ISSUED_CERTIFICATES_STUDENTS"))
    try {
      const { data, status } = await api.getIssuedCertificateStudents(
        currentPage,
        perPage,
        search,
        filters
      );
      if (status === 200) {
        Dispatchstudents(
          Actions.getIssuedCertificateStudents(
            data,
            "ISSUED_CERTIFICATES_STUDENTS"
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      Dispatchstudents(Actions.setLoading("ISSUED_CERTIFICATES_STUDENTS"));
    }
  };

  // ALL Fee Details Students
  const getPaginatedFeeDetailsStudents = async () => {
    const { currentPage, perPage, search, filters } = studentState?.FeeDetailsStudents;
    Dispatchstudents(Actions.setLoading("FEE_DETAILS_STUDENTS"))
    try {
      const { data, status } = await api.getFeeDetailsStudents(
        currentPage,
        perPage,
        search,
        filters
      );
      if (status === 200) {
        Dispatchstudents(
          Actions.getFeeDetailsStudents(data, "FEE_DETAILS_STUDENTS")
        );
      }
    } catch (error) {
      console.error(error)
    } finally {
      Dispatchstudents(Actions.setLoading("FEE_DETAILS_STUDENTS"));
    }
  };

  // No Due Fee Records
  const getNoDueFeeRecordStudents = async () => {
    const { currentPage, perPage, search, filters } = studentState?.NoDueFeeRecords_Students;
    Dispatchstudents(Actions.setLoading("NO_DUE_FEE_RECORDS_STUDENTS"))

    try {
      const { data, status } = await api.getNoDueFeeRecordsStudents(
        currentPage,
        perPage,
        search,
        filters
      );
      if (status === 200) {
        Dispatchstudents(
          Actions.getNoDueFeeRecordStudents(data, "NO_DUE_FEE_RECORDS_STUDENTS")
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      Dispatchstudents(Actions.setLoading("NO_DUE_FEE_RECORDS_STUDENTS"));
    }
  };



  const getTodayFeeDetailsStudents = async () => {
    const { currentPage, perPage, search, filters } = studentState?.TodayFeeDetailsStudents;
    Dispatchstudents(Actions.setLoading("TODAY_FEE_DETAILS_STUDENTS"))
    try {
      const { data, status } = await api.getTodayFeeDetailsStudents(currentPage, perPage, search, filters);
      if (status === 200) {
        Dispatchstudents(Actions.setTodayFeeDetailsStudents(data, "TODAY_FEE_DETAILS_STUDENTS"))
      }
    } catch (error) {
      console.error(error)
    } finally {
      Dispatchstudents(Actions.setLoading("TODAY_FEE_DETAILS_STUDENTS"));
    }
  };


  // OverDueFeeDetails Students
  const getOverDueFeeDetailsStudents = async () => {
    const { currentPage, perPage, search, filters } = studentState?.OverDueFeeDetailsStudents;
    Dispatchstudents(Actions.setLoading("OVER_DUE_FEE_DETAILS_STUDENTS"))
    try {
      const { data, status } = await api.getOverDueFeeDetailsStudents(currentPage, perPage, search, filters);
      if (status === 200) {
        Dispatchstudents(Actions.setOverDueFeeDetailsStudents(data, "OVER_DUE_FEE_DETAILS_STUDENTS"))
      }
    } catch (error) {
      console.error(error)
    } finally {
      Dispatchstudents(Actions.setLoading("OVER_DUE_FEE_DETAILS_STUDENTS"));
    }
  };

  // Upcoming FeeDetails Students
  const getUpComingFeeDetailsStudents = async () => {
    const { currentPage, perPage, search, filters } = studentState?.UpComingFeeDetailsStudents;
    Dispatchstudents(Actions.setLoading("UPCOMING_FEE_DETAILS_STUDENTS"))
    try {
      const { data, status } = await api.getUpComingFeeDetailsStudents(currentPage, perPage, search, filters);
      if (status === 200) {
        Dispatchstudents(Actions.setUpComingFeeDetailsStudents(data, "UPCOMING_FEE_DETAILS_STUDENTS"))
      }
    } catch (error) {
      console.error(error)
    } finally {
      Dispatchstudents(Actions.setLoading("UPCOMING_FEE_DETAILS_STUDENTS"));
    }
  };



  // Create Student Record
  const createStudentRecord = async (studentdata) => {
    try {
      const { data, status } = await api.createStudentRecord(studentdata);
      if (status === "200") {
        Dispatchstudents(Actions.createStudentRecord(data, "CREATE_STUDENT"));
      }
      return { data, status };
    } catch (error) {
      console.error(error);
    }
  };


  // Single Student
  const getStudent = async (studentId) => {
    try {
      const { status, data } = await api.getStudentById(studentId);
      if (status === 200) {
        Dispatchstudents(Actions.getStudentById(data, "GET_SINGLE_STUDENT"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Update Single Student Record
  const UpdateStudent = async (student) => {
    try {
      const { status, data } = await api.UpdateStudentdata(student);
      if (status === 200) {
        return data;
      }
    } catch (error) {
      console.error(error)
    }
  };

  // useEffect(() => {
  //   getPaginatedStudentsData();

   
  //   getAllStudents();
 
  // }, []);

  

 



  

  // useEffect(() => {
  //   getPaginatedStudentsData();
  // }, [
  //   studentState?.EnrolledStudents?.search,
  //   studentState?.EnrolledStudents?.currentPage,
  //   studentState?.EnrolledStudents?.perPage,
  //   studentState?.EnrolledStudents?.filters?.fromDate,
  //   studentState?.EnrolledStudents?.filters?.toDate,
  //   studentState?.EnrolledStudents?.filters?.enquiry,
  //   studentState?.EnrolledStudents?.filters?.modeOfTraining,
  //   studentState?.EnrolledStudents?.filters?.branch,
  //   studentState?.EnrolledStudents?.filters?.lead,
  //   studentState?.EnrolledStudents?.filters?.course,
  //   studentState?.EnrolledStudents?.filters?.coursepackage,
  // ]);

 

 

  return (
    <StudentsContext.Provider
      value={{
        studentState,
        Dispatchstudents,
        getPaginatedStudentsData,
        createStudentRecord,
        getAllStudents,
        getStudent,
        UpdateStudent,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

export default StudentsContextProvider;
