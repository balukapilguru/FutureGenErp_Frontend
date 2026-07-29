import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useBranchContext } from "../../hooks/useBranchContext";
import { useCourseContext } from "../../hooks/useCourseContext";
import { useCoursePackage } from "../../hooks/useCoursePackage";
import { useDepartmentContext } from "../../hooks/useDepartmentContext";
import { useLeadSourceContext } from "../../hooks/useLeadSourceContext";
import { useRoleContext } from "../../hooks/useRoleContext";
import { useUserContext } from "../../hooks/useUserContext";
import { useStudentsContext } from "../../hooks/useStudentsContext";
import LoadingScreen from "../../../componentLayer/components/loadingScreen/LoadingScreen";
import { ERPApi } from "../../../serviceLayer/interceptor";

export const AuthContext = createContext();
const AuthContextProvider = ({ children }) => {
  const { getAllBranches } = useBranchContext();
  const { getAllCourses } = useCourseContext();
  const { getAllCoursePackages } = useCoursePackage();
  const { getAllDeparments } = useDepartmentContext();
  const { getAllLeadSource } = useLeadSourceContext();
  const { getAllPaginatedRoles } = useRoleContext();
  const { getAllCouncellers, getAllUsersWithOutCouncellers } = useUserContext();

  const { getPaginatedStudentsData, getAllStudents } = useStudentsContext();

  const localStrogeData = JSON.parse(localStorage.getItem("data"));
  const localStrogeData1 = JSON.parse(localStorage.getItem("password"));



  const InitialState = {
    user: localStrogeData?.user || {},
    token: localStrogeData?.token || "",
    role: localStrogeData?.role || [],
    password: localStrogeData1?.password || "",
  };




  const [AuthState, DispatchAuth] = useReducer(AuthReducer, InitialState);

  const [isLoading, setIsLoading] = useState(false);

  const LoginAdmin = async (logindata, navigate1) => {
    try {
      const { data, status } = await toast.promise(
        axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, logindata),
        {
          pending: "Verifying user credentials, please wait...",
          success: {
            render({ data }) {
              // Destructuring response data if it's coming with a `data` field, otherwise just display a success message.
              return `Login successful! Welcome back, ${data?.user?.name || "User"
                }!`;
            },
          },
          error:
            "Incorrect credentials. Please check your username and password and try again. 🤯",
        }
      );

      if (status === 200) {
        setIsLoading(true);

        localStorage.setItem(
          "data",
          JSON.stringify({
            user: data?.user,
            token: data?.token,
            role: data?.role?.Permissions,
          })
        );

        localStorage.setItem(
          "password",
          JSON.stringify({
            password: data?.user?.password,
          })
        );

        DispatchAuth({ type: "SET_USER", payload: data?.user });
        DispatchAuth({ type: "SET_TOKEN", payload: data?.token });
        DispatchAuth({ type: "SET_ROLE", payload: data?.role?.Permissions });
        DispatchAuth({
          type: "SET_PASSWORD_LOCALSTORAGE",
          payload: data?.user?.password,
        });
        if (data?.user?.profile === "Trainer") {
          navigate1("/batchmanagement/trainer/dashboard", { replace: true });
        } else if (data?.user?.profile === "IIT Guwahati") {
          navigate1("/student/cerficationlist", { replace: true });
        } else if(data?.user?.profile === "Digital Marketing") {
          navigate1("/vouchers", { replace: true });
        } 
        else {
          navigate1("/", { replace: true });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const Forgotpassword = async (email, navigate1) => {
    try {
      const { data, status } = await toast.promise(
        axios.get(
          `${import.meta.env.VITE_API_URL}/auth/forget?email=${email?.email}`
        ),
        {
          pending: "verifying data",
          success: {
            render({
              data: {
                data: { email },
              },
            }) {
              return `Email Submitted Successfully`;
            },
          },
          error: "Wrong Credentials 🤯",
        }
      );
      if (status === 200) {
        Swal.fire({
          title: "Reset Password Success!",
          text: "Check your email for reset instructions.",
          icon: "success",
        });

        navigate1("/auth/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const ChangePasswordfun = async (updatedpassword, navigate1) => {
    try {
      const { data, status } = await toast.promise(
        axios.put(
          `${import.meta.env.VITE_API_URL}/user/changepassword`,
          updatedpassword,
          {
            headers: {
              authorization: AuthState?.token,
            },
          }
        ),
        {
          pending: "verifying data",
          success: {
            render({
              data: {
                data: { updated },
              },
            }) {
              return `Password Updated`;
            },
          },
          error: "Unauthorized Access 🤯",
        }
      );
      if (status === 200) {
        localStorage.removeItem("data");
        localStorage.removeItem("password");
        DispatchAuth({ type: "SET_USER", payload: {} });
        DispatchAuth({ type: "SET_TOKEN", payload: "" });
        DispatchAuth({ type: "SET_ROLE", payload: {} });
        DispatchAuth({ type: "SET_PASSWORD_LOCALSTORAGE", payload: "" });
        navigate1("/auth/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetPassword = async ({ token, updatedpassword }, navigate1) => {
    try {
      const { data, status } = await toast.promise(
        axios.patch(
          `${import.meta.env.VITE_API_URL}/auth/change`,
          updatedpassword,
          {
            headers: {
              Authorization: token,
            },
          }
        ),
        {
          pending: "verifying data",
          success: {
            render({
              data: {
                data: { updated },
              },
            }) {
              return `Password Updated`;
            },
          },
          error: "Unauthorized Access 🤯",
        }
      );
      if (status === 200) {
        localStorage.removeItem("data");
        localStorage.removeItem("password");
        DispatchAuth({ type: "SET_USER", payload: {} });
        DispatchAuth({ type: "SET_TOKEN", payload: "" });
        DispatchAuth({ type: "SET_ROLE", payload: {} });
        DispatchAuth({ type: "SET_PASSWORD_LOCALSTORAGE", payload: "" });
        navigate1("/auth/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const userLogout = async (navigate) => {
    // let token = JSON.parse(localStorage.getItem("data"))?.token;

    try {
      const { data, status } = await toast.promise(
        axios.post(
          `${import.meta.env.VITE_API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${AuthState?.token}`,
            },
          }
        ),
        {
          pending: "Please Wait Logging Out!...",
          success: {
            render({
              data: {
                data: { updated },
              },
            }) {
              return `Log Out Successfully..!`;
            },
          },
          error: "Unauthorized Access 🤯",
        }
      );

      if (status === 200) {
        navigate("/auth/login");
        localStorage.removeItem("data");
        localStorage.removeItem("password");

        localStorage.removeItem("emailVerificationState");
        localStorage.removeItem("studentDetails");
        localStorage.removeItem("parentsDetails");
        localStorage.removeItem("educationDetails");
        localStorage.removeItem("admissionDetails");
        localStorage.removeItem("feeAndBillingDetails");


        DispatchAuth({ type: "SET_USER", payload: {} });
        DispatchAuth({ type: "SET_TOKEN", payload: "" });
        DispatchAuth({ type: "SET_ROLE", payload: {} });
        DispatchAuth({ type: "SET_PASSWORD_LOCALSTORAGE", payload: "" });
      }
    } catch (e) {
      console.error(e,"Logout data");
      if (e.status === 498) {
        navigate("/auth/login");
        localStorage.removeItem("data");
        localStorage.removeItem("password");

        localStorage.removeItem("emailVerificationState");
        localStorage.removeItem("studentDetails");
        localStorage.removeItem("parentsDetails");
        localStorage.removeItem("educationDetails");
        localStorage.removeItem("admissionDetails");
        localStorage.removeItem("feeAndBillingDetails");

        
        DispatchAuth({ type: "SET_USER", payload: {} });
        DispatchAuth({ type: "SET_TOKEN", payload: "" });
        DispatchAuth({ type: "SET_ROLE", payload: {} });
        DispatchAuth({ type: "SET_PASSWORD_LOCALSTORAGE", payload: "" });
      }
    }
  };

  useEffect(() => {
    if (localStrogeData) {
      DispatchAuth({ type: "SET_TOKEN", payload: localStrogeData?.token });
      DispatchAuth({ type: "SET_USER", payload: localStrogeData?.user });
    }
  }, []);

  useEffect(() => {
    if (AuthState?.user?.profile !== "IIT Guwahati" && AuthState?.token) {
      // getAllBranches();
      // getAllCourses();
      // getAllCoursePackages();
      // getAllDeparments();
      // getAllLeadSource();
      // getAllPaginatedRoles();
      // getAllCouncellers();
      // getAllUsersWithOutCouncellers();
      // getPaginatedStudentsData();
      // getAllStudents();
    }
  }, [AuthState?.token]);

  return (
    <AuthContext.Provider
      value={{
        AuthState,
        DispatchAuth,
        Forgotpassword,
        LoginAdmin,
        resetPassword,
        ChangePasswordfun,
        userLogout,
      }}
    >
      {/* {children} */}

      {isLoading && <LoadingScreen />}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
