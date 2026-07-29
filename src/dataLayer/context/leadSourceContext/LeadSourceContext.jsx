import axios from "axios";
import LeadSourceReducer from "./LeadSourceReducer";
import React, { createContext, useEffect, useReducer } from "react";
import { ERPApi } from "../../../serviceLayer/interceptor.jsx";

export const LeadSourceContext = createContext();

const LeadSourceContextProvider = ({ children }) => {
  const initialState = {
    leadSources: null,
  };

  const [leadSourceState, DispatchLeadSource] = useReducer(
    LeadSourceReducer,
    initialState
  );

  const CreateleadSource = async (leadsource) => {
    try {
      const { data, status } = await axios.post();
      if (status === 200) {
        DispatchLeadSource({ type: "CREATE_LEAD_SOURCE", payload: data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllLeadSource = async () => {
    try {
      const { data, status } = await ERPApi.get(
        `${import.meta.env.VITE_API_URL}/settings/getleadsource`
      );

      if (status === 200) {
        DispatchLeadSource({ type: "SET_LEAD_SOURCE", payload: data.leadSourceData });
      }
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect(() => {
  //   getAllLeadSource();
  // }, []);

  return (
    <LeadSourceContext.Provider
      value={{
        leadSourceState,
        DispatchLeadSource,
        CreateleadSource,
        getAllLeadSource,
      }}
    >
      {children}
    </LeadSourceContext.Provider>
  );
};

export default LeadSourceContextProvider;
