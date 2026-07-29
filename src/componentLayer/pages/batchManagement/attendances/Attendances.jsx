import React, { useState } from "react";
import BackButton from "../../../components/backbutton/BackButton";
import { MdFilterList } from "react-icons/md";
import { Link } from "react-router-dom";
import AttendancesProvider from "./AttendancesProvider";
import Usedebounce from "../../../../dataLayer/hooks/useDebounce/Usedebounce";

import Pagination from "../../../../utils/Pagination";
import PaginationInfo from "../../../../utils/PaginationInfo";

const Attendances = () => {
  const {
    AttendancesState: { AttendancesList },
    DispatchAttendances,
  } = AttendancesProvider();

  const { debouncesetSearch, debouncesetPage } =
    Usedebounce(DispatchAttendances);

  const handleSearch = (e) => {
    debouncesetSearch({ data: e.target.value });
  };

  const handlePerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);

    DispatchAttendances({
      type: "SET_PER_PAGE",
      payload: {
        data: selectedvalue,
      },
    });
  };

  // filters

  const [filters, setFilters] = useState({
    status: "",
  });



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    DispatchAttendances({
      type: "SET_FILTERS",
      payload: {
        data: {
          status: "",
        },
      },
    });
    setFilters({
      status: "",
    });
  };

  const handleSubmit = () => {
    DispatchAttendances({
      type: "SET_FILTERS",
      payload: {
        data: {
          status: filters.status,
        },
      },
    });
  };

  // Paginations
  const handlePageChange = (page) => {
    debouncesetPage({ data: page });
  };

  return (
    <div>
      <BackButton heading="Attendances" content="Back" />
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
                        className="form-control search input_bg_color select"
                        placeholder="Search for..."
                        name="search"
                        required
                        onChange={(e) => handleSearch(e)}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="buttons_alignment">
                      <div className="fs-13 me-3 mt-2"></div>
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
                    {/* Status of the Applicant */}
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium black_300">
                        Status
                      </label>
                      <select
                        className="form-control fs-s bg-form text_color input_bg_color"
                        aria-label=""
                        placeholder="Select the Status"
                        name="status"
                        id="status"
                        required
                        onChange={(e) => handleFilterChange(e)}
                        value={filters?.status}
                      >
                        <option value="" disabled>
                          Select the Status
                        </option>
                        <option value="Screening">Screening</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="On-hold">On-hold</option>
                        <option value="Reject">Reject</option>
                        <option value="On-boarded">On-boarded</option>
                      </select>
                    </div>

                    <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                      <button
                        className="btn btn_primary"
                        type="button"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={() => handleReset()}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                      <button
                        className="btn btn_primary"
                        type="button"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                        onClick={() => handleSubmit()}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive table-card table-container table-scroll border-0">
                  <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                    <thead>
                      <tr className="">
                        <th scope="col" className="fs-13 lh-xs fw-600  ">
                          S.No
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                          Student Name
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                          Registration Number
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                        >
                          Training Mode
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600 text-">
                          Courses
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs fw-600  text-truncate"
                        >
                          {" "}
                          Batch Start Date
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                        >
                          Course Duration
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                        >
                          Current Duration
                        </th>
                        <th
                          scope="col"
                          className="fs-13 lh-xs  fw-600 text-truncate"
                        >
                          Attendance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {AttendancesList?.PaginatedAttendancesList &&
                      AttendancesList?.PaginatedAttendancesList.length > 0 ? (
                        AttendancesList?.loading ? (
                          <tr>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              loading...
                            </td>
                          </tr>
                        ) : (
                          AttendancesList?.PaginatedAttendancesList.map(
                            (item, index) => {
                              const applicantId = item?.id;
                              return (
                                <tr key={applicantId}>
                                  <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                    {(AttendancesList?.currentPage - 1) *
                                      AttendancesList.perPage +
                                      index +
                                      1}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.name}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.registrationnumber}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item.modeoftraining}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light ">
                                    {" "}
                                    {item?.courses}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light ">
                                    {item?.job_posting?.company_name}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light ">
                                    {item?.status}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light ">
                                    {item?.status}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light cursor-pointer">
                                    5765
                                  </td>
                                </tr>
                              );
                            }
                          )
                        )
                      ) : (
                        <tr>
                          <td className="fs-13 black_300  lh-xs bg_light">
                            no data
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                          01
                        </td>
                        <td className="fs-13 black_300  lh-xs bg_light">
                          <Link to="/batchmanagement/attendanceview ">
                            Shrii
                          </Link>
                        </td>
                        <td className="fs-13 black_300  lh-xs bg_light">
                          TA26792002
                        </td>
                        <td className="fs-13 black_300  lh-xs bg_light ">
                          Offline
                        </td>
                        <td className="fs-13 black_300  lh-xs bg_light ">
                          Python
                        </td>
                        <td className="fs-13 black_300  lh-xs bg_light ">
                          25-05-2024
                        </td>
                        <td className="fs-13 black_300  lh-xs bg_light ">
                          100
                        </td>
                        <td className="fs-13 black_300  lh-xs bg_light ">50</td>
                        <td className="fs-13 black_300  lh-xs bg_light ">
                          <Link to="/batchmanagement/attendanceview ">90</Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length:
                          AttendancesList?.PaginatedAttendancesList?.length,
                        start: AttendancesList?.startAttendancesList,
                        end: AttendancesList?.endAttendancesList,
                        total: AttendancesList?.searchResultAttendancesList,
                      }}
                      loading={AttendancesList?.loading}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color pagination-select "
                        aria-label="Default select example"
                        required
                        onChange={(e) => handlePerPage(e)}
                      >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="75">75</option>
                        <option value="100">100</option>
                      </select>
                    </div>

                    <div>
                      <Pagination
                        currentPage={AttendancesList?.currentPage}
                        totalPages={AttendancesList?.totalPages}
                        loading={AttendancesList?.loading}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendances;
