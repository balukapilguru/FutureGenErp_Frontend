import { useContext } from "react";
import { BranchContext } from "../context/branchContext/BranchContextProvider";

export const useBranchContext = () => {
    const context = useContext(BranchContext);
    if (!context) {
      // throw Error(
      //   "useBranchContext must be used inside an BranchContextProvider"
      // );

      console.error("useBranchContext must be used inside an BranchContextProvider")
    }
    return context;
  };