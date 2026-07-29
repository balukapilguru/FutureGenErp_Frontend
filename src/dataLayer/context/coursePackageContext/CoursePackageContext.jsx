import React, { createContext, useEffect, useReducer } from "react";

import CoursePackageReducer from "./CoursePackageReducer";
import axios from "axios";
import { ERPApi } from "../../../serviceLayer/interceptor.jsx";

export const CoursePackageContext = createContext();

const CoursePackageContextProvider = ({ children }) => {
  const initialState = {
    coursepackages: null,
  };

  const [coursePackageState, DispatchCourseState] = useReducer(
    CoursePackageReducer,
    initialState
  );

  const createCoursePackage = async (coursepackages) => {
    try {
      const { data, status } = await ERPApi.post();
      if (status == 200) {
        DispatchCourseState({ type: "CREATE_COURSE_PACKAGE", payload: data });
        getAllCoursePackages();
      }
    } catch (error) {}
  };

  const getAllCoursePackages = async () => {
    try {
      const { data, status } = await ERPApi.get(
        `${import.meta.env.VITE_API_URL}/settings/getcoursespackages`
      );
      if (status === 200) {
        DispatchCourseState({ type: "SET_COURSE_PACKAGES", payload: data.coursePackageData });
      }
    } catch (error) {}
  };

  // useEffect(() => {
  //   getAllCoursePackages();
  // }, []);

  return (
    <CoursePackageContext.Provider
      value={{
        coursePackageState,
        DispatchCourseState,
        getAllCoursePackages,
        createCoursePackage,
      }}
    >
      {children}
    </CoursePackageContext.Provider>
  );
};

export default CoursePackageContextProvider;
