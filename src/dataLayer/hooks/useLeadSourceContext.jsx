import { useContext } from "react";
import { LeadSourceContext } from "../context/leadSourceContext/LeadSourceContext";

export const  useLeadSourceContext= () => {
    const context = useContext(LeadSourceContext);
    if (!context) {
      // throw Error(
      //   "LeadSourceContext must be used inside an LeadSourceContextProvider"
      // );


      console.error("LeadSourceContext must be used inside an LeadSourceContextProvider")
    }

    return context;
  };