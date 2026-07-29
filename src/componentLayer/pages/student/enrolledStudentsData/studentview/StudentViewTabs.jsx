import React from "react";
import BackButton from "../../../../components/backbutton/BackButton";
import {NavLink, Outlet, useLocation, useMatches, useParams} from "react-router-dom";

const StudentViewTabs = () => {
  // views

  const location = useLocation();
  const currentPath = location.pathname;
  const {registrationNumber} = useParams()
  const searchParams = new URLSearchParams(location.search);
  const studentId = searchParams.get("studentId");

  const matches = useMatches();

  const currentRoute = matches[matches.length - 1];
  const loaderData = currentRoute?.data;

  const student =
      loaderData?.studentData ??
      loaderData?.data?.user;

  const studentRegistrationNumber = student?.registrationnumber;


  return (
    <div className="">
      <BackButton heading="Student Details" content="Back" />
      <div className="container-fluid ">
        <div className="card  mb-0">
          <div className="d-flex border-bottom">
            <ul className="d-flex flex-row m-3" id="pills-tab" role="tablist">
              {/* View Tab */}
              <li role="presentation" className="me-2">
                <NavLink
                  to={`/student/views?studentId=${registrationNumber ?? studentId}`}
                  className={({ isActive }) =>
                    `fw-medium px-3 py-2 rounded-3 ${
                      isActive || currentPath === "/student/views"
                        ? "active-tab"
                        : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    color:
                      isActive && currentPath === "/student/views"
                        ? "#405189"
                        : "#878a99",
                  })}
                >
                  View
                </NavLink>
              </li>
                      
              {/* Activity Tab */}
              <li role="presentation" className="me-2">
                <NavLink
                  to={`/student/views/activity?studentId=${registrationNumber ?? studentId}&page=1&pageSize=10`}
                  className={({ isActive }) =>
                    `fw-medium px-3 py-2 rounded-3 ${
                      isActive || currentPath === "/student/views/activity"
                        ? "active-tab"
                        : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    color:
                      isActive || currentPath === "/student/views/activity"
                        ? "#405189"
                        : "#878a99",
                  })}
                >
                  Activity
                </NavLink>
              </li>

              {/* Remarks Tab */}
              <li role="presentation" className="me-2">
                <NavLink
                  to={`/student/views/remarks?studentId=${registrationNumber ?? studentId}`}
                  className={({ isActive }) =>
                    `fw-medium px-3 py-2 rounded-3 ${
                      isActive || currentPath === "/student/views/remarks"
                        ? "active-tab"
                        : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    color:
                      isActive || currentPath === "/student/views/remarks"
                        ? "#405189"
                        : "#878a99",
                  })}
                >
                  Remarks
                </NavLink>
              </li>
              {/* Attended Jobs */}
              <li role="presentation" className="me-2">
                <NavLink
                  to={`/student/views/jobs-attended/${registrationNumber ?? studentId}`}
                  className={({ isActive }) =>
                    `fw-medium px-3 py-2 rounded-3 ${
                      isActive || currentPath.startsWith(
                          "/student/views/jobs-attended"
                      )
                        ? "active-tab"
                        : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    color:
                      isActive || currentPath.startsWith(
                          "/student/views/jobs-attended"
                      )
                        ? "#405189"
                        : "#878a99",
                  })}
                >
                  Jobs Attended
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="tab-content mt-3">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentViewTabs;
