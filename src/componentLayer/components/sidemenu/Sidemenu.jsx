import React, { useState, useEffect } from "react";
import "../../../assets/css/Sidemenu.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { CiSettings } from "react-icons/ci";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { AiOutlineLine, AiOutlineUsergroupAdd } from "react-icons/ai";
import { PiStudentFill } from "react-icons/pi";
import { TbMessageReport } from "react-icons/tb";
import Teks_Logo from "../../../assets/images/Teks_Logo.svg";
import TeksSmallLogo from "../../../assets/images/Teks_Shape.svg";
import GateKeeper from "../../../rbac/GateKeeper";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useAuthContext } from "../../../dataLayer/hooks/useAuthContext";
import { usePermissionsProvider } from "../../../dataLayer/hooks/usePermissionsProvider";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { IoTicketOutline } from "react-icons/io5";
// import { BiWallet } from "react-icons/bi";
import fgLogo from "../../../assets/images/FG-LOGO.png";

const Sidemenu = ({ isExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { AuthState } = useAuthContext();
  const { permission } = usePermissionsProvider();

  const profile = AuthState?.user?.profile;
  // const branchLogoImage = AuthState?.user;
  // const branchLogo = branchLogoImage?.branch_setting?.logoName
  //   ? `https://teksacademy.s3.ap-south-1.amazonaws.com/branches/logos/${branchLogoImage?.branch_setting?.logoName}`
  //   : null;

  // Function to check if any child path is active (for parent menus)
  const isChildActive = (childPaths) => {
    return childPaths.some((path) => location.pathname.startsWith(path));
  };

  // Student Management child paths
  const studentChildPaths = [
    "/student/dashboard",
    "/student/list",
    "/student/cerficationlist",
    "/student/feedetails",
    "/student/installment",
    "/student/certificate",
    "/student/requestedcertificate",
    "/student/refunddata",
    "/student/feedback",
    "/student/abroad",
  ];

  // Batch Management child paths
  const batchChildPaths = [
    "/batchmanagement/dashboard",
    "/batchmanagement/trainer/dashboard",
    "/batchmanagement/batches",
    "/batchmanagement/placedstudents",
    "/batchmanagement/attendances",
  ];

  // Exam Management child paths
  const examChildPaths = ["/exam/examdetails", "/exam/registrationform"];
  const demobatchespaths = [
    "/demobatches/registrationform",
    "/demobatches/registrationform/create",
    "/demobatches/registrationform/customfields",
  ];
  return (
    <div className="">
      <main className="bg-white">
        <div className="wrapper">
          <aside
            id="sidebar"
            className={`sidebar overflow-auto ${isExpanded ? "expand sidebar_scroll" : "close"}`}
          >
            <div className="mt-3">
              <div className="text-center">
                <NavLink to={"/"}>
                  <img
                    src={isExpanded ? fgLogo : fgLogo}
                    className={
                      isExpanded
                        ? "img-fluid logo_css bg-white"
                        : "mini_logo_css open img-fluid bg-white"
                    }
                    alt="Branch Logo"
                    onError={(e) => {
                      e.target.src = isExpanded
                        ? fgLogo || fgLogo
                        : fgLogo;
                    }}
                  />
                </NavLink>
              </div>
            </div>
            <div className="simplebar-offset">
              <ul className="sidebar-nav simplebar-content-wrapper">
                {/* Dashboard */}
                {profile !== "Human Resource" &&
                  profile !== "Placement Partner" &&
                  profile !== "Trainer" &&
                  profile !== "Student Relationship Team" &&
                  profile !== "Digital Marketing" &&
                  profile !== "IIT Guwahati" && (
                    <li className="sidebar-item">
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          `sidebar-link ${isActive ? "active" : ""}`
                        }
                        end
                      >
                        <LuLayoutDashboard className="main_icon" />
                        <span className="title_show">Dashboard</span>
                      </NavLink>
                    </li>
                  )}

                {/* Student Management */}
                <GateKeeper
                  requiredModule="Student Management"
                  requiredPermission="all"
                >
                  <li className="sidebar-item cursor-pointer">
                    <div
                      className={`sidebar-link has-dropdown ${
                        isChildActive(studentChildPaths) ? "active-parent" : ""
                      } ${isChildActive(studentChildPaths) ? "" : "collapsed"}`}
                      data-bs-toggle="collapse"
                      data-bs-target="#student"
                      aria-expanded={isChildActive(studentChildPaths)}
                    >
                      <PiStudentFill className="main_icon" />
                      <span>Student Management</span>
                    </div>

                    <ul
                      id="student"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        isChildActive(studentChildPaths) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      {/* Student Management Dashboard */}
                      {profile !== "IIT Guwahati" && (
                        <GateKeeper
                          requiredModule="Student Management"
                          requiredPermission="all"
                        >
                          <li className="sidebar-item">
                            <NavLink
                              to="/student/dashboard"
                              className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                              }
                            >
                              <AiOutlineLine className="sub_icon" />
                              Dashboard
                            </NavLink>
                          </li>
                        </GateKeeper>
                      )}

                      {/* Enrolled Students */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Enrolled Students"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            // to="/student/list"
                            to="/student/list?preOnboard=0"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Enrolled Students
                          </NavLink>
                        </li>
                      </GateKeeper>

                      {/* PG Certification */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="PG Certification"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/student/cerficationlist"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            PG Certification
                          </NavLink>
                        </li>
                      </GateKeeper>

                      {/* Fee Details */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Fee Details"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/student/feedetails/list?search=&page=1&pageSize=10"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Fee Details
                          </NavLink>
                        </li>
                      </GateKeeper>

                      {/* Installments */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Installment"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/student/installment"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Installments
                          </NavLink>
                        </li>
                      </GateKeeper>

                      {/* Certificate */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Certificate"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/student/certificate"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Certificate
                          </NavLink>
                        </li>
                      </GateKeeper>

                      {/* Requested Certificate */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Requested Certificate"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/student/requestedcertificate"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Requested Certificate
                          </NavLink>
                        </li>
                      </GateKeeper>

                      {/* Refund */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="refund"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/student/refunddata"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Refund
                          </NavLink>
                        </li>
                      </GateKeeper>

                      {/* Feedback */}
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="feedback"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/student/feedback"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Feedback
                          </NavLink>
                        </li>
                      </GateKeeper>
                      <GateKeeper
                        requiredModule="Student Management"
                        requiredPermission="all"
                        submenumodule="Abroad Study"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/student/abroadstudents"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Abroad Students
                          </NavLink>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Batch Management */}
                <GateKeeper
                  requiredModule="Batch Management"
                  requiredPermission="all"
                >
                  <li className="sidebar-item cursor-pointer">
                    <div
                      className={`sidebar-link has-dropdown ${
                        isChildActive(batchChildPaths) ? "active-parent" : ""
                      } ${isChildActive(batchChildPaths) ? "" : "collapsed"}`}
                      data-bs-toggle="collapse"
                      data-bs-target="#batch"
                      aria-expanded={isChildActive(batchChildPaths)}
                    >
                      <MdOutlineManageAccounts className="main_icon" />
                      <span>Batch Management</span>
                    </div>

                    <ul
                      id="batch"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        isChildActive(batchChildPaths) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      {/* Batch Management Dashboard - Non-Trainer */}
                      {profile && profile !== "Trainer" && (
                        <GateKeeper
                          requiredModule="Batch Management"
                          requiredPermission="all"
                        >
                          <li className="sidebar-item">
                            <NavLink
                              to="/batchmanagement/dashboard"
                              className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                              }
                            >
                              <AiOutlineLine className="sub_icon" />
                              Dashboard
                            </NavLink>
                          </li>
                        </GateKeeper>
                      )}

                      {/* Batch Management Dashboard - Trainer */}
                      {profile && profile === "Trainer" && (
                        <GateKeeper
                          requiredModule="Batch Management"
                          requiredPermission="all"
                        >
                          <li className="sidebar-item">
                            <NavLink
                              to="/batchmanagement/trainer/dashboard"
                              className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                              }
                            >
                              <AiOutlineLine className="sub_icon" />
                              Dashboard
                            </NavLink>
                          </li>
                        </GateKeeper>
                      )}

                      {/* Batches */}
                      <GateKeeper
                        requiredModule="Batch Management"
                        requiredPermission="all"
                        submenumodule={[
                          "Batch",
                          "Active Batches",
                          "Upcoming Batches",
                          "Completed Batches",
                        ]}
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/batchmanagement/batches/activelist"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Batches
                          </NavLink>
                        </li>
                      </GateKeeper>

                      {/* Placed Students */}
                      <GateKeeper
                        requiredModule="Batch Management"
                        requiredPermission="all"
                        submenumodule="Placed Students"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/batchmanagement/placedstudents?page=1&pageSize=10&search="
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Placed Students
                          </NavLink>
                        </li>
                      </GateKeeper>

                      {/* Attendance */}
                      <GateKeeper
                        requiredModule="Batch Management"
                        requiredPermission="all"
                        submenumodule="Attendance"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/batchmanagement/attendances"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Attendance
                          </NavLink>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>
                <GateKeeper
                  requiredModule="Demo batches"
                  requiredPermission="all"
                >
                  <li className="sidebar-item cursor-pointer">
                    <div
                      className={`sidebar-link has-dropdown ${
                        isChildActive(demobatchespaths) ? "active-parent" : ""
                      }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#demobatches"
                      aria-expanded={
                        isChildActive(demobatchespaths) ? "true" : "false"
                      }
                      data-title="Demo batches"
                    >
                      <MdOutlineManageAccounts className="main_icon" />
                      <span>Demo Batches</span>
                    </div>

                    <ul
                      id="demobatches"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        isChildActive(demobatchespaths) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Demo batches"
                        submenumodule="Registration Form"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/demobatches/registrationform"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            <span>Registration Form</span>
                          </NavLink>
                        </li>
                      </GateKeeper>
                      <GateKeeper
                        requiredModule="Demo batches"
                        submenumodule="Registration Form"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/demobatches/all"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            <span>Batches</span>
                          </NavLink>
                        </li>
                      </GateKeeper>
                      {/* Job Openings */}
                      {/* <GateKeeper
                        requiredModule="HR Management"
                        submenumodule="Job Openings"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/jobopenings/joblist"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                            data-title="Job Openings"
                          >
                            <AiOutlineLine className="sub_icon" />
                            <span>Job Openings</span>
                          </NavLink>
                        </li>
                      </GateKeeper> */}
                      {/* Placed Students */}
                      {/* <GateKeeper
                        requiredModule="Dashboard"
                        requiredPermission="all"
                        submenuReqiredPermission="canUpdate"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/hrmanagement/placedstudents"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                            data-title="Placed Students"
                          >
                            <AiOutlineLine className="sub_icon" />
                            <span>Placed Students</span>
                          </NavLink>
                        </li>
                      </GateKeeper> */}
                      {/* <GateKeeper
                        requiredModule="Placement Management"
                        submenumodule="Batches"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                        <NavLink
                          to="/placement/batches/list"
                          className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                          }
                        >
                          <AiOutlineLine className="sub_icon" />
                          <span>Batches</span>
                        </NavLink>
                      </li>
                      </GateKeeper>
                       */}
                    </ul>
                  </li>
                </GateKeeper>
                {/* Referrals */}
                <GateKeeper requiredModule="Referrals" requiredPermission="all">
                  <li className="sidebar-item cursor-pointer">
                    <div
                      className={`sidebar-link has-dropdown ${
                        isChildActive(["/referrals"]) ? "active-parent" : ""
                      } ${isChildActive(["/referrals"]) ? "" : "collapsed"}`}
                      data-bs-toggle="collapse"
                      data-bs-target="#referrals"
                      aria-expanded={isChildActive(["/referrals"])}
                    >
                      <AiOutlineUsergroupAdd className="main_icon" />
                      <span>Referrals</span>
                    </div>
                    <ul
                      id="referrals"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        isChildActive(["/referrals"]) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Referrals"
                        submenumodule="Referrals Data"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/referrals"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Referral Data
                          </NavLink>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Vouchers */}
                {/* <GateKeeper requiredModule="Vouchers" requiredPermission="all">
                  <li className="sidebar-item cursor-pointer">
                    <div
                      className={`sidebar-link has-dropdown ${
                        isChildActive(["/vouchers"]) ? "active-parent" : ""
                      } ${isChildActive(["/vouchers"]) ? "" : "collapsed"}`}
                      data-bs-toggle="collapse"
                      data-bs-target="#vouchers"
                      aria-expanded={isChildActive(["/vouchers"])}
                    >
                      <IoTicketOutline className="main_icon" />
                      <span>Vouchers</span>
                    </div>
                    <ul
                      id="vouchers"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        isChildActive(["/vouchers"]) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Vouchers"
                        submenumodule="Vouchers Data"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/vouchers"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon " />
                            Vouchers Data
                          </NavLink>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper> */}

                {/* Wallet */}
                {/* <GateKeeper requiredModule="Wallet" requiredPermission="all">
                  <li className="sidebar-item cursor-pointer">
                    <div
                      className={`sidebar-link has-dropdown ${
                        isChildActive(["/wallet"]) ? "active-parent" : ""
                      } ${isChildActive(["/wallet"]) ? "" : "collapsed"}`}
                      data-bs-toggle="collapse"
                      data-bs-target="#wallet"
                      aria-expanded={isChildActive(["/wallet"])}
                    >
                      <BiWallet className="main_icon" />
                      <span>Wallet</span>
                    </div>
                    <ul
                      id="wallet"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        isChildActive(["/wallet"]) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Wallet"
                        submenumodule="Withdrawal Requests"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/wallet"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Withdrawal Requests
                          </NavLink>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper> */}

                {/* Reports */}
                <GateKeeper requiredModule="Reports" requiredPermission="all">
                  <li className="sidebar-item cursor-pointer">
                    <div
                      className={`sidebar-link has-dropdown ${
                        isChildActive(["/reports"]) ? "active-parent" : ""
                      } ${isChildActive(["/reports"]) ? "" : "collapsed"}`}
                      data-bs-toggle="collapse"
                      data-bs-target="#reports"
                      aria-expanded={isChildActive(["/reports"])}
                    >
                      <TbMessageReport className="main_icon" />
                      <span>Reports</span>
                    </div>
                    <ul
                      id="reports"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        isChildActive(["/reports"]) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Reports"
                        submenumodule="Report Data"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/reports/reportsdata"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Reports Data
                          </NavLink>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Exam Management */}
                <GateKeeper
                  requiredModule="Exam Mangement"
                  requiredPermission="all"
                >
                  <li className="sidebar-item cursor-pointer">
                    <div
                      className={`sidebar-link has-dropdown ${
                        isChildActive(examChildPaths) ? "active-parent" : ""
                      } ${isChildActive(examChildPaths) ? "" : "collapsed"}`}
                      data-bs-toggle="collapse"
                      data-bs-target="#exammangement"
                      aria-expanded={isChildActive(examChildPaths)}
                    >
                      <PiStudentFill className="main_icon" />
                      <span>Exam Management</span>
                    </div>
                    <ul
                      id="exammangement"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        isChildActive(examChildPaths) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Exam Mangement"
                        submenumodule="Exam Details"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/exam/examdetails"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Exam
                          </NavLink>
                        </li>
                      </GateKeeper>

                      <GateKeeper
                        requiredModule="Exam Mangement"
                        submenumodule="Registration Form"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <NavLink
                            to="/exam/registrationform"
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active" : ""}`
                            }
                          >
                            <AiOutlineLine className="sub_icon" />
                            Registration Form
                          </NavLink>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Tickets */}
                <GateKeeper
                  requiredModule="Tickets Mangement"
                  requiredPermission="all"
                  submenumodule="Tickets Details"
                  submenuReqiredPermission="canRead"
                >
                  <li className="sidebar-item">
                    <NavLink
                      to="/tickets/ticketsDashboard"
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      <FaRegCircleQuestion className="main_icon" />
                      <span className="title_show">Tickets</span>
                    </NavLink>
                  </li>
                </GateKeeper>

                {/* Users */}
                <GateKeeper
                  requiredModule="User Mangement"
                  requiredPermission="all"
                  submenumodule="User Details"
                  submenuReqiredPermission="canRead"
                >
                  <li className="sidebar-item">
                    <NavLink
                      to="/user/list"
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      <FaRegUserCircle className="main_icon" />
                      <span className="title_show">Users</span>
                    </NavLink>
                  </li>
                </GateKeeper>

                {/* Settings */}
                <GateKeeper requiredModule="Settings" requiredPermission="all">
                  <li className="sidebar-item">
                    <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                    >
                      <CiSettings className="main_icon" />
                      <span className="title_show">Settings</span>
                    </NavLink>
                  </li>
                </GateKeeper>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Sidemenu;
