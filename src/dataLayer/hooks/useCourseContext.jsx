import { useContext } from "react";
import { CourseContext } from "../context/courseContext/CourseContextProvider";

export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (!context) {
      // throw Error(
      //   "useCourseContext must be used inside an useCourseContextProvider"
      // );
    console.error("useCourseContext must be used inside an useCourseContextProvider")
    }
    return context;
  };