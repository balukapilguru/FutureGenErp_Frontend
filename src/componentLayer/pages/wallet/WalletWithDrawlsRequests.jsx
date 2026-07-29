import { useFetcher, useLoaderData, useSearchParams } from "react-router-dom";
import BackButton from "../../components/backbutton/BackButton";
import CustomTable from "../../../utils/CustomTable";
import Pagination from '../../../utils/Pagination';
import PaginationInfo from '../../../utils/PaginationInfo';
import { useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
import { MdFilterList } from "react-icons/md";
import Filter from "../../../utils/FilterWithSearchParams";
import SearchInputField from "../../../utils/SearchInputField";
import Swal from "sweetalert2";

const WalletWithDrawlsRequests = () => {
    const { withdrawalRequests } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const fetcher = useFetcher();
    const handleStatusChange = (e, id) => {
        const formData = new FormData();
        formData.append('action', e.target.value);
        formData.append('requestId', id);
        Swal.fire({
            title: "Are you sure?",
            text: `you want to ${e.target.value === "approve" ? "approve" : "reject"} this withdrawal request?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${e.target.value === "approve" ? "approve" : "reject"} it!`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                fetcher.submit(formData, { method: 'post' });
            };
        })
    }
    const StatusBadge = ({ status }) => {
        const badgeClasses = {
            pending: "badge bg-warning text-white  w-50 py-2",
            approved: "badge bg-success text-white  w-50 py-2",
            rejected: "badge bg-danger text-white  w-50 py-2",
        };

        return (
            <span
                className={`${badgeClasses[status] || "badge bg-secondary text-white"
                    } px-2 py-0.5 rounded-2`}
            >
                {status ? status.toUpperCase() : "N/A"}
            </span>
        );
    };

    const walletWithdrawalColumns = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) => (
                <span>
                    {(withdrawalRequests?.pagination?.currentPage - 1) *
                        withdrawalRequests?.pagination?.pageSize +
                        index +
                        1}
                </span>
            ),
        },
        {
            id: "entity",
            header: "Entity",
            accessor: (row) => (
                <span className="text-sm text-slate-700" title={row?.wallet?.entity?.name}>
                    {row?.wallet?.entity?.name}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "requestedAt",
            header: "Requested At",
            accessor: (row) => (
                <span className="text-sm text-slate-700" title={new Date(row.createdAt).toLocaleString()}>
                    {new Date(row.createdAt).toISOString().split("T")[0]}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "amount",
            header: "Amount",
            accessor: (row) => (
                <span className="text-sm font-semibold text-slate-900" title={Number(row.amount)?.toLocaleString("en-IN")}>
                    ₹{Number(row.amount)?.toLocaleString("en-IN")}
                </span>
            ),
            sortable: true,
            hideable: true,
        },
        {
            id: "status",
            header: "Status",
            accessor: (row) => {
                if (row.status === "approved" || row.status === "rejected") {
                    // Show badge for approved or rejected
                    return <StatusBadge status={row.status} />;
                } else {
                    // Show dropdown for pending
                    return (
                        <select
                            value={row.status}
                            onChange={(e) => handleStatusChange(e, row.id)} // Replace with your status change handler
                            className="form-control form-select fs-s bg-form text_color input_bg_color w-50"
                        >
                            <option value="approve">Approve</option>
                            <option value="reject">Reject</option>
                            <option value="pending" disabled className="cursor-not-allowed text-muted bg-muted">
                                Pending
                            </option>
                        </select>
                    );
                }
            },
        },
    ];

    const handlePerPage = (e) => {
        const selectedvalue = parseInt(e.target.value, 10);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("pageSize", selectedvalue.toString());
        newSearchParams.set("page", 1);
        setSearchParams(newSearchParams);
    };

    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("page", page.toString());
        setSearchParams(newSearchParams);
    };

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
            label: "Status",
            type: "select",
            inputname: "status",
            value: "",
            options: [
                { label: "All", value: "all" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
                { label: "Pending", value: "pending" },
            ],
        },
    ];

    const [filterData, setFilterData] = useState(initialFilterData);

    const HandleFilters = (index, name, value) => {
        setFilterData((prev) =>
            prev.map((item, idx) =>
                idx == index
                    ? {
                        ...item,
                        [`filter[${name}]`]: value,  // same pattern as handleFilters
                    }
                    : item
            )
        );
    };

    const FilterReset = () => {
        const resetFilterData = filterData?.map((item) => ({
            ...item,
            value: "",
        }));
        setFilterData(resetFilterData);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        initialFilterStructure.forEach(filter => {
            newSearchParams.delete(filter.urlParam || filter.inputname);
        });
        newSearchParams.set("page", "1");

        setSearchParams(newSearchParams);
    };

    const filterSubmit = () => {
        const offcanvasElement = document.getElementById("offcanvasRight");
        const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
            offcanvasInstance.hide();
        }
    };


    return (
        <div>
            <BackButton heading="Wallet Withdrawals Requests" content="Back" />
            <div className="container-fluid">
                <div className="card">
                    <div className="card-header">
                        <div className="row justify-content-between">
                            <div className="col-sm-4">
                                <div className="search-box">
                                    <SearchInputField />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="buttons_alignment">
                                    <button
                                        className="btn btn-sm btn_primary fs-13 me-1  margin_top_12 button-res"
                                        type="button"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvasRight"
                                        aria-controls="offcanvasRight"
                                    >
                                        <MdFilterList className="me-1 mb-1" />
                                        Filters
                                    </button>
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
                                            <Filter
                                                filterData={filterData}
                                                HandleFilters={HandleFilters}
                                                filterReset={FilterReset}
                                                filterSubmit={filterSubmit}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive table-card  border-0">
                            <div className="table-container table-scroll">
                                <CustomTable data={withdrawalRequests?.data} columns={walletWithdrawalColumns} />
                            </div>
                        </div>
                        {/* pagination start */}

                        <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                            <div className="col-sm">
                                <PaginationInfo
                                    data={{
                                        length: withdrawalRequests?.data?.length,
                                        start: withdrawalRequests?.pagination?.start,
                                        end: withdrawalRequests?.pagination?.end,
                                        total: withdrawalRequests?.pagination?.totalResults,
                                    }}
                                // loading={false}
                                />
                            </div>

                            <div className="col-sm-auto mt-3 mt-sm-0 d-flex">
                                <div className="mt-2">
                                    <select
                                        className="form-select form-control me-3 input_bg_color pagination-select"
                                        aria-label="Default select example"
                                        placeholder="Branch*"
                                        name="branch"
                                        id="branch"
                                        required
                                        onChange={handlePerPage}
                                        value={withdrawalRequests?.pagination?.pageSize}
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
                                        currentPage={withdrawalRequests?.pagination?.currentPage}
                                        totalPages={withdrawalRequests?.pagination?.totalPages}
                                        // loading={withdrawalRequests?.loading}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletWithDrawlsRequests
