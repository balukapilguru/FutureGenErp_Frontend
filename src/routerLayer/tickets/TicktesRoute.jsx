
import TicketDashboard, { ticketDashboardLoader } from "../../componentLayer/pages/settings/tickets/TicketDashboard";
import Tickets, { ticketBranchListLoader, ticketUpdateAction } from "../../componentLayer/pages/settings/tickets/Tickets";
import TicketsView, { ticketDataLoaderById } from "../../componentLayer/pages/settings/tickets/TicketsView";
import RouteBlocker from "../../rbac/RouteBlocker";

const TicketsRoute = [
    {
        path: "ticketsDashboard",
        element: (
            <RouteBlocker
                requiredModule="Tickets Mangement"
                requiredPermission="all"
                submenumodule="Tickets Details"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <TicketDashboard />,
                loader: ticketDashboardLoader,
                action: ticketUpdateAction
            },
        ],
    },
    {
        path: "list",
        element: (
            <RouteBlocker
                requiredModule="Tickets Mangement"
                requiredPermission="all"
                submenumodule="Tickets Details"
                submenuReqiredPermission="canRead"
            />
        ),

        children: [
            {
                index: true,
                element: <Tickets />,
                action: ticketUpdateAction,
                loader: ticketBranchListLoader
            },
        ],
    },

    {
        path: "view/:id",
        element: (
            <RouteBlocker
                requiredModule="Tickets Mangement"
                requiredPermission="all"
                submenumodule="Tickets Details"
                submenuReqiredPermission="canRead"
            />
        ),
        children: [
            {
                index: true,
                element: <TicketsView />,
                loader:ticketDataLoaderById
            },
        ],
    },
];

export default TicketsRoute;

