import React from "react";
import { LiaRupeeSignSolid } from "react-icons/lia";
import BackButton from "../../../../components/backbutton/BackButton";
import { NavLink, Outlet, useLoaderData, useLocation, useRouteLoaderData } from "react-router-dom";
import TodayFeeImg from "../../../../../assets/images/feedetails/Today.png";
import UpcomingFeeImg from "../../../../../assets/images/feedetails/Upcoming.png";
import OverDueImg from "../../../../../assets/images/feedetails/Overdue.png";
import { ERPApi } from "../../../../../serviceLayer/interceptor";

export const FeeFollowUpsLoader = async ({ request, params }) => {
    const url = new URL(request.url);

    try {
        const { data, status } = await ERPApi.get(`/fee/FeeDueRecords${url.search}`);
        // const { data, status } = await ERPApi.get(`/fee/FeeDueRecords`);
        if (status === 200) {
            const feeData = data || null
            return { feeData };
        }

    }
    catch (error) {
        console.error(error);
        return {
            feeData: {
                todayDueFeeResponse: 0,
                upcomingDueFeeResponse: 0,
                overDueFeeResponse: 0,
            }
        };
    }

}


const FeeFollowUpsTabs = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const data = useLoaderData();
    const TodayFeeRecordsListData = useRouteLoaderData("todayFeeRecords");
    const upcomingFeeRecords = useRouteLoaderData("upcomingFeeRecords");
    const overDueFeeRecords = useRouteLoaderData("overdueFeeRecords");
    const todayFeeAmount = TodayFeeRecordsListData?.TodayFeeRecordsList?.totalDueAmount;
    const upcomingFeeAmount = upcomingFeeRecords?.UpcomingFeeRecordsList?.totalDueAmount;
    const overdueFeeAmount = overDueFeeRecords?.OverDueFeeRecordsList?.totalDueAmount;
    const { feeData } = data;

    return (
        <div>
            <BackButton heading="Fee FollowUps" content="Back" />
            <div className="container d-flex justify-content-center">
                <ul className="nav gap-3 nav-tabs" id="pills-tab" role="tablist">
                    {/* Today */}
                    <li className="nav-item" role="presentation">
                        <NavLink
                            to={{
                                pathname: `today/list`,
                                search: `?search=&page=1&pageSize=10`,
                            }}
                            className={({ isActive }) =>
                                isActive || currentPath === "/student/feefollowUps/today/list"
                                    ? "active"
                                    : ""
                            }
                        >
                            <button
                                className={`nav-link card card_animate  ${currentPath === "/student/feefollowUps/today/list"
                                    ? "active"
                                    : ""
                                    }`}
                                type="button"
                                role="tab"
                            >
                                <div className="d-flex justify-content-between">
                                    <div className="text-start me-5">
                                        <p className="fs_20 fw-500">Today</p>
                                        <p className="mt-3 fs_14 lh-100 black_300">
                                            <LiaRupeeSignSolid />
                                            {Number(
                                                parseFloat(
                                                    // feeData?.todayDueFeeResponse
                                                    (todayFeeAmount || todayFeeAmount == 0) ? todayFeeAmount : feeData?.todayDueFeeResponse
                                                ).toFixed(2)
                                            ).toLocaleString("en-IN")}{"/-"}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="avatar-md">
                                            <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                                                <img
                                                    src={TodayFeeImg}
                                                    className="img-fluid"
                                                    width="100px"
                                                    height="100px"
                                                    alt=""
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </NavLink>
                    </li>
                    {/* Upcoming */}
                    <li className="nav-item" role="presentation">
                        <NavLink
                            className={({ isActive }) =>
                                isActive ||
                                    currentPath === "/student/feefollowUps/upcoming/list"
                                    ? "active"
                                    : ""
                            }
                            to={{
                                pathname: `upcoming/list`,
                                search: `?search=&page=1&pageSize=10`,
                            }}
                        >
                            <button
                                className={`nav-link card card_animate  ${currentPath === "/student/feefollowUps/upcoming/list"
                                    ? "active"
                                    : ""
                                    }`}
                                type="button"
                                role="tab"
                            >
                                <div className="d-flex justify-content-between">
                                    <div className="text-start me-4">
                                        <p className="fs_20 fw-500">Upcoming</p>
                                        <p className="mt-3 fs_14 lh-100 black_300">
                                            <LiaRupeeSignSolid />
                                            {Number(
                                                parseFloat(
                                                    //    feeData?.upcomingDueFeeResponse
                                                    (upcomingFeeAmount || upcomingFeeAmount == 0) ? upcomingFeeAmount : feeData?.upcomingDueFeeResponse
                                                ).toFixed(2)
                                            ).toLocaleString("en-IN")}{"/-"}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="avatar-md">
                                            <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                                                <img
                                                    src={UpcomingFeeImg}
                                                    className="img-fluid"
                                                    width="100px"
                                                    height="100px"
                                                    alt=""
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </NavLink>
                    </li>

                    {/* OverDue */}
                    <li className="nav-item" role="presentation">
                        <NavLink
                            className={({ isActive }) =>
                                isActive || currentPath === "/student/feefollowUps/overdue/list"
                                    ? "active"
                                    : ""
                            }
                            to={{
                                pathname: `overdue/list`,
                                search: `?search=&page=1&pageSize=10`,
                            }}
                        >
                            <button
                                className={`nav-link card card_animate  ${currentPath === "/student/feefollowUps/overdue/list"
                                    ? "active"
                                    : ""
                                    }`}
                                type="button"
                                role="tab"
                            >
                                <div className="d-flex justify-content-between">
                                    <div className="text-start me-5">
                                        <p className="fs_20 fw-500">Over Due</p>
                                        <p className="mt-3 fs_14 lh-100 black_300">
                                            <LiaRupeeSignSolid />
                                            {Number(
                                                parseFloat(
                                                    //    feeData?.overDueFeeResponse
                                                    (overdueFeeAmount || overdueFeeAmount == 0) ? overdueFeeAmount : feeData?.overDueFeeResponse
                                                ).toFixed(2)
                                            ).toLocaleString("en-IN")}{"/-"}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="avatar-md">
                                            <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                                                <img
                                                    src={OverDueImg}
                                                    className="img-fluid"
                                                    width="100px"
                                                    height="100px"
                                                    alt=""
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="tab-content mt-3">
                <Outlet />
            </div>
        </div>
    );
};

export default FeeFollowUpsTabs;
