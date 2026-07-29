import { useContext } from "react";
import { RoleContext } from "../context/roleContext/RoleContextProvider";


export const  useRoleContext= () => {
    const context = useContext(RoleContext);
    if (!context) {
      // throw Error(
      //   "RoleContext must be used inside an LeadRoleContextr"
      // );

      console.error("RoleContext must be used inside an LeadRoleContextr")
    }
    return context;
};