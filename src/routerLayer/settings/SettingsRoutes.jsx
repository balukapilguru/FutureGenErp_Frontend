
import OrganizationProfile from "../../componentLayer/pages/settings/organizationProfile/OrganizationProfile";
import SettingsTabs from "../../componentLayer/pages/settings/SettingsTabs";
import AdmissionFee from "../../componentLayer/pages/settings/admissionfee/AdmissionFee";
import Branch from "../../componentLayer/pages/settings/branch/Branch";
import CoursePackage from "../../componentLayer/pages/settings/coursePackage/CoursePackage";
import Course from "../../componentLayer/pages/settings/courses/Course";
import Departments from "../../componentLayer/pages/settings/departments/Department";
import Roles, { RoleAction } from "../../componentLayer/pages/settings/roles/Roles";
import LeadSource from "../../componentLayer/pages/settings/leadsource/LeadSource";
import { CreateRole } from "../../componentLayer/pages/settings/roles/CreateRole";
import CreateBranch from "../../componentLayer/pages/settings/branch/CreateBranch";
import CreateLeadSource from "../../componentLayer/pages/settings/leadsource/CreateLeadSource";
import CreateCoursePackage from "../../componentLayer/pages/settings/coursePackage/CreateCoursePackage";
import CreateCourse from "../../componentLayer/pages/settings/courses/CreateCourse";
import CreateAdmissionFee from "../../componentLayer/pages/settings/admissionfee/CreateAdmissionFee";
import CreateDepartment from "../../componentLayer/pages/settings/departments/CreateDepartment";
import RouteBlocker from "../../rbac/RouteBlocker";
import Curriculum from "../../componentLayer/pages/settings/curriculum/Curriculum";
import AddCurriculum from "../../componentLayer/pages/settings/courses/AddCurriculum";
import { BranchFromAction, BranchListAction } from "../../componentLayer/pages/settings/branch/Branch.Action";
import { branchFromLoader, branchListLoader } from "../../componentLayer/pages/settings/branch/Branch.Loader";
import BankDetails from "../../componentLayer/pages/settings/bankDetails/BankDetails";
import CreateBankDetails from "../../componentLayer/pages/settings/bankDetails/CreateBankDetails";
import { bankDetailsLoader, bankDetailsLoaderById } from "../../componentLayer/pages/settings/bankDetails/BankLoader";
import { bankDetailsAction, bankDetailsDeleteAction } from "../../componentLayer/pages/settings/bankDetails/BankAction";
import Tickets from "../../componentLayer/pages/settings/tickets/Tickets";
import { coursePackageByidLoader, coursePackageLoader } from "../../componentLayer/pages/settings/coursePackage/CoursePackage.loader";
import { coursePackageAction, createCoursePackageAction } from "../../componentLayer/pages/settings/coursePackage/CoursePackage.action";
import { addCurriculum, curriculumLoader,mediaLoader } from "../../componentLayer/pages/settings/curriculum/Curriculum.loader";
import Curriculums from "../../componentLayer/pages/settings/curriculum/Curriculums";
import { curriculumAction } from "../../componentLayer/pages/settings/curriculum/curriculum_sub_components/Curriculum.action";
import { CourseLoader, createCourseLoader } from "../../componentLayer/pages/settings/courses/Course.loader";
import { courseAction, createCourseAction } from "../../componentLayer/pages/settings/courses/Course.action";
import { departmentCreateLoader, departmentLoader } from "../../componentLayer/pages/settings/departments/Department.loader";
import { departmentAction, departmentCreateEditAction } from "../../componentLayer/pages/settings/departments/Department.action";
import { LeadSourceCreateEditLoader, LeadSourceLoader } from "../../componentLayer/pages/settings/leadsource/LeadSource.loader";
import { leadSourceAction, LeadSourceCreateEditAction } from "../../componentLayer/pages/settings/leadsource/LeadSource.action";
import { RolesListLoader } from "../../componentLayer/pages/settings/roles/Roles.loader";
import Entity from "../../componentLayer/pages/settings/Entities/Entity";
import CreateEntity from "../../componentLayer/pages/settings/Entities/CreateEntity";
import { EntityLoader, updateEntityLoader } from "../../componentLayer/pages/settings/Entities/Entity.loader";
import { createEntityAction, updateEntityAction } from "../../componentLayer/pages/settings/Entities/Entity.actions";
import EntityBranch from "../../componentLayer/pages/settings/Entities/entityBranch/EntityBranch";
import { createEntityBranchLoader, EntityBranchLoader, updateEntityBranchLoader } from "../../componentLayer/pages/settings/Entities/entityBranch/EntityBranch.loader";
import CreateEntityBranch from "../../componentLayer/pages/settings/Entities/entityBranch/CreateEntityBranch";
import { createEntityBranch, updateEntityBranchAction } from "../../componentLayer/pages/settings/Entities/entityBranch/EntityBranch.action";
import EntityUsers from "../../componentLayer/pages/settings/Entities/entityUsers/EntityUsers";
import { createEntityUserLoader, EntityUserLoader, updateEntityUserLoader } from "../../componentLayer/pages/settings/Entities/entityUsers/EntityUser.loader";
import CreateEntityUsers from "../../componentLayer/pages/settings/Entities/entityUsers/CreateEntityUsers";
import { createEntityUserAction, updateEntityUserAction } from "../../componentLayer/pages/settings/Entities/entityUsers/EntityUsers.action";
import AddMediaForTopic from '../../../src/componentLayer/pages/settings/curriculum/modules_topic_media/AddMediaForTopic'
import { mediaAction } from "../../componentLayer/pages/settings/curriculum/modules_topic_media/AddMediaForTopic.action";

