import Customfields from "../../componentLayer/pages/demoBatches/customfields/Customfields";
import Demoform from "../../componentLayer/pages/demoBatches/Demoform";
import { demoRegistrationFormAction, demoRegistrationFormLoader, getDemoBatchesLoader, updateDemoRegistrationFormAction } from "../../componentLayer/pages/demoBatches/Demoform.action";
import DemoRegistrationform from '../../componentLayer/pages/demoBatches/registrationform/DemoRegistrationform'
import RouteBlocker from "../../rbac/RouteBlocker";
import ViewstudentsData from '../../componentLayer/pages/demoBatches/viewregisteredstudents/ViewstudentsData'
import { getDemoRegistrationsLoader } from "../../componentLayer/pages/demoBatches/viewregisteredstudents/ViewstudentsData.action";
import DemoBatches from "../../componentLayer/pages/demoBatches/DemoBatches";
import { createDemoRegistrationFormAction, registerFormGetLoader } from "../../componentLayer/pages/demoBatches/registrationform/DemoRegistrationform.action";
import { customFieldsAction, customFieldsLoader } from "../../componentLayer/pages/demoBatches/customfields/Customfields.action";
export const demoroutes = [
    {
        path: "registrationform",
        element: (
            <RouteBlocker
                requiredModule="Demo batches"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <Demoform/>,
                loader:demoRegistrationFormLoader,
                action:demoRegistrationFormAction
            },
        ],
    },
     {
        path: "registrationform/Customfields",
        element: (
            <RouteBlocker
                requiredModule="Demo batches"
                requiredPermission="all"
                submenumodule="Custom Fields"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <Customfields />,
                loader: customFieldsLoader,    
                action: customFieldsAction,   
            },
        ],
    },
    {
        path: "registrationform/create",
        element: (
            <RouteBlocker
                requiredModule="Demo batches"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canCreate"
            />
        ),
        children: [
            {
                index: true,
                element: <DemoRegistrationform />,
                loader: registerFormGetLoader,    
                action: createDemoRegistrationFormAction,   
            },
        ],
    },
    {
        path: "registrationform/edit/:registrationformid",
        element: (
            <RouteBlocker
                requiredModule="Demo batches"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canUpdate"
            />
        ),
        children: [
            {
                index: true,
                element: <DemoRegistrationform />,
                loader: registerFormGetLoader,
                action: updateDemoRegistrationFormAction,
            },
        ],
    },
    {
        path: "registrationform/view/:formUuid",
        element: (
            <RouteBlocker
                requiredModule="Demo batches"
                requiredPermission="all"
                submenumodule="Registration Form"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <ViewstudentsData/>,
                loader: getDemoRegistrationsLoader,
                
            },
        ],
    },
    {
        path: "all",
        element: (
            <RouteBlocker
                requiredModule="Demo batches"
                requiredPermission="all"
                submenumodule="Batches"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <DemoBatches/>,
                loader: getDemoBatchesLoader,
                
            },
        ],
    },
]