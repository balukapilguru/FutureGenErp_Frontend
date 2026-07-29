import React, { useState } from 'react'
import { NavLink, useFetcher, useLoaderData, useSearchParams } from 'react-router-dom'
import Pagination from '../../../utils/Pagination';
import PaginationInfo from '../../../utils/PaginationInfo';
import CustomTable from '../../../utils/CustomTable';
import GateKeeper from '../../../rbac/GateKeeper';
import SearchInputField from '../../../utils/SearchInputField';
import BackButton from '../../components/backbutton/BackButton';
import { usePermissionsProvider } from '../../../dataLayer/hooks/usePermissionsProvider';
import { HiMiniPlus } from 'react-icons/hi2';
import { Offcanvas } from 'bootstrap';
import Filter from '../../../utils/FilterWithSearchParams';
import { MdFilterList } from 'react-icons/md';
import { RiEdit2Line } from 'react-icons/ri';
import { BsLayoutThreeColumns } from 'react-icons/bs';


export const StatusEditor = ({ item, statusList, handleStatusChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [tempStatus, setTempStatus] = useState(item?.status || "");

    const openModal = () => {
        setTempStatus(item?.status || ""); // keep original selected
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    const saveStatus = () => {
        handleStatusChange(item.id, tempStatus); // SAME LOGIC AS BEFORE
        closeModal();
    };

    return (
        <>
            <GateKeeper
                requiredModule="Referrals"
                submenumodule="Referrals Data"
                submenuReqiredPermission="canUpdate"
            >
                {/* EDIT ICON */}
                <RiEdit2Line
                    size={18}
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={openModal}
                />
            </GateKeeper>

            {/* BOOTSTRAP MODAL */}
            <div
                className={`modal fade ${showModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        {/* Header */}
                        <div className="modal-header">
                            <h5 className="modal-title">Update Status</h5>
                            <button className="btn-close" onClick={closeModal}></button>
                        </div>

                        {/* Body - Your SAME SELECT */}
                        <div className="modal-body">
                            <select
                                className="form-select form-select-sm"
                                value={tempStatus}
                                onChange={(e) => setTempStatus(e.target.value)}
                                disabled={item?.status === "enrolled"}
                            >
                                <option value="">Select Status</option>
                                {statusList.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button className="btn btn-secondary py-1" onClick={closeModal}>
                                Cancel
                            </button>
                            <button className="btn btn_primary py-1" onClick={saveStatus}>
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};




const Referrals = () => {
    const { referrals } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const { permission } = usePermissionsProvider();
    const referralFetcher = useFetcher();

    const handleStatusChange = (id, newStatus) => {
        const formData = new FormData();
        formData.set("id", id);
        formData.set("status", newStatus);
        referralFetcher.submit(formData, {
            method: "put",
            encType: "application/form-data",
        })

        // you will add API update logic here
    };

    const statusList = [
        { label: "New Lead", value: "new_lead" },
        { label: "Not Answering", value: "not_answering" },
        { label: "Call Back", value: "call_back" },
        { label: "Porspect", value: "porspect" },
        { label: "Follow Up One", value: "follow_up_one" },
        { label: "Follow Up Two", value: "follow_up_two" },
        { label: "Demo Completed", value: "demo_completed" },
        { label: "Demo Scheduled", value: "demo_scheduled" },
        { label: "Not Intrested", value: "not_intrested" },
        { label: "Invalid", value: "invalid" },
        { label: "Enrolled", value: "enrolled" },
        { label: "Pending", value: "pending" },
    ];


    const columns = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) =>
                (referrals?.data?.currentPage - 1) * referrals?.data?.pageSize + index + 1,
        },
        {
            id: "name", header: "Name", accessor: "name", sortable: true, hideable: true,
        },
        {
            id: "email", header: "Email", accessor: "email", sortable: true, hideable: true,
        },
        {
            id: "contact", header: "Contact", accessor: "contact", sortable: true, hideable: true,
        },
        {
            id: "student", header: "Course", accessor: (row, index) => { return (<span title={row?.course}>{row?.course.slice(0, 19) || "N/A"}</span>) }, sortable: true, hideable: true,
        },
        {
            id: "referralID", header: "Referral ID", accessor: "referralID", sortable: true, hideable: true,
        },

        // STATUS — DROPDOWN
        {
            id: "status",
            header: "Status",
            accessor: (row, index) => {
                const status = row.status;

                return (
                    <span>{status || "N/A"}</span>
                );
            },
            sortable: true,
            hideable: true,

        },

        // CREATED AT
        {
            id: "createdAt",
            header: "Created At",
            accessor: (row) =>
                row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })
                    : "N/A",
        },
    ];

    const actions = (item) => {
        // find "Reports" module permissions
        const reportModule = permission?.permissions?.find(
            (p) => p.module === "Referrals"
        );

        // find submenu for "Report Data"
        const reportDataSubmenu = reportModule?.submenus?.find(
            (s) => s.module === "Referrals Data"
        );

        // if no permissions found, don’t render anything
        if (!reportDataSubmenu) return null;

        return (
            <div className="d-flex align-items-center">
                {/* 👁️ VIEW — show if canUpdate is true */}
                {reportDataSubmenu?.canUpdate && (
                    <StatusEditor
                        item={item}
                        statusList={statusList}
                        handleStatusChange={handleStatusChange}
                    />
                    // <GateKeeper
                    //     requiredModule="Referrals"
                    //     submenumodule="Referrals Data"
                    //     submenuReqiredPermission="canUpdate"
                    // >
                    //     <select
                    //         className="form-select form-select-sm"
                    //         value={item?.status || ""}
                    //         onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    //         disabled={item?.status === "enrolled"} // disable if enrolled
                    //     >
                    //         <option value="">Select Status</option>
                    //         {statusList.map((status) => (
                    //             <option key={status.value} value={status.value}>
                    //                 {status.label}
                    //             </option>
                    //         ))}
                    //     </select>
                    // </GateKeeper>
                )}

            </div>
        );
    };



    const data = referrals?.data?.students?.map((item) => {
        const createdDate = new Date(item.createdAt);

        return {
            id: item.id,
            name: item.name || "N/A",
            email: item.email || "N/A",
            contact: item.contact || "N/A",
            course: item?.course || "N/A",
            referralID: item.referralID || "N/A",
            status: item.status || "",

            createdAt: !isNaN(createdDate)
                ? createdDate.toISOString()
                : null,
        };
    }) || [];


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

        debouncesetPage({ context: "ENROLLED_STUDENTS", data: page });
    };


    const initialFilterData = [
        {
            label: "Status",
            type: "select",
            inputname: "filter[status]",
            value: "",
            options: statusList,
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
            <BackButton heading="Referrals" content="Back" />
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
                                    <div className="fs-13 me-3 "></div>
                                    {/* <CSVLink
                    data={generateCSVData()}
                    filename={"Reportdata.csv"}
                    target="_blank"
                  >
                    <button
                      type="button"
                      class="btn btn-sm btn_primary margin_top_12 me-2 button-res"
                    >
                      <FaDownload className="me-1" />
                      Download
                    </button>
                    
                  </CSVLink> */}
                                    {/* <GateKeeper
                                        requiredModule="Reports"
                                        submenumodule="Report Data"
                                        submenuReqiredPermission="canCreate"
                                    >
                                        <NavLink
                                            to="/reports/createreport"
                                            className="btn btn_primary fs-13"
                                        >
                                            <HiMiniPlus /> Add Report
                                        </NavLink>
                                    </GateKeeper> */}
                                    <div className="fs-13 me-2 mt-2 text_color">
                                        <button
                                            className="btn btn-sm btn_primary fs-13  margin_top_12 button-res"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#columnOffcanvas"
                                            title="Column Filter"
                                        >
                                            <BsLayoutThreeColumns strokeWidth={0.6} size={20} />
                                        </button>
                                    </div>
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
                                <CustomTable
                                    data={data}
                                    columns={columns}
                                    actions={actions}
                                    enableColumnToggle={true}
                                />
                            </div>
                        </div>
                        {/* pagination start */}

                        <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                            <div className="col-sm">
                                <PaginationInfo
                                    data={{
                                        length: referrals?.data?.searchResultStudents,
                                        start: referrals?.data?.startStudent,
                                        end: referrals?.data?.endStudent,
                                        total: referrals?.data?.totalStudents,
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
                                        value={referrals?.pageSize}
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
                                        currentPage={referrals?.data?.currentPage}
                                        totalPages={referrals?.data?.totalPages}
                                        // loading={referrals?.loading}
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

export default Referrals