import { useContext } from "react";
import { PermissionsContext } from "../../rbac/PermissionsProvider";

export const  usePermissionsProvider= () => {
    const context = useContext(PermissionsContext);
    if (!context) {
      // throw Error(
      //   "PermissionsContext must be used inside an PermissionsContextProvider"
      // );

      console.error("PermissionsContext must be used inside an PermissionsContextProvider")
    }
    return context;
  };