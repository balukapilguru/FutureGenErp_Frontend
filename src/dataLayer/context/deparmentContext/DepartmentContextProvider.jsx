import React, { createContext, useEffect, useReducer } from "react";
import DepartmentReducer from "./DepartmentReducer";
import axios from "axios";
import { ERPApi } from "../../../serviceLayer/interceptor.jsx";

export const DepartmentContext = createContext();

const DepartmentContextProvider = ({ children }) => {
  const initialState = {
    departments: null,
  };

  const [DepartmentState, DispatchDepartment] = useReducer(
    DepartmentReducer,
    initialState
  );

  const CreateDepartment = async (department) => {
    try {
      const { data, status } = await ERPApi.post();
      if (status === 200) {
        DispatchDepartment({ type: "CREATE_DEPARTMENTS", payload: data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllDeparments = async () => {
    try {
      const { data, status } = await ERPApi.get(
        `${import.meta.env.VITE_API_URL}/settings/getdepartment`
      );
      if (status === 200) {
        DispatchDepartment({ type: "SET_DEPARTMENTS", payload: data.data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   getAllDeparments();
  // }, []);

  return (
    <DepartmentContext.Provider
      value={{
        DepartmentState,
        DispatchDepartment,
        CreateDepartment,
        getAllDeparments,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentContextProvider;
