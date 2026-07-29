import RegistrationForm from "../../componentLayer/pages/student/studentRegistrationForm/RegistrationForm";
import Studentdata from "../../componentLayer/pages/student/enrolledStudentsData/Studentdata";
import Certificate, {
    certificateLoader,
} from "../../componentLayer/pages/student/certificate/Certificate";
import RequestedCertificate, {
    requestCertificateLoader,
} from "../../componentLayer/pages/student/requestedCertificate/RequestedCertificate";
import IssuedCertificates, {
    issuedCerificateAction,
    issuedCertificatesLoader,
} from "../../componentLayer/pages/student/issuedCertificates/IssuedCertificates";
import StudentApplicationPrint, {
    studentApplicationPrintAction,
    studentApplicationPrintLoader,
} from "../../componentLayer/pages/student/enrolledStudentsData/StudentApplicationPrint";
import FeeView from "../../componentLayer/pages/student/feeDetails/FeeView";
import FeeAdminInvoice, {
    FeeAdminInvoiceLoader,
} from "../../componentLayer/pages/student/feeDetails/FeeAdminInvoice";
import RefundData from "../../componentLayer/pages/student/refund/RefundData";
import RefundForm from "../../componentLayer/pages/student/refund/RefundForm";
import StudentIdCard, {
    studentIdCardLoader,
} from "../../componentLayer/pages/student/enrolledStudentsData/StudentIdCard";
import EditStudent from "../../componentLayer/pages/student/enrolledStudentsData/EditStudent";
import CertificatePrint, {
    certificatePrintLoader,
} from "../../componentLayer/pages/student/certificate/CertificatePrint";
import RouteBlocker from "../../rbac/RouteBlocker";
import StudentManagementDasboard from "../../componentLayer/pages/student/dashboard/StudentManagementDasboard";
import RefundView from "../../componentLayer/pages/student/refund/RefundView";

import IntrernshipCertificate, {
    intrernshipCertificateLoader,
} from "../../componentLayer/pages/student/certificate/IntrernshipCertificate";
import IEPCertificate, {
    iepCertificateLoader,
} from "../../componentLayer/pages/student/certificate/IEPCertificate";
import CertificateIssueForm from "../../componentLayer/pages/student/certificate/CertificateIssueForm";
import EnrolledStudentsData, {
    pgCertificationDataLoader,
} from "../../componentLayer/pages/student/iitGuwautiStudents/EnrolledStudentsData";

import FeeViewAndUpdate, {
    FeeViewAndUpdateAction,
    FeeViewAndUpdateLoader,
} from "../../componentLayer/pages/student/feeDetails/FeeViewAndUpdate";

import FeeRecordsTabs from "../../componentLayer/pages/student/studentFeeDetails/FeeRecordsTabs";
import FeeRecordsList, {
    FeeRecordsListLoader,
} from "../../componentLayer/pages/student/studentFeeDetails/feeRecords/FeeRecordsList";
import NoDueFeeRecordsList, {
    NoDueRecordsListLoader,
} from "../../componentLayer/pages/student/studentFeeDetails/noDueRecords/NoDueFeeRecordsList";
import Installment, {
    studentApproveAction,
    studentInstallmentLoader,
} from "../../componentLayer/pages/student/installment/Installment";
import OverDueFeeRecordsList, {
    OverDueFeeRecordsListAction,
    OverDueFeeRecordsListLoader,
} from "../../componentLayer/pages/student/studentFeeDetails/feeFollowUps/OverDueFeeRecordsList";
import TodayFeeRecordsList, {
    TodayFeeRecordsListLoader,
} from "../../componentLayer/pages/student/studentFeeDetails/feeFollowUps/TodayFeeRecordsList";
import UpcomingFeeRecordsList, {
    UpcomingFeeRecordsListLoader,
} from "../../componentLayer/pages/student/studentFeeDetails/feeFollowUps/UpcomingFeeRecordsList";
import FeeFollowUpsTabs, {
    FeeFollowUpsLoader,
} from "../../componentLayer/pages/student/studentFeeDetails/feeFollowUps/FeeFollowUpsTabs";
import StudentViewTabs from "../../componentLayer/pages/student/enrolledStudentsData/studentview/StudentViewTabs";
import StudentView, {
    StudentViewLoader,
} from "../../componentLayer/pages/student/enrolledStudentsData/studentview/StudentView";
import StudentRemarks, {
    StudentRemarksLoader,
} from "../../componentLayer/pages/student/enrolledStudentsData/studentview/StudentRemarks";
import StudentActivity, {
    StudentActivityLoader,
} from "../../componentLayer/pages/student/enrolledStudentsData/studentview/StudentActivity";
import Feedback, {
    feedbackLoader,
} from "../../componentLayer/pages/student/feedback/Feedback";
import StudentRegistrationFrom
    from "../../componentLayer/pages/student/studentRegistrationForm/StudentRegistrationFrom";
import PreOnBoardingRegistrationForm
    from "../../componentLayer/pages/student/studentRegistrationForm/PreOnBoardingRegistrationForm";
import {
    StudentRegistrationFromLoader
} from "../../componentLayer/pages/student/studentRegistrationForm/StudentRegistrationFromLoader";
import {
    StudentRegistrationFromAction
} from "../../componentLayer/pages/student/studentRegistrationForm/StudentRegistrationFromAction";
import EnrolledStudents from "../../componentLayer/pages/student/enrolledStudentsData/EnrolledStudents";
import {
    AbroadstudentsLoader,
    EditStudentLoader,
    EnrolledStudentsLoader,
} from "../../componentLayer/pages/student/enrolledStudentsData/StudentData.loader";
import {StudentDataAction} from "../../componentLayer/pages/student/enrolledStudentsData/StudentData.action";
import {createCertificateLoader} from "../../componentLayer/pages/student/certificate/Certificate.loader";
import OverDueFeeRecordInstallmentsNotes, {
    NotesByInstallmentsLoader,
} from "../../componentLayer/pages/student/studentFeeDetails/feeFollowUps/OverDueFeeRecordInstallmentsNotes";
import Dashboard from "../../componentLayer/pages/newDashboard/Dashboard";
import {PreOnboardingLoader} from "../../componentLayer/pages/student/studentRegistrationForm/PreOnBoarding.loader";
import {
    preOnBoardAdmissionAction
} from "../../componentLayer/pages/student/studentRegistrationForm/preOnBoardingFromComponents/PreOnBoard.action";
import Abroadstudents from "../../componentLayer/pages/student/enrolledStudentsData/Abroadstudents";
import StudentAttendedJobs
    , {
    studentAttendedJobLoader
} from "../../componentLayer/pages/student/enrolledStudentsData/studentview/StudentAttendedJobs.jsx";

const StudentRoutes = [
    //  This Dashboard need not access to IIT Guwati

    {
        path: "enrollment",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Enrolled Students"
                submenuReqiredPermission="canCreate"
            />
        ),
        children: [
            {
                index: true,
                element: <StudentRegistrationFrom/>,
                loader: StudentRegistrationFromLoader,
                action: StudentRegistrationFromAction,
            },
            {
                path: ":studentId",
                element: <PreOnBoardingRegistrationForm/>,
                loader: PreOnboardingLoader,
                action: preOnBoardAdmissionAction,
            },
        ],
    },

    {
        path: "dashboard",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
            />
        ),
        children: [{index: true, element: <Dashboard/>}],
    },

    {
        path: "views",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Enrolled Students"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                element: <StudentViewTabs/>,
                children: [
                    {
                        index: true,
                        element: <StudentView/>,
                        loader: StudentViewLoader,
                    },
                    {
                        path: "remarks",
                        element: <StudentRemarks/>,
                        loader: StudentRemarksLoader,
                    },
                    {
                        path: "activity",
                        element: <StudentActivity/>,
                        loader: StudentActivityLoader,
                    },
                    {
                        path: "jobs-attended/:registrationNumber",
                        element: <StudentAttendedJobs/>,
                        loader: studentAttendedJobLoader,
                    },
                ],
            },
        ],
    },

    {
        path: "feedetails",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Fee Details"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                element: <FeeRecordsTabs/>,
                children: [
                    {
                        path: "list",
                        element: <FeeRecordsList/>,
                        loader: FeeRecordsListLoader,
                    },
                    {
                        path: "noduelist",
                        element: <NoDueFeeRecordsList/>,
                        loader: NoDueRecordsListLoader,
                    },
                ],
            },
        ],
    },

    {
        path: "feefollowUps",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Fee Details"
                submenuReqiredPermission="canRead"
            />
        ),

        children: [
            {
                loader: FeeFollowUpsLoader,
                element: <FeeFollowUpsTabs/>,
                children: [
                    {
                        id: "todayFeeRecords",
                        path: "today/list",
                        element: <TodayFeeRecordsList/>,
                        loader: TodayFeeRecordsListLoader,
                    },
                    {
                        id: "upcomingFeeRecords",
                        path: "upcoming/list",
                        element: <UpcomingFeeRecordsList/>,
                        loader: UpcomingFeeRecordsListLoader,
                    },
                    {
                        id: "overdueFeeRecords",
                        path: "overdue/list",
                        element: <OverDueFeeRecordsList/>,
                        loader: OverDueFeeRecordsListLoader,
                        action: OverDueFeeRecordsListAction,
                    },
                ],
            },
            {
                path: "overdue/followupaction/:installmentId",
                element: <OverDueFeeRecordInstallmentsNotes/>,
                loader: NotesByInstallmentsLoader,
                action: OverDueFeeRecordsListAction,
            },
        ],
    },

    {
        path: "feeUpdate",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Fee Details"
                submenuReqiredPermission="canUpdate"
            />
        ),
        children: [
            {
                index: true,
                element: <FeeViewAndUpdate/>,
                loader: FeeViewAndUpdateLoader,
                action: FeeViewAndUpdateAction,
            },
        ],
    },

    {
        path: "certificateissueform/:status/:id",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Certificate"
                submenuReqiredPermission="canUpdate"
            />
        ),
        children: [
            {
                index: true,
                element: <CertificateIssueForm/>,
                loader: createCertificateLoader,
            },
        ],
    },

    {
        path: "certificateissueform",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Certificate"
                submenuReqiredPermission="canCreate"
            />
        ),
        children: [
            {
                index: true,
                element: <CertificateIssueForm/>,
                loader: createCertificateLoader,
            },
        ],
    },

    {
        path: "new",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Enrolled Students"
                submenuReqiredPermission="canCreate"
            />
        ),
        children: [{index: true, element: <RegistrationForm/>}],
    },

    {
        path: "list",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Enrolled Students"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                //   element: <Studentdata />
                // },
                // {
                //   path: "enrolled-students",
                element: <EnrolledStudents/>,
                loader: EnrolledStudentsLoader,
                action: StudentDataAction,
            },
        ],
    },

    {
        path: "cerficationlist",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="PG Certification"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <EnrolledStudentsData/>,
                loader: pgCertificationDataLoader,
            },
        ],
    },

    {
        path: "installment",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Installment"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <Installment/>,
                loader: studentInstallmentLoader,
                action: studentApproveAction,
            },
        ],
    },

    {
        path: "applicationprint/:id",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Enrolled Students"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <StudentApplicationPrint/>,
                loader: studentApplicationPrintLoader,
                action: studentApplicationPrintAction,
            },
        ],
    },

    {
        path: "studentidcard/:id",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Enrolled Students"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {index: true, element: <StudentIdCard/>, loader: studentIdCardLoader},
        ],
    },

    {
        path: "feeview/:id",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Fee Details"
                submenuReqiredPermission="canUpdate"
            />
        ),
        children: [{index: true, element: <FeeView/>}],
    },
    {
        path: "editstudent/:id",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Enrolled Students"
                submenuReqiredPermission="canUpdate"
            />
        ),
        children: [
            {index: true, element: <EditStudent/>, loader: EditStudentLoader},
        ],
    },
    {
        path: "certificate",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Certificate"
                submenuReqiredPermission="canRead"
            />
        ),

        children: [
            {
                index: true,
                element: <Certificate/>,
                loader: certificateLoader,
            },
        ],
    },

    {
        path: "requestedcertificate",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Requested Certificate"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <RequestedCertificate/>,
                loader: requestCertificateLoader,
            },
        ],
    },
    {
        path: "feedback",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="feedback"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <Feedback/>,
                loader: feedbackLoader,
            },
        ],
    },

    {
        path: "issuedcertificates",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Issued Certificate"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <IssuedCertificates/>,
                loader: issuedCertificatesLoader,
                action: issuedCerificateAction,
            },
        ],
    },

    {
        path: "invoice/:id/:index/:name/:nametype",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Fee Details"
                submenuReqiredPermission="canRead"
            />
        ),

        children: [
            {
                index: true,
                element: <FeeAdminInvoice/>,
                loader: FeeAdminInvoiceLoader,
            },
        ],
    },

    {
        path: "invoice/:id/:index/:name/:nametype",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule={["Fee Details", "Enrolled Students"]}
                submenuReqiredPermission="canRead"
            />
        ),

        children: [
            {
                index: true,
                element: <FeeAdminInvoice/>,
                loader: FeeAdminInvoiceLoader,
            },
        ],
    },

    {
        path: "certificateprint/:id",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Certificate"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <CertificatePrint/>,
                loader: certificatePrintLoader,
            },
        ],
    },

    {
        path: "internshipcertificate/:id",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Certificate"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <IntrernshipCertificate/>,
                loader: intrernshipCertificateLoader,
            },
        ],
    },

    {
        path: "iepcertificate/:id",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Certificate"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <IEPCertificate/>,
                loader: iepCertificateLoader,
            },
        ],
    },

    //  Refund
    {
        path: "refundview/:id",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="refund"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [{index: true, element: <RefundView/>}],
    },

    {
        path: "refunddata",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="refund"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [{index: true, element: <RefundData/>}],
    },

    {
        path: "refundform",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="refund"
                submenuReqiredermission="canCreate"
            />
        ),
        children: [{index: true, element: <RefundForm/>}],
    },

    {
        path: "abroadstudents",
        element: (
            <RouteBlocker
                requiredModule="Student Management"
                requiredPermission="all"
                submenumodule="Abroad Study"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <Abroadstudents/>,
                loader: AbroadstudentsLoader,
            },
        ],
    },
];

export default StudentRoutes;

// import React, { Suspense, lazy } from "react";
// import { Route, Routes } from "react-router-dom";
// import RegistrationForm from "../../componentLayer/pages/student/studentRegistrationForm/RegistrationForm";
// import Studentdata from "../../componentLayer/pages/student/enrolledStudentsData/Studentdata";
// import Certificate from "../../componentLayer/pages/student/certificate/Certificate";
// import RequestedCertificate from "../../componentLayer/pages/student/requestedCertificate/RequestedCertificate";
// import IssuedCertificates from "../../componentLayer/pages/student/issuedCertificates/IssuedCertificates";
// import StudentApplicationPrint from "../../componentLayer/pages/student/enrolledStudentsData/StudentApplicationPrint";

// import FeeView from "../../componentLayer/pages/student/feeDetails/FeeView";

// import FeeAdminInvoice from "../../componentLayer/pages/student/feeDetails/FeeAdminInvoice";
// import RefundData from "../../componentLayer/pages/student/refund/RefundData";
// import RefundForm from "../../componentLayer/pages/student/refund/RefundForm";
// import StudentIdCard from "../../componentLayer/pages/student/enrolledStudentsData/StudentIdCard";
// import EditStudent from "../../componentLayer/pages/student/enrolledStudentsData/EditStudent";
// import CertificatePrint from "../../componentLayer/pages/student/certificate/CertificatePrint";
// import RouteBlocker from "../../rbac/RouteBlocker";
// import Error from "../../componentLayer/pages/Error/Error";
// import BulkFeeInvoice from "../../componentLayer/pages/student/feeDetails/BulkFeeInvoice";
// import Dashboard from "../../componentLayer/pages/dashboard/Dashboard";
// import StudentManagementDasboard from "../../componentLayer/pages/student/dashboard/StudentManagementDasboard";
// import RefundView from "../../componentLayer/pages/student/refund/RefundView";
// import IntrernshipCertificate from "../../componentLayer/pages/student/certificate/IntrernshipCertificate";
// import IEPCertificate from "../../componentLayer/pages/student/certificate/IEPCertificate";
// import CertificateIssueForm from "../../componentLayer/pages/student/certificate/CertificateIssueForm";
// import EnrolledStudentsData from "../../componentLayer/pages/student/iitGuwautiStudents/EnrolledStudentsData";
// import { useAuthContext } from "../../dataLayer/hooks/useAuthContext";

