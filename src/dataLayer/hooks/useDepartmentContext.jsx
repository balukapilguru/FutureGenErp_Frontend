import { useContext } from "react";
import { DepartmentContext } from "../context/deparmentContext/DepartmentContextProvider";


export const useDepartmentContext = () => {
    const context = useContext(DepartmentContext);
    if (!context) {
      // throw Error(
      //   "DepartmentContext must be used inside an DepartmentContextProvider"
      // );

      console.error("DepartmentContext must be used inside an DepartmentContextProvider");
    }
    return context;
  };