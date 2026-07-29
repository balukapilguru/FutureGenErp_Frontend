import React, { useEffect, useState } from 'react'
import CustomTable from '../../../../utils/CustomTable'
import { SearchSelect } from '../../../../utils/SearchSelect'
import Pagination from '../../../../utils/Pagination'
import PaginationInfo from '../../../../utils/PaginationInfo'
import SearchInputField from '../../../../utils/SearchInputField'
import BackButton from '../../../components/backbutton/BackButton'
import { HiMiniPlus } from 'react-icons/hi2'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { ERPApi } from '../../../../serviceLayer/interceptor'
import GateKeeper from '../../../../rbac/GateKeeper'
import { NavLink, useLoaderData, useSearchParams } from 'react-router-dom'
import { RiEdit2Line } from 'react-icons/ri'

const Entity = () => {
    const { entityList } = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams();

    const [vocherData, setVoucherData] = useState({
        voucherCode: "",
        validity_end_date: "",
        validity_start_date: new Date().toISOString().split("T")[0],
        valueType: "amount",
        amount: "",
        entity_id: "",
        percentage: 0,
        voucherDescription: "",
        registrationFormId: null,
        razorpayLink: "",
        isExamForVoucher: false,
        crmSourceId: ""
    })


    const [showVocherPopup, setShowVocherPopup] = useState()
    const [entityID, setEntityID] = useState()
    const [vocherLoading, setVocherLoading] = useState()
    const [errorMessage, setErrorMessage] = useState({
        voucherCount: "",
        voucherValue: "",
    })


    const statusList = [
        { label: "Issue", value: "issue" },
        { label: "Issued", value: "issued" },
        { label: "Enrolled", value: "enrolled" },
    ]


    const columns = [
        {
            id: "sno",
            header: "S.No",
            accessor: (row, index) =>
                (entityList?.pagination?.currentPage - 1) *
                entityList?.pagination?.pageSize +
                index +
                1,
        },
        { id: "name", header: "Entity Name", accessor: "name", sortable: true, hideable: false }, // Display Name
        { id: "email", header: "Email", accessor: "email", sortable: true, hideable: false }, // Display Email
        { id: "phone_number", header: "Phone Number", accessor: (row) => row.phone_number, sortable: true, hideable: false }, // Display Phone Number
        // {
        //     id: "createdAt",
        //     header: "Created At",
        //     accessor: (row) => new Date(row.createdAt).toLocaleString(), // Format createdAt to a readable string
        // },
        // {
        //     id: "updatedAt",
        //     header: "Updated At",
        //     accessor: (row) => new Date(row.updatedAt).toLocaleString(), // Format updatedAt to a readable string
        // },

    ];



    const handleAddVochers = (item) => {
        setEntityID(item.id)
        setVoucherData(prev => ({
            ...prev,
            clusterName: item.clusterName
        }))
        setShowVocherPopup(true);
    };

    const actions = (item, handleDelete) => (
        <div className="d-flex align-items-center">
            <GateKeeper
                requiredModule="Settings"
                submenumodule="Entity"
                submenuReqiredPermission="canCreate"
            >
                <HiMiniPlus
                    className=" table_icons me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleAddVochers(item)}
                    data-bs-toggle="tooltip"
                    title="Add Vocher"
                />
            </GateKeeper>
            <GateKeeper
                requiredModule="Reports"
                submenumodule="Report Data"
                submenuReqiredPermission="canUpdate"
            >
                <NavLink
                    to={`update-entity/${item.id}`}
                    className="fw-medium"
                >
                    <RiEdit2Line />
                </NavLink>
            </GateKeeper>

        </div>
    );


    const handelSubmitVocher = async () => {
        // Clear previous errors
        setErrorMessage({});
        // Validate voucher code (if required, assuming it's mandatory)
        if (!vocherData.voucherCode.trim()) {
            setErrorMessage(prev => ({
                ...prev,
                voucherCode: "Voucher code is mandatory"
            }));
            return;
        }
        if (vocherData.voucherCode?.trim().replace(/\s/g, "")?.length < 4) {
            setErrorMessage(prev => ({
                ...prev,
                voucherCode: "Voucher code must be greater than 3"
            }));
            return;
        }
        if (!vocherData.crmSourceId) {
            setErrorMessage(prev => ({
                ...prev,
                crmSourceId: "CRM Source Id is Required"
            }));
            return;
        }
        if (!/^\d+$/.test(vocherData.crmSourceId.trim())) {
            setErrorMessage(prev => ({
                ...prev,
                crmSourceId: "Invalid CRM Source Id"
            }));
            return;
        }

        // Validate voucher amount (Must be greater than 0)
        if (vocherData.valueType === "amount" && (vocherData.amount <= 0 || vocherData.amount.trim() === "")) {
            setErrorMessage(prev => ({
                ...prev,
                voucherValue: "Voucher value must be greater than 0"
            }));
            return;
        }
        if (vocherData.valueType === "percentage" && (vocherData.percentage <= 0 || vocherData.percentage.trim() === "")) {
            setErrorMessage(prev => ({
                ...prev,
                voucherValue: "Voucher value must be greater than 0"
            }));
            return;
        }
        // if (!vocherData.voucherDescription) {
        //     setErrorMessage(prev => ({
        //         ...prev,
        //         voucherValue: "Voucher value must required"
        //     }));
        //     return;
        // }
        // if (vocherData.voucherDescription?.trim().replace(/\s/g, "")?.length < 10) {
        //     setErrorMessage(prev => ({
        //         ...prev,
        //         voucherValue: "Voucher value must be greater than 10"
        //     }));
        //     return;
        // }

        // Validate voucher percentage (Must be between 0 and 100 if valueType is "percentage")
        if (vocherData.valueType === "percentage" && (vocherData.percentage < 0 || vocherData.percentage > 100)) {
            setErrorMessage(prev => ({
                ...prev,
                voucherValue: "Voucher percentage must be between 0 and 100"
            }));
            return;
        }

        if (!vocherData.validity_start_date) {
            setErrorMessage(prev => ({
                ...prev,
                validity_start_date: "Validity start date is required"
            }));
            return;
        }
        if (!vocherData.validity_end_date) {
            setErrorMessage(prev => ({
                ...prev,
                validity_end_date: "Validity end date is required"
            }));
            return;
        }


        // Validate validity dates (valid start and end date)
        if (vocherData.validity_start_date && vocherData.validity_end_date) {
            const startDate = new Date(vocherData.validity_start_date);
            const endDate = new Date(vocherData.validity_end_date);
            if (startDate >= endDate) {
                setErrorMessage(prev => ({
                    ...prev,
                    validityDates: "End date must be after start date"
                }));
                return;
            }
        }



        // Set loading state while the request is pending
        setVocherLoading(true);

        try {
            // Prepare the payload to be sent to the API
            const payload = {
                valueType: vocherData.valueType,
                amount: Number(vocherData.amount),
                voucherCode: vocherData.voucherCode,
                validity_start_date: vocherData.validity_start_date,
                validity_end_date: vocherData.validity_end_date,
                entity_id: entityID,
                percentage: Number(vocherData.percentage),
                voucherDescription: vocherData.voucherDescription,
                crmSourceId:vocherData.crmSourceId,
            };

            // Make the API call and handle success or error messages
            const res = await toast.promise(
                ERPApi.post(`/vouchers/create`, payload),  // API call
                {
                    pending: 'Creating voucher...',  // Message shown while the request is pending
                    success: 'Voucher created successfully!',  // Message shown if the request succeeds
                    error: 'Error creating voucher. Please try again.',  // Message shown if the request fails
                }
            );

            if (res.status === 201) {
                // Handle success response
                // fetchClusters(); // Reload or fetch data after successful creation
                Swal.fire('Success!', `${vocherData.voucherCode} Code Created`, 'success');
                setVoucherData({
                    valueType: "amount",
                    amount: "",
                    voucherCode: "",
                    voucherDescription: "",
                    validity_start_date: new Date().toISOString().split("T")[0],
                    validity_end_date: "",
                    entity_id: "",
                    percentage: "",
                    crmSourceId:""
                });
                setShowVocherPopup(false); // Close the popup
            }
        } catch (error) {
            // Handle error during the API request
            console.error("Error creating voucher:", error);
            toast.error("Failed to create voucher");
        } finally {
            // Stop the loading spinner
            setVocherLoading(false);
        }
    };


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



    return (
        <div>
            <BackButton heading="Entity" content="Back" />
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

                                    <GateKeeper
                                        requiredModule="Settings"
                                        submenumodule="Entity"
                                        submenuReqiredPermission="canCreate"
                                    >
                                        <NavLink
                                            to="create-entity"
                                            className="btn btn_primary fs-13"
                                        >
                                            <HiMiniPlus /> Add Entity
                                        </NavLink>
                                    </GateKeeper>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive table-card  border-0">
                            <div className="table-container table-scroll">
                                <CustomTable
                                    data={entityList?.data || []}
                                    columns={columns}
                                    actions={actions}
                                    enableColumnToggle={false}
                                />
                            </div>
                        </div>
                        {/* pagination start */}

                        <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                            <div className="col-sm">
                                <PaginationInfo
                                    data={{
                                        length: entityList?.data?.searchResultStudents,
                                        start: entityList?.pagination?.start,
                                        end: entityList?.pagination?.end,
                                        total: entityList?.pagination?.totalResult,
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
                                        value={entityList?.pagination?.pageSize}
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
                                        currentPage={entityList?.pagination?.currentPage}
                                        totalPages={entityList?.pagination?.totalPages}
                                        // loading={referrals?.loading}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                        {showVocherPopup && (
                            <div
                                className="modal fade show d-block"
                                style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                                tabIndex="-1"
                            >
                                <div className="modal-dialog modal-dialog-centered modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add Voucher</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => setShowVocherPopup(false)}
                                            ></button>
                                        </div>

                                        <div className="modal-body">
                                            {/* Voucher Code + Description */}
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label fs-s fw-medium black_300">
                                                        Voucher Code <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={vocherData.voucherCode}
                                                        maxLength={10}
                                                        minLength={4}
                                                        onChange={(e) => {
                                                            setVoucherData((prev) => ({
                                                                ...prev,
                                                                voucherCode: e.target.value.toUpperCase(),
                                                            }));
                                                            setErrorMessage("");
                                                        }}
                                                        placeholder="Enter voucher code"
                                                    />
                                                    {errorMessage?.voucherCode && (
                                                        <div className="text-danger mt-1">
                                                            {errorMessage.voucherCode}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label fs-s fw-medium black_300">
                                                        CRM Source ID
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={vocherData.crmSourceId}
                                                        onChange={(e) => {
                                                            setVoucherData((prev) => ({
                                                                ...prev,
                                                                crmSourceId: e.target.value,
                                                            }));
                                                            setErrorMessage((prev) => ({
                                                                ...prev,
                                                                crmSourceId: "",
                                                            }));
                                                        }}
                                                        placeholder="Enter voucher description"
                                                    />
                                                    {errorMessage?.crmSourceId && (
                                                        <div className="text-danger mt-1">
                                                            {errorMessage.crmSourceId}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Voucher Type + Amount/Percentage */}
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label fs-s fw-medium black_300">
                                                        Voucher Type <span className="text-danger">*</span>
                                                    </label>
                                                    <select
                                                        className="form-select  fs-s"
                                                        value={vocherData.valueType}
                                                        onChange={(e) => {
                                                            setVoucherData((prev) => ({
                                                                ...prev,
                                                                valueType: e.target.value,
                                                                amount: "",
                                                                percentage: 0,
                                                            }));
                                                            setErrorMessage("");
                                                        }}
                                                    >
                                                        <option className=' fs-s' value="amount">Amount</option>
                                                        <option className=' fs-s' value="percentage">Percentage</option>
                                                    </select>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label fs-s fw-medium black_300">
                                                        {vocherData.valueType === "amount"
                                                            ? "Voucher Amount"
                                                            : "Voucher Percentage"}{" "}
                                                        <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={
                                                            vocherData.valueType === "amount"
                                                                ? vocherData.amount
                                                                : vocherData.percentage
                                                        }
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            if (vocherData.valueType === "amount") {
                                                                if (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0) {
                                                                    setVoucherData((prev) => ({
                                                                        ...prev,
                                                                        amount: value,
                                                                    }));
                                                                    setErrorMessage("");
                                                                }
                                                            } else {
                                                                if (/^\d*\.?\d*$/.test(value) && value >= 0 && value <= 100) {
                                                                    setVoucherData((prev) => ({
                                                                        ...prev,
                                                                        percentage: value,
                                                                    }));
                                                                    setErrorMessage("");
                                                                }
                                                            }
                                                        }}
                                                        placeholder={
                                                            vocherData.valueType === "amount"
                                                                ? "Voucher Amount"
                                                                : "Voucher Percentage"
                                                        }
                                                    />
                                                    {errorMessage?.voucherValue && (
                                                        <div className="text-danger mt-1">
                                                            {errorMessage.voucherValue}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Validity Dates */}
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label fs-s fw-medium black_300">
                                                        Description
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={vocherData.voucherDescription}
                                                        onChange={(e) => {
                                                            setVoucherData((prev) => ({
                                                                ...prev,
                                                                voucherDescription: e.target.value,
                                                            }));
                                                            setErrorMessage((prev) => ({
                                                                ...prev,
                                                                voucherDescription: "",
                                                            }));
                                                        }}
                                                        placeholder="Enter voucher description"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label fs-s fw-medium black_300">
                                                        Validity Start Date <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={vocherData.validity_start_date}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        max={new Date().toISOString().split("T")[0]}
                                                        onChange={(e) =>
                                                            setVoucherData((prev) => ({
                                                                ...prev,
                                                                validity_start_date: e.target.value,
                                                            }))
                                                        }
                                                        disabled
                                                    />
                                                    {errorMessage?.validity_start_date && (
                                                        <div className="text-danger mt-1">
                                                            {errorMessage.validity_start_date}
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="row">

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label  fs-s">End Date <span className="text-danger">*</span></label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={vocherData.validity_end_date}
                                                        min={vocherData.validity_start_date}
                                                        onChange={(e) =>
                                                            setVoucherData({
                                                                ...vocherData,
                                                                validity_end_date: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>


                                        </div>

                                        {/* Footer */}
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary py-1"
                                                onClick={() => setShowVocherPopup(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn btn_primary ${!vocherData?.validity_start_date ||
                                                    !vocherData?.validity_end_date ||
                                                    vocherLoading
                                                    ? "cursor_pointer_not_allowed"
                                                    : "cursor-pointer"
                                                    }`}
                                                onClick={() => handelSubmitVocher()}
                                                disabled={
                                                    !vocherData?.validity_end_date ||
                                                    vocherLoading
                                                }
                                            >
                                                {vocherLoading ? "Creating Vouchers" : "Issue Voucher"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Entity