const SettingsRoutes = [
  {
    index: true,
    element: <SettingsTabs />,
  },

  {
    path: "roles/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Roles" submenuReqiredPermission="canCreate" />,
    children: [{ index: true, element: <CreateRole /> }],
  },

  {
    path: "roles",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Roles" submenuReqiredPermission="canRead" />,
    children: [{ index: true, element: <Roles />, loader: RolesListLoader, action: RoleAction }],
  },

  {
    path: "roles/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Roles" submenuReqiredPermission="canUpdate" />,
    children: [{ index: true, element: <CreateRole /> }],
  },

  {
    path: "branch",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Branch" submenuReqiredPermission="canRead" />,
    children: [{
      index: true,
      element: <Branch />,
      loader: branchListLoader,
      action: BranchListAction,
    }],
  },

  {
    path: "branch/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Branch" submenuReqiredPermission="canCreate" />,
    children: [{
      index: true,
      element: <CreateBranch />,
      action: BranchFromAction,
      loader: branchFromLoader
    }],
  },

  {
    path: "branch/edit",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Branch" submenuReqiredPermission="canUpdate" />,
    children: [{
      index: true,
      element: <CreateBranch />,
      loader: branchFromLoader,
      action: BranchFromAction,
    }],
  },

  {
    path: "coursePackage",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Course Package" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <CoursePackage />,
        loader: coursePackageLoader,
        action: coursePackageAction
      }
    ],
  },

  {
    path: "coursePackage/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Course Package" submenuReqiredPermission="canCreate" />,
    children: [
      {
        index: true,
        element: <CreateCoursePackage />,
        action: createCoursePackageAction
      }

    ],
  },

  {
    path: "coursePackage/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Course Package" submenuReqiredPermission="canUpdate" />,
    children: [
      {
        index: true,
        element: <CreateCoursePackage />,
        loader: coursePackageByidLoader,
        action: createCoursePackageAction
      }
    ],
  },


  {
    path: "courses",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Courses" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <Course />,
        loader: CourseLoader,
        action: courseAction
      }
    ],
  },

  {
    path: "courses/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Courses" submenuReqiredPermission="canCreate" />,
    children: [
      {
        index: true,
        element: <CreateCourse />,
        loader: createCourseLoader,
        action: createCourseAction
      }

    ],
  },

  {
    path: "courses/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Courses" submenuReqiredPermission="canUpdate" />,
    children: [
      {
        index: true,
        element: <CreateCourse />,
        loader: createCourseLoader,
        action: createCourseAction
      }
    ],
  },

  {
    path: "admissionfee",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Admission Fee" submenuReqiredPermission="canRead" />,
    children: [{ index: true, element: <AdmissionFee /> }],
  },

  // curriculum

  {
    path: "curriculum",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Curriculum" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        //   element: <Curriculum />, 
        //   loader: curriculumLoader
        // },
        // {
        //   path: "curriculums", 
        element: <Curriculums />,
        loader: curriculumLoader,
        action: curriculumAction,
      }
    ],
  },


  {
    path: "curriculum/addmodules/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Curriculum" submenuReqiredPermission="canUpdate" />,
    children: [
      {
        index: true,
        element: <AddCurriculum />,
        loader: addCurriculum
      }
    ],
  },

   {
        path: "curriculum/:curriculumId/AddMediaForTopic",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Curriculum" submenuReqiredPermission="canUpdate" />,
    children: [
      {
        index: true,
        element: <AddMediaForTopic />,
        loader: mediaLoader,
        action:mediaAction
      }
    ],
  },

 

  {
    path: "departments",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Departments" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <Departments />,
        loader: departmentLoader,
        action: departmentAction
      }

    ],
  },

  {
    path: "departments/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Departments" submenuReqiredPermission="canCreate" />,
    children: [
      {
        index: true,
        element: <CreateDepartment />,
        action: departmentCreateEditAction
      }
    ],
  },



  {
    path: "departments/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Departments" submenuReqiredPermission="canUpdate" />,
    children: [
      {
        index: true,
        element: <CreateDepartment />,
        loader: departmentCreateLoader,
        action: departmentCreateEditAction
      }
    ],
  },


  {
    path: "leadsource",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Lead Sources" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <LeadSource />,
        loader: LeadSourceLoader,
        action: leadSourceAction,
      }
    ],
  },

  {
    path: "lead/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Lead Sources" submenuReqiredPermission="canCreate" />,
    children: [{ index: true, element: <CreateLeadSource />, action: LeadSourceCreateEditAction }],
  },

  {
    path: "lead/edit/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Lead Sources" submenuReqiredPermission="canUpdate" />,
    children: [{ index: true, element: <CreateLeadSource />, loader: LeadSourceCreateEditLoader, action: LeadSourceCreateEditAction }],
  },

  {
    path: "organizationprofile",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Organization Profile" submenuReqiredPermission="canRead" />,
    children: [{
      index: true,
      element: <OrganizationProfile />
    }],
  },

  {
    path: "admissionfee/new",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Admission Fee" submenuReqiredPermission="canCreate" />,
    children: [{
      index: true,
      element: <CreateAdmissionFee />
    }],
  },
  {
    path: "createbankdetails",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Bank Details" submenuReqiredPermission="canCreate" />,
    children: [{
      index: true,
      element: <CreateBankDetails />,
      action: bankDetailsAction
    }],
  },
  {
    path: "editbankdetails/:id",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Bank Details" submenuReqiredPermission="canUpdate" />,
    children: [{
      index: true,
      element: <CreateBankDetails />,
      loader: bankDetailsLoaderById,
      action: bankDetailsAction
    }],
  },
  {
    path: "bankDetails",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Bank Details" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <BankDetails />,
        loader: bankDetailsLoader,
        action: bankDetailsDeleteAction
      }],
  },
  {
    path: "entity",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Entity" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <Entity />,
        loader: EntityLoader
      },
      {
        path: "create-entity",
        element: <CreateEntity />,
        action: createEntityAction
      },
      {
        path: "update-entity/:entityId",
        element: <CreateEntity />,
        loader: updateEntityLoader,
        action: updateEntityAction
      },
    ],
  },
  {
    path: "entity-branch",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Entity Branch" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <EntityBranch />,
        loader: EntityBranchLoader
      },
      {
        path: "create-entity-branch",
        element: <CreateEntityBranch />,
        loader: createEntityBranchLoader,  
        action: createEntityBranch,
      },
      {
        path: "update-entity-branch/:branchId",
        element: <CreateEntityBranch />,
        loader: updateEntityBranchLoader,
        action: updateEntityBranchAction
      },
    ],
  },
  {
    path: "entity-users",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Entity User" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <EntityUsers />,
        loader: EntityUserLoader
      },
      {
        path: "create-entity-user",
        element: <CreateEntityUsers />,
        loader: createEntityUserLoader,  
        action: createEntityUserAction,
      },
      {
        path: "update-entity-user/:userId",
        element: <CreateEntityUsers />,
        loader: updateEntityUserLoader,
        action: updateEntityUserAction
      },
    ],
  },
  {
    path: "issues",
    element: <RouteBlocker requiredModule="Settings" requiredPermission="all" submenumodule="Issues" submenuReqiredPermission="canRead" />,
    children: [
      {
        index: true,
        element: <Tickets />,
      }],
  },

];

