import { useContext } from "react";


import { UsersContext } from "../context/usersContext/UsersContextProvider";
export const  useUserContext= () => {
    const context = useContext(UsersContext);
    if (!context) {
      // throw Error(
      //   "UsersContext must be used inside an UsersContextProvider"
      // );

      console.error("UsersContext must be used inside an UsersContextProvider")
    }
    return context;
  };