import React, {useEffect, useState, useCallback} from "react";
import {useNavigate, useLocation, useFetcher, useLoaderData} from "react-router-dom";
import {MdFilterList} from "react-icons/md";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Pagination from "../../../../utils/Pagination";
import CustomFilters from "../../../../utils/CustomFilters";
import FormattedDate from "../../../../utils/FormattedDate";
import BackButton from "../../../components/backbutton/BackButton";
import io from "socket.io-client";
import {toast} from "react-toastify";
import {ERPApi} from "../../../../serviceLayer/interceptor";
import {IoMdNotificationsOutline} from "react-icons/io";
import GateKeeper from "../../../../rbac/GateKeeper";
import {useAuthContext} from "../../../../dataLayer/hooks/useAuthContext";


const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;
const socket = io(SOCKET_SERVER_URL);

export const ticketUpdateAction = async ({request, params}) => {
    const formData = await request.formData();
    const status = formData.get("status");
    const ticketID = formData.get("ticketId");
    let payload = {
        status: status,
    }
    if (status === "Reopen") {
        payload.title = formData.get("title"),
            payload.description = formData.get("description"),
            payload.reopenedBy = "Support"
    }
    try {
        const {data} = await toast.promise(
            ERPApi.post(`/ticket/change/${ticketID}`, payload),
            {
                pending: "Updating Tickets...",
                success: "successfully Updated!",
                error: "Failed to update.",
            }
        );
        return {reopenStatus: true,data};
    } catch (error) {
        toast.error("Updating Tickets failed.");
        return {success: false, message: "Updating Tickets failed."};
    }
};

export const ticketBranchListLoader = async ({request, params}) => {
    const url = new URL(request.url);
    try {
        const [BranchesData, CategoryData] = await Promise.all([
            ERPApi.get(`/settings/getbranch`),
            ERPApi.get(`/issuetypes/all`),
        ]);

        const BranchsList = BranchesData?.data?.branchData?.map((item) => ({
            label: item?.branch_name,
            value: item.id,
        }));
        const CategoryList = CategoryData?.data?.issueTypes?.map((item) => ({
            label: item?.issueType,
            value: item.issueType,
        }));
        return {BranchsList, CategoryList};
    } catch (error) {
        console.error(error);
        return {BranchsList: [], CategoryList: []};
    }
};