export default SettingsRoutes;


// import React from "react";
// import OrganizationProfile from "../../componentLayer/pages/settings/organizationProfile/OrganizationProfile";
// import { Route, Routes } from "react-router-dom";
// import SettingsTabs from "../../componentLayer/pages/settings/SettingsTabs";
// import AdmissionFee from "../../componentLayer/pages/settings/admissionfee/AdmissionFee";
// import Branch from "../../componentLayer/pages/settings/branch/Branch";
// import CoursePackage from "../../componentLayer/pages/settings/coursePackage/CoursePackage";
// import Course from "../../componentLayer/pages/settings/courses/Course";
// import Departments from "../../componentLayer/pages/settings/departments/Department";
// import Roles from "../../componentLayer/pages/settings/roles/Roles";
// import LeadSource from "../../componentLayer/pages/settings/leadsource/LeadSource";
// import { CreateRole } from "../../componentLayer/pages/settings/roles/CreateRole";
// import CreateBranch from "../../componentLayer/pages/settings/branch/CreateBranch";
// import CreateLeadSource from "../../componentLayer/pages/settings/leadsource/CreateLeadSource";
// import CreateCoursePackage from "../../componentLayer/pages/settings/coursePackage/CreateCoursePackage";
// import CreateCourse from "../../componentLayer/pages/settings/courses/CreateCourse";
// import CreateAdmissionFee from "../../componentLayer/pages/settings/admissionfee/CreateAdmissionFee";
// import CreateDepartment from "../../componentLayer/pages/settings/departments/CreateDepartment";
// import RouteBlocker from "../../rbac/RouteBlocker";
// import Error from "../../componentLayer/pages/Error/Error";
// import Curriculum from "../../componentLayer/pages/settings/curriculum/Curriculum";
// import AddCurriculum from "../../componentLayer/pages/settings/courses/AddCurriculum";

