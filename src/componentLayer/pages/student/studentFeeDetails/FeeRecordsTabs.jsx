import React from 'react'
import BackButton from '../../../components/backbutton/BackButton';
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router-dom';


import FeeRecordImg from "../../../../assets/images/feedetails/fee_records.png"
import NoDueRecordImg from "../../../../assets/images/feedetails/No_due_records.png"
import FeeFollowUpsImg from "../../../../assets/images/feedetails/Follow_Ups.png"



const FeeRecordsTabs = () => {
    const location = useLocation();
    const currentPath = location.pathname;


    return (
        <div>
            <BackButton heading="Fee Details" content="Back" to="/" />
             <div className="overflow-autogtd container-fluid d-flex justify-content-center ">
                <ul className="nav gap-3 nav-tabs" id="pills-tab" role="tablist">
                    {/* Fee Records */}
                    <li className="nav-item w_100" role="presentation">
                        <NavLink
                            className={({ isActive }) => isActive || currentPath === "/student/feedetails/list" ? "active" : ""}
                            to="list?search=&page=1&pageSize=10">
                            <button
                                className={`bg_white nav-link card card_animate w_100  ${currentPath === "/student/feedetails/list" ? "active" : ""}`}
                                type="button" role="tab">
                                <div className="text-start">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="fs_20 fw-500 me-2">Fee Records</span>
                                        </div>


                                        <div className="flex-shrink-0">
                                            <div className="avatar-md">
                                                <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                                                    <img
                                                        src={FeeRecordImg}
                                                        className="img-fluid"
                                                        width="100px"
                                                        height="100px"
                                                        alt=""
                                                    />
                                                </span>
                                            </div>
                                        </div>



                                    </div>
                                </div>
                            </button>
                        </NavLink>
                    </li>

                    {/* No Due Fee Records */}
                    <li className="nav-item w_100" role="presentation">
                        <NavLink
                            className={({ isActive }) => isActive || currentPath === "/student/feedetails/noduelist" ? "active" : ""}

                            to="noduelist?search=&page=1&pageSize=10">
                            <button

                                // className="nav-link card card_animate w_100" 
                                className={`bg_white nav-link card card_animate w_100  ${currentPath === "/student/feedetails/noduelist" ? "active" : ""}`}


                                type="button" role="tab">
                                <div className="text-start">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="fs_20 fw-500 me-2">No Due Records</span>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="avatar-md">
                                                <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                                                    <img src={NoDueRecordImg} className="img-fluid" width="100px" height="100px" alt="" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </NavLink>
                    </li>

                    {/* Fee FollowUps (Direct Navigation) */}
                    <li className="nav-item w_100" role="presentation">
                        <Link

                            to="/student/feefollowUps/today/list?search=&page=1&pageSize=10"

                        //  to="/student/feefollowups"

                        >
                            <button className="bg_white nav-link card card_animate w_100" type="button" role="tab">
                                <div className="text-start">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="fs_20 fw-500 me-2">Fee FollowUps</span>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="avatar-md">
                                                <span className="avatar-title bg-danger-subtle rounded-circle fs-1">
                                                    <img src={FeeFollowUpsImg} className="img-fluid" width="100px" height="100px" alt="" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </Link>
                    </li>
                </ul>
            </div>


            <div className="tab-content mt-3">
                <Outlet />
            </div>

        </div>
    );
};

export default FeeRecordsTabs
