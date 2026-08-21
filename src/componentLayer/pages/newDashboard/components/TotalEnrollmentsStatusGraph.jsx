import React, { useEffect, useState } from 'react'
import CountUp from '../../../../utils/CountUp';
import { MdArrowOutward } from 'react-icons/md';
import { FiArrowDownRight } from 'react-icons/fi';
import { LiaRupeeSignSolid } from 'react-icons/lia';
import ReactApexChart from 'react-apexcharts';
import { getCouncellersListInTotalEnrollments, getCurrentMonthDates, getStudentsListInTotalEnrollments, getTotalEnrollmentDeatils, getTotalEnrollmentGraph } from '../utils/DataUtilities';
import TopEnrollersSideCount from './TopEnrollersSideCount';
import FirstTabTables from './FirstTabTables';
import { Offcanvas } from 'bootstrap';
import Select from "react-select";
import { ERPApi } from '../../../../serviceLayer/interceptor';
import { debounce } from '../../../../utils/Utils';

const TotalEnrollmentsStatusGraph = ({ getTaboneData, userData, TotalEnrollmentGraphData, BranchState }) => {

    const [TotalEnrollmentGraph, setTotalEnrollmentGraph] = useState(TotalEnrollmentGraphData.TotalEnrollments || [])

    const [branchList, setBranchList] = useState();
    useEffect(() => {
        const branches = BranchState?.map((item) => ({
            label: item.branch_name,
            value: item.id
        })) || [];

        // Add the static "All" option at the start or end
        const allOption = { label: "All", value: "allbranches" };

        // Add "All" option dynamically to the list
        const updatedBranchList = [allOption, ...branches]; // or use: [...branches, allOption] to add at the end

        setBranchList(updatedBranchList);

    }, [BranchState])

    const [chartData, setChartData] = useState({
        Enrollements: [
            {
                name: "Total Enrollments Count",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
        ],
        options: {
            chart: {
                height: 350,
                type: "bar",
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    columnWidth: "45%",
                    dataLabels: {
                        position: "top",
                    },
                },
            },
            dataLabels: {
                enabled: true,
                offsetY: -18,
                style: {
                    fontSize: "12px",
                    colors: ["#fff"],
                },
                formatter: function (val) {
                    return val;
                },
            },
            colors: ["#405189"],
            xaxis: {
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
                labels: {},
                axisTicks: {
                    show: true,
                    style: {
                        colors: "#405189",
                        lineAtIndex: 1,
                        beginAtZero: true,
                    },
                },
            },
            yaxis: {
                gridLines: {
                    zeroLineColor: "#ffcc33",
                },
            },
        },
    });

    useEffect(() => {
        if (TotalEnrollmentGraph?.yearlyEnrollments) {
            setChartData((prev) => ({
                ...prev,
                Enrollements: transformData([TotalEnrollmentGraph?.yearlyEnrollments]),
            }));
        }
    }, [TotalEnrollmentGraph?.yearlyEnrollments, TotalEnrollmentGraph]);

    const transformData = (monthlyData) => {
        const categories = Object.keys(monthlyData[0]);
        const data = categories.map((month) => monthlyData[0][month]);
        return [{ data }];
    };

    const [formDataGraph, setFormDataGraph] = useState({
        branch: "",
    });

    // const HandleBranchGraph = async (e) => {
    //     const { name, value } = e.target;
    //     setFormDataGraph((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    //     const branch = e.target.value;

    //     const newTotalEnrollmentGraph = await getTotalEnrollmentGraph(branch)
    //     setTotalEnrollmentGraph(newTotalEnrollmentGraph.data)
    //     getTaboneData(newTotalEnrollmentGraph.data?.currentEnrollments)
    //     // currentEnrollments

    // }

    const HandleBranchGraph = async (e) => {
        const { name, value } = e.target;
        setFormDataGraph((prev) => ({
            ...prev,
            [name]: value,
        }));

        const branch = e.target.value;

        try {
            // Fetch the graph data based on selected branch
            const newTotalEnrollmentGraph = await getTotalEnrollmentGraph(branch);
            setTotalEnrollmentGraph(newTotalEnrollmentGraph.data);
            getTaboneData(newTotalEnrollmentGraph.data?.currentEnrollments);
        } catch (error) {
            console.error('Error fetching graph data:', error);
        }
    };

    useEffect(() => {
        setTotalEnrollmentGraph(TotalEnrollmentGraphData?.TotalEnrollments || [])
    }, [TotalEnrollmentGraphData?.TotalEnrollments])

    const [newTopEnrollers, setNewTopEnrollers] = useState()
    const updateTopEnrollers = (data) => {
        setNewTopEnrollers(data);
        return data;
    };




    const [studentCountData, setStudentCountData] = useState([])


    useEffect(() => {
        if ((userData?.user?.profile === "Counsellor" || userData?.user?.profile === "counsellor")) {
            const fetchStudentData = async (payload) => {
                const response = await getStudentsListInTotalEnrollments(payload)
                setStudentCountData(response?.data?.students)
                setStudentTableData(response?.data?.students)
                return response.data
            }
            fetchStudentData({
                enquirytakenby: userData?.user?.id,
                ...filterDatesTotalEnrollments
            })
        }
    }, [userData?.user])



    /***************************************************
     * *************************************************
     * Tables Data Start Here ***************************
     * ************************************************* 
     * *************************************************/

    const [loadingStates, setLoadingStates] = useState({
        branchLoading: false,
        councellerLoading: false,
        studentLoading: false,
    });


    const [activeBranch, setActiveBranch] = useState(null);
    const [activeCouncellor, setActiveCouncellor] = useState(null);
    const [firstTableData, setFirstTableData] = useState()
    const [secondTableData, setSecondTableData] = useState()
    const [studentTableData, setStudentTableData] = useState()
    const [branchManagerData, setBranchManagerData] = useState()
    const [adminSideCount, setAdminSideCount] = useState()
    const [filterDatesTotalEnrollments, setFilterDatesTotalEnrollments] = useState({
        fromDate: "",
        toDate: "",
    });



    useEffect(() => {
        setFirstTableData(TotalEnrollmentGraphData?.TopEnrollers?.branches)
        if (userData?.user?.profile !== "Branch Manager") {
            setSecondTableData(TotalEnrollmentGraphData?.TopEnrollers?.topEnquiryTakenBy)
        }
    }, [TotalEnrollmentGraphData.TopEnrollers])


    /* For Branch Manager this UseEffect will take the Branch manager Id 
       and hit the get all councellors API with manager Id 
    */
    useEffect(() => {
        const loadData = async () => {
            const branchId = TotalEnrollmentGraphData?.TopEnrollers?.branches?.[0]?.branchId;
            if (userData?.user?.profile === "Branch Manager" && branchId) {

                const dates = getCurrentMonthDates();
                const payload = {
                    branch: branchId,
                    fromDate: dates.fromDate, // ✅ fixed typo
                    toDate: dates.toDate,
                };

                const dataOfSecondTable = await getCouncellersListInTotalEnrollments(payload);
                setBranchManagerData(dataOfSecondTable.data.enquirytakenbyData)
                setSecondTableData(dataOfSecondTable.data.enquirytakenbyData)
            }
        };
        if (userData?.user?.profile !== "Admin") {
            setActiveBranch(TotalEnrollmentGraphData?.TopEnrollers?.branches?.[0]?.branchId)
            loadData();
        }

    }, [TotalEnrollmentGraphData?.TopEnrollers?.branches?.[0]?.branchId]);




    const handleBranchSubmit = async (branch, filters) => {
        const payload = {
            ...filterDatesTotalEnrollments || {},
            branch: branch
        }
        setActiveBranch(branch);
        try {
            setLoadingStates((prev) => ({ ...prev, councellerLoading: true }));
            const response = await getCouncellersListInTotalEnrollments(payload);
            // setTablesData((prev) => ({
            //     ...prev,
            //     enrollmentsByCouncellors: response?.data?.enquirytakenbyData || [],
            //     councellerWiseStudentsDetails: []
            // }))
            setSecondTableData(response?.data?.enquirytakenbyData)
            setLoadingStates((prev) => ({ ...prev, councellerLoading: false }));

        } catch (error) {
            setLoadingStates((prev) => ({ ...prev, councellerLoading: false }));
        }
        const BranchDetails = { branch };
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilterDatesTotalEnrollments((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCouncellorSubmit = async (enquirytakenby) => {
        setActiveCouncellor(enquirytakenby);
        try {
            setLoadingStates((prev) => ({ ...prev, studentLoading: true }));
            const response = await getStudentsListInTotalEnrollments({
                enquirytakenby: enquirytakenby,
                fromDate: filterDatesTotalEnrollments ? filterDatesTotalEnrollments.fromDate : "",
                toDate: filterDatesTotalEnrollments ? filterDatesTotalEnrollments.toDate : ""
            });

            setStudentTableData(response?.data.students)
            setLoadingStates((prev) => ({ ...prev, studentLoading: false }));

        } catch (error) {
            setLoadingStates((prev) => ({ ...prev, studentLoading: false }));
        }
    };

    const filterResetTotalEnrollementDates = async () => {
        setFilterDatesTotalEnrollments({
            fromDate: "",
            toDate: "",
        });
        if ((userData?.user?.profile === "Counsellor" || userData?.user?.profile === "counsellor")) {
            const fetchStudentData = async (payload) => {
                const response = await getStudentsListInTotalEnrollments(payload)
                setStudentCountData(response?.data?.students)
                setStudentTableData(response?.data?.students)
                return response.data
            }
            fetchStudentData({
                enquirytakenby: userData?.user?.id,
                fromDate: "",
                toDate: "",
            })
            return;
        } else if (activeBranch && activeCouncellor) {
            try {
                const mergedObject = {
                    branch: activeBranch, fromDate: "",
                    toDate: "",
                };
                const [response, Graphresponse, studentData] = await Promise.all([
                    getCouncellersListInTotalEnrollments(mergedObject),
                    getTotalEnrollmentDeatils({ fromDate: "", toDate: "" }),
                    getStudentsListInTotalEnrollments({ enquirytakenby: activeCouncellor, fromDate: "", toDate: "" })
                ]);
                // setTablesData((prev) => ({
                //     ...prev,
                //     enrolmentsInBranch: Graphresponse.data.branches,
                //     enrollmentsByCouncellors: response?.data?.enquirytakenbyData || [],
                //     councellerWiseStudentsDetails: studentData.data.students || []
                // }))
                setFirstTableData(Graphresponse?.data?.branches)
                setSecondTableData(response?.data?.enquirytakenbyData)
                setBranchManagerData(response?.data?.enquirytakenbyData)
                setStudentTableData(studentData?.data?.students)
                setAdminSideCount(Graphresponse?.data?.branches)
                updateTopEnrollers(Graphresponse)
            } catch (error) {
                console.error(error)
            }
        }
        else if (activeBranch) {
            try {
                const mergedObject = {
                    branch: activeBranch,
                    fromDate: "",
                    toDate: "",
                };
                const [response, Graphresponse] = await Promise.all([
                    getCouncellersListInTotalEnrollments(mergedObject),
                    getTotalEnrollmentDeatils({
                        fromDate: "",
                        toDate: "",
                    })
                ]);

                // setTablesData((prev) => ({
                //     ...prev,
                //     enrolmentsInBranch: Graphresponse.data.branches,
                //     enrollmentsByCouncellors: response?.data?.enquirytakenbyData || [],
                //     councellerWiseStudentsDetails: []
                // }))
                setFirstTableData(Graphresponse.data.branches)
                setSecondTableData(response?.data?.enquirytakenbyData)
                setStudentTableData([])
                updateTopEnrollers(Graphresponse)
            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                const response = await getTotalEnrollmentDeatils({
                    fromDate: "",
                    toDate: "",
                });
                setFirstTableData(response?.data?.branches)
            } catch (error) {
                console.error(error)
            }
        }

    };

    const filterSubmitTotalEnrollemntDates = async () => {
        if (
            !filterDatesTotalEnrollments.fromDate &&
            !filterDatesTotalEnrollments.toDate
        ) {
            toast.error("Please fill in at least one filter criteria.");
            return;
        }

        if (filterDatesTotalEnrollments.fromDate && !filterDatesTotalEnrollments.toDate) {
            toast.error("Please select To Date.");
            return;
        }

        if (!filterDatesTotalEnrollments.fromDate && filterDatesTotalEnrollments.toDate) {
            toast.error("Please select From Date.");
            return;
        }

        if (filterDatesTotalEnrollments.fromDate && filterDatesTotalEnrollments.toDate) {
            if (new Date(filterDatesTotalEnrollments.toDate) < new Date(filterDatesTotalEnrollments.fromDate)) {
                toast.error("To Date cannot be earlier than From Date.");
                return;
            }
        }

        const closeOffcanvas = () => {
            const offcanvasElement = document.getElementById("offcanvasRight");
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
                const response = await getStudentsListInTotalEnrollments(payload)
                setStudentCountData(response?.data?.students)
                setStudentTableData(response?.data?.students)
                return response.data
            }
            await fetchStudentData({
                enquirytakenby: userData?.user?.id,
                ...filterDatesTotalEnrollments
            });
            closeOffcanvas();
            return;
        } else if (activeBranch && activeCouncellor) {
            try {
                const mergedObject = { branch: activeBranch, ...filterDatesTotalEnrollments };
                const [response, Graphresponse, studentData] = await Promise.all([
                    getCouncellersListInTotalEnrollments(mergedObject),
                    getTotalEnrollmentDeatils(filterDatesTotalEnrollments),
                    getStudentsListInTotalEnrollments({
                        enquirytakenby: activeCouncellor,
                        ...filterDatesTotalEnrollments
                    })
                ]);

                setFirstTableData(Graphresponse?.data?.branches)
                setSecondTableData(response?.data?.enquirytakenbyData)
                setBranchManagerData(response?.data?.enquirytakenbyData)
                setStudentTableData(studentData?.data?.students)
                setAdminSideCount(Graphresponse?.data?.branches)
                updateTopEnrollers(Graphresponse)
            } catch (error) {
                console.error(error)
            }
        }
        else if (activeBranch) {
            try {
                const mergedObject = { branch: activeBranch, ...filterDatesTotalEnrollments };
                const [response, Graphresponse] = await Promise.all([
                    getCouncellersListInTotalEnrollments(mergedObject),
                    getTotalEnrollmentDeatils(filterDatesTotalEnrollments)
                ]);

                setFirstTableData(Graphresponse?.data?.branches)
                setAdminSideCount(Graphresponse?.data?.branches)
                setSecondTableData(response?.data?.enquirytakenbyData)
                setBranchManagerData(response?.data?.enquirytakenbyData)
                setStudentTableData([]);
                updateTopEnrollers(Graphresponse)
            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                const response = await getTotalEnrollmentDeatils(filterDatesTotalEnrollments);
                setFirstTableData(response?.data?.branches)
                setSecondTableData(response?.data?.topEnquiryTakenBy)
            } catch (error) {
                console.error(error)
            }
        }
        closeOffcanvas();
    };
    // Branch Search function
    const searchBranch = async (search) => {
        try {
            // setLoading(true); // Set loading to true while fetching data
            const { status, data } = await ERPApi.get(
                `${import.meta.env.VITE_API_URL}/settings/getbranch?search=${search}`
            );

            const branchData = data?.branchData?.map((item) => ({
                label: item.branch_name,
                value: item.id,
            }));
            const allOption = {
                label: "All", value: "allbranches"
            }


            // Add "All" option dynamically to the list
            const updatedBranchList = [allOption, ...branchData];
            // Update branch list for react-select
            setBranchList(updatedBranchList);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Set loading to false once data fetching is done
        }
    };

    let timeoutId; // Store the timeout ID globally

    // const trigersearch = (search) => {
    //     // Clear any previously set timeout
    //     clearTimeout(timeoutId);

    //     // Set a new timeout to delay the search
    //     timeoutId = setTimeout(() => {
    //         searchBranch(search);
    //     }, 1500); // Adjust the delay as needed
    // };
    const debouncedSearch = debounce((search) => {
        searchBranch(search); // Call the searchBranch function after the debounce delay
    }, 1500);

    const trigersearch = (search) => {

        debouncedSearch(search)
    };




    /***************************************************
     * *************************************************
     * Tables Data End Here ***************************
     * ************************************************* 
     * *************************************************/

    return (
        <div>
            <div className="row">
                <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="card">
                        <div className="card-body mb-3">
                            <div className=" d-flex justify-content-between">
                                <div>
                                    {" "}
                                    <h6 className="">Overall Status Graph</h6>
                                </div>
                                <div className="col-lg-3 mb-2">
                                    {userData &&
                                        userData?.user &&
                                        userData?.user?.profile !== "Counsellor" &&
                                        userData?.user?.profile !== "counsellor" &&
                                        userData?.user?.profile !== "Branch Manager" && (
                                            // <select
                                            //     className="form-control fs-s bg-form text_color input_bg_color select form-select"
                                            //     aria-label=""
                                            //     placeholder=""
                                            //     id="branch"
                                            //     name="branch"
                                            //     value={formDataGraph?.branch}
                                            //     onChange={HandleBranchGraph}
                                            //     required
                                            // >
                                            //     <option value="allbranches" selected>
                                            //         All
                                            //     </option>
                                            //     {BranchState &&
                                            //         BranchState?.length > 0
                                            //         ? BranchState?.map(
                                            //             (item, index) => (
                                            //                 <option key={index} value={item.id}>
                                            //                     {item?.branch_name}
                                            //                 </option>
                                            //             )
                                            //         )
                                            //         : null}
                                            // </select>
                                            <Select
                                                id="branch"
                                                name="branch"
                                                placeholder="Search Branch"
                                                classNamePrefix="Search"
                                                className="fs-s bg-form text_color input_bg_color"
                                                options={branchList || []}  // Branch options from API
                                                onInputChange={(inputValue) => {
                                                    trigersearch(inputValue);  // Fetch new branches based on search input
                                                }}
                                                onChange={async (selectedOption) => {
                                                    if (selectedOption) {
                                                        const branchId = selectedOption?.value; // This will be the branch id
                                                        await HandleBranchGraph({ target: { name: "branch", value: branchId } });
                                                    }
                                                }}
                                                isClearable
                                                getOptionLabel={(e) => e.label}
                                                getOptionValue={(e) => e.value}
                                            />
                                        )}
                                </div>
                            </div>

                            <div className="row g-0 text-center text_background">
                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="p-2 border border-dashed border-start-1 h-100">
                                        <p className="mb-0 fs-7 text-mute">
                                            Total Enrollments
                                        </p>
                                        <h5 className="mb-1 fs-16 display_no">
                                            <span
                                                className="counter-value fw-500 black_500"
                                                data-target="7585"
                                            >
                                                <CountUp
                                                    finalValue={
                                                        TotalEnrollmentGraph?.totalEnrollments
                                                    }
                                                />
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="p-2 border border-dashed border-start-0 h-100">
                                        <p className="mb-0 fs-7 text-mute">
                                            Last Month Total Enrollments
                                        </p>
                                        <h5 className="mb-1 fs-16 display_no">
                                            <span
                                                className="counter-value fw-500 black_500 "
                                                data-target="22.89"
                                            >
                                                <CountUp
                                                    finalValue={
                                                        TotalEnrollmentGraph?.lastMonthEnrollments
                                                    }
                                                />
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="p-2 border border-dashed border-start-0 h-100">
                                        <p className=" mb-0 fs-7 text-mute ">
                                            Current Month Enrollments - As on Date
                                        </p>
                                        <h5 className="mb-1 fs-16 display_no">
                                            <span
                                                className="counter-value fw-500 black_500"
                                                data-target="367"
                                            >
                                                <CountUp
                                                    finalValue={
                                                        TotalEnrollmentGraph?.currentEnrollments
                                                    }
                                                />
                                                <span className="bract-sz"> {"("}</span>
                                                {TotalEnrollmentGraph?.lastAndCurrentMonthEnrollementsDifference &&
                                                    TotalEnrollmentGraph?.lastAndCurrentMonthEnrollementsDifference > 0 ? (
                                                    <>
                                                        <span className="text-success">
                                                            <CountUp
                                                                finalValue={
                                                                    TotalEnrollmentGraph?.lastAndCurrentMonthEnrollementsDifference
                                                                }
                                                            />
                                                        </span>
                                                        <MdArrowOutward className="text-success fs-14  mb-0" />
                                                    </>
                                                ) : TotalEnrollmentGraph?.lastAndCurrentMonthEnrollementsDifference < 0 ? (
                                                    <>
                                                        <span className="text-danger fs-12">
                                                            <CountUp
                                                                finalValue={
                                                                    TotalEnrollmentGraph?.lastAndCurrentMonthEnrollementsDifference
                                                                }
                                                            />
                                                        </span>
                                                        <FiArrowDownRight className="text-danger fs-12" />
                                                    </>
                                                ) : (
                                                    <span className="">
                                                        <CountUp
                                                            finalValue={
                                                                TotalEnrollmentGraph?.lastAndCurrentMonthEnrollementsDifference
                                                            }
                                                        />
                                                    </span>
                                                )}
                                                <span className="bract-sz">{" )"}</span>
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="p-3 border border-dashed border-start-0">
                                        <p className=" mb-0 fs-7 text-mute bottom_space">
                                            Current Month Booking Amount - As On Date
                                        </p>

                                        <h5 className="mb-1 fs-16 display_no">
                                            <span
                                                className="counter-value fw-500 black_500"
                                                data-target="367"
                                            >
                                                <LiaRupeeSignSolid />
                                                <CountUp
                                                    finalValue={
                                                        TotalEnrollmentGraph?.currentMonthFinalTotal
                                                    }
                                                />
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-0 text-center text_background">
                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="p-2 border border-dashed border-start- h-100">
                                        <p className="mb-0 fs-7 text-mute">
                                            Total Booking Amount
                                        </p>
                                        <h5
                                            className="mb-1 fs-16 display_no"
                                            data-target="7585"
                                        >
                                            <span
                                                className="counter-value fw-500 black_500"
                                                data-target="367"
                                            >
                                                <LiaRupeeSignSolid />
                                                <CountUp
                                                    finalValue={
                                                        TotalEnrollmentGraph?.overallFinalTotal
                                                    }
                                                />
                                            </span>
                                        </h5>
                                    </div>
                                </div>

                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="p-2 border border-dashed border-start-0 h-100">
                                        <p className="mb-0 fs-7 text-mute">
                                            Last Month Total Booking Amount
                                        </p>
                                        <h5 className="mb-1 fs-16 display_no">
                                            <span
                                                className="counter-value fw-500 black_500"
                                                data-target="367"
                                            >
                                                <LiaRupeeSignSolid />
                                                <CountUp
                                                    finalValue={
                                                        TotalEnrollmentGraph?.lastMonthFinalTotal
                                                    }
                                                />
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="p-2 border border-dashed border-start-0 h-100">
                                        <p className=" mb-0 fs-7 text-mute ">
                                            Last Month Enrollements - As On Date
                                        </p>
                                        <h5 className="mb-1 fs-16 display_no">
                                            <span
                                                className="counter-value fw-500 black_500"
                                                data-target="367"
                                            >
                                                <CountUp
                                                    finalValue={
                                                        TotalEnrollmentGraph?.lastMonthAsOnDateEnrollments
                                                    }
                                                />
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                                    <div className="p-2 border border-dashed border-start-0 h-100">
                                        <p className="mb-0 fs-7 text-mute">
                                            Current Month Fee Received - As On Date
                                        </p>
                                        <h5 className="mb-1 fs-16 display_no">
                                            <span
                                                className="counter-value fw-500 black_500"
                                                data-target="367"
                                            >
                                                <LiaRupeeSignSolid />

                                                <CountUp
                                                    finalValue={
                                                        TotalEnrollmentGraph?.currentMonthFeeRecevied
                                                    }
                                                />
                                            </span>
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div id="chart">
                                    <ReactApexChart
                                        className="apex-charts"
                                        options={chartData?.options}
                                        series={chartData?.Enrollements}
                                        type="bar"
                                        height={350}
                                    />
                                </div>
                                <div id="html-dist"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <TopEnrollersSideCount
                    userData={userData}
                    AdminSideCount={firstTableData}
                    TotalEnrollementDetailsData={TotalEnrollmentGraphData}
                    newTopEnrollers={newTopEnrollers}
                    BranchManagerData={branchManagerData}
                    StudentCountData={studentCountData}
                />
            </div>
            <FirstTabTables
                userData={userData}
                // TotalEnrollementDetailsData={TotalEnrollmentGraphData.TopEnrollers}
                updateTopEnrollers={updateTopEnrollers}
                loadingStates={loadingStates}
                firstTableData={firstTableData}
                secondTableData={secondTableData}
                handleBranchSubmit={handleBranchSubmit}
                filterDatesTotalEnrollments={filterDatesTotalEnrollments}
                handleDateChange={handleDateChange}
                handleCouncellorSubmit={handleCouncellorSubmit}
                filterResetTotalEnrollementDates={filterResetTotalEnrollementDates}
                filterSubmitTotalEnrollemntDates={filterSubmitTotalEnrollemntDates}
                activeBranch={activeBranch}
                activeCouncellor={activeCouncellor}
                studentTableData={studentTableData}
            />
        </div>
    )
}

export default TotalEnrollmentsStatusGraph
