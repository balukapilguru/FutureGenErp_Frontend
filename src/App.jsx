// import { Route, Routes, useNavigate } from "react-router-dom";
// import "./App.css";
// import DashboardRoutes from "./routerLayer/dashboard/DashboardRoutes";
// import AuthRoutes from "./routerLayer/auth/AuthRoutes";
// import RequireAuth from "./componentLayer/pages/layout/RequireAuth";
// import PublicLayout from "./componentLayer/pages/layout/PublicLayout";
// import UserRoutes from "./routerLayer/users/UserRoutes";
// import StudentRoutes from "./routerLayer/students/StudentRoutes";
// import BatchManagementRoutes from "./routerLayer/batchmanagement/BatchManagementRoutes";
// import ReportsRoutes from "./routerLayer/reports/ReportsRoutes";
// import SettingsRoutes from "./routerLayer/settings/SettingsRoutes";
// import RouteBlocker from "./rbac/RouteBlocker";
// import { useEffect } from "react";
// import Error from "./componentLayer/pages/Error/Error";
// import UnauthorisedAccess from "./componentLayer/pages/Error/UnauthorisedAccess";
// import UserView from "./componentLayer/pages/users/UserView";
// import { setupInterceptors } from "./serviceLayer/interceptor.jsx";
// import InternalServer from "./componentLayer/pages/Error/InternalServer";
// import LoginTransit from "./componentLayer/pages/auth/LoginTransit";
// import EnrolledStudentsData from "./componentLayer/pages/student/iitGuwautiStudents/EnrolledStudentsData.jsx";

// const App = () => {
//   const navigate = useNavigate();
//   useEffect(() => {
//     setupInterceptors(navigate);
//   }, [navigate]);

//   return (
//     <Routes>
//       <Route element={<RequireAuth />}>
//         <Route path="/user/profileview/:id" element={<UserView />} />

//         <Route path="/*" element={<DashboardRoutes />} />


        

//         <Route
//           path="/user/*"
//           element={
//             <RouteBlocker
//               requiredModule="User Mangement"
//               requiredPermission="all"
//             >
//               <UserRoutes />
//             </RouteBlocker>
//           }
//         />

//         <Route
//           path="/student/*"
//           element={
//             <RouteBlocker
//               requiredModule="Student Management"
//               requiredPermission="all"
//             >
//               <StudentRoutes />
//             </RouteBlocker>
//           }
//         />

//         <Route
//           path="/batchmanagement/*"
//           element={
//             <RouteBlocker
//               requiredModule="Batch Management"
//               requiredPermission="all"
//             >
//               <BatchManagementRoutes />
//             </RouteBlocker>
//           }
//         />

//         <Route
//           path="/reports/*"
//           element={
//             <RouteBlocker requiredModule="Reports" requiredPermission="all">
//               <ReportsRoutes />
//             </RouteBlocker>
//           }
//         />

//         <Route
//           path="/settings/*"
//           element={
//             <RouteBlocker requiredModule="Settings" requiredPermission="all">
//               <SettingsRoutes />
//             </RouteBlocker>
//           }
//         />
//       </Route>

//       <Route element={<PublicLayout />}>
//         <Route path="*" element={<Error />} />
//         <Route path="/500" element={<InternalServer />} />
//         <Route path="/422" element={<UnauthorisedAccess />} />
//         <Route path="/auth/*" element={<AuthRoutes />} />
//         <Route path="/transit/*" element={<LoginTransit />} />
//       </Route>
//     </Routes>
//   );
// };

// export default App;
