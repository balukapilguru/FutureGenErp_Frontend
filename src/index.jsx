import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "./dataLayer/context/themeContext/ThemeContext";
import { ToastContainer } from "react-toastify";
import AuthContextProvider from "./dataLayer/context/authContext/AuthContextProvider";
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import RoleContextProvider from "./dataLayer/context/roleContext/RoleContextProvider";
import BranchContextProvider from "./dataLayer/context/branchContext/BranchContextProvider";
import DepartmentContextProvider from "./dataLayer/context/deparmentContext/DepartmentContextProvider";
import CoursePackageContextProvider from "./dataLayer/context/coursePackageContext/CoursePackageContext";
import CourseContextProvider from "./dataLayer/context/courseContext/CourseContextProvider";
import LeadSourceContextProvider from "./dataLayer/context/leadSourceContext/LeadSourceContext";
import UsersContextProvider from "./dataLayer/context/usersContext/UsersContextProvider";
import StudentsContextProvider from "./dataLayer/context/studentsContext/StudContextProvider";
import PermissionsProvider from "./rbac/PermissionsProvider";
import router from "./routerLayer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
    <RoleContextProvider>
      <BranchContextProvider>
        <DepartmentContextProvider>
          <CoursePackageContextProvider>
            <CourseContextProvider>
              <LeadSourceContextProvider>
                <UsersContextProvider>
                  <StudentsContextProvider>
                    <AuthContextProvider>
                      <PermissionsProvider>
                        <ThemeProvider>
                          <ToastContainer
                            position="top-right"
                            autoClose={1000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                          />
                          <RouterProvider router={router} />
                        </ThemeProvider>
                      </PermissionsProvider>
                    </AuthContextProvider>
                  </StudentsContextProvider>
                </UsersContextProvider>
              </LeadSourceContextProvider>
            </CourseContextProvider>
          </CoursePackageContextProvider>
        </DepartmentContextProvider>
      </BranchContextProvider>
    </RoleContextProvider>
  // </React.StrictMode>
);
