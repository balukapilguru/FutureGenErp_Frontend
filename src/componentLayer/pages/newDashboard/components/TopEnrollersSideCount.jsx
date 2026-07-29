import { useEffect, useState } from "react";
import { MdOutlinePeople } from "react-icons/md";
import { Link } from "react-router-dom";
import CountUp from "../../../../utils/CountUp";
import { LiaRupeeSignSolid } from "react-icons/lia";

const TopEnrollersSideCount = ({
    userData,
    TotalEnrollementDetailsData,
    newTopEnrollers,
    BranchManagerData,
    AdminSideCount,
    StudentCountData
}) => {
    const [TotalEnrollementDetails, setTotalEnrollementDetails] = useState({
        TopEnrollers: {
            branches: []
        }
    })
    useEffect(() => {
        setTotalEnrollementDetails(TotalEnrollementDetailsData)
    }, [TotalEnrollementDetailsData]);

    const today = new Date();
    const currentMonthYear = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
    }).format(today);

    useEffect(() => {
        if (newTopEnrollers) {
            setTotalEnrollementDetails(prev => ({
                ...prev,
                TopEnrollers: newTopEnrollers.data
            }))
        }
    }, [newTopEnrollers])

    return (
        <>
            {userData &&
                userData?.user &&
                userData?.user?.profile !== "Counsellor" &&
                userData?.user?.profile !== "counsellor" &&
                userData?.user?.profile !== "Branch Manager" && (
                    <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="mt-1">
                                    {" "}
                                    Top Enrollers for{" "}
                                    {currentMonthYear && currentMonthYear}
                                </h6>
                                <div className="table-container-one table-responsive">
                                    <div className="p-2 ">
                                        {AdminSideCount?.length > 0 &&
                                            AdminSideCount?.map(
                                                (item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <li className="" role="presentation">
                                                                <div>
                                                                    <span
                                                                        className={` nav-link card_animate cardcol-bg w-100 p-1
                                                `}
                                                                        id="pills-home-tab"
                                                                        data-bs-toggle="pill"
                                                                        data-bs-target="#pills-home"
                                                                        role="tab"
                                                                        aria-controls="pills-home"
                                                                    >
                                                                        <div className="d-flex align-items-centerjustify-content-between">
                                                                            <div className="flex-grow-1 overflow-hidden">
                                                                                <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3">
                                                                                    {item.branch}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex-shrink-0 text-end">
                                                                                <h5 className="text-success fs-14 mb-0"></h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex  align-items-center  w-100 tab-bg p-1">
                                                                            <div className="d-flex align-items-center me-2 white-border">
                                                                                <div className="">
                                                                                    <MdOutlinePeople className="fs-14 dwnld_icon ms-3  " />
                                                                                    <span className="text-black fs-14 me-3 ms-1">
                                                                                        <CountUp
                                                                                            finalValue={
                                                                                                item?.enrollments
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="d-flex align-items-center me-3 white-border">
                                                                                <div className="">
                                                                                    <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                                                    <span className="text-black fs-14  me-3">
                                                                                        <CountUp
                                                                                            finalValue={
                                                                                                item?.finalTotal
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="d-flex align-items-center">
                                                                                <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                                                <span className="text-black fs-14  me-2">
                                                                                    <CountUp
                                                                                        finalValue={
                                                                                            item?.feeReceived
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* Progressivebar Branch Manager */}
            {userData &&
                userData?.user &&
                userData?.user?.profile === "Branch Manager" && (
                    <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="mt-1">
                                    Top Enrollers for{" "}
                                    {currentMonthYear && currentMonthYear}
                                </h6>
                                <div className="table-container-one table-responsive ">
                                    <div className="p-2 ">
                                        {BranchManagerData && BranchManagerData.length > 0 &&
                                            BranchManagerData.map(
                                                (item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <li className="" role="presentation">
                                                                <Link>
                                                                    <button
                                                                        className={`card nav-link card_animate cardcol-bg w-100 p-1
                                                  `}
                                                                        id="pills-home-tab"
                                                                        data-bs-toggle="pill"
                                                                        data-bs-target="#pills-home"
                                                                        type="button"
                                                                        role="tab"
                                                                        aria-controls="pills-home"
                                                                    >
                                                                        <div className="d-flex align-items-centerjustify-content-between">
                                                                            <div className="flex-grow-1 overflow-hidden">
                                                                                <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3">
                                                                                    {item?.enquirytakenby}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex-shrink-0 text-end">
                                                                                <h5 className="text-success fs-14 mb-0"></h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex  align-items-center w-100 tab-bg p-1">
                                                                            <div className="d-flex align-items-center me-2 white-border">
                                                                                <div className="">
                                                                                    <MdOutlinePeople className="fs-14 dwnld_icon ms-3 " />
                                                                                    <span className="text-black fs-14 me-3 ms-1">
                                                                                        <CountUp
                                                                                            finalValue={
                                                                                                item?.enrollments
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="d-flex align-items-center me-3 white-border">
                                                                                <div className="me-5">
                                                                                    <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                                                    <span className="text-black fs-14 me-2 ">
                                                                                        <CountUp
                                                                                            finalValue={
                                                                                                item?.finalTotal
                                                                                            }
                                                                                        />
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            <div className="d-flex align-items-center">
                                                                                <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                                                <span className="text-black fs-14  me-2">
                                                                                    <CountUp
                                                                                        finalValue={
                                                                                            item?.feeReceived
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </Link>
                                                            </li>
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {userData &&
                userData?.user &&
                (userData?.user?.profile === "Counsellor" ||
                    userData?.user?.profile === "counsellor") && (
                    <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="mt-1">
                                    Enrolled Students in{" "}
                                    {currentMonthYear && currentMonthYear}
                                </h6>
                                <div className="table-container-one table-responsive ">
                                    <div className="p-2 ">
                                        {StudentCountData?.length > 0 && StudentCountData?.map(
                                                (item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <li className="" role="presentation">
                                                                <Link>
                                                                    <button
                                                                        className={`card nav-link card_animate cardcol-bg w-100 p-1
                                                  `}
                                                                        id="pills-home-tab"
                                                                        data-bs-toggle="pill"
                                                                        data-bs-target="#pills-home"
                                                                        type="button"
                                                                        role="tab"
                                                                        aria-controls="pills-home"
                                                                    >
                                                                        <div className="d-flex align-items-centerjustify-content-between">
                                                                            <div className="flex-grow-1 overflow-hidden">
                                                                                <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3">
                                                                                    {item?.name}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex-shrink-0 text-end">
                                                                                <h5 className="text-success fs-14 mb-0"></h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex justify-content-center align-items-center   w-100 tab-bg p-1">
                                                                            <div className="d-flex align-items-center me-3 white-border">
                                                                                <span className="text-black fs-14  me-2">
                                                                                    Booking Amount: <br />
                                                                                    <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />{" "}
                                                                                    <CountUp
                                                                                        finalValue={
                                                                                            item?.finalTotal
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </div>

                                                                            <div className="d-flex align-items-center">
                                                                                <span className="text-black fs-14  me-2">
                                                                                    Fee Received :<br />
                                                                                    <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                                                                    <CountUp
                                                                                        finalValue={
                                                                                            item?.totalPaidAmount
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                </Link>
                                                            </li>
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </>
    )
}

export default TopEnrollersSideCount
