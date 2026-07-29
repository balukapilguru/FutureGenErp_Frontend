
import Dashboard from "../../componentLayer/pages/dashboard/Dashboard";
import NewDashboard from "../../componentLayer/pages/newDashboard/Dashboard";
import LoadingScreen from "../../componentLayer/components/loadingScreen/LoadingScreen";


const DashboardRoutes = [
  { index: true, element:  <NewDashboard /> },
  // { path: "dashboard", element:  <NewDashboard /> },
  { path: "/loading", element: <LoadingScreen /> },
];


export default DashboardRoutes;



// import { Route, Routes } from "react-router-dom";
// import Dashboard from "../../componentLayer/pages/dashboard/Dashboard";
// import Error from "../../componentLayer/pages/Error/Error";
// import LoadingScreen from "../../componentLayer/components/loadingScreen/LoadingScreen";
// import { useAuthContext } from "../../dataLayer/hooks/useAuthContext";



// function DashboardRoutes() {

//   const { AuthState, DispatchAuth } = useAuthContext();
//   const profile = AuthState?.user?.profile;


//   return (
//     <Routes>
//       <Route path='*' element={<Error />} />

//       {
//         (profile !== "Human Resource" && profile !== "Placement Partner" && profile !== "Trainer" && profile !== "IIT Guwahati" ) && (
//           <Route path="/" element={<Dashboard />} />
//         )
//       }

//       <Route path="/loading" element={<LoadingScreen />} />
//     </Routes>
//   );
// }

// export default DashboardRoutes;
