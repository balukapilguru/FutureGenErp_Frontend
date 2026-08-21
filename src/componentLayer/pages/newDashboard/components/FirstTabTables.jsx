import React, { useEffect, useState } from 'react'
import { MdFilterList } from 'react-icons/md';
import Button from '../../../components/button/Button';
import { toast } from 'react-toastify';
import { getCouncellersListInTotalEnrollments, getStudentsListInTotalEnrollments, getTotalEnrollmentDeatils } from '../utils/DataUtilities';
import { Offcanvas } from 'bootstrap';
import TotalEnrollmentsFirstTable from './totalEnrollmentsTables/TotalEnrollmentsFirstTable'
import TotalEnrollmentsSecondTable from './totalEnrollmentsTables/TotalEnrollmentsSecondTable';
import TotalEnrollmentsStudentTable from './totalEnrollmentsTables/TotalEnrollmentsStudentTable';


const FirstTabTables = ({
    userData,
    TotalEnrollementDetailsData,
    updateTopEnrollers,
    firstTableData,
    secondTableData,
    studentTableData,
    loadingStates,
    handleBranchSubmit,
    filterDatesTotalEnrollments,
    handleDateChange,
    handleCouncellorSubmit,
    filterResetTotalEnrollementDates,
    filterSubmitTotalEnrollemntDates,
    activeBranch,
    activeCouncellor,
}) => {


    const [tablesData, setTablesData] = useState({
        enrolmentsInBranch: TotalEnrollementDetailsData?.branches || [],
        enrollmentsByCouncellors: TotalEnrollementDetailsData?.topEnrollers || [],
        councellerWiseStudentsDetails: [],
    })








    useEffect(() => {
        setTablesData((prev) => ({
            ...prev,
            enrolmentsInBranch: TotalEnrollementDetailsData?.branches || [],
            enrollmentsByCouncellors: TotalEnrollementDetailsData?.topEnquiryTakenBy || [],
        }))
    }, [TotalEnrollementDetailsData])


    return (
        <div>
            <div className="mt-2 mb-2 mt-lg-0">
                <div className="mb-0 card">
                    <div className="card-body">
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRight"
                                aria-controls="offcanvasRight"
                            >
                                <MdFilterList className="me-1 mb-1 text_white" />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="offcanvas offcanvas-end bg_light"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">
                        Filters
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body p-2">
                    <div>
                        <label className="form-label fs-s fw-medium text_color">
                            From Date
                        </label>
                        <input
                            className="  form-control input_bg_color  date_input_color "
                            id="rdob"
                            name="fromDate"
                            type="date"
                            value={filterDatesTotalEnrollments?.fromDate}
                            max={filterDatesTotalEnrollments?.toDate || undefined}
                            onChange={handleDateChange}
                        />
                    </div>

                    <div className="mt-2">
                        <label className="form-label fs-s fw-medium text_color">
                            To Date
                        </label>
                        <input
                            className=" form-control input_bg_color  date_input_color "
                            id="rdob"
                            name="toDate"
                            type="date"
                            min={filterDatesTotalEnrollments?.fromDate || undefined}
                            onChange={handleDateChange}
                            value={filterDatesTotalEnrollments?.toDate}
                        />
                    </div>

                    <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                        <button
                            className="btn btn_primary"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                            onClick={filterResetTotalEnrollementDates}
                        >
                            Clear
                        </button>
                    </div>
                    <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                        <Button
                            className="btn btn_primary"
                            onClick={filterSubmitTotalEnrollemntDates}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tables */}

            {userData &&
                userData?.user &&
                userData?.user?.profile !== "Counsellor" &&
                userData?.user?.profile !== "counsellor" && (
                    <div className="row">
                        {/* Enrollements Branch Table */}
                        <TotalEnrollmentsFirstTable enrolmentsInBranch={firstTableData} activeBranch={activeBranch} handleBranchSubmit={handleBranchSubmit} />

                        {/* Enrollements Top rated counceller &&  Barch wise Councellors Table */}
                        <TotalEnrollmentsSecondTable
                            handleCouncellorSubmit={handleCouncellorSubmit}
                            activeCouncellor={activeCouncellor}
                            enrollmentsByCouncellors={secondTableData}
                            councellerLoading={loadingStates.councellerLoading}
                        />
                    </div>
                )}

            {/* Enrollement Student table */}

            {studentTableData &&
                studentTableData?.length > 0 && (
                    <TotalEnrollmentsStudentTable
                        councellerWiseStudentsDetails={studentTableData}
                        studentLoading={loadingStates.studentLoading}
                    />
                )}
        </div>
    )
}

export default FirstTabTables
