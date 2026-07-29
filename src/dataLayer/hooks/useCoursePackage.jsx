import { useContext } from "react";
import { CoursePackageContext } from "../context/coursePackageContext/CoursePackageContext";

export const useCoursePackage = () => {
    const context = useContext(CoursePackageContext);
    if (!context) {
      // throw Error(
      //   "CoursePackageContext must be used inside an CoursePackageContextProvider"
      // );
      console.error("CoursePackageContext must be used inside an CoursePackageContextProvider")
    }
    return context;
  };