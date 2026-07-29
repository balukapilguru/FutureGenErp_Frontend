
import AddCustomRegistrationForm, { addCustomQuestionsAction, addCustomRegistrationFormLoader } from "../../componentLayer/pages/exams/AddCustomRegistrationForm";
import AddQuestions, { addQuestionsAction, examDataByIdLoader } from "../../componentLayer/pages/exams/AddQuestions";
import CreateExam, { addExamAction } from "../../componentLayer/pages/exams/CreateExam";
import CreateRegistrationForm, { addRegistrationFormAction, registerFormGetLoader } from "../../componentLayer/pages/exams/CreateRegistrationForm";
import ExamPaperView, { ExamPaperViewLoader } from "../../componentLayer/pages/exams/ExamPaperView";
import Exams, { examDataLoader, examDeleteAction } from "../../componentLayer/pages/exams/Exams";
import ExternalStudentExam, { externalExamResultAction, externalExamResultLoader } from "../../componentLayer/pages/exams/ExternalStudentExam";
import RegistrationForm, { registrationFormAction, registrationFormLoader } from "../../componentLayer/pages/exams/RegistrationForm";
import StudentDataView, { studentExamDataLoader } from "../../componentLayer/pages/exams/StudentDataView";

import RouteBlocker from "../../rbac/RouteBlocker";

const TicketsRoute = [
    {
        path: "examDetails",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Exam Details"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <Exams />,
                loader: examDataLoader,
                action: examDeleteAction
            },
        ],
    },
    {
        path: "createExam",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Exam Details"
                submenuReqiredPermission="canCreate"
            />
        ),
        children: [
            {
                index: true,
                element: <CreateExam />,
                action: addExamAction
            },
        ],
    },
    {
        path: "createExam/:id",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Exam Details"
                submenuReqiredPermission="canUpdate"
            />
        ),
        children: [
            {
                index: true,
                element: <CreateExam />,
                loader: examDataByIdLoader,
                action: addExamAction
            },
        ],
    },
    {
        path: "addquestion/:id",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Exam Details"
                submenuReqiredPermission="canCreate"
            />
        ),
        children: [
            {
                index: true,
                element: <AddQuestions />,
                loader: examDataByIdLoader,
                action: addQuestionsAction
            },
        ],
    },
    {
        path: "view/:id",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Exam Details"
                submenuReqiredPermission="canUpdate"
            />
        ),
        children: [
            {
                index: true,
                element: <ExamPaperView />,
                loader: ExamPaperViewLoader,
                // action : addQuestionsAction
            },
        ],
    },
    {
        path: "registrationform",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <RegistrationForm />,
                loader: registrationFormLoader,
                action: registrationFormAction
            },
        ],
    },
    {
        path: "createRegistrationForm",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canCreate"
            />
        ),
        children: [
            {
                index: true,
                element: <CreateRegistrationForm />,
                loader: registerFormGetLoader,
                action: addRegistrationFormAction
            },
        ],
    },

    {
        path: "createRegistrationForm/:id",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <CreateRegistrationForm />,
                loader: registerFormGetLoader,
                action: addRegistrationFormAction
            },
        ],
    },
    {
        path: "studentDataView/:id",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <StudentDataView />,
                loader: studentExamDataLoader,
            },
           
        ],
    },
    {
        path: "studentanswersheet/:id",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canUpdate"
            />
        ),
        children: [
            {
                index: true,
                element: <ExternalStudentExam />,
                loader: externalExamResultLoader,
                action: externalExamResultAction
            },
           
        ],
    },
    {
        path: "customRegistrationfrom",
        element: (
            <RouteBlocker
                requiredModule="Exam Mangement"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <AddCustomRegistrationForm />,
                loader: addCustomRegistrationFormLoader,
                action: addCustomQuestionsAction
            },
           
        ],
    },
];

export default TicketsRoute;

