import { useLoaderData, useParams, useSearchParams } from 'react-router-dom';
import CustomPage from '../../../../../utils/Custompage.jsx';
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import { useState } from "react";
import Popup from "../../../../../utils/Popup.jsx";
import { MdHistory } from "react-icons/md";
import InfoTooltip from "../../../../../utils/InfoTooltip.jsx";

export const studentAttendedJobLoader = async ({ request, params }) => {
    const { registrationNumber } = params;
    const url = new URL(request.url);
    console.log(registrationNumber, "registrationNumber")
    try {
        const response = await ERPApi.get(`/jobs/studentapplication/${registrationNumber}${url.search}`);
        const studentAttendedJobs = response.data
        return { studentAttendedJobs };
    } catch (error) {
        const studentAttendedJobs = {}
        console.error(error, "Demo Batches error");
        return studentAttendedJobs
    }
}

const StudentAttendedJobs = () => {
    const { studentAttendedJobs } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showHistoryPopup, setShowHistoryPopup] = useState(false);
    console.log(studentAttendedJobs, "studentAttendedJobs")
    const [selectedStatusHistory, setSelectedStatusHistory] = useState({
        ticketId: "",
        statusHistory: [],
    });

    const students = studentAttendedJobs?.applications || [];

    // ✅ Columns
    const STUDENT_COLUMNS = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) =>
                (studentAttendedJobs?.currentPage - 1) *
                studentAttendedJobs?.pageSize +
                index +
                1,
        },
        {
            id: "title",
            header: "Job Title",
            accessor: (row) => row.jobpostingapp?.title || "-",
        },
        {
            id: "companyName",
            header: "Company Name",
            accessor: (row) => row.jobpostingapp?.company_name || "-",
        },
        {
            id: "jobId",
            header: "Job ID",
            accessor: (row) => row.jobpostingapp?.job_id || "-",
        },
        {
            id: "location",
            header: "Location",
            accessor: (row) => row.jobpostingapp?.location || "-",
        },
        {
            id: "ctcRange",
            header: "CTC Range",
            accessor: (row) => row.jobpostingapp?.ctc_range || "-",
        },
        {
            id: "status",
            header: "Status",
            accessor: (row) => row?.status || "-",
        },
        {
            id: "interviewDate",
            header: "Interview Date",
            accessor: (row) =>
                row.interviewData
                    ? new Date(row.interviewData).toLocaleDateString("en-GB")
                    : "-",
        },
        {
            id: "applied_date",
            header: "Applied Date",
            accessor: (row) => {
                const date = row.applied_date || row.createdAt;

                return date
                    ? new Date(date).toLocaleDateString("en-GB")
                    : "-";
            },
        }
    ];

    const actions = (row) => {
        if (!row) return null;

        return (
            <button
                style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: "#405189",
                }}
                onClick={() => handleViewHistory(row)}
                title="View Status History"
            >
                <MdHistory size={20} />
            </button>
        );
    };
    // ✅ Pagination mapping
    const pagination = {
        page: studentAttendedJobs?.currentPage || 1,
        pageSize: studentAttendedJobs?.pageSize || 10,
        totalPages: studentAttendedJobs?.totalPages || 1,
        length: students.length,
        start: studentAttendedJobs?.startplacement || 0,
        end: studentAttendedJobs?.endplacement || 0,
        searchResult: studentAttendedJobs?.totalstudents || 0,
    };

    // ✅ Handlers
    const handlePageChange = (newPage) => {
        console.log("pageChange");
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage);
        setSearchParams(params);
    };

    const handlePerPageChange = (e) => {
        console.log("perPageChange");
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
    const handleViewHistory = (row) => {
        setSelectedStatusHistory({
            ticketId: row.uuid,
            statusHistory: row.status_history || [],
        });

        setShowHistoryPopup(true);
    };

    const currentScope = searchParams.get("scope") || "";

    const handleScopeChange = (e) => {
        const nextValue = e.target.value;

        setSearchParams((prevParams) => {
            const nextParams = Object.fromEntries(prevParams.entries());

            if (nextValue) {
                nextParams.scope = nextValue;
            } else {
                delete nextParams.scope;
            }

            nextParams.page = "1";

            return nextParams;
        });
    };

    const scopeSelector = (
        <div className="col-md-4 mb-3">
            {/* <label className="form-label fw-bold">Filter Dashboard Scope</label> */}
            <select
                className="form-select form-select-sm w-auto"
                // className="form-select"
                value={currentScope}
                onChange={handleScopeChange}
            >
                <option value="">All Applications</option>
                <option value="PORTAL_APPLICATIONS">Student Portal Applications</option>
                <option value="DRIVE_TRACKS">Placement Team Applications</option>
                <option value="STATUS_CHANGED">Application Moved Froward</option>
            </select>
        </div>
    );
    return (
        <>
            <CustomPage
                heading="Students"
                backButtonText="Back"
                searchToolTipPosition={"right"}
                searchToolTipText={"Search with Job Id, Company Name, Job Title"}
                headerActions={scopeSelector}
                // ✅ Data
                tableData={students}
                tableColum={STUDENT_COLUMNS}
                tableActions={actions}
                // ✅ Search
                isSearch={true}
                searchPlaceHolder="Search by name, email, phone..."

                // ✅ Pagination
                tablePagination={pagination}
                onPageChange={handlePageChange}
                handlePerPageChange={handlePerPageChange}
            />
            <Popup
                show={showHistoryPopup}
                title="Status History"
                onClose={() => {
                    setShowHistoryPopup(false);
                    setSelectedStatusHistory({
                        ticketId: "",
                        statusHistory: [],
                    });
                }}
            >
                {selectedStatusHistory.statusHistory.length > 0 ? (
                    selectedStatusHistory.statusHistory.map((item, index) => (
                        <div
                            key={index}
                            className="border rounded p-3 mb-3"
                        >
                            <div>
                                <strong>Status:</strong> {item.status}
                            </div>

                            <div>
                                <strong>Remark:</strong> {item?.remark ?? item?.reason}
                            </div>

                            <div>
                                <strong>Updated At:</strong>{" "}
                                {new Date(item.updatedAt).toLocaleString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No history available.</p>
                )}
            </Popup>
        </>
    );
};

export default StudentAttendedJobs;