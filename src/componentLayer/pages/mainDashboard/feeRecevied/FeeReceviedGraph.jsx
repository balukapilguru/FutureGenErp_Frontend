import { MdFilterList } from "react-icons/md"


const FeeReceviedGraph = () => {
  return (
    <div>
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
    </div>
  )
}

export default FeeReceviedGraph
