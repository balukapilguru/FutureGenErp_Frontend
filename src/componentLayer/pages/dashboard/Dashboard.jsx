import React, { useState, useEffect } from "react";
import "../../../assets/css/Sidemenu.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { BiWallet } from "react-icons/bi";

const Sidemenu = ({ isExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { AuthState } = useAuthContext();
  const { permission } = usePermissionsProvider();

  const profile = AuthState?.user?.profile;
  const branchLogoImage = AuthState?.user;
  const branchLogo = branchLogoImage?.branch_setting?.logoName
    ? `https://teksacademy.s3.ap-south-1.amazonaws.com/branches/logos/${branchLogoImage?.branch_setting?.logoName}`
    : null;

  // Get current pathname
  const pathname = location.pathname;



  // Function to check if a path is active
  const isPathActive = (path) => {
    if (!path) return false;
    
    // Exact match
    if (pathname === path) return true;
    
    // For paths with query parameters or nested routes
    if (path !== '/' && pathname.startsWith(path)) {
      const nextChar = pathname.charAt(path.length);
      return nextChar === '/' || nextChar === '?' || nextChar === '';
    }
    
    return false;
  };

  // Function to check if any child path is active (for parent menus)
  const isChildPathActive = (basePath) => {
    if (!basePath) return false;
    return pathname.startsWith(basePath) && pathname.length > basePath.length;
  };

  // Function to check if parent menu should be expanded
  const shouldExpandParent = (basePath, childPaths = []) => {
    // Check if any child path is active
    if (childPaths.some(path => pathname.startsWith(path))) {
      return true;
    }
    // Check if we're on a child page of this parent
    return pathname.startsWith(basePath) && pathname !== basePath;
  };

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
                <Link to={"/"}>
                  <img
                    src={isExpanded ? branchLogo : TeksSmallLogo}
                    className={isExpanded ? "img-fluid logo_css" : "mini_logo_css open img-fluid"}
                    alt="Branch Logo"
                    onError={(e) => {
                      e.target.src = isExpanded ? (branchLogo || Teks_Logo) : TeksSmallLogo;
                    }}
                  />
                </Link>
              </div>
            </div>
            <div className="simplebar-offset">
              <ul className="sidebar-nav simplebar-content-wrapper">
                {/* Dashboard */}
                {profile !== "Human Resource" &&
                  profile !== "Placement Partner" &&
                  profile !== "Trainer" &&
                  profile !== "Student Relationship Team" &&
                  profile !== "IIT Guwahati" && (
                    <li className="sidebar-item">
                      <Link
                        to="/"
                        className={`sidebar-link ${pathname === "/" ? "active" : ""}`}
                      >
                        <LuLayoutDashboard className="main_icon" />
                        <span className="title_show">Dashboard</span>
                      </Link>
                    </li>
                  )}

                {/* Student Management */}
                <GateKeeper requiredModule="Student Management" requiredPermission="all">
                  <li className="sidebar-item ">
                    <Link
                      className={`sidebar-link has-dropdown ${
                        shouldExpandParent("/student", [
                          "/student/dashboard",
                          "/student/list",
                          "/student/cerficationlist",
                          "/student/feedetails",
                          "/student/installment",
                          "/student/certificate",
                          "/student/requestedcertificate",
                          "/student/refunddata",
                          "/student/feedback"
                        ]) ? "" : "collapsed"
                      }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#student"
                      aria-expanded={shouldExpandParent("/student", [
                        "/student/dashboard",
                        "/student/list",
                        "/student/cerficationlist",
                        "/student/feedetails",
                        "/student/installment",
                        "/student/certificate",
                        "/student/requestedcertificate",
                        "/student/refunddata",
                        "/student/feedback"
                      ])}
                    >
                      <PiStudentFill className="main_icon" />
                      <span>Student Management</span>
                    </Link>

                    <ul
                      id="student"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        shouldExpandParent("/student", [
                          "/student/dashboard",
                          "/student/list",
                          "/student/cerficationlist",
                          "/student/feedetails",
                          "/student/installment",
                          "/student/certificate",
                          "/student/requestedcertificate",
                          "/student/refunddata",
                          "/student/feedback"
                        ]) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      {/* Student Management Dashboard */}
                      {profile !== "IIT Guwahati" && (
                        <GateKeeper requiredModule="Student Management" requiredPermission="all">
                          <li className="sidebar-item">
                            <Link
                              to="/student/dashboard"
                              className={`sidebar-link ${isPathActive("/student/dashboard") ? "active" : ""}`}
                            >
                              <AiOutlineLine className="sub_icon" />
                              Dashboard
                            </Link>
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
                          <Link
                            to="/student/list"
                            className={`sidebar-link ${isPathActive("/student/list") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Enrolled Students
                          </Link>
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
                          <Link
                            to="/student/cerficationlist"
                            className={`sidebar-link ${isPathActive("/student/cerficationlist") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            PG Certification
                          </Link>
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
                          <Link
                            to="/student/feedetails/list?search=&page=1&pageSize=10"
                            className={`sidebar-link ${pathname.startsWith("/student/feedetails") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Fee Details
                          </Link>
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
                          <Link
                            to="/student/installment"
                            className={`sidebar-link ${isPathActive("/student/installment") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Installments
                          </Link>
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
                          <Link
                            to="/student/certificate"
                            className={`sidebar-link ${isPathActive("/student/certificate") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Certificate
                          </Link>
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
                          <Link
                            to="/student/requestedcertificate"
                            className={`sidebar-link ${isPathActive("/student/requestedcertificate") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Requested Certificate
                          </Link>
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
                          <Link
                            to="/student/refunddata"
                            className={`sidebar-link ${isPathActive("/student/refunddata") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Refund
                          </Link>
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
                          <Link
                            to="/student/feedback"
                            className={`sidebar-link ${isPathActive("/student/feedback") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Feedback
                          </Link>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Batch Management */}
                <GateKeeper requiredModule="Batch Management" requiredPermission="all">
                  <li className="sidebar-item">
                    <Link
                      className={`sidebar-link has-dropdown ${
                        shouldExpandParent("/batchmanagement", [
                          "/batchmanagement/dashboard",
                          "/batchmanagement/trainer/dashboard",
                          "/batchmanagement/batches",
                          "/batchmanagement/placedstudents",
                          "/batchmanagement/attendances"
                        ]) ? "" : "collapsed"
                      }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#batch"
                      aria-expanded={shouldExpandParent("/batchmanagement", [
                        "/batchmanagement/dashboard",
                        "/batchmanagement/trainer/dashboard",
                        "/batchmanagement/batches",
                        "/batchmanagement/placedstudents",
                        "/batchmanagement/attendances"
                      ])}
                    >
                      <MdOutlineManageAccounts className="main_icon" />
                      <span>Batch Management</span>
                    </Link>

                    <ul
                      id="batch"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        shouldExpandParent("/batchmanagement", [
                          "/batchmanagement/dashboard",
                          "/batchmanagement/trainer/dashboard",
                          "/batchmanagement/batches",
                          "/batchmanagement/placedstudents",
                          "/batchmanagement/attendances"
                        ]) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      {/* Batch Management Dashboard - Non-Trainer */}
                      {profile && profile !== "Trainer" && (
                        <GateKeeper requiredModule="Batch Management" requiredPermission="all">
                          <li className="sidebar-item">
                            <Link
                              to="/batchmanagement/dashboard"
                              className={`sidebar-link ${isPathActive("/batchmanagement/dashboard") ? "active" : ""}`}
                            >
                              <AiOutlineLine className="sub_icon" />
                              Dashboard
                            </Link>
                          </li>
                        </GateKeeper>
                      )}

                      {/* Batch Management Dashboard - Trainer */}
                      {profile && profile === "Trainer" && (
                        <GateKeeper requiredModule="Batch Management" requiredPermission="all">
                          <li className="sidebar-item">
                            <Link
                              to="/batchmanagement/trainer/dashboard"
                              className={`sidebar-link ${isPathActive("/batchmanagement/trainer/dashboard") ? "active" : ""}`}
                            >
                              <AiOutlineLine className="sub_icon" />
                              Dashboard
                            </Link>
                          </li>
                        </GateKeeper>
                      )}

                      {/* Batches */}
                      <GateKeeper
                        requiredModule="Batch Management"
                        requiredPermission="all"
                        submenumodule={["Batch", "Active Batches", "Upcoming Batches", "Completed Batches"]}
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <Link
                            to="/batchmanagement/batches/activelist"
                            className={`sidebar-link ${pathname.startsWith("/batchmanagement/batches") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Batches
                          </Link>
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
                          <Link
                            to="/batchmanagement/placedstudents?page=1&pageSize=10&search="
                            className={`sidebar-link ${pathname.startsWith("/batchmanagement/placedstudents") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Placed Students
                          </Link>
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
                          <Link
                            to="/batchmanagement/attendances"
                            className={`sidebar-link ${isPathActive("/batchmanagement/attendances") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Attendance
                          </Link>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Referrals */}
                <GateKeeper requiredModule="Referrals" requiredPermission="all">
                  <li className="sidebar-item">
                    <Link
                      className={`sidebar-link has-dropdown ${
                        shouldExpandParent("/referrals") ? "" : "collapsed"
                      }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#referrals"
                      aria-expanded={shouldExpandParent("/referrals")}
                    >
                      <AiOutlineUsergroupAdd className="main_icon" />
                      <span>Referrals</span>
                    </Link>
                    <ul
                      id="referrals"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        shouldExpandParent("/referrals") ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Referrals"
                        submenumodule="Referrals Data"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <Link
                            to="/referrals"
                            className={`sidebar-link ${isPathActive("/referrals") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Referral Data
                          </Link>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Vouchers */}
                <GateKeeper requiredModule="Vouchers" requiredPermission="all">
                  <li className="sidebar-item">
                    <Link
                      className={`sidebar-link has-dropdown ${
                        shouldExpandParent("/vouchers") ? "" : "collapsed"
                      }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#vouchers"
                      aria-expanded={shouldExpandParent("/vouchers")}
                    >
                      <IoTicketOutline className="main_icon" />
                      <span>Vouchers</span>
                    </Link>
                    <ul
                      id="vouchers"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        shouldExpandParent("/vouchers") ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Vouchers"
                        submenumodule="Vouchers Data"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <Link
                            to="/vouchers"
                            className={`sidebar-link ${isPathActive("/vouchers") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Vouchers Data
                          </Link>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Wallet */}
                <GateKeeper requiredModule="Wallet" requiredPermission="all">
                  <li className="sidebar-item">
                    <Link
                      className={`sidebar-link has-dropdown ${
                        shouldExpandParent("/wallet") ? "" : "collapsed"
                      }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#wallet"
                      aria-expanded={shouldExpandParent("/wallet")}
                    >
                      <BiWallet className="main_icon" />
                      <span>Wallet</span>
                    </Link>
                    <ul
                      id="wallet"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        shouldExpandParent("/wallet") ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Wallet"
                        submenumodule="Withdrawal Requests"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <Link
                            to="/wallet"
                            className={`sidebar-link ${isPathActive("/wallet") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Withdrawal Requests
                          </Link>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Reports */}
                <GateKeeper requiredModule="Reports" requiredPermission="all">
                  <li className="sidebar-item">
                    <Link
                      className={`sidebar-link has-dropdown ${
                        shouldExpandParent("/reports") ? "" : "collapsed"
                      }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#reports"
                      aria-expanded={shouldExpandParent("/reports")}
                    >
                      <TbMessageReport className="main_icon" />
                      <span>Reports</span>
                    </Link>
                    <ul
                      id="reports"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        shouldExpandParent("/reports") ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Reports"
                        submenumodule="Report Data"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <Link
                            to="/reports/reportsdata"
                            className={`sidebar-link ${isPathActive("/reports/reportsdata") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Reports Data
                          </Link>
                        </li>
                      </GateKeeper>
                    </ul>
                  </li>
                </GateKeeper>

                {/* Exam Management */}
                <GateKeeper requiredModule="Exam Mangement" requiredPermission="all">
                  <li className="sidebar-item">
                    <Link
                      className={`sidebar-link has-dropdown ${
                        shouldExpandParent("/exam", ["/exam/examdetails", "/exam/registrationform"]) ? "" : "collapsed"
                      }`}
                      data-bs-toggle="collapse"
                      data-bs-target="#exammangement"
                      aria-expanded={shouldExpandParent("/exam", ["/exam/examdetails", "/exam/registrationform"])}
                    >
                      <PiStudentFill className="main_icon" />
                      <span>Exam Management</span>
                    </Link>
                    <ul
                      id="exammangement"
                      className={`sidebar-dropdown list-unstyled collapse ${
                        shouldExpandParent("/exam", ["/exam/examdetails", "/exam/registrationform"]) ? "show" : ""
                      }`}
                      data-bs-parent="#sidebar"
                    >
                      <GateKeeper
                        requiredModule="Exam Mangement"
                        submenumodule="Exam Details"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <Link
                            to="/exam/examdetails"
                            className={`sidebar-link ${isPathActive("/exam/examdetails") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Exam
                          </Link>
                        </li>
                      </GateKeeper>

                      <GateKeeper
                        requiredModule="Exam Mangement"
                        submenumodule="Registration Form"
                        submenuReqiredPermission="canRead"
                      >
                        <li className="sidebar-item">
                          <Link
                            to="/exam/registrationform"
                            className={`sidebar-link ${isPathActive("/exam/registrationform") ? "active" : ""}`}
                          >
                            <AiOutlineLine className="sub_icon" />
                            Registration Form
                          </Link>
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
                    <Link
                      className={`sidebar-link ${isPathActive("/tickets/ticketsDashboard") ? "active" : ""}`}
                      to="/tickets/ticketsDashboard"
                    >
                      <FaRegCircleQuestion className="main_icon" />
                      <span className="title_show">Tickets</span>
                    </Link>
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
                    <Link
                      className={`sidebar-link ${isPathActive("/user/list") ? "active" : ""}`}
                      to="/user/list"
                    >
                      <FaRegUserCircle className="main_icon" />
                      <span className="title_show">Users</span>
                    </Link>
                  </li>
                </GateKeeper>

                {/* Settings */}
                <GateKeeper requiredModule="Settings" requiredPermission="all">
                  <li className="sidebar-item">
                    <Link
                      to="/settings"
                      className={`sidebar-link ${isPathActive("/settings") ? "active" : ""}`}
                    >
                      <CiSettings className="main_icon" />
                      <span className="title_show">Settings</span>
                    </Link>
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