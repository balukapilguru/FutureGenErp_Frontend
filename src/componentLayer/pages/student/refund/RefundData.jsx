import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import Button from "../../../components/button/Button";
import "../../../../assets/css/Table.css";
import BackButton from "../../../components/backbutton/BackButton";
import { MdFilterList } from "react-icons/md";
import { HiMiniPlus } from "react-icons/hi2";
import GateKeeper from "../../../../rbac/GateKeeper";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
// import { MdDelete } from "react-icons/md";




function RefundData() {
  const [refundData, setRefundData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ERPApi.get(
          `${
            import.meta.env.VITE_API_URL
          }/studentrefunds/studentrefundsfromrefunds`
        );

        const refunds = response?.data?.combinedData?.map(
          (item) => item.refund
        );
        const refund = refunds?.map((d) => d[0]);
        setRefundData(refund);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Clean-up function
    return () => {
      // You can add any cleanup code here
    };
  }, []);

  return (
    <div>
      <BackButton heading="Refund Data" content="Back" to="/" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search input_bg_color"
                        placeholder="Search for..."
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="buttons_alignment">
                      <button
                        className="btn btn-sm btn_primary fs-13 me-1 margin_top_12 button-res"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <MdFilterList className="me-1 mb-1" />
                        Filters
                      </button>
                      <GateKeeper
                        requiredModule="Student Management"
                        submenumodule="refund"
                        submenuReqiredPermission="canCreate"
                      >
                        <Button
                          type="button"
                          className="btn btn-sm btn-md btn_primary fs-13 margin_top_12 button-res"
                        >
                          <Link
                            to="/student/refundform"
                            className="button_color"
                          >
                            <HiMiniPlus className="text_white " /> Request
                            Refund
                          </Link>
                        </Button>
                      </GateKeeper>
                    </div>
                  </div>
                </div>
                <div
                  className="offcanvas offcanvas-end  bg_white"
                  id="offcanvasRight"
                  aria-labelledby="offcanvasRightLabel"
                >
                  <div className="offcanvas-header">
                    <h5
                      className="offcanvas-title text_color"
                      id="offcanvasRightLabel"
                    >
                      Filters
                    </h5>
                    <button
                      type="button"
                      className="btn-close "
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="offcanvas-body p-2">
                    {/* from calendar */}
                    <div className="form-group text-start">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="example-text-input "
                      >
                        From Date
                      </label>
                      <input
                        className="form-control fs-s bg-form input_bg_color date_input_color "
                        type="date"
                        id="exampleInputdate"
                      />
                    </div>
                    {/* to calendar */}
                    <div className="form-group text-start mt-2">
                      <label
                        className="form-label fs-s text_color"
                        htmlFor="example-text-input "
                      >
                        To Date
                      </label>
                      <input
                        className="form-control fs-s bg-form input_bg_color date_input_color  "
                        type="date"
                        id="exampleInputdate"
                      />
                    </div>
                    {/* profile */}
                    <div className="">
                      <label className="form-label fs-s fw-medium text_color">
                        Counsellors
                      </label>
                      <select
                        className="form-select form-control input_bg_color select text_color"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                      >
                        <option disabled selected value="">
                          Select Counsellors
                        </option>
                        <option value="2">Sr. Associate</option>
                        <option value="3">Regional Manager</option>
                        <option value="4">Branch Manager</option>
                        <option value="5">Counsellor</option>
                        <option value="6">Admin</option>
                      </select>
                    </div>
                    {/* branch */}
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Branch
                      </label>
                      <select
                        className="form-select form-control input_bg_color select text_color"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                      >
                        <option value="" disabled selected>
                          Select Branch
                        </option>
                        <option value="2">Hitech City</option>
                        <option value="3">Kukkatpally</option>
                        <option value="4">Dilsukhnagar</option>
                        <option value="5">Secunderabad</option>
                        <option value="6">Testing</option>
                      </select>
                    </div>
                    {/* department */}
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium text_color">
                        Mode Of Training
                      </label>
                      <select
                        className="form-select form-control input_bg_color select text_color"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                      >
                        <option value="" disabled selected>
                          Select Mode Of Training
                        </option>
                        <option value="2">Counsellor</option>
                        <option value="3">Digital Marketing</option>
                        <option value="4">Student Counsellor</option>
                      </select>
                    </div>
                    <div>
                      <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                        <Button className="btn btn_primary">Clear</Button>
                      </div>
                      <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                        <Button className="btn btn_primary">Save</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div class="table-responsive table-container table-card table-scroll border-0">
                  <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                    <thead>
                      <tr className="">
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          S.No
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                          Student&nbsp;Name
                        </th>
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          Registration&nbsp;Number
                        </th>
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          Branch
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600 ">
                          Course
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600 ">
                          Support&nbsp;Status
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600 ">
                          RM&nbsp;Status
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600 ">
                          Account&nbsp;Status
                        </th>
                        <GateKeeper
                          requiredModule="Student Management"
                          submenumodule="refund"
                          submenuReqiredPermission="canRead"
                        >
                          <th scope="col" className="fs-13 lh-xs  fw-600 ">
                            Action
                          </th>
                        </GateKeeper>
                      </tr>
                    </thead>
                    <tbody className="">
                      {/* 1st row */}
                      {refundData.length > 0 ? (
                        refundData.map((item, index) => {
                          return (
                            <tr key={item.registrationnumber}>
                              <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                {index + 1}
                              </td>
                              <td
                                className="fs-13 black_300  lh-xs bg_light text-truncate"
                                style={{ maxWidth: "150px" }}
                                title={item.name}
                              >
                                {item.name}
                              </td>
                              <td className="fs-13 black_300  lh-xs bg_light">
                                {item.registrationnumber}
                              </td>
                              <td className="fs-13 black_300  lh-xs bg_light">
                                {item.branch}
                              </td>
                              <td
                                className="fs-13 black_300  lh-xs bg_light text-truncate"
                                style={{ maxWidth: "150px" }}
                                title={item.courses}
                              >
                                {item.courses}
                              </td>
                              <td className="fs-13 black_300  lh-xs bg_light ">
                                None
                              </td>
                              <td className="fs-13 black_300  lh-xs  bg_light">
                                None
                              </td>
                              <td className="fs-13 black_300  lh-xs  bg_light">
                                None
                              </td>
                              <GateKeeper
                                requiredModule="Student Management"
                                submenumodule="refund"
                                submenuReqiredPermission="canRead"
                              >
                                <td className="fs_14 text_mute bg_light lh-xs">
                                  <Link
                                    to={`/student/refundview/${item.registrationnumber}`}
                                  >
                                    <AiFillEye
                                      className="eye_icon table_icons me-2"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title="view"
                                    />
                                  </Link>
                                  {/* <MdDelete /> */}
                                </td>
                              </GateKeeper>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td className="fs-13 black_300  lh-xs  bg_light">
                            No Data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className=" mt-4 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                  <div className="col-sm">
                    <div className="text_mute pagination-text">
                      Showing <span className="fw-semibold">5</span> of{" "}
                      <span className="fw-semibold">25</span> Results
                    </div>
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
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                    <ul className="mt-2 pagination pagination-separated pagination-sm mb-0 justify-content-center">
                      <li className="page-item disabled p-1">
                        <a href="#" className="page-link rounded  ">
                          ←
                        </a>
                      </li>
                      <li className="page-item p-1 ">
                        <a href="#" className="page-link rounded">
                          1
                        </a>
                      </li>
                      <li className="page-item active p-1 ">
                        <a href="#" className="page-link page_color rounded">
                          2
                        </a>
                      </li>
                      <li className="page-item p-1 ">
                        <a href="#" className="page-link rounded">
                          3
                        </a>
                      </li>
                      <li className="page-item p-1 ">
                        <a href="#" className="page-link rounded">
                          →
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundData;
