import { useContext } from "react";
import { StudentsContext } from "../context/studentsContext/StudContextProvider";


export const  useStudentsContext= () => {
    const context = useContext(StudentsContext);
    if (!context) {
      // throw Error(
      //   "StudentsContext must be used inside an StudentsContextProvider"
      // );
      console.error("StudentsContext must be used inside an StudentsContextProvider")
    }

    return context;
  };