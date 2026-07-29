import { FaIndianRupeeSign, FaUsers, FaWpforms } from "react-icons/fa6";
import { Link } from "react-router-dom";
import CountUp from "../../../utils/CountUp";
import { TbMoneybag } from "react-icons/tb";
import { LiaRupeeSignSolid } from "react-icons/lia";

const MainDashboardPage = () => {
  return (
    <div className="container-fluid mt-5 ">
      <ul className="row nav nav-tabs nav-justified mb-3 ">
        <li
          className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
          role="presentation"
        >
          <button className="card nav-link card_animate" type="button">
            <div className="d-flex align-items-center  justify-content-between">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-start text-uppercase fw-medium text-mute text-truncate  fs-12">
                  Total Enrollments
                </p>
              </div>
              <div className="flex-shrink-0 text-end">
                <h5 className="text-success fs-12 mb-0"></h5>
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
              <div className="text-start">
                <h5 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                  <span className="counter-value" data-target="559.25"></span>
                </h5>
                <Link to="" className="fs-xs fw-500  mb-0">
                  View Enrollments
                </Link>
              </div>
              <div className="avatar-sm flex-shrink-0">
                <span className="avatar-title bg-success-subtle rounded fs-3">
                  <FaWpforms className="text-success fs-20" />
                </span>
              </div>
            </div>
          </button>
        </li>
        <li
          className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
          role="presentation"
        >
          <button className="card nav-link card_animate" type="button">
            <div className="d-flex align-items-center  justify-content-between">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-start text-uppercase fw-medium text-mute text-truncate  fs-12">
                  fee details
                </p>
              </div>
              <div className="flex-shrink-0 text-end">
                <h5 className="text-success fs-12 mb-0"></h5>
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
              <div className="text-start">
                <h5 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                  <LiaRupeeSignSolid />
                  <span className="counter-value" data-target="559.25"></span>
                </h5>
                <Link to="" className="fs-xs fw-500  mb-0">
                  View Fee Details
                </Link>
              </div>
              <div className="avatar-sm flex-shrink-0">
                <span className="avatar-title bg-info-subtle rounded fs-3">
                  <FaIndianRupeeSign className="light-blue-color fs-20" />
                </span>
              </div>
            </div>
          </button>
        </li>
        <li
          className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
          role="presentation"
        >
          <button className="card nav-link card_animate" type="button">
            <div className="d-flex align-items-center  justify-content-between">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-start text-uppercase fw-medium text-mute text-truncate  fs-12">
                  today fee received
                </p>
              </div>
              <div className="flex-shrink-0 text-end">
                <h5 className="text-success fs-12 mb-0"></h5>
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
              <div className="text-start">
                <h5 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                  <span className="counter-value" data-target="559.25">
                    <LiaRupeeSignSolid />
                  </span>
                </h5>
                <Link to="" className="fs-xs fw-500  mb-0">
                  View Fee Received
                </Link>
              </div>
              <div className="avatar-sm flex-shrink-0">
                <span className="avatar-title bg-success-subtle rounded fs-3">
                  <FaWpforms className="text-success fs-20" />
                </span>
              </div>
            </div>
          </button>
        </li>
        <li
          className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
          role="presentation"
        >
          <button className="card nav-link card_animate" type="button">
            <div className="d-flex align-items-center  justify-content-between">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-start text-uppercase fw-medium text-mute text-truncate  fs-12">
                  fee followups
                </p>
              </div>
              <div className="flex-shrink-0 text-end">
                <h5 className="text-success fs-12 mb-0"></h5>
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
              <div className="text-start">
                <h5 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                  <span className="counter-value" data-target="559.25">
                    <LiaRupeeSignSolid />
                  </span>
                </h5>
                <Link to="" className="fs-xs fw-500  mb-0">
                  View Fee FollowUps
                </Link>
              </div>
              <div className="avatar-sm flex-shrink-0">
                <span className="avatar-title bg-warning-subtle rounded fs-3">
                  <TbMoneybag className="text_yellow fs-20" />
                </span>
              </div>
            </div>
          </button>
        </li>
        <li
          className="col-xxl-2 col-xl-2 col-lg-3 col-md-12 col-sm-12 col-12 nav-item mt-2"
          role="presentation"
        >
          <button className="card nav-link card_animate" type="button">
            <div className="d-flex align-items-center  justify-content-between">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-start text-uppercase fw-medium text-mute text-truncate  fs-12">
                  Total users
                </p>
              </div>
              <div className="flex-shrink-0 text-end">
                <h5 className="text-success fs-12 mb-0"></h5>
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
              <div className="text-start">
                <h5 className="fs-20 fw-semibold ff-secondary mb-4 display_no">
                  <span className="counter-value" data-target="559.25"></span>
                </h5>
                <Link to="" className="fs-xs fw-500  mb-0">
                  View Total Users
                </Link>
              </div>
              <div className="avatar-sm flex-shrink-0">
                <span className="avatar-title bg-primary-subtle rounded fs-3">
                  <FaUsers className="dwnld_icon fs-18" />
                </span>
              </div>
            </div>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default MainDashboardPage;
