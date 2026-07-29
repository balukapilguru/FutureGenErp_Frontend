import { useContext } from "react";
import { AuthContext } from "../context/authContext/AuthContextProvider";


export const  useAuthContext= () => {
    const context = useContext(AuthContext);
    if (!context) {
      console.error("AuthContext must be used inside an AuthContextProvider")
    }
    return context;
  };