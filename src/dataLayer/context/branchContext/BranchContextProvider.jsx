import { createContext, useEffect, useReducer } from "react";


import BranchReducer from "./BranchReducer";
import { ERPApi } from "../../../serviceLayer/interceptor.jsx";

export const BranchContext = createContext();

const BranchContextProvider = ({ children }) => {
  const intialState = {
    branches: [],
  };

  const [BranchState, DispatchBranch] = useReducer(BranchReducer, intialState);

  const getAllBranches = async () => {
    try {
      const { status, data } = await ERPApi.get(
        `${import.meta.env.VITE_API_URL}/settings/getbranch`
      );
      if (status === 200) {
        DispatchBranch({ type: "SET_BRANCHES", payload: data.branchData });
      }
    } catch (error) {
      console.error(error)
    }
  };

  // useEffect(() => {
  //   getAllBranches();
  // }, []);

  return (
    <BranchContext.Provider
      value={{ BranchState, DispatchBranch, getAllBranches }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export default BranchContextProvider;
