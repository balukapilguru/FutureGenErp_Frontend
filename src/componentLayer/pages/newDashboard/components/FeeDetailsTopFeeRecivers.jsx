import React, { useEffect, useState } from 'react'
import { LiaRupeeSignSolid } from 'react-icons/lia';
import { Link } from 'react-router-dom';
import CountUp from '../../../../utils/CountUp';
import { MdOutlinePeople } from 'react-icons/md';

const FeeDetailsTopFeeRecivers = ({ userData, currentMonthYear, topFeeReceivers, ManagerTopFeeReceivers,CounselloersCount }) => {
    const [branchesTopFeeReceivers, setBranchesTopFeeReceivers] = useState([])
    const [TopFeeReceivers,setManagerTopFeeReceivers] = useState()
    useEffect(() => {
        setBranchesTopFeeReceivers(topFeeReceivers?.branches)
    }, [topFeeReceivers])
    useEffect(() => {
        setManagerTopFeeReceivers(ManagerTopFeeReceivers)
    }, [ManagerTopFeeReceivers])


    return (
        <>
            {/* FeeDetails ProgressiveBar For Branches */}
            {userData &&
                userData?.user &&
                userData?.user?.profile !== "Counsellor" &&
                userData?.user?.profile !== "counsellor" &&
                userData?.user?.profile !== "Branch Manager" && (
                    <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="mt-1">
                                    Top Fee Receivers for{" "}
                                    {currentMonthYear && currentMonthYear}
                                </h6>

                                <div className="table-container-two table-responsive ">
                                    <div className="p-2 ">
                                        {branchesTopFeeReceivers?.length > 0 &&
                                            branchesTopFeeReceivers?.map(
                                                (item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <li className="" role="presentation">
                                                                <div>
                                                                    <div
                                                                        className={`card nav-link card_animate cardcol-bg w-100 p-1
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
                                                                                    {item?.branch}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex-shrink-0 text-end">
                                                                                <h5 className="text-success fs-14 mb-0"></h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex justify-content-center align-items-center   w-100 tab-bg p-1">
                                                                            <div className="d-flex align-items-center me-3 white-border">
                                                                                <span className="text-black fs-12  me-2">
                                                                                    Fee Recevied : <br />
                                                                                    <LiaRupeeSignSolid className="fs-12 dwnld_icon " />{" "}
                                                                                    <CountUp
                                                                                        finalValue={
                                                                                            item?.feeReceived
                                                                                        }
                                                                                    />

                                                                                </span>
                                                                            </div>

                                                                            <div className="d-flex align-items-center">
                                                                                <span className="text-black fs-12  me-3">
                                                                                    Fee Yet To Recevie :{" "}
                                                                                    <br />
                                                                                    <LiaRupeeSignSolid className="fs-12 dwnld_icon " />{" "}
                                                                                    <CountUp
                                                                                        finalValue={
                                                                                            item?.feeYetToReceive
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
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


            {/* FeeDetails for Branch Mananger Wise */}

            {userData &&
                userData?.user &&
                userData?.user?.profile === "Branch Manager" && (
                    <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="mt-1">
                                    Top Fee Receivers for{" "}
                                    {currentMonthYear && currentMonthYear}
                                </h6>

                                <div className="table-container-two table-responsive ">
                                    <div className="p-2 ">
                                        {TopFeeReceivers && TopFeeReceivers.length > 0 && TopFeeReceivers.map(
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
                                                                    <div className="d-flex justify-content-center align-items-center   w-100 tab-bg p-1">
                                                                        <div className="d-flex align-items-center me-3 white-border">
                                                                            <span className="text-black fs-12  me-2">
                                                                                Fee Recevied : <br />
                                                                                <LiaRupeeSignSolid className="fs-12 dwnld_icon me-2" />
                                                                                <CountUp
                                                                                    finalValue={
                                                                                        item?.feeReceived
                                                                                    }
                                                                                />
                                                                            </span>
                                                                        </div>

                                                                        <div className="d-flex align-items-center">
                                                                            <span className="text-black fs-12  me-2">
                                                                                Fee Yet To Recevie :<br />
                                                                                <LiaRupeeSignSolid className="fs-12 dwnld_icon me-2" />{" "}
                                                                                <CountUp
                                                                                    finalValue={
                                                                                        item?.feeYetToReceive
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

            {/*FeeDetails ProgressiveBar For Counsellors */}
            {userData &&
                userData?.user &&
                (userData?.user?.profile === "Counsellor" ||
                    userData?.user?.profile === "counsellor") && (
                    <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
                        <div className="card">
                            <div className="card-body">
                                <h6 className="mt-1">
                                    Top Fee Receivers for{" "}
                                    {currentMonthYear && currentMonthYear}
                                </h6>

                                <div className="table-container-two table-responsive ">
                                    <div className="p-2 ">
                                        {CounselloersCount?.length > 0 &&
                                            CounselloersCount?.map(
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
                                                                                    {item?.branch}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex-shrink-0 text-end">
                                                                                <h5 className="text-success fs-14 mb-0"></h5>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex justify-content-center align-items-center   w-100 tab-bg p-1">
                                                                            <div className="d-flex align-items-center me-3 white-border">
                                                                                <span className="text-black fs-12  me-2">
                                                                                    {" "}
                                                                                    Fee Recevied :<br />
                                                                                    <LiaRupeeSignSolid className="fs-12 dwnld_icon me-2" />{" "}
                                                                                    <CountUp
                                                                                        finalValue={
                                                                                            item?.totalpaidamount
                                                                                        }
                                                                                    />
                                                                                </span>
                                                                            </div>

                                                                            <div className="d-flex align-items-center">
                                                                                <span className="text-black fs-12  me-2">
                                                                                    {" "}
                                                                                    Fee Yet To Receive :<br />
                                                                                    <LiaRupeeSignSolid className="fs-12 dwnld_icon me-2" />{" "}
                                                                                    <CountUp
                                                                                        finalValue={
                                                                                            item?.dueamount
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

export default FeeDetailsTopFeeRecivers