// const StudentRoutes = () => {

//     const { AuthState } = useAuthContext();
//     const profile = AuthState?.user?.profile;
//   return (
//     <Routes>
//       <Route path="*" element={<Error />} />
//       {
//         ( profile !== "IIT Guwahati") && (
//           <Route path="/dashboard" element={<StudentManagementDasboard />} />
//         )
//       }

//       <Route
//         path="/certificateissueform/:status/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Certificate"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CertificateIssueForm />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/certificateissueform/"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Certificate"
//             submenuReqiredPermission="canCreate"
//           >
//             <CertificateIssueForm />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/new"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Enrolled Students"
//             submenuReqiredPermission="canCreate"
//           >
//             <RegistrationForm />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/list"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Enrolled Students"
//             submenuReqiredPermission="canRead"
//           >
//             <Studentdata />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/cerficationlist"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="PG Certification"
//             submenuReqiredPermission="canRead"
//           >
//             <EnrolledStudentsData />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/applicationprint/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Enrolled Students"
//             submenuReqiredPermission="canRead"
//           >
//             <StudentApplicationPrint />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/studentidcard/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Enrolled Students"
//             submenuReqiredPermission="canRead"
//           >
//             <StudentIdCard />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/feeview/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Fee Details"
//             submenuReqiredPermission="canUpdate"
//           >
//             <FeeView />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/editstudent/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Enrolled Students"
//             submenuReqiredPermission="canUpdate"
//           >
//             <EditStudent />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/certificate"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Certificate"
//             submenuReqiredPermission="canRead"
//           >
//             <Certificate />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/requestedcertificate"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Requested Certificate"
//             submenuReqiredPermission="canRead"
//           >
//             <RequestedCertificate />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/issuedcertificates"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Issued Certificate"
//             submenuReqiredPermission="canRead"
//           >
//             <IssuedCertificates />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/refunddata"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="refund"
//             submenuReqiredPermission="canRead"
//           >
//             <RefundData />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/refundform"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="refund"
//             submenuReqiredPermission="canCreate"
//           >
//             <RefundForm />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/invoice/:id/:index/:name/:nametype"
//         element={<FeeAdminInvoice />}
//       />
//       {/* <Route path="/invoice/:id/:index/:name/:nametype" element={
//         <BulkFeeInvoice />
//       } /> */}

//       <Route
//         path="/certificateprint/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Certificate"
//             submenuReqiredPermission="canRead"
//           >
//             <CertificatePrint />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/internshipcertificate/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Certificate"
//             submenuReqiredPermission="canRead"
//           >
//             <IntrernshipCertificate />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/iepcertificate/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="Certificate"
//             submenuReqiredPermission="canRead"
//           >
//             <IEPCertificate />
//           </RouteBlocker>
//         }
//       />

//       {/* Refund */}

//       <Route
//         path="/refundform"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="refund"
//             submenuReqiredPermission="canCreate"
//           >
//             <RefundForm />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/refunddata"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="refund"
//             submenuReqiredPermission="canRead"
//           >
//             <RefundData />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/refundview/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Student Management"
//             requiredPermission="all"
//             submenumodule="refund"
//             submenuReqiredPermission="canRead"
//           >
//             <RefundView />
//           </RouteBlocker>
//         }
//       />
//     </Routes>
//   );
// };

// export default StudentRoutes;
