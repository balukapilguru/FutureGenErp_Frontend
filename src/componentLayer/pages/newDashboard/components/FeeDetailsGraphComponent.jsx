import React, { useEffect, useState } from 'react'
import { LiaRupeeSignSolid } from 'react-icons/lia'
import CountUp from '../../../../utils/CountUp'
import { MdArrowOutward } from 'react-icons/md'
import { FiArrowDownRight } from 'react-icons/fi'
import ReactApexChart from 'react-apexcharts'
import Select from "react-select";
import { ERPApi } from '../../../../serviceLayer/interceptor'
import { debounce } from '../../../../utils/Utils'


const FeeDetailsGraphComponent = ({
    userData,
    FeeReceivedGraphData,
    BranchState,
    branchGraph,
    handleBranchFeeDetailGraph
}) => {

    const [graphData, setGraphData] = useState()
    useEffect(() => {
        if (
            graphData?.yearlyFeeReceived &&
            graphData?.yearlyFeeYetRecevie
        ) {
            setChartDatas((prev) => ({
                ...prev,
                Enrollments: {
                    ...prev.Enrollments,
                    series: transformData1(
                        [graphData?.yearlyFeeReceived],
                        [graphData?.yearlyFeeYetRecevie]
                    ),
                },
            }));
        }
    }, [
        graphData?.yearlyFeeReceived,
        graphData?.yearlyFeeYetRecevie,
    ]);
    useEffect(() => {
        setGraphData(FeeReceivedGraphData);
    }, [FeeReceivedGraphData])

    const transformData1 = (feeReceive, feeYetToRecive) => {
        const feeCategories = Object.keys(feeReceive[0]);
        const enrollmentCategories = Object.keys(feeYetToRecive[0]);
        const feeReceivedValues = feeCategories.map(
            (month) => feeReceive[0][month]
        );
        const feeYetToReciveValues = enrollmentCategories.map(
            (month) => feeYetToRecive[0][month]
        );

        const transformedData = [
            { name: "Fee Received", data: feeReceivedValues, color: "#405189" },
            { name: "Fee Yet Recevie", data: feeYetToReciveValues, color: "#eb6329" },
        ];
        return transformedData;
    };
    const [chartDatas, setChartDatas] = useState({
        Enrollments: {
            series: [
                {
                    name: "FeeReceived",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    color: "#405189",
                },
                {
                    name: "FeeYetRecevie",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    color: "#eb6329",
                },
            ],
        },
        yaxis: [
            {
                min: 1000000,
                max: 500000000,
                tickAmount: 4,
                logarithmic: true,
                seriesName: "FeeReceived",
            },
            {
                min: 1000000,
                max: 500000000,
                opposite: true,
                tickAmount: 4,
                seriesName: "FeeYetRecevie",
            },
        ],
        options: {
            yAxes: [
                {
                    gridLines: {
                        zeroLineColor: "#eb6329",
                    },
                },
            ],
            chart: {
                height: 350,
                type: "bar",
                toolbar: {
                    show: false,
                },
            },
            plotOptions: {
                bar: {
                    columnWidth: "100%",
                    dataLabels: {
                        position: "top", // Position the data labels inside the bars
                    },
                },
            },
            colors: ["#405189", "#eb6329"],
            dataLabels: {
                enabled: false, // Enable data labels
                offsetY: -18,
                style: {
                    fontSize: "12px", // Decrease font size here
                    colors: ["#fff"],
                },
                formatter: function (val) {
                    return val;
                },
            },
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
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                },
            },

            responsive: [
                {
                    breakpoint: 1000,
                    options: {
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [
                                {
                                    ticks: {
                                        autoSkip: false,
                                        minRotation: 45,
                                        maxRotation: 90,
                                    },
                                },
                            ],
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                        autoSkip: false,
                                        rotation: -45,
                                    },
                                },
                            ],
                        },
                    },
                },
            ],
        },
    });



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

    return (
        <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="card">
                <div className="card-body mb-3">
                    <div className="d-flex justify-content-between">
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
                                    //     value={branchGraph?.branch}
                                    //     onChange={handleBranchFeeDetailGraph}
                                    //     required
                                    // >
                                    //     <option value="allbranches" selected>
                                    //         All
                                    //     </option>
                                    //     {BranchState &&
                                    //         BranchState?.length > 0
                                    //         ? BranchState?.map(
                                    //             (item, index) => (
                                    //                 <option key={index} value={item?.id}>
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
                                                await handleBranchFeeDetailGraph({ target: { name: "branch", value: branchId } });
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
                                    Total Fee Received
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
                                                graphData?.totalFeeReceived
                                            }
                                        />
                                    </span>
                                </h5>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                                <p className="mb-0 fs-7 text-mute">
                                    Last Month Fee Received
                                </p>
                                <h5 className="mb-1 fs-16 display_no">
                                    <span
                                        className="counter-value fw-500 black_500"
                                        data-target="367"
                                    >
                                        <LiaRupeeSignSolid />
                                        <CountUp
                                            finalValue={
                                                graphData?.lastMonthFeeReceived
                                            }
                                        />
                                    </span>
                                </h5>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                                <div className="">
                                    <p className=" mb-0 fs-7 text-mute ">
                                        Last Month Fee Recevied - As on Date
                                    </p>
                                    <h5 className="mb-1 fs-16 display_no">
                                        <span
                                            className="counter-value fw-500 black_500"
                                            data-target="367"
                                        >
                                            <LiaRupeeSignSolid />
                                            <CountUp
                                                finalValue={
                                                    graphData?.lastMonthFeeReceivedAsOnDate
                                                }
                                            />
                                        </span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100 mb-4">
                                <p className="mb-0 fs-7 text-mute">
                                    Current Month Fee Received
                                </p>
                                <h5 className="mb-1 fs-16 display_no">
                                    <span
                                        className="counter-value fw-500 black_500"
                                        data-target="367"
                                    >
                                        <LiaRupeeSignSolid />
                                        <CountUp
                                            finalValue={
                                                graphData?.currentFeeReceived
                                            }
                                        />

                                        {graphData?.feeReceiveddifference &&
                                            graphData?.feeReceiveddifference >
                                            0 ? (
                                            <>
                                                <span className="bract-sz"> {"("}</span>
                                                <LiaRupeeSignSolid />
                                                <span className="text-success fs-12 ">
                                                    <CountUp
                                                        finalValue={
                                                            graphData?.feeReceiveddifference
                                                        }
                                                    />
                                                </span>
                                                <MdArrowOutward className="text-success fs-12  mb-0" />
                                                <span className="bract-sz"> {")"}</span>
                                            </>
                                        ) : graphData?.feeReceiveddifference <
                                            0 ? (
                                            <>
                                                <br />
                                                <span className="bract-sz"> {"("}</span>
                                                <LiaRupeeSignSolid />
                                                <span className="text-danger fs-12">
                                                    <CountUp
                                                        finalValue={
                                                            graphData?.feeReceiveddifference
                                                        }
                                                    />
                                                </span>
                                                <FiArrowDownRight className="text-danger fs-12" />
                                                <span className="bract-sz"> {")"}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="bract-sz"> {"("}</span>
                                                <span className="">
                                                    <LiaRupeeSignSolid />
                                                    <CountUp
                                                        finalValue={
                                                            graphData?.feeReceiveddifference
                                                        }
                                                    />
                                                </span>
                                                <span className="bract-sz"> {")"}</span>
                                            </>
                                        )}
                                    </span>
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="row g-0 text-center text_background">
                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start- h-100">
                                <p className="mb-0 fs-7 text-mute">
                                    Total Fee Yet To Receive
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
                                                graphData?.totalFeeYetToReceive
                                            }
                                        />
                                    </span>
                                </h5>
                            </div>
                        </div>

                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                                <p className="mb-0 fs-7 text-mute">
                                    Last Month Fee Yet to Receive
                                </p>
                                <h5 className="mb-1 fs-16 display_no">
                                    <span
                                        className="counter-value fw-500 black_500"
                                        data-target="367"
                                    >
                                        <LiaRupeeSignSolid />
                                        <CountUp
                                            finalValue={
                                                graphData?.lastMonthFeeYetToReceived
                                            }
                                        />
                                    </span>
                                </h5>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-1 border border-dashed border-start-0 h-100 mb-4">
                                <p className=" mb-0 fs-7 text-mute ">
                                    Current Month Fee Yet to Receive
                                </p>
                                <h5 className="mb-0 fs-12 display_no">
                                    <span
                                        className="counter-value fw-500 black_500"
                                        data-target="367"
                                    >
                                        <LiaRupeeSignSolid />
                                        <CountUp
                                            finalValue={
                                                graphData?.currentFeeYetToReceived
                                            }
                                        />

                                        {graphData?.feeYetToReceiveddifference &&
                                            graphData?.feeYetToReceiveddifference >
                                            0 ? (
                                            <>
                                                <br />
                                                <span className="bract-sz"> {"("}</span>
                                                <LiaRupeeSignSolid />
                                                <span className="text-success fs-12">
                                                    <CountUp
                                                        finalValue={
                                                            graphData?.feeYetToReceiveddifference
                                                        }
                                                    />
                                                </span>
                                                <MdArrowOutward className="text-success fs-12  mb-0" />
                                                <span className="bract-sz"> {")"}</span>
                                            </>
                                        ) : graphData?.feeYetToReceiveddifference <
                                            0 ? (
                                            <>
                                                <br />
                                                <span className="bract-sz"> {"("}</span>
                                                <LiaRupeeSignSolid />
                                                <span className="text-danger fs-12">
                                                    <CountUp
                                                        finalValue={
                                                            graphData?.feeYetToReceiveddifference
                                                        }
                                                    />
                                                </span>
                                                <FiArrowDownRight className="text-danger fs-12" />
                                                <span className="bract-sz"> {")"}</span>
                                            </>
                                        ) : (
                                            <>
                                                <br />
                                                <span className="bract-sz"> {"("}</span>

                                                <span className="">
                                                    <LiaRupeeSignSolid />
                                                    <CountUp
                                                        finalValue={
                                                            graphData?.feeYetToReceiveddifference
                                                        }
                                                    />
                                                </span>
                                                <span className="bract-sz"> {")"}</span>
                                            </>
                                        )}
                                    </span>
                                </h5>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                            <div className="p-2 border border-dashed border-start-0 h-100">
                                <p className="mb-0 fs-7 text-mute">
                                    {`Last Three Months Fee Yet to Receive (${Array.from(
                                        { length: 3 },
                                        (_, i) =>
                                            new Date(
                                                new Date().setMonth(
                                                    new Date().getMonth() - (2 - i)
                                                )
                                            ).toLocaleString("default", {
                                                month: "short",
                                            })
                                    ).join(", ")})`}
                                </p>
                                <h5 className="mb-1 fs-16 display_no">
                                    <span
                                        className="counter-value fw-500 black_500"
                                        data-target="367"
                                    >
                                        <LiaRupeeSignSolid />
                                        <CountUp
                                            finalValue={
                                                graphData?.lastThreeMonthsFeeYetToReceive
                                            }
                                        />
                                    </span>
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div id="chart">
                        <ReactApexChart
                            className="apex-charts"
                            options={chartDatas.options}
                            series={chartDatas?.Enrollments.series}
                            type="bar"
                            height={350}
                        />
                    </div>
                    <div id="html-dist"></div>
                </div>
            </div>
        </div>
    )
}

export default FeeDetailsGraphComponent