const Tickets = () => {
    const {CategoryList, BranchsList} = useLoaderData();
    const fetcher = useFetcher();
    const navigate = useNavigate();
    const location = useLocation();
    const {AuthState} = useAuthContext();
    const userEmail = AuthState?.user.email;
    const userId = AuthState?.user.id;
    const [ticketsData, setTicketsData] = useState(null);
    const searchParams = new URLSearchParams(location.search);
    const branchFilter = searchParams.get("branch");
    const statusFilter = searchParams.get("status");
    const filteredTickets = ticketsData?.tickets
        ? ticketsData.tickets.filter((ticket) =>
            (!branchFilter || ticket?.student_detail?.branches?.id?.toString() === branchFilter) &&
            (!statusFilter || ticket?.status === statusFilter)
        )
        : [];

    const [Qparams, setQParams] = useState({
        search: searchParams.get("search") || "",
        page: parseInt(searchParams.get("page") || "1", 10),
        pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
        status: searchParams.get("filter[status]") || "",
    });

    const intialState = [
        {
            label: "Branch",
            type: "select",
            inputname: "branch",
            value: Qparams.branch,
            options: BranchsList,
        },
        {
            label: "Category",
            type: "select",
            value: Qparams.Category,
            inputname: "issueType",
            options: CategoryList,
        },
        {
            label: "Status",
            type: "select",
            value: Qparams.status,
            inputname: "status",
            options: [
                {label: "Open", value: "Open"},
                {label: "Inprogress", value: "Inprogress"},
                {label: "Resolved", value: "Resolved"},
                {label: "Unresolved", value: "Unresolved"},
                {label: "Pending", value: "Pending"},
                {label: "Reopen", value: "Reopened"},
            ],
        },
    ];
    const [filterData, setFilterData] = useState(intialState);

    const handleNavigate = (ticket) => {
        navigate(`/tickets/view/${ticket.id}`, {
            state: {unreadMessageIds: ticket.unreadSupportMessagesIds},
        });
    };

    const handlePage = (page) => {
        setQParams((prev) => ({...prev, page}));
    };

    const handlePerPageChange = (event) => {
        const selectedValue = parseInt(event.target.value, 10);
        setQParams((prev) => ({...prev, page: 1, pageSize: selectedValue}));
    };

    const handleTicketsData = useCallback((data) => {
        console.log(data, "Scoket data")
        setTicketsData(data);
    }, [setTicketsData]);

    const handleMessageData = (data) => {
        const {ticketId, senderRole} = data;

        if (senderRole !== 'Student') return;

        setTicketsData(prev => {
            if (!prev?.tickets) return prev;
            const updatedTickets = prev.tickets.map(ticket =>
                ticket.id === ticketId
                    ? {...ticket, unreadSupportMessages: (ticket.unreadSupportMessages || 0) + 1}
                    : ticket
            );
            socket.emit("allTickets", Qparams);
            return {...prev, tickets: updatedTickets};
        });
    };

    const handleTicketCreated = (newTicket) => {
        setTicketsData(prev => {
            if (!prev?.tickets) {
                return {...prev, tickets: [newTicket]};
            }
            const updatedTickets = [newTicket, ...prev.tickets];
            socket.emit("allTickets", Qparams);
            return {...prev, tickets: updatedTickets};
        });
    };
    useEffect(() => {
        socket.on("getAllTickets", handleTicketsData);
        socket.on("messageCreated", handleMessageData);
        socket.on("ticketCreated", handleTicketCreated);

        socket.emit("allTickets", Qparams);

        return () => {
            socket.off("getAllTickets", handleTicketsData);
            socket.off("messageCreated", handleMessageData);
            socket.off("ticketCreated", handleTicketCreated);
        };
    }, [handleTicketsData, Qparams]);

    const [ticketStatuses, setTicketStatuses] = useState(
        ticketsData?.tickets?.reduce((acc, ticket) => {
            acc[ticket.id] = ticket.status;
            return acc;
        }, {})
    );
    //     if (fetcher.state === 'idle' && fetcher.data?.success) {
    //         // Optimistically update the ticketsData to reflect the status change
    //         setTicketsData(prevData => {
    //             if (!prevData?.tickets) return prevData;
    //             const updatedTickets = prevData.tickets.map(ticket =>
    //                 ticket.id === fetcher.data.ticketId // Assuming your action returns the ticketId
    //                     ? { ...ticket, status: ticketStatuses[ticket.id] }
    //                     : ticket
    //             );
    //             return { ...prevData, tickets: updatedTickets };
    //         });
    //         // Optionally clear the fetcher data to avoid repeated updates
    //         // fetcher.data = null;
    //     } else if (fetcher.state === 'error') {
    //         // Handle error, maybe revert the local ticketStatuses
    //         toast.error("Failed to update ticket status.");
    //         // Revert local state on error if needed
    //         // setTicketStatuses(prev => ({ ...prev, [fetcher.data?.ticketId]: /* previous status */ }));
    //     }
    // }, [fetcher.state, fetcher.data, ticketStatuses]);

    const handleStatusChange = (ticketId, newStatus) => {
        setTicketStatuses((prev) => ({...prev, [ticketId]: newStatus}));
        fetcher.submit(
            {ticketId, status: newStatus},
            {
                method: "POST",
            }
        );
        setTicketsData(prevData => {
            if (!prevData?.tickets) return prevData;
            const updatedTickets = prevData.tickets.map(ticket =>
                ticket.id === ticketId
                    ? {...ticket, status: newStatus}
                    : ticket
            );
            return {...prevData, tickets: updatedTickets};
        });
    };


    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        const newParams = new URLSearchParams(location.search);
        newParams.set("search", searchTerm);
        newParams.set("page", "1");
        navigate(`${location.pathname}?${newParams.toString()}`, {replace: true});
        setQParams((prev) => ({...prev, search: searchTerm, page: 1}));
        socket.emit("allTickets", {search: searchTerm, page: 1, pageSize: Qparams.pageSize});
    };

    const handleFilterChange = (updatedFilters) => {
        let query = `${location.pathname}?search=${Qparams.search || ""}`;
        let filterObj = {};

        updatedFilters.forEach((filter) => {
            if (filter.value) {
                query += `&${filter.inputname}=${filter.value}`;
                // query += `&filter[${filter.inputname}]=${filter.value}`;
                filterObj[filter.inputname] = filter.value;
            }
        });

        navigate(query, {replace: true});

        setQParams((prev) => ({
            ...prev,
            ...filterObj,
        }));

        socket.emit("allTickets", {
            search: Qparams.search,
            page: 1,
            pageSize: Qparams.pageSize,
            filter: filterObj,
        });
    };

    const handleClearFilters = () => {
        setFilterData((prevFilters) =>
            prevFilters.map((filter) => ({
                ...filter,
                value:
                    filter.inputname === "branch"
                        ? filter.value
                        : "",
            }))
        );

        setQParams((prev) => ({
            ...prev,
            issueType: "",
            status: "",
        }));

        navigate(`${location.pathname}?branch=${Qparams.branch || ""}`,
            {replace: true}
        );

        socket.emit("allTickets", {
            search: Qparams.search,
            page: 1,
            pageSize: Qparams.pageSize,
            branch: Qparams.branch,
            issueType: "",
            status: "",
        });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const newQParams = {
            search: searchParams.get("search") || "",
            page: parseInt(searchParams.get("page") || "1", 10),
            pageSize: parseInt(searchParams.get("pageSize") || "10", 10),
            branch: searchParams.get("branch") || "",
            issueType: searchParams.get("issueType") || "",
            status: searchParams.get("status") || "",
        };

        setQParams(newQParams);
        setFilterData((prevFilters) =>
            prevFilters.map((filter) => ({
                ...filter,
                value: newQParams[filter.inputname] || "",
            }))
        );
    }, [location.search]);
    return (
        <div>
            <BackButton heading="Issues" content="Back" to="/"/>
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card border-0">
                            <div className="card-header">
                                <div className="row justify-content-between">
                                    <div className="col-sm-4">
                                        <div className="search-box">
                                            <input
                                                type="text"
                                                className="form-control search input_bg_color select"
                                                placeholder="Search for..."
                                                name="search"
                                                required
                                                onChange={(e) => handleSearch(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="buttons_alignment">
                                            <button
                                                className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white"
                                                type="button"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#offcanvasRight"
                                                aria-controls="offcanvasRight"
                                            >
                                                <MdFilterList className="me-1 mb-1 text_white"/>
                                                Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="offcanvas offcanvas-end  bg_white"
                                    id="offcanvasRight"
                                    aria-labelledby="offcanvasRightLabel"
                                >
                                    <div className="offcanvas-header ">
                                        <h5
                                            className="offcanvas-title  text_color"
                                            id="offcanvasRightLabel"
                                        >
                                            Filters
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="offcanvas"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="offcanvas-body p-2 bg_white">
                                        <CustomFilters
                                            filterData={filterData}
                                            Qparams={Qparams}
                                            setQParams={setQParams}
                                            setFilterData={(updatedFilters) => {
                                                if (updatedFilters.every((filter) => !filter.value)) {
                                                    handleClearFilters();
                                                } else {
                                                    handleFilterChange(updatedFilters);
                                                }
                                            }}
                                        />


                                    </div>
                                </div>
                            </div>
                            {/* Table Section */}
                            <div className="card-body">
                                <div className="table-responsive table-card table-container table-scroll border-0">
                                    <table
                                        className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                                        <thead>
                                        <tr>
                                            <th scope="col" className="fs-13 lh-xs fw-600">S.No</th>
                                            <th scope="col" className="fs-13 lh-xs fw-600">Name</th>
                                            <th scope="col" className="fs-13 lh-xs fw-600">Email</th>
                                            <th scope="col" className="fs-13 lh-xs fw-600">Branch</th>
                                            <th scope="col" className="fs-13 lh-xs fw-600">Subject</th>
                                            <th scope="col" className="fs-13 lh-xs fw-600">Description</th>
                                            <th scope="col" className="fs-13 lh-xs fw-600">Date</th>
                                            <th scope="col" className="fs-13 lh-xs fw-600 text-truncate"
                                                style={{maxWidth: "120px"}}>Ticket Nmuber
                                            </th>
                                            <GateKeeper
                                                requiredModule="Tickets Mangement"
                                                requiredPermission="all"
                                                submenumodule="Tickets Details"
                                                submenuReqiredPermission="canUpdate"
                                            >
                                                <th scope="col" className="fs-13 lh-xs fw-600">Status</th>
                                            </GateKeeper>
                                            <th scope="col" className="fs-13 lh-xs fw-600">Action</th>
                                        </tr>
                                        </thead>
                                        <tbody className="scrollable-body">
                                        {!ticketsData ? (
                                            <tr>
                                                <td colSpan="" className="fs-13 black_300 lh-xs bg_light">
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : filteredTickets.length === 0 ? (
                                            <tr>
                                                <td colSpan="" className="fs-13 black_300 lh-xs bg_light">
                                                    No Data
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTickets.map((ticket, index) => (
                                                <tr key={ticket.id}>
                                                    <td className="fs-13 black_300 lh-xs bg_light">
                                                        {(ticketsData?.currentPage - 1) * ticketsData?.pageSize + index + 1}
                                                    </td>
                                                    <td className="fs-13 black_300 lh-xs bg_light">{ticket?.student_detail?.name}</td>
                                                    <td className="fs-13 black_300 lh-xs bg_light text-truncate"
                                                        style={{maxWidth: "120px"}}
                                                        title={ticket?.student_detail?.email}>
                                                        {ticket?.student_detail?.email}
                                                    </td>
                                                    <td className="fs-13 black_300 lh-xs bg_light">{ticket?.student_detail?.branches?.branch_name}</td>
                                                    <td className="fs-13 black_300 lh-xs bg_light text-truncate"
                                                        style={{maxWidth: "120px"}} title={ticket.title}>
                                                        {ticket.title}
                                                    </td>
                                                    <td className="fs-13 black_300 lh-xs bg_light text-truncate"
                                                        style={{maxWidth: "120px"}} title={ticket.description}>
                                                        {ticket.description}
                                                    </td>
                                                    <td className="fs-13 black_300 lh-xs bg_light">{FormattedDate(ticket.createdAt)}</td>
                                                    <td className="fs-13 black_300 lh-xs bg_light">{ticket.ticketNumber}</td>

                                                    <GateKeeper requiredModule="Tickets Mangement"
                                                                requiredPermission="all" submenumodule="Tickets Details"
                                                                submenuReqiredPermission="canUpdate">
                                                        <td className="fs-13 black_300 lh-xs bg_light">
                                                            <select
                                                                className="form-select fs-13"
                                                                value={ticket.status}
                                                                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                                                style={{
                                                                    backgroundColor: ticket.status === "Resolved" ? "#c7efd0" : "#f3f2f2",
                                                                    color: "black",
                                                                    border: "none",
                                                                }}
                                                            >
                                                                <option value="Open">Open</option>
                                                                <option value="Inprogress">Inprogress</option>
                                                                <option value="Pending">Pending</option>
                                                                <option value="Unresolved">Unresolved</option>
                                                                <option value="Resolved">Resolved</option>
                                                                <option value="Re-Open">Re-Open</option>
                                                            </select>
                                                        </td>
                                                    </GateKeeper>

                                                    <td className="fs-13 black_300 lh-xs bg_light">
                                                        <div onClick={() => handleNavigate(ticket)}
                                                             style={{cursor: "pointer"}}>
                                                            <div className="position-relative d-inline-block">
                                                                <IoMdNotificationsOutline className="me-3 eye_icon"
                                                                                          title="message"
                                                                                          style={{fontSize: "20px"}}/>

                                                                {ticket.unreadSupportMessages > 0 && (
                                                                    <span
                                                                        className="badge bg-danger position-absolute"
                                                                        style={{
                                                                            top: "-10px",
                                                                            right: "8px",
                                                                            fontSize: "8px",
                                                                            padding: "3px 6px",
                                                                            borderRadius: "50%"
                                                                        }}
                                                                    >
                                                                            {ticket.unreadSupportMessages}
                                                                        </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                            <div
                                className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                                <div className="col-sm">
                                    <PaginationInfo
                                        data={{
                                            length: ticketsData?.length,
                                            start: ticketsData?.startData,
                                            end: ticketsData?.endData,
                                            total: ticketsData?.searchResultTickets,
                                        }}
                                    />

                                </div>
                                <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                                    <div className="mt-2">
                                        <select
                                            className="form-select form-control me-3 input_bg_color pagination-select "
                                            aria-label="Default select example"
                                            required
                                            onChange={(e) => handlePerPageChange(e)}
                                            value={Qparams?.pageSize}
                                        >
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="75">75</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>

                                    <div className="">
                                        <Pagination
                                            currentPage={ticketsData?.currentPage || 1}
                                            totalPages={ticketsData?.totalPages || 1}
                                            onPageChange={handlePage}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tickets;