// function SettingsRoutes() {
//   return (
//     <Routes>
//       <Route path="" element={<SettingsTabs />} />

//       <Route path="*" element={<Error />} />
//       {/* role */}
//       <Route
//         path="/roles/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Roles"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateRole />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/roles"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Roles"
//             submenuReqiredPermission="canRead"
//           >
//             <Roles />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/roles/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Roles"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateRole />
//           </RouteBlocker>
//         }
//       />

//       {/* branch */}
//       <Route
//         path="/branch"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Branch"
//             submenuReqiredPermission="canRead"
//           >
//             <Branch />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/branch/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Branch"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateBranch />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/branch/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Branch"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateBranch />
//           </RouteBlocker>
//         }
//       />

//       {/* coursePackage */}
//       <Route
//         path="/coursePackage"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Course Package"
//             submenuReqiredPermission="canRead"
//           >
//             <CoursePackage />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/coursePackage/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Course Package"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateCoursePackage />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/coursePackage/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Course Package"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateCoursePackage />
//           </RouteBlocker>
//         }
//       />

//       {/* courses */}
//       <Route
//         path="/courses"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Courses"
//             submenuReqiredPermission="canRead"
//           >
//             <Course />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/courses/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Courses"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateCourse />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/courses/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Courses"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateCourse />
//           </RouteBlocker>
//         }
//       />

//       {/* admission fee */}
//       <Route
//         path="/admissionfee"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Admission Fee"
//             submenuReqiredPermission="canRead"
//           >
//             <AdmissionFee />
//           </RouteBlocker>
//         }
//       />

//       {/* curriculum */}
//       <Route
//         path="/curriculum"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Curriculum"
//             submenuReqiredPermission="canRead"
//           >
//             <Curriculum />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/curriculum/addmodules/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Curriculum"
//             submenuReqiredPermission="canUpdate"
//           >
//             <AddCurriculum />
//           </RouteBlocker>
//         }
//       />

//       {/* department */}
//       <Route
//         path="/departments"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Departments"
//             submenuReqiredPermission="canRead"
//           >
//             <Departments />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/departments/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Departments"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateDepartment />
//           </RouteBlocker>
//         }
//       />

//       <Route
//         path="/departments/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Departments"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateDepartment />
//           </RouteBlocker>
//         }
//       />

//       {/* leadsource */}
//       <Route
//         path="/leadsource"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Lead Sources"
//             submenuReqiredPermission="canRead"
//           >
//             <LeadSource />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/lead/new"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Lead Sources"
//             submenuReqiredPermission="canCreate"
//           >
//             <CreateLeadSource />
//           </RouteBlocker>
//         }
//       />
//       <Route
//         path="/lead/edit/:id"
//         element={
//           <RouteBlocker
//             requiredModule="Settings"
//             requiredPermission="all"
//             submenumodule="Lead Sources"
//             submenuReqiredPermission="canUpdate"
//           >
//             <CreateLeadSource />
//           </RouteBlocker>
//         }
//       />

//       <Route path="/organizationprofile" element={<OrganizationProfile />} />
//       <Route path="/admissionfee/new" element={<CreateAdmissionFee />} />
//       {/* Add id here for editing purpose */}
//       <Route path="/admissionfee/edit/" element={<CreateAdmissionFee />} />
//     </Routes>
//   );
// }

// export default SettingsRoutes;
