import BatchManagement from "../../componentLayer/pages/batchManagement/batchDashboard/BatchManagement";
import Attendances from "../../componentLayer/pages/batchManagement/attendances/Attendances";
import Trainers from "../../componentLayer/pages/batchManagement/trainers/Trainers";
import Batches from "../../componentLayer/pages/batchManagement/batches/Batches";
import AttendanceView from "../../componentLayer/pages/batchManagement/attendances/AttendanceView";
import LaunchBatch from "../../componentLayer/pages/batchManagement/batches/launchBatch/LaunchBatch";
import PlacedStudentList, {
  PlacedStudentListLoader, PlacedStudentListAction
} from "../../componentLayer/pages/batchManagement/placedstudents/PlacedStudentList";
import AddPlacedStudent, {
  addPlacedStudentListLoader,
  addPlacedStudentsAction,
} from "../../componentLayer/pages/batchManagement/placedstudents/AddPlacedStudent";

import RouteBlocker from "../../rbac/RouteBlocker";
import BatchSudentExam, { batchExamStudentLoader } from "../../componentLayer/pages/batchManagement/batches/launchBatch/BatchSudentExam";
import BatchStudentExamResult, { studenExamResultAction, studentExamResultLoader } from "../../componentLayer/pages/batchManagement/batches/launchBatch/BatchStudentExamResult";
import { batchesLoader } from "../../componentLayer/pages/batchManagement/batches/Batches.loader";
import { Batch, handleDeleteBatchByIDAction } from "../../componentLayer/pages/batchManagement/batches/Batch";
import { batchManagementDashboardLoader } from "../../componentLayer/pages/batchManagement/batchDashboard/BatchManagement.loader";
import BatchManagementDashboard from "../../componentLayer/pages/batchManagement/batchDashboard/BatchManagementDashboard";

const BatchManagementRoutes = [
  {
    path: "dashboard",
    element: (
      <RouteBlocker
        requiredModule="Batch Management"
        requiredPermission="all"
      />
    ),
    children: [
      {
        index: true,
      //   element: <BatchManagement />,
      //   loader: batchManagementDashboardLoader
      // },
      // {
      //   path: "managementdashboard",
        element: <BatchManagementDashboard />,
        loader: batchManagementDashboardLoader
      },
    ],
  },

  {
    path: "placedstudents",
    element: (
      <RouteBlocker
        requiredModule="Batch Management"
        requiredPermission="all"
        submenumodule="Placed Students"
        submenuReqiredPermission="canRead"
      />
    ),
    children: [
      {
        index: true,
        element: <PlacedStudentList />,
        loader: PlacedStudentListLoader,
        action: PlacedStudentListAction,
      },
    ],
  },

  {
    path: "placedstudents/addplacedstudents",
    element: (
      <RouteBlocker
        requiredModule="Batch Management"
        requiredPermission="all"
        submenumodule="Placed Students"
        submenuReqiredPermission="canCreate"
      />
    ),
    children: [
      {
        index: true,
        element: <AddPlacedStudent />,
        loader: addPlacedStudentListLoader,
        action: addPlacedStudentsAction,
      },
    ],
  },

  {
    path: "trainer/dashboard",
    element: (
      <RouteBlocker
        requiredModule="Batch Management"
        requiredPermission="all"
      />
    ),
    children: [
      {
        index: true,
        element: <Trainers />,
      },
    ],
  },

  {
    path: "batches/:list",
    element: (
      <RouteBlocker
        requiredModule="Batch Management"
        requiredPermission="all"
        submenumodule={[
          "Batch",
          "Active Batches",
          "Upcoming Batches",
          "Completed Batches",
        ]}
        submenuReqiredPermission="canRead"
      />
    ),
    children: [
      {
        index: true,
      //   element: <Batches />,
      //   loader:batchesLoader,
      // },
      // {
      //   path:"batchview",
        element: <Batch />,
        loader:batchesLoader,
        action:handleDeleteBatchByIDAction
      },
    ],
  },

  {
    path: "attendances",
    element: (
      <RouteBlocker
        requiredModule="Batch Management"
        requiredPermission="all"
        submenumodule="Attendance"
        submenuReqiredPermission="canRead"
      />
    ),
    children: [
      {
        index: true,
        element: <Attendances />,
      },
    ],
  },

  {
    path: ":list/launch/:batchType/:batchId",
    element: (
      <RouteBlocker
        requiredModule="Batch Management"
        requiredPermission="all"
        submenumodule={[
          "Active Batches",
          "Upcoming Batches",
          "Completed Batches",
        ]}
        submenuReqiredPermission="canRead"
      />
    ),
    children: [
      {
        index: true,
        element: <LaunchBatch />,
      },
    ],
  },

  {
    path: "attendanceview",
    element: (
      <RouteBlocker
        requiredModule="Batch Management"
        requiredPermission="all"
        submenumodule="Attendance"
        submenuReqiredPermission="canRead"
      />
    ),
    children: [
      {
        index: true,
        element: <AttendanceView />,
      },
    ],
  },
  {
    path: "batchStudentExam/:batchId/:id",
    element: (
    <RouteBlocker
    requiredModule="Batch Management"
    requiredPermission="all"
    submenumodule="Exam"
    submenuReqiredPermission="canUpdate"
  />
),
  children: [
    {
      index: true,
      element: <BatchSudentExam />,
      loader: batchExamStudentLoader
    },
  ],
  },
  {
    path: "batchStudentExamResult/:batchId/:id",
    element: (
      <RouteBlocker
      requiredModule="Batch Management"
      requiredPermission="all"
      submenumodule="Exam"
      submenuReqiredPermission="canUpdate"
    />
  ),
  children: [
    {
      index: true,
      element: <BatchStudentExamResult />,
      loader: studentExamResultLoader,
      action:studenExamResultAction
    },
  ],
  

  },
];

export default BatchManagementRoutes;

// import { Route, Routes } from "react-router-dom";
// import BatchManagement from "../../componentLayer/pages/batchManagement/batchDashboard/BatchManagement";
// import Attendances from "../../componentLayer/pages/batchManagement/attendances/Attendances";
// import Trainers from "../../componentLayer/pages/batchManagement/trainers/Trainers";
// import Batches from "../../componentLayer/pages/batchManagement/batches/Batches";

// import AttendanceView from "../../componentLayer/pages/batchManagement/attendances/AttendanceView";
// import LaunchBatch from "../../componentLayer/pages/batchManagement/batches/launchBatch/LaunchBatch";
// import RouteBlocker from "../../rbac/RouteBlocker";
// import Error from "../../componentLayer/pages/Error/Error";
// import { useAuthContext } from "../../dataLayer/hooks/useAuthContext";

// function BatchManagementRoutes() {
//   const { AuthState } = useAuthContext();
//   const profile = AuthState?.user?.profile;

//   return (
//     <Routes>
//       <Route path='*' element={<Error />} />

//       {
//         profile && profile !== "Trainer" && (
//           <Route path="/dashboard" element={
//             <RouteBlocker requiredModule="Batch Management" requiredPermission="all">
//               < BatchManagement />
//             </RouteBlocker>
//           } />
//         )
//       }

//       {
//         profile && profile === "Trainer" && (
//           <Route path="/dashboard" element={
//             <RouteBlocker requiredModule="Batch Management" requiredPermission="all">
//               <Trainers />
//             </RouteBlocker>
//           } />

//         )
//       }

//       <Route path="/batches/:list" element={
//         <RouteBlocker
//           requiredModule="Batch Management"
//           requiredPermission="all"
//           submenumodule={["Batch", "Active Batches", "Upcoming Batches", "Completed Batches"]}
//           submenuReqiredPermission="canRead"
//         >
//           <Batches />
//         </RouteBlocker>
//       } />

//       <Route path="/attendances" element={
//         <RouteBlocker
//           requiredModule="Batch Management"
//           requiredPermission="all"
//           submenumodule="Attendance"
//           submenuReqiredPermission="canRead"
//         >
//           <Attendances />
//         </RouteBlocker>
//       } />

//       <Route path="/:list/launch/:batchType/:batchId" element={
//         <RouteBlocker
//           requiredModule="Batch Management"
//           requiredPermission="all"
//           submenumodule={["Active Batches", "Upcoming Batches", "Completed Batches"]}
//           submenuReqiredPermission="canRead"
//         >
//           <LaunchBatch />
//         </RouteBlocker>
//       } />

//       <Route path="/attendanceview" element={
//         <RouteBlocker
//           requiredModule="Batch Management"
//           requiredPermission="all"
//           submenumodule="Attendance"
//           submenuReqiredPermission="canRead"
//         >
//           <AttendanceView />
//         </RouteBlocker>
//       } />

//     </Routes>
//   );
// }
// export default BatchManagementRoutes;
