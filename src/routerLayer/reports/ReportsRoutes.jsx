
import ReportsData from "../../componentLayer/pages/reports/ReportsData"
import CreateReport from '../../componentLayer/pages/reports/CreateReport';
import ReportsView from '../../componentLayer/pages/reports/ReportsView';
import RouteBlocker from '../../rbac/RouteBlocker';
import ReportData from "../../componentLayer/pages/reports/ReportData";
import { reportDataLoader } from "../../componentLayer/pages/reports/Reports.loader";
import { reportDataAction } from "../../componentLayer/pages/reports/Report.action";
import ReportView, { viewReportLoader } from "../../componentLayer/pages/reports/ReportView";


const ReportsRoutes = [

    {
        path: "reportsdata",
        element: (
            <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canRead" />
        ),
        children: [
            {
                index: true,
                //     element: <ReportsData />
                // },
                // {
                //     path: "reportsData",
                element: <ReportData />,
                loader: reportDataLoader,
                action: reportDataAction
            },
        ],
    },
    {
        path: "createreport",
        element: (
            <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canCreate" />
        ),
        children: [{ index: true, element: <CreateReport /> }],
    },

    {
        path: "reportview/:id",
        element: (
            <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canUpdate" />
        ),
        children: [
            {
                index: true,
            //     element: <ReportsView />

            // },
            // {
            //     path: "report",
                element: <ReportView />,
                loader: viewReportLoader

            }
        ],
    },
];



export default ReportsRoutes;


// import { Route, Routes } from 'react-router-dom';
// import ReportsData from "../../componentLayer/pages/reports/ReportsData"
// import CreateReport from '../../componentLayer/pages/reports/CreateReport';
// import ReportsView from '../../componentLayer/pages/reports/ReportsView';
// import Error from '../../componentLayer/pages/Error/Error';
// import RouteBlocker from '../../rbac/RouteBlocker';

// function ReportsRoutes() {
//     return (
//         <Routes>
//             <Route path='*' element={<Error />} />

//             <Route path="/reportsdata" element={
//                 <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canRead">
//                     <ReportsData />
//                 </RouteBlocker>
//             } />

//             <Route path="/createreport" element={
//                 <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canCreate">
//                     <CreateReport />
//                 </RouteBlocker>
//             } />

//             <Route path="/reportview/:id" element={
//                 <RouteBlocker requiredModule="Reports" requiredPermission="all" submenumodule="Report Data" submenuReqiredPermission="canUpdate">
//                     <ReportsView />
//                 </RouteBlocker>} />
//         </Routes>
//     );
// }

// export default ReportsRoutes;