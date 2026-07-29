import { useState } from "react";
import CountUp from "../../../../utils/CountUp";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FiArrowDownRight } from "react-icons/fi";
import { MdArrowOutward, MdFilterList, MdOutlinePeople } from "react-icons/md";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

const EnrollementGraph = () => {
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
  return (
    <div className="container-fluid">
      <div className="row mt-2">
        <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="card">
            <div className="card-body mb-3">
              <div className=" d-flex justify-content-between">
                <div>
                  {" "}
                  <h6 className="">Overall Status Graph</h6>
                </div>
              </div>

              <div className="row g-0 text-center text_background">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                  <div className="p-2 border border-dashed border-start-1 h-100">
                    <p className="mb-0 fs-7 text-mute">Total Enrollments</p>
                    <h5 className="mb-1 fs-16 display_no">
                      <span
                        className="counter-value fw-500 black_500"
                        data-target="7585"
                      >
                        <CountUp />
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
                        <CountUp />
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
                        <CountUp />

                        <>
                          <span className="text-success">
                            <CountUp />
                          </span>
                          <MdArrowOutward className="text-success fs-14  mb-0" />
                        </>

                        <>
                          <span className="text-danger fs-12">
                            <CountUp />
                          </span>
                          <FiArrowDownRight className="text-danger fs-12" />
                        </>

                        <span className="">
                          <CountUp />
                        </span>

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
                        <CountUp />
                      </span>
                    </h5>
                  </div>
                </div>
              </div>

              <div className="row g-0 text-center text_background">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                  <div className="p-2 border border-dashed border-start- h-100">
                    <p className="mb-0 fs-7 text-mute">Total Booking Amount</p>
                    <h5 className="mb-1 fs-16 display_no" data-target="7585">
                      <span
                        className="counter-value fw-500 black_500"
                        data-target="367"
                      >
                        <LiaRupeeSignSolid />
                        <CountUp />
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
                        <CountUp />
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
                        <CountUp />
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

                        <CountUp />
                      </span>
                    </h5>
                  </div>
                </div>
              </div>

              <div>
                <div id="chart">
                  <ReactApexChart
                    className="apex-charts"
                    options={chartData.options}
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

        <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 black_300">
          <div className="card">
            <div className="card-body">
              <h6 className="mt-1"> Top Enrollers for </h6>
              <div className="table-container-one table-responsive">
                <div className="p-2 ">
                  <div>
                    <li className="" role="presentation">
                      <Link>
                        <button
                          className={`card nav-link card_animate cardcol-bg w-100 p-1
`}
                        >
                          <div className="d-flex align-items-centerjustify-content-between">
                            <div className="flex-grow-1 overflow-hidden">
                              <p className="text-start text-uppercase fw-medium text-black text-truncate mt-1 fs-14 ms-3"></p>
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
                                  <CountUp />
                                </span>
                              </div>
                            </div>

                            <div className="d-flex align-items-center me-3 white-border">
                              <div className="">
                                <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                                <span className="text-black fs-14  me-3">
                                  <CountUp />
                                </span>
                              </div>
                            </div>

                            <div className="d-flex align-items-center">
                              <LiaRupeeSignSolid className="fs-14 dwnld_icon me-2" />
                              <span className="text-black fs-14  me-2">
                                <CountUp />
                              </span>
                            </div>
                          </div>
                        </button>
                      </Link>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            />
          </div>

          <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
            <button
              className="btn btn_primary"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              Clear
            </button>
          </div>
          <div className="position-absolute bottom-0 end-0 me-2 mb-2"></div>
        </div>
      </div>

      <div className="row">
        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="card">
            <div className="card-header">
              <h6>Enrollments In Branch</h6>
              <div className="card-body">
                <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                  <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                    <thead>
                      <tr className="">
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          S.No
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                          Branch
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                        >
                          Enrollments
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                        >
                          Booking Amount
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs fw-600  text-truncate"
                        >
                          Fee Received
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                        >
                          Fee Yet To Receive
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="card" id="navbar-example2">
            <div className="card-header">
              <h6>Enrollments By Counsellors</h6>
              <div className="card-body">
                <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                  <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                    <thead>
                      <tr className="">
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          S.No
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                          Counsellors
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                        >
                          Enrollments
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate "
                          style={{ maxWidth: "100px" }}
                          title="  Booking Amount"
                        >
                          Booking Amount
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600  text-truncate "
                          style={{ maxWidth: "100px" }}
                          title="   Fee Received  "
                        >
                          Fee Received
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate "
                          style={{ maxWidth: "100px" }}
                          title="     Fee Yet To Received  "
                        >
                          Fee Yet To Received
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollement Student table */}
    </div>
  );
};

export default EnrollementGraph;
