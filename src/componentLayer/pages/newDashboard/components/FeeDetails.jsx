import React, { useEffect, useState } from 'react'
import FeeDetailsGraphComponent from './FeeDetailsGraphComponent'
import FeeDetailsTopFeeRecivers from './FeeDetailsTopFeeRecivers';
import FeeDetailsTables from './FeeDetailsTables';
import { getCouncellersListInTotalEnrollments, getCurrentMonthDates, getFeeReceivedByBranchWise, getFeeReceivedByCouncellorWise, getStudentsListInFeeDetails, getStudentsListInTotalEnrollments, getTotalEnrollmentDeatils } from '../utils/DataUtilities';
import Button from '../../../components/button/Button';
import { MdFilterList } from 'react-icons/md';
import { Offcanvas } from 'bootstrap';
import { toast } from 'react-toastify';

const FeeDetails = ({
    userData,
    feeDetailsData,
    BranchState,
    branchGraph,
    handleBranchFeeDetailGraph
}) => {


    const [activeBranchFeeDetails, setactiveBranchFeeDetails] = useState(null);
    const [studentData, setStudentData] = useState()
    const [feeDetailsGraph, setFeeDetailsGraph] = useState()
    const [branch, setBranch] = useState();
    const today = new Date();
    const currentMonthYear = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", }).format(today);

    useEffect(() => {
        setFeeDetailsGraph(feeDetailsData)
        setactiveBranchFeeDetails(feeDetailsData?.topFeeReceivers?.branches?.[0]?.branchId)
    }, [feeDetailsData])


    /** this is for the counsellor if the user is the counsellor 
     * then this useEffect will run and get the user id from the 
     * localstorage from user details with user id it will hit students api
     */
    useEffect(() => {
        if ((userData?.user?.profile === "Counsellor" || userData?.user?.profile === "counsellor")) {
            const fetchStudentData = async (payload) => {
                const response = await getStudentsListInFeeDetails(payload)
                setStudentData(response?.data?.students)
                // setStudentTableData(response?.data?.students)
                return response.data
            }
            fetchStudentData({
                enquirytakenby: userData?.user?.id,
                ...filteredDatesFeeDetails
            })
        }
    }, [userData?.user])


    /* 
    * Start Of FeeDetails SecoundTable Data
    */


    const [secondTableData, setSecondTableData] = useState();
    const [activeCouncellorFeeDetails, setactiveCouncellorFeeDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (userData?.user?.profile === "Branch Manager" && feeDetailsGraph?.topFeeReceivers?.branches?.[0]?.branchId) {
                const dates = getCurrentMonthDates();
                const data = {
                    admissionFromDate: filteredDatesFeeDetails ? filteredDatesFeeDetails.admissionFromDate : "",
                    admissionToDate: filteredDatesFeeDetails ? filteredDatesFeeDetails.admissionToDate : "",
                    branch: feeDetailsGraph?.topFeeReceivers?.branches?.[0]?.branchId,
                    toDate: filteredDatesFeeDetails ? filteredDatesFeeDetails?.toDate : dates.toDate,
                    fromDate: filteredDatesFeeDetails ? filteredDatesFeeDetails?.fromDate : dates.fromDate,
                };

                try {
                    const tableData = await getFeeReceivedByCouncellorWise(data);
                    setSecondTableData(tableData?.data?.enquirytakenbyData)
                } catch (error) {
                    console.error("Error fetching counsellors list:", error);
                }

            } else {
                setSecondTableData(feeDetailsGraph?.topFeeReceivers?.topEnquiryTakenBy)
            }

        };
        if (userData?.user?.profile === "Branch Manager") {
            setactiveBranchFeeDetails(feeDetailsGraph?.topFeeReceivers?.branches?.[0]?.branchId)
        }

        fetchData();
    }, [feeDetailsGraph?.topFeeReceivers?.branches]);
    /*
     End Of FeeDetails SecoundTable Data
    */


    /** this is the util to get current month first and last date 
     * this is for some api's are needed the first and last date 
     * of the current month if we didn't give the dates getting different data
     */
    const Dates = getCurrentMonthDates();


    /** Filter Start */
    const [filteredDatesFeeDetails, setFilteredDatesFeeDetails] = useState({
        fromDate: Dates.fromDate,
        toDate: Dates.toDate,
        branch: activeBranchFeeDetails,
        admissionFromDate: "",
        admissionToDate: "",
    });


    /** Data Changing Function  */
    const handleDateChangeInFeeDeatils = (e) => {
        const { name, value } = e.target;
        setFilteredDatesFeeDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    /** Filtes Resetting Function */
    const filterReset_FeeDetailsDates = async () => {

        setFilteredDatesFeeDetails({
            fromDate: Dates.fromDate,
            branch: activeBranchFeeDetails,
            toDate: Dates.toDate,
            admissionFromDate: "",
            admissionToDate: "",
        });
        const payload = {
            fromDate: Dates.fromDate,
            branch: activeBranchFeeDetails,
            toDate: Dates.toDate,
            admissionFromDate: "",
            admissionToDate: "",
        }
        const studentPayload = {
            fromDate: Dates.fromDate,
            toDate: Dates.toDate,
            admissionFromDate: "",
            admissionToDate: "",
            enquirytakenby: activeCouncellorFeeDetails
        }
        if ((userData?.user?.profile === "Counsellor" || userData?.user?.profile === "counsellor")) {
            const fetchStudentData = async (payload) => {
                const response = await getStudentsListInFeeDetails(payload)
                setStudentData(response?.data?.students)
                return response.data
            }
            fetchStudentData({
                enquirytakenby: userData?.user?.id,
                fromDate: Dates.fromDate,
                toDate: Dates.toDate,
                admissionFromDate: "",
                admissionToDate: "",
            })
            return;
        } else if (activeBranchFeeDetails && activeCouncellorFeeDetails) {
            const data = await getFeeReceivedByCouncellorWise(payload)

            const studentData = await getStudentsListInFeeDetails(studentPayload)

            const data2 = await getFeeReceivedByBranchWise({
                fromDate: Dates.fromDate,
                toDate: Dates.toDate,
                admissionFromDate: "",
                admissionToDate: "",
            })
            setFeeDetailsGraph(prev => ({
                ...prev,
                topFeeReceivers: data2?.data
            }))


            setSecondTableData(data?.data?.enquirytakenbyData)
            setStudentData(studentData?.data?.students)
        } else if (activeBranchFeeDetails) {
            const data = await getFeeReceivedByCouncellorWise(payload)

            const data2 = await getFeeReceivedByBranchWise({
                fromDate: Dates.fromDate,
                toDate: Dates.toDate,
                admissionFromDate: "",
                admissionToDate: "",
            })
            setFeeDetailsGraph(prev => ({
                ...prev,
                topFeeReceivers: data2?.data
            }))


            setSecondTableData(data?.data?.enquirytakenbyData)
        } else {
            const data = await getFeeReceivedByCouncellorWise(payload)

            const studentData = await getStudentsListInFeeDetails(studentPayload)

            const data2 = await getFeeReceivedByBranchWise({
                fromDate: Dates.fromDate,
                toDate: Dates.toDate,
                admissionFromDate: "",
                admissionToDate: "",
            })
            setFeeDetailsGraph(prev => ({
                ...prev,
                topFeeReceivers: data2?.data
            }))


            setSecondTableData(data?.data?.enquirytakenbyData)
            setStudentData(studentData?.data?.students)
        }
    };

    /** Filter Submitting Function */
    const filterSubmit_FeeDetailsDates = async () => {
        if (
            !filteredDatesFeeDetails.fromDate &&
            !filteredDatesFeeDetails.toDate &&
            !filteredDatesFeeDetails.admissionFromDate &&
            !filteredDatesFeeDetails.admissionToDate
        ) {
            toast.error("Please fill in at least one filter criteria.");
            return;
        }

        if (filteredDatesFeeDetails.fromDate && !filteredDatesFeeDetails.toDate) {
            toast.error("Please select To Date.");
            return;
        }
        if (!filteredDatesFeeDetails.fromDate && filteredDatesFeeDetails.toDate) {
            toast.error("Please select From Date.");
            return;
        }
        if (filteredDatesFeeDetails.fromDate && filteredDatesFeeDetails.toDate) {
            if (new Date(filteredDatesFeeDetails.toDate) < new Date(filteredDatesFeeDetails.fromDate)) {
                toast.error("To Date cannot be earlier than From Date.");
                return;
            }
        }

        if (filteredDatesFeeDetails.admissionFromDate && !filteredDatesFeeDetails.admissionToDate) {
            toast.error("Please select Admission To Date.");
            return;
        }
        if (!filteredDatesFeeDetails.admissionFromDate && filteredDatesFeeDetails.admissionToDate) {
            toast.error("Please select Admission From Date.");
            return;
        }
        if (filteredDatesFeeDetails.admissionFromDate && filteredDatesFeeDetails.admissionToDate) {
            if (new Date(filteredDatesFeeDetails.admissionToDate) < new Date(filteredDatesFeeDetails.admissionFromDate)) {
                toast.error("Admission To Date cannot be earlier than Admission From Date.");
                return;
            }
        }

        const closeOffcanvas = () => {
            const offcanvasElement = document.getElementById("offcanvasRightOne");
            if (offcanvasElement) {
                const offcanvasInstance = Offcanvas.getInstance(offcanvasElement) || (window.bootstrap ? new window.bootstrap.Offcanvas(offcanvasElement) : null);
                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                } else {
                    const closeBtn = offcanvasElement.querySelector('[data-bs-dismiss="offcanvas"]');
                    if (closeBtn) closeBtn.click();
                }
            }
        };

        if ((userData?.user?.profile === "Counsellor" || userData?.user?.profile === "counsellor")) {
            const fetchStudentData = async (payload) => {
                const response = await getStudentsListInFeeDetails(payload)
                setStudentData(response?.data?.students)
                return response.data
            }
            await fetchStudentData({
                enquirytakenby: userData?.user?.id,
                ...filteredDatesFeeDetails,
            });
            closeOffcanvas();
            return;
        } else if (activeBranchFeeDetails && activeCouncellorFeeDetails) {
            try {
                const mergedObject = {
                    ...filteredDatesFeeDetails,
                    branch: activeBranchFeeDetails,
                };
                const payload = {
                    ...filteredDatesFeeDetails,
                    enquirytakenby: activeCouncellorFeeDetails
                }
                const [response, secoundTableData, studentData] = await Promise.all([
                    getFeeReceivedByBranchWise(filteredDatesFeeDetails),
                    getFeeReceivedByCouncellorWise(mergedObject),
                    getStudentsListInFeeDetails(payload)
                ]);
                setFeeDetailsGraph(prev => ({
                    ...prev,
                    topFeeReceivers: response.data
                }))
                setSecondTableData(secoundTableData?.data?.enquirytakenbyData)
                setStudentData(studentData?.data?.students)
            } catch (error) {
                console.error(error)
            }
        } else if (activeBranchFeeDetails) {
            try {
                const mergedObject = {
                    ...filteredDatesFeeDetails,
                    branch: activeBranchFeeDetails,
                };
                const [response, Graphresponse] = await Promise.all([
                    getFeeReceivedByCouncellorWise(mergedObject),
                    getFeeReceivedByBranchWise(filteredDatesFeeDetails)
                ]);
                setFeeDetailsGraph(prev => ({
                    ...prev,
                    topFeeReceivers: Graphresponse?.data
                }))
                setSecondTableData(response?.data?.enquirytakenbyData)
            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                const payload = {
                    ...filteredDatesFeeDetails,
                    branch: activeBranchFeeDetails
                }


                const data = await getCouncellersListInTotalEnrollments(payload)
                setSecondTableData(data?.data?.enquirytakenbyData)
            } catch (error) {
                console.error(error, "Filter Error Fee Details Tab")
            }
        }
        closeOffcanvas();
    };
    /** Filter End */


    const handleCouncellorSubmitfeeDetails = async (enquirytakenby) => {
        setactiveCouncellorFeeDetails(enquirytakenby);
        const counceller = { enquirytakenby };
        const payload = {
            fromDate: filteredDatesFeeDetails.fromDate,
            toDate: filteredDatesFeeDetails.toDate,
            admissionFromDate: filteredDatesFeeDetails.admissionFromDate,
            admissionToDate: filteredDatesFeeDetails.admissionToDate,
            enquirytakenby: enquirytakenby
        }
        const data = await getStudentsListInFeeDetails(payload);
        setStudentData(data?.data?.students)

    };

    /** this is for admin this will change the graph data based one the branch selected */
    const handleBranchSubmitFeeDetails = async (branch) => {
        const payload = {
            ...filteredDatesFeeDetails,
            branch:branch
        }
        setactiveBranchFeeDetails(branch);
        const branchData = await getFeeReceivedByCouncellorWise(payload)
        setSecondTableData(branchData?.data?.enquirytakenbyData)
        const BranchDetails = { branch };
    };

    return (
        <div>
            <div className='row'>
                {/* Graph Component */}
                <FeeDetailsGraphComponent
                    FeeReceivedGraphData={feeDetailsGraph?.graphData}
                    userData={userData}
                    BranchState={BranchState}
                    branchGraph={branchGraph}
                    handleBranchFeeDetailGraph={handleBranchFeeDetailGraph}
                />

                {/* Count component beside the graph */}
                <FeeDetailsTopFeeRecivers
                    userData={userData}
                    topFeeReceivers={feeDetailsGraph?.topFeeReceivers}
                    currentMonthYear={currentMonthYear}
                    ManagerTopFeeReceivers={secondTableData}
                    CounselloersCount={studentData}
                />
            </div>

            {/* Filter  */}
            <div className="mt-2 mb-2 mt-lg-0">
                <div className="mb-0 card">
                    <div className="card-body">
                        <div className="d-flex justify-content-end">
                            <button
                                className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRightOne"
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
                id="offcanvasRightOne"
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
                    {/* Profile filter */}
                    <div>
                        <label className="form-label fs-s fw-medium text_color">
                            From Date
                        </label>
                        <input
                            className="  form-control input_bg_color  date_input_color "
                            id="rdob"
                            name="fromDate"
                            type="date"
                            max={filteredDatesFeeDetails?.toDate || undefined}
                            onChange={handleDateChangeInFeeDeatils}
                            value={filteredDatesFeeDetails?.fromDate}
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
                            min={filteredDatesFeeDetails?.fromDate || undefined}
                            onChange={handleDateChangeInFeeDeatils}
                            value={filteredDatesFeeDetails?.toDate}
                        />
                    </div>

                    <div className="mt-2">
                        <label className="form-label fs-s fw-medium text_color">
                            Admission From Date
                        </label>
                        <input
                            className=" form-control input_bg_color  date_input_color "
                            id="rdob"
                            name="admissionFromDate"
                            type="date"
                            max={filteredDatesFeeDetails?.admissionToDate || undefined}
                            onChange={handleDateChangeInFeeDeatils}
                            value={filteredDatesFeeDetails?.admissionFromDate}
                        />
                    </div>
                    <div className="mt-2">
                        <label className="form-label fs-s fw-medium text_color">
                            Admission To Date
                        </label>
                        <input
                            className=" form-control input_bg_color  date_input_color "
                            id="rdob"
                            name="admissionToDate"
                            type="date"
                            min={filteredDatesFeeDetails?.admissionFromDate || undefined}
                            onChange={handleDateChangeInFeeDeatils}
                            value={filteredDatesFeeDetails?.admissionToDate}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                        <button
                            className="btn btn_primary"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                            onClick={filterReset_FeeDetailsDates}
                        >
                            Clear
                        </button>
                    </div>
                    <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                        <Button
                            className="btn btn_primary"
                            onClick={filterSubmit_FeeDetailsDates}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
            {/* All the three table components parent component */}
            <FeeDetailsTables
                userData={userData}
                FirstTableData={feeDetailsGraph?.topFeeReceivers}
                handleCouncellorSubmitfeeDetails={handleCouncellorSubmitfeeDetails}
                activeCouncellorFeeDetails={activeCouncellorFeeDetails}
                secondTableData={secondTableData}
                StudentData={studentData}
                activeBranchFeeDetails={activeBranchFeeDetails}
                handleBranchSubmitFeeDetails={handleBranchSubmitFeeDetails}
            />
        </div>
    )
}

export default FeeDetails
