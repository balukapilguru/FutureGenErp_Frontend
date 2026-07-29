import React, {useEffect, useState} from 'react'
import {Link, useFetcher, useLoaderData, useNavigate, useSearchParams} from 'react-router-dom'
import {FaHistory, FaWpforms} from 'react-icons/fa'
import BackButton from '../../../components/backbutton/BackButton'
import {ERPApi} from '../../../../serviceLayer/interceptor'
import CountUp from '../../../../utils/CountUp'
import CustomTable from '../../../../utils/CustomTable'
import Filter from '../../../../utils/FilterWithSearchParams.jsx'
import {BsLayoutThreeColumns} from "react-icons/bs";
import {MdDelete, MdFilterList} from "react-icons/md";
import {Offcanvas} from "bootstrap";
import {AiFillEye} from "react-icons/ai";
import {toast} from "react-toastify";
import GateKeeper from "../../../../rbac/GateKeeper.jsx";
import io from "socket.io-client";
import {IoMdNotificationsOutline} from "react-icons/io";
import Popup from "../../../../utils/Popup.jsx";
import SearchInputField from "../../../../utils/SearchInputField.jsx";

export const ticketDashboardLoader = async ({request}) => {

    const url = new URL(request.url);

    const selectedStatus = url.searchParams.get("status");
    const view = url.searchParams.get("view");

    try {

        const [
            issueTypesResponse,
            branchResponse
        ] = await Promise.all([
            ERPApi.get("/issuetypes/all"),
            ERPApi.get("/settings/getbranch")
        ]);

        let response;

        if (view === "All") {

            response = await ERPApi.get(
                `/ticket/all${url.search}`
            );

        } else {

            response = await ERPApi.post(`/ticket/count`, {
                status:
                    selectedStatus !== "Received"
                        ? selectedStatus
                        : "",
            });

        }

        return {
            ...(response?.data || {}),
            issueTypes: issueTypesResponse?.data || [],
            branchesList: branchResponse?.data || [],
        };

    } catch (error) {

        console.error(error);

        return {
            issueTypes: [],
            branchesList: [],
            branches: [],
            tickets: [],
            StatusCounts: {},
            branchStatusCounts: {},
            error: true
        };

    }
};
const TicketDashboard = () => {
    const navigate = useNavigate()
    const ticketCountData = useLoaderData();
    const [ticketsData, setTicketsData] = useState(null);
    const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;
    const socket = io(SOCKET_SERVER_URL);

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedStatus = searchParams.get("status") || "";
    const selectedView = searchParams.get("view") || "Branches";
    const [reopenTicketError, setReopenTicketError] = useState({
        title: "",
        description: "",
    })
    useEffect(() => {

        if (selectedView !== "All") return;

        const params = {
            page: Number(searchParams.get("page")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 10,
            search: searchParams.get("search") || "",
            status: searchParams.get("status") || "",
            branch: searchParams.get("branch") || "",
            issueType: searchParams.get("issueType") || "",
        };
        console.log(params)

        socket.emit("allTickets", params);

        socket.on("getAllTickets", handleTicketsData);
        socket.on("messageCreated", handleMessageData);
        socket.on("ticketCreated", handleTicketCreated);

        return () => {
            socket.off("getAllTickets", handleTicketsData);
            socket.off("messageCreated", handleMessageData);
            socket.off("ticketCreated", handleTicketCreated);
        };

    }, [selectedView, searchParams.toString()]);

    const fetcher = useFetcher();

    const handleStatusClick = (status) => {
        const params = Object.fromEntries(searchParams.entries());

        let mappedStatus = status;

        if (status === "All") {
            mappedStatus = "";
        } else if (status === "New") {
            mappedStatus = "Open";
        }

        setSearchParams({
            ...params,
            status: mappedStatus,
        });
    };
    const statusColors = {
        All: "#a9cce3 ",
        New: "#fdebd0  ",
        Resolved: "#d0ece7 ",
        Unresolved: "#fadbd8  ",
        Pending: "#f9e79f  ",
        Inprogress: "#d2b4de   ",
    };

    const columns =
        selectedView === "All"
            ? [
                {
                    id: "sno",
                    header: "S.No",
                    accessor: (_, index) => index + 1,
                },
                {
                    id: "ticketNumber",
                    header: "Ticket Number",
                    accessor: (item) => <Link to={`/tickets/view/${item.id}`}> {item.ticketNumber}</Link>,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "studentName",
                    header: "Student",
                    accessor: (item) => item.student_detail?.name || "-",
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "branch",
                    header: "Branch",
                    accessor: (item) =>
                        item.student_detail?.branches?.branch_name || "-",
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "issueType",
                    header: "Issue Type",
                    accessor: (item) =>
                        item.issueType?.issueType || "-",
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "status",
                    header: "Status",
                    accessor: (item) => item.status,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "reopenCount",
                    header: "Reopen Count",
                    accessor: (item) => item.reopenCount,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "createdDate",
                    header: "Created Date",
                    accessor: (item) =>
                        item.ticketCreatedOn
                            ? new Date(item.ticketCreatedOn).toLocaleString()
                            : "-",
                    sortable: true,
                    hideable: true,
                },
            ]
            : [
                {
                    id: "sno",
                    header: "S.No",
                    accessor: (_, index) => index + 1,
                },
                {
                    id: "branch",
                    header: "Branch",
                    accessor: (item) => (
                        <span
                            className="text-truncate"
                            style={{maxWidth: "50px", cursor: "pointer"}}
                            title={item.branch_name}
                            onClick={() =>
                                navigate(
                                    `/tickets/list?branch=${item.id}&status=${selectedStatus}`
                                )
                            }
                        >
                        {item.branch_name}
                    </span>
                    ),
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "totalCount",
                    header: "Total Count",
                    accessor: (item) =>
                        Object.values(item.branchIssueTypeCounts || {}).reduce(
                            (acc, count) => acc + count,
                            0
                        ),
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "recordings",
                    header: "Recordings",
                    accessor: (item) =>
                        item.branchIssueTypeCounts?.Recordings || 0,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "trainerIssues",
                    header: "Trainer Issues",
                    accessor: (item) =>
                        item.branchIssueTypeCounts?.["Trainer Issues"] || 0,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "counsellorIssues",
                    header: "Counsellor Issues",
                    accessor: (item) =>
                        item.branchIssueTypeCounts?.["Counsellor Issues"] || 0,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "idCard",
                    header: "Id Card",
                    accessor: (item) =>
                        item.branchIssueTypeCounts?.["ID Card"] || 0,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "certificates",
                    header: "Certificates",
                    accessor: (item) =>
                        item.branchIssueTypeCounts?.Certificates || 0,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "iep",
                    header: "IEP",
                    accessor: (item) =>
                        item.branchIssueTypeCounts?.IEP || 0,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "batchShiftings",
                    header: "Batch Shiftings",
                    accessor: (item) =>
                        item.branchIssueTypeCounts?.["Batch Shifting"] || 0,
                    sortable: true,
                    hideable: true,
                },
                {
                    id: "others",
                    header: "Others",
                    accessor: (item) =>
                        item.branchIssueTypeCounts?.Others || 0,
                    sortable: true,
                    hideable: true,
                },
            ];

    const initialFilterData = [
        {
            label: "From Date",
            type: "date",
            inputname: "fromDate",
            value: "",
        },
        {
            label: "TO Date",
            type: "date",
            inputname: "toDate",
            value: "",
        },
        {
            label: "Branch",
            type: "select",
            inputname: "branch",
            value: ticketCountData?.branchesList?.branchData?.map(item => item.id == searchParams.get("filter[branch]")),
            options: ticketCountData?.branchesList?.branchData?.map(item => ({
                label: item.branch_name,
                value: item.id
            })),
        },
        {
            label: "Category",
            type: "select",
            inputname: "issueType",
            value: ticketCountData?.issueTypes?.issueTypes?.map(item => item.id == searchParams.get("filter[issueType]")),
            options: ticketCountData?.issueTypes?.issueTypes?.map(item => ({
                label: item.issueType,
                value: item.issueType
            })),
        },
    ];

    const [filterData, setFilterData] = useState(initialFilterData);

    const HandleFilters = (index, name, value) => {
        setFilterData(prevState => {
            let showToast = false;

            let updated = prevState.map((item, idx) =>
                idx === index ? {...item, value} : item
            );

            // When From Date changes
            if (name === "fromDate") {
                updated = updated.map(item => {
                    if (item.inputname === "toDate") {
                        if (item.value && item.value < value) {
                            showToast = true;
                            return {
                                ...item,
                                min: value,
                                value: "", // reset invalid To Date
                            };
                        }

                        return {
                            ...item,
                            min: value, // always update min
                        };
                    }
                    return item;
                });
            }

            // Fire toast AFTER state calculation
            if (showToast) {
                toast.warning("To Date cannot be earlier than From Date");
            }

            return updated;
        });
    };


    const FilterReset = () => {

        const resetFilterData = filterData?.map((item) => ({
            ...item,
            value: "",
        }));

        setFilterData(resetFilterData);

        const newSearchParams = new URLSearchParams(searchParams.toString());

        initialFilterData.forEach(filter => {
            newSearchParams.delete(
                filter.urlParam ||
                filter.inputname ||
                filter?.urlSearchParam
            );
        });

        newSearchParams.delete("filter[course_label]");

        setSearchParams(newSearchParams);
    };
    const filterSubmit = () => {
        const offcanvasElement = document.getElementById("offcanvasRight");
        const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
            offcanvasInstance.hide();
        }
    };

    const pagination = {
        page: ticketsData?.currentPage || 1,
        pageSize: ticketsData?.pageSize || 10,
        totalPages: ticketsData?.totalPages || 1,
        length: selectedView === "All"
            ? ticketsData?.tickets?.length || []
            : ticketsData?.branches?.length || [],
        start: ticketsData?.startData || 0,
        end: ticketsData?.endData || 0,
        searchResult: ticketsData?.searchResultTickets || 0,
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage);
        setSearchParams(params);
    };
    const handlePerPageChange = (e) => {
        const pageSize = parseInt(e.target.value, 10);

        setSearchParams((prev) => {
            const params = Object.fromEntries(prev);
            return {
                ...params,
                page: 1,
                pageSize,
            };
        });
    };

    const getApiStatus = (status) => {
        if (status === "All") return "Received";
        return status;
    };

    const [showAnswersPopup, setShowAnswersPopup] = useState(false);
    const [selectedStudentAnswers, setSelectedStudentAnswers] = useState({
        status: "Reopen",
        title: "Refund not processed",
        description: "EMI got deducted even after cancellation",
        reopenedBy: "Student",
        ticketId: ""
    });
    const handleTicketReopen = (ticketId) => {
        setShowAnswersPopup(true)
        setSelectedStudentAnswers({
            ticketId: ticketId
        })
    }
    const handleStatusChange = (ticketId, newStatus) => {
        // setTicketStatuses((prev) => ({...prev, [ticketId]: newStatus}));
        let payload = {
            status: newStatus,
            ticketId: ticketId,
        }
        if (newStatus === "Reopen") {
            if (selectedStudentAnswers.title.trim() === "") {
                setReopenTicketError(prev => ({
                    ...prev,
                    title: "Ticket Title is Required"
                }))
                return;
            }
            if (selectedStudentAnswers.description.trim() === "") {
                setReopenTicketError(prev => ({
                    ...prev,
                    description: "Ticket Description is Required"
                }))
                return;
            }
            payload.status = newStatus;
            payload.title = selectedStudentAnswers.title,
                payload.description = selectedStudentAnswers.description,
                payload.reopenedBy = "Support"
        }

        fetcher.submit(
            payload,
            {
                method: "POST",
            }
        );
        // setTicketsData(prevData => {
        //     if (!prevData?.tickets) return prevData;
        //     const updatedTickets = prevData.tickets.map(ticket =>
        //         ticket.id === ticketId
        //             ? {...ticket, status: newStatus}
        //             : ticket
        //     );
        //     return {...prevData, tickets: updatedTickets};
        // });
    };


    const actions = (ticket) => {
        if (!ticket) return null;

        return (
            <div className="d-flex align-items-center gap-3">

                <GateKeeper
                    requiredModule="Tickets Mangement"
                    requiredPermission="all"
                    submenumodule="Tickets Details"
                    submenuReqiredPermission="canUpdate"
                >
                    <select
                        className="form-select fs-13"
                        value={ticket.status}
                        onChange={(e) => e.target.value == "Reopen" ? handleTicketReopen(ticket.id) : handleStatusChange(ticket.id, e.target.value)}
                        style={{
                            width: "130px",
                            backgroundColor:
                                ticket.status === "Resolved"
                                    ? "#c7efd0"
                                    : "#f3f2f2",
                            color: "black",
                            border: "none",
                        }}
                    >
                        <option value="Open">Open</option>
                        <option value="Inprogress">Inprogress</option>
                        <option value="Pending">Pending</option>
                        <option value="Unresolved">Unresolved</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Reopen">Reopend</option>
                    </select>
                </GateKeeper>


                <div className="position-relative d-inline-block">

                    <IoMdNotificationsOutline
                        className="eye_icon"
                        title="Messages"
                        style={{fontSize: "20px"}}
                    />

                    {ticket.unreadSupportMessages > 0 && (
                        <span
                            className="badge bg-danger position-absolute"
                            style={{
                                top: "-10px",
                                right: "-8px",
                                fontSize: "8px",
                                padding: "3px 6px",
                                borderRadius: "50%",
                            }}
                        >
            {ticket.unreadSupportMessages}
        </span>
                    )}

                </div>

                <Link to={`/tickets/view/${ticket.id}`}>
                    <AiFillEye
                        className="eye_icon table_icons"
                        title="View Ticket"
                        style={{cursor: "pointer"}}
                        // onClick={() => handleNavigate(ticket)}
                    />
                </Link>

                <FaHistory
                    className="eye_icon table_icons text_primary"
                    title="Reopen History"
                    style={{cursor: "pointer"}}
                    onClick={() => {
                        setSelectedReopenHistories(ticket.reopenHistories || []);
                        setSelectedTicketNumber(ticket.ticketNumber);
                        setShowReopenPopup(true);
                    }}
                />
            </div>
        );
    };

    const handleTicketsData = (data) => {
        setTicketsData(data);
        console.log(data, "Vineeth")
    };

    const handleMessageData = (data) => {
        const {ticketId, senderRole} = data;

        if (senderRole !== "Student") return;

        setTicketsData(prev => {

            if (!prev?.tickets) return prev;

            return {
                ...prev,
                tickets: prev.tickets.map(ticket =>
                    ticket.id === ticketId
                        ? {
                            ...ticket,
                            unreadSupportMessages:
                                (ticket.unreadSupportMessages || 0) + 1
                        }
                        : ticket
                )
            };
        });
    };

    const handleTicketCreated = (newTicket) => {

        setTicketsData(prev => {

            if (!prev?.tickets) {
                return {
                    ...prev,
                    tickets: [newTicket]
                };
            }

            return {
                ...prev,
                tickets: [newTicket, ...prev.tickets]
            };
        });
    };


    useEffect(() => {
        if (fetcher.data?.reopenStatus) {
            setSelectedStudentAnswers({
                ticketId: "",
                status: "",
                description: "",
                reopenedBy: "",
                title: ""
            })
            setShowAnswersPopup(false)
        }
        const params = {
            page: Number(searchParams.get("page")) || 1,
            pageSize: Number(searchParams.get("pageSize")) || 10,
            search: searchParams.get("search") || "",
            status: searchParams.get("status") || "",
            branch: searchParams.get("branch") || "",
            issueType: searchParams.get("issueType") || "",
        };

        socket.emit("allTickets", params);

        socket.on("getAllTickets", handleTicketsData);
        socket.on("messageCreated", handleMessageData);
        socket.on("ticketCreated", handleTicketCreated);

        return () => {
            socket.off("getAllTickets", handleTicketsData);
            socket.off("messageCreated", handleMessageData);
            socket.off("ticketCreated", handleTicketCreated);
        };
    }, [fetcher.data])

    const [showReopenPopup, setShowReopenPopup] = useState(false);

    const [selectedTicketNumber, setSelectedTicketNumber] = useState("");

    const [selectedReopenHistories, setSelectedReopenHistories] = useState([]);

    return (
        <div>
            <BackButton heading="Issues Dashboard" content="Back"/>
            <div className="container-fluid">
                <style>
                    {`
    .card_animate[data-status="All"] { background-color: #a9cce3 !important; color: #000 !important; }
    .card_animate[data-status="Open"] { background-color: #fdebd0 !important; color: #000 !important; }
    .card_animate[data-status="Resolved"] { background-color: #d0ece7 !important; color: #000 !important; }
    .card_animate[data-status="Unresolved"] { background-color: #fadbd8 !important; color: #000 !important; }
    .card_animate[data-status="Pending"] { background-color: #f9e79f !important; color: #000 !important; }
    .card_animate[data-status="Inprogress"] { background-color: #d2b4de !important; color: #000 !important; }
    
    /* Ensure text inside button is also white */
    .card_animate p, 
    .card_animate h4, 
    .card_animate span {
      color: #000 !important;
    }

    /* Apply specific colors for the SVG icon */
    .card_animate[data-status="Received"] svg { color: #2980b9 !important; }  /* Dark Blue */
    .card_animate[data-status="Open"] svg { color: #e67e22 !important; }  /* Orange */
    .card_animate[data-status="Resolved"] svg { color: #1abc9c !important; }  /* Teal */
    .card_animate[data-status="Unresolved"] svg { color: #e74c3c !important; }  /* Red */
    .card_animate[data-status="Pending"] svg { color: #f1c40f !important; }  /* Yellow */
    .card_animate[data-status="Inprogress"] svg { color: #8e44ad !important; }  /* Purple */
  `}
                </style>


                <ul className="row nav mb-3 nav-tabs nav-justified mb-3 nav-fill mt-2" id="pills-tab">
                    {["All", "Open", "Resolved", "Unresolved", "Pending", "Inprogress", "Reopen"].map((status) => (
                        <li key={status}
                            className="col-xxl-1 col-xl-1 col-lg-1 col-md-6 col-sm-12 col-12 nav-item mt-2">
                            <button
                                className={`card nav-link card_animate ${selectedStatus === status ? "active" : ""}`}
                                onClick={() => handleStatusClick(status)}
                                data-status={status} // Assigning data attribute for CSS
                            >
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                                            {status === "Reopen" ? "Reopened" : status}
                                        </p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
                                    <div className="text-start">
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-4 display_no">
                                            <CountUp
                                                finalValue={
                                                    selectedView === "All"
                                                        ? ticketsData?.StatusCounts?.[getApiStatus(status)] || 0
                                                        : ticketCountData?.branchStatusCounts?.[getApiStatus(status)] || 0
                                                }
                                                duration={300}
                                            />
                                        </h4>
                                    </div>
                                    <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-success-subtle rounded fs-6 p-2">
                      <FaWpforms className="text-success fs-20"/>
                    </span>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='container-fluid'>
                <div className="d-flex justify-content-between align-items-center mb-3">

                    {/* LEFT SIDE */}
                    <div className="d-flex gap-2">
                        <button
                            className={`btn btn-sm px-3 ${
                                selectedView === "All"
                                    ? "btn btn_primary fs-13 button-res"
                                    : "btn-outline-primary"
                            }`}
                            onClick={() => setSearchParams({view: "All"})}
                        >
                            All
                        </button>

                        <button
                            className={`btn btn-sm  ${
                                selectedView === "Branches"
                                    ? "btn btn_primary fs-13 button-res"
                                    : "btn-outline-primary"
                            }`}
                            onClick={() => setSearchParams({view: "Branches"})}
                        >
                            Branches
                        </button>
                        {
                            selectedView === "All" &&
                            <SearchInputField/>
                        }
                    </div>

                    {/* RIGHT SIDE */}
                    {selectedView === "All" &&
                        <div className="d-flex align-items-center gap-2">

                            <div className="fs-13 text_color">
                                <button
                                    className="btn btn-sm btn_primary fs-13 button-res"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#columnOffcanvas"
                                    title="Column Filter"
                                >
                                    <BsLayoutThreeColumns strokeWidth={0.6} size={20}/>
                                </button>
                            </div>

                            <button
                                className="btn btn-sm btn_primary fs-13 button-res"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRight"
                                aria-controls="offcanvasRight"
                            >
                                <MdFilterList className="me-1 mb-1"/>
                                Filters
                            </button>

                        </div>
                    }

                    {/* OFFCANVAS */}
                    <div
                        className="offcanvas offcanvas-end bg_white"
                        id="offcanvasRight"
                        aria-labelledby="offcanvasRightLabel"
                    >
                        <div className="offcanvas-header">
                            <h5
                                className="offcanvas-title text_color"
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
                            <Filter
                                filterData={filterData}
                                HandleFilters={HandleFilters}
                                filterReset={FilterReset}
                                filterSubmit={filterSubmit}
                            />
                        </div>
                    </div>

                </div>
                <div className="card-body  bg-white">
                    <div className="table-responsive table-card table-container table-scroll border-0">
                        <CustomTable
                            data={
                                selectedView === "All"
                                    ? ticketsData?.tickets || []
                                    : ticketCountData?.branches || []
                            }
                            pagination={
                                selectedView === "All"
                                    ? pagination
                                    : false
                            }
                            actions={
                                selectedView === "All"
                                    ? actions
                                    : false
                            }
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePerPageChange}
                            columns={columns}
                            enableColumnToggle={true}
                        />
                        <Popup
                            show={showAnswersPopup}
                            title="Create Ticket"
                            onClose={() => {
                                setShowAnswersPopup(false);
                                setSelectedStudentAnswers({title: "", description: ""});
                            }}
                            onSubmit={() => handleStatusChange(selectedStudentAnswers?.ticketId, "Reopen")}
                        >
                            <div className="answers-container">

                                {/* Title Input */}
                                <div className="form-group mb-3">
                                    <label className="form-label fw-bold mb-1">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter title"
                                        value={selectedStudentAnswers?.title || ""}
                                        onChange={(e) => {
                                            setSelectedStudentAnswers({
                                                ...selectedStudentAnswers,
                                                title: e.target.value,
                                            })
                                            setReopenTicketError(prev => ({
                                                ...prev,
                                                title: ""
                                            }))
                                        }
                                        }
                                    />
                                    <div style={{height: "8px"}}>
                                        {reopenTicketError.title && (
                                            <span className="text-danger text-start mail error-text fs-s">
                                                            {reopenTicketError.title}
                                                        </span>
                                        )}
                                    </div>
                                </div>

                                {/* Description Input */}
                                <div className="form-group mb-3">
                                    <label
                                        className="form-label fw-bold mb-1">Description</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        placeholder="Enter description"
                                        value={selectedStudentAnswers?.description || ""}
                                        onChange={(e) => {
                                            setSelectedStudentAnswers({
                                                ...selectedStudentAnswers,
                                                description: e.target.value,
                                            })
                                            setReopenTicketError(prev => ({
                                                ...prev,
                                                description: ""
                                            }))
                                        }
                                        }
                                    />
                                    <div style={{height: "8px"}}>
                                        {reopenTicketError.description && (
                                            <span className="text-danger text-start mail error-text fs-s">
                                                {reopenTicketError.description}
                                            </span>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </Popup>
                        <Popup
                            show={showReopenPopup}
                            title={`Reopen History - ${selectedTicketNumber}`}
                            onClose={() => {
                                setShowReopenPopup(false);
                                setSelectedReopenHistories([]);
                                setSelectedTicketNumber("");
                            }}
                        >
                            {selectedReopenHistories && selectedReopenHistories.length > 0 ? (
                                <div style={{
                                    maxHeight: "400px",   // fixed size (adjust as needed)
                                    overflowY: "auto",
                                    paddingRight: "8px",
                                }}
                                >
                                    {selectedReopenHistories.map((history) => {
                                        return (
                                            <div key={history.id} className="mb-3 pb-2 border-bottom">

                                                <div className="mb-1">
                                                    <strong>Reopen Number:</strong>{" "}
                                                    <span className="text-muted">{history.reopenNumber}</span>
                                                </div>

                                                <div className="mb-1">
                                                    <strong>Reopened By:</strong>{" "}
                                                    <span className="text-muted">{history.reopenedBy}</span>
                                                </div>

                                                <div className="mb-1">
                                                    <strong>Title:</strong>{" "}
                                                    <span className="text-muted">{history.title || "-"}</span>
                                                </div>

                                                <div className="mb-1">
                                                    <strong>Description:</strong>{" "}
                                                    <span className="text-muted">{history.description || "-"}</span>
                                                </div>

                                                <div className="mb-1">
                                                    <strong>Date:</strong>{" "}
                                                    <span className="text-muted">
                                                        {new Date(history.createdAt).toLocaleString()}
                                                    </span>
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-muted">No reopen history available.</p>
                            )}
                        </Popup>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TicketDashboard


// < table className = "table table-centered align-middle table-nowrap equal-cell-table table-hover" >
//             <thead>
//               <tr>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "20px" }}>S.No</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600">Branch</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Total Count'>Total Count</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }}>Recordings</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Trainer Issues'>Trainer Issues</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Counsellor Issues'>Counsellor Issues</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }}>Id Card</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Certificate'>Certificates</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }}>IEP</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }} title='Batch Shiftings'>Batch Shiftings</th>
//                 <th scope="col" className="fs-13 lh-xs fw-600 text-truncate" style={{ maxWidth: "50px" }}>Others</th>
//               </tr>
//             </thead>
//             <tbody>
//               {ticketCountData?.branches?.map((item, index) => (
//                 <tr key={item.id} style={{ cursor: "pointer" }}>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{index + 1}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light text-truncate' style={{ maxWidth: "50px" }} title={item.branch_name} onClick={() => navigate(`/tickets/list?branch=${item.id}&status=${selectedStatus}`)} >{item.branch_name}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{Object.values(item.branchIssueTypeCounts).reduce((acc, count) => acc + count, 0)}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.Recordings || 0}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.["Trainer Issues"] || 0}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.["Counsellor Issues"] || 0}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.["ID Card"] || 0}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.Certificates || 0}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.IEP || 0}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.["Batch Shifting"] || 0}</td>
//                   <td className='fs-13 black_300 lh-xs bg_light' >{item.branchIssueTypeCounts?.Others || 0}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </ >