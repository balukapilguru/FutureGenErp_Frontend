import React, { createContext, useContext, useEffect, useReducer } from "react";
import CourseReducer from "./CourseReducer";
import axios from "axios";
import { ERPApi } from "../../../serviceLayer/interceptor.jsx";

export const CourseContext = createContext();

const CourseContextProvider = ({ children }) => {
  const initialState = {
    courses: null,
    coursesList: {
      paginatedCoursesList: [],
      searchResultCourses: null,
      perPage: 10,
      totalCourses: null,
      totalPages: null,
      loading: false,
      startCourse: null,
      endCourse: null,
      search: "",
      currentPage: 1,
    },
  };

  const [courseState, DispatchCourse] = useReducer(CourseReducer, initialState);

  const getAllCourses = async () => {
    try {
      const { data, status } = await ERPApi.get(
        `${import.meta.env.VITE_API_URL}/batch/course`
      );

      if (status === 200) {
        DispatchCourse({ type: "SET_COURSES", payload: data });
      }
    } catch (error) {
      console.error(error)
    }
  };

  const getPaginatedCourses = async () => {
    const { perPage, search, currentPage } = courseState?.coursesList;
    DispatchCourse({ type: "SET_LOADING" });
    try {
      const { data, status } = await ERPApi.get(
        `${
          import.meta.env.VITE_API_URL
        }/batch/course?page=${currentPage}&pageSize=${perPage}&search=${search}`
      );

      if (status === 200) {
        DispatchCourse({ type: "SET_PAGINATED_COURSES_LIST", payload: data });
      }
    } catch (error) {
      console.error(error)
    } finally {
      DispatchCourse({ type: "SET_LOADING" });
    }
  };

  // useEffect(() => {
  //   getAllCourses();
  //   getPaginatedCourses();
  // }, []);

  // useEffect(() => {
  //   getPaginatedCourses();
  // }, [
  //   courseState?.coursesList?.search,
  //   courseState?.coursesList?.currentPage,
  //   courseState?.coursesList?.perPage,
  // ]);

  return (
    <CourseContext.Provider
      value={{
        courseState,
        DispatchCourse,
        getAllCourses,
        getPaginatedCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export default CourseContextProvider;
