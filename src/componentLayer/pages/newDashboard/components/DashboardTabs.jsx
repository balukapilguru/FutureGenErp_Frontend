import { FaWpforms, FaIndianRupeeSign, FaUsers } from "react-icons/fa6";
import { TbMoneybag } from "react-icons/tb";
import GateKeeper from "../../../../rbac/GateKeeper";
import DashboardCard from "./DashboardCard";

const DashboardTabs = ({ activeTabs, handleTabs, staticDashboardData }) => {
  const tabs = [
    {
      id: "TotalEnrollments",
      requiredModule: "Student Management",
      submenumodule: "Enrolled Students",
      submenuReqiredPermission: "canRead",
      title: "Total Enrollments",
      linkText: "View Enrollments",
      iconBg: "bg-success-subtle",
      icon: <FaWpforms className="text-success fs-20" />,
      apiKey: "totalEnrollments",
    },
    {
      id: "FeeDetails",
      requiredModule: "Student Management",
      submenumodule: "Fee Details",
      submenuReqiredPermission: "canRead",
      title: "Fee Details",
      linkText: "With GST:",
      iconBg: "bg-info-subtle",
      icon: <FaIndianRupeeSign className="light-blue-color fs-20" />,
      apiKey: "withoutGstCurrentFeeReceived",
      withGstKey: "currentFeeReceived",
      showRupee: true,
    },
    {
      id: "TodayFeeReceived",
      requiredModule: "Student Management",
      submenumodule: "Fee Details",
      submenuReqiredPermission: "canRead",
      title: "Today Fee Received",
      linkText: "View Fee Received",
      iconBg: "bg-info-subtle",
      icon: <FaIndianRupeeSign className="light-blue-color fs-20" />,
      apiKey: "todayOverallFeeReceived",
      showRupee: true,
    },
    {
      id: "Today Enrollments",   // 👈 Already exists
      requiredModule: "Student Management",
      submenumodule: "Enrolled Students",
      submenuReqiredPermission: "canRead",
      title: "Today Enrollments",
      linkText: "View Enrollments",
      iconBg: "bg-info-subtle",
      icon: <FaWpforms className="text-success fs-20" />,
      apiKey: "todayEnrollments",   // 👈 State key
    },
    {
      id: "FeeFollowUps",
      requiredModule: "Student Management",
      submenumodule: "Fee Details",
      submenuReqiredPermission: "canRead",
      title: "Fee FollowUps",
      linkText: "View Fee FollowUps",
      linkTo: "/student/feefollowUps/today/list?search=&page=1&pageSize=10",
      iconBg: "bg-warning-subtle",
      icon: <TbMoneybag className="text_yellow fs-20" />,
      apiKey: "currentFeeYetToReceived",
      showRupee: true,
    },
    {
      id: "TotalUsers",
      requiredModule: "User Mangement",
      requiredPermission: "all",
      submenumodule: "User Details",
      submenuReqiredPermission: "canRead",
      title: "Total Users",
      linkText: "Live",
      iconBg: "bg-primary-subtle",
      icon: <FaUsers className="dwnld_icon fs-18" />,
      apiKey: "totalUsers",
      liveKey: "liveUsers",
    },
  ];

  return (
    <ul
      className="row nav mb-3 nav-tabs nav-justified mb-3 nav-fill"
      id="pills-tab"
      role="tablist"
    >
      {tabs.map((tab) => (
        <GateKeeper
          key={tab.id}
          requiredModule={tab.requiredModule}
          requiredPermission={tab.requiredPermission}
          submenumodule={tab.submenumodule}
          submenuReqiredPermission={tab.submenuReqiredPermission}
        >
          <li
            className={`col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2 ${
              tab.id === "TotalUsers" ? "user-column" : ""
            }`}
            role="presentation"
          >
            <DashboardCard
              tab={tab}
              active={activeTabs[tab.id]}
              handleTabs={handleTabs}
              value={staticDashboardData[tab.apiKey]}
              withGstValue={staticDashboardData[tab.withGstKey]}
              liveCount={staticDashboardData[tab.liveKey]}
            />
          </li>
        </GateKeeper>
      ))}
    </ul>
  );
};

export default DashboardTabs;