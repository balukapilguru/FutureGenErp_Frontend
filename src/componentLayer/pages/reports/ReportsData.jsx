import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import "../../../assets/css/Table.css";
import { NavLink } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { HiMiniPlus } from "react-icons/hi2";
import BackButton from "../../components/backbutton/BackButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Usedebounce from "../../../dataLayer/hooks/useDebounce/Usedebounce";
import Reportsprovider from "./Reportsprovider";
import Swal from "sweetalert2";
import GateKeeper from "../../../rbac/GateKeeper";
import { usePermissionsProvider } from "../../../dataLayer/hooks/usePermissionsProvider";
import { ERPApi } from "../../../serviceLayer/interceptor.jsx";
import * as XLSX from "xlsx";
import Pagination from "../../../utils/Pagination";
import PaginationInfo from "../../../utils/PaginationInfo";

function ReportsData() {
  const { permission } = usePermissionsProvider();
  const {
    DispatchReports,
    reportState: { ReportsData },
  } = Reportsprovider();
  const { debouncesetSearch, debouncesetPage } = Usedebounce(DispatchReports);
  const navigate = useNavigate();
  let data = localStorage.getItem("data");

  const [reportData, setReportData] = useState();

  const getReportDataById = async (id) => {
    try {
      const { data, status } = await ERPApi.get(
        `${import.meta.env.VITE_API_URL}/reports/getreport/${id}`
      );
      if (status === 200) {
        setReportData(data?.report);
        const ReportData = data?.report?.reportsdata;
        const Dimensions = data?.report?.reports[0]?.dimensions;
        const metrics = data?.report?.reports[0]?.metrics;
        downloadExcel(ReportData, Dimensions, metrics);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const downloadExcel = (ReportData, Dimensions, metrics) => {
    const wb = XLSX.utils.book_new();
    const ws_data = convertToExcelData(ReportData, Dimensions, metrics);
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Apply formatting to the header row
    const headerRow = ws_data[0];
    headerRow.forEach((_, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!ws[cellAddress]) ws[cellAddress] = {}; // Ensure the cell object exists
      ws[cellAddress].s = { font: { bold: true, sz: 14 } }; // Bold font and size 14
    });

    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    // Create a Blob and trigger the download
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ReportData.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToExcelData = (data, dimensions, metrics) => {
    const headers = [];
    const rows = [];
    // Build headers dynamically based on the provided dimensions
    if (dimensions?.dimension1 === "courses") headers.push("Courses");
    if (dimensions?.dimension1 === "enquirytakenby") headers.push("Counsellor");
    if (dimensions?.dimension1 === "branch") headers.push("Branch");
    if (dimensions?.dimension1 === "coursepackage")
      headers.push("Course Package");
    if (dimensions?.dimension1 === "modeoftraining")
      headers.push("Mode of Training");
    if (dimensions?.dimension1 === "state") headers.push("State");
    if (dimensions?.dimension1 === "educationtype")
      headers.push("Education Type");
    if (dimensions?.dimension1 === "leadsource") headers.push("Lead Source");
    if (dimensions?.dimension1 === "academicyear")
      headers.push("Academic year");

    if (dimensions?.dimension2 === "courses") headers.push("Courses");
    if (dimensions?.dimension2 === "enquirytakenby") headers.push("Counsellor");
    if (dimensions?.dimension2 === "branch") headers.push("Branch");
    if (dimensions?.dimension2 === "coursepackage")
      headers.push("Course Package");
    if (dimensions?.dimension2 === "modeoftraining")
      headers.push("Mode of Training");
    if (dimensions?.dimension2 === "state") headers.push("State");
    if (dimensions?.dimension2 === "educationtype")
      headers.push("Education Type");
    if (dimensions?.dimension2 === "leadsource") headers.push("Lead Source");
    if (dimensions?.dimension2 === "academicyear")
      headers.push("Academic year");

    if (dimensions?.dimension3 === "courses") headers.push("Courses");
    if (dimensions?.dimension3 === "enquirytakenby") headers.push("Counsellor");
    if (dimensions?.dimension3 === "branch") headers.push("Branch");
    if (dimensions?.dimension3 === "coursepackage")
      headers.push("Course Package");
    if (dimensions?.dimension3 === "modeoftraining")
      headers.push("Mode of Training");
    if (dimensions?.dimension3 === "state") headers.push("State");
    if (dimensions?.dimension3 === "educationtype")
      headers.push("Education Type");
    if (dimensions?.dimension3 === "leadsource") headers.push("Lead Source");
    if (dimensions?.dimension3 === "academicyear")
      headers.push("Academic year");

    if (metrics) {
      headers.push(`${metrics}`);
    }

    // Add headers row to the data array
    rows.push(headers);
    // Process each data entry
    data.forEach((row) => {
      const maxLength = Math.max(
        row.dim2.length,
        row.dim3.length,
        row.dim4.length
      );
      for (let i = 0; i < maxLength; i++) {
        const rowData = [];
        if (dimensions?.dimension1) rowData.push(i === 0 ? row?.dim1 : "");
        if (dimensions?.dimension2) rowData.push(row?.dim2[i] || "");
        if (dimensions?.dimension3) rowData.push(row?.dim3[i] || "");
        if (metrics) rowData.push(row?.dim4[i] || "");
        rows.push(rowData);
      }
    });
    return rows;
  };

  const handleSearch = (e) => {
    debouncesetSearch({ context: "SET_REPORT_DATA", data: e.target.value });
  };

  const handlePerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);

    DispatchReports({
      type: "SET_PER_PAGE",
      payload: {
        context: "SET_REPORT_DATA",
        data: selectedvalue,
      },
    });
  };

  const handlePageChange = (page) => {
    debouncesetPage({ context: "SET_REPORT_DATA", data: page });
  };

  // Delete Report
  const handleDeleteReport = async (id) => {
    Swal.fire({
      title: `Are you sure?`,
      text: "You won't be able to revert this report",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let reportID = { id: id };
        try {
          const { data, status } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/reports/deletereport/${id}`
          );

          if (status === 200) {
            DispatchReports({ type: "DELETE_REPORT", payload: reportID });
            Swal.fire({
              title: "Deleted!",
              text: "Report deleted Successfully.",
              icon: "success",
            });
          }
        } catch (error) {}
      }
    });
  };

  return (
    <div>
      <BackButton heading="Report" content="Back" />
      <div className="container-fluid">
        <div className="card">
          <div className="card-header">
            <div className="row justify-content-between">
              <div className="col-sm-4">
                <div className="search-box">
                  <input
                    type="text"
                    className="form-control search input_bg_color text_color"
                    placeholder="Search for..."
                    name="search"
                    required
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="buttons_alignment">
                  <div className="fs-13 me-3 "></div>
                  {/* <CSVLink
                    data={generateCSVData()}
                    filename={"Reportdata.csv"}
                    target="_blank"
                  >
                    <button
                      type="button"
                      class="btn btn-sm btn_primary margin_top_12 me-2 button-res"
                    >
                      <FaDownload className="me-1" />
                      Download
                    </button>
                    
                  </CSVLink> */}
                  <GateKeeper
                    requiredModule="Reports"
                    submenumodule="Report Data"
                    submenuReqiredPermission="canCreate"
                  >
                    <NavLink
                      to="/reports/createreport"
                      className="btn btn_primary fs-13"
                    >
                      <HiMiniPlus /> Add Report
                    </NavLink>
                  </GateKeeper>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive table-card  border-0">
              <div className="table-container table-scroll">
                <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                  <thead className="table-light">
                    <tr className="shadow-sm bg-body-tertiary rounded">
                      <th scope="col" className="fs-13 lh-xs fw-600">
                        S.No
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600 ">
                        Report Name
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600">
                        Report Type
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600">
                        Created By
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600">
                        Created At
                      </th>

                      {permission?.permissions.map((item) => {
                        if (item.module === "Reports") {
                          return item?.submenus?.map((submenu) => {
                            if (
                              submenu?.module === "Report Data" &&
                              (submenu?.canUpdate === true ||
                                submenu?.canDelete === true)
                            ) {
                              return (
                                <th
                                  scope="col"
                                  className="fs-13 lh_xs 0 fw-600"
                                >
                                  Actions
                                </th>
                              );
                            }
                            return null;
                          });
                        }
                        return null;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {ReportsData?.paginatedReportsData &&
                    ReportsData?.paginatedReportsData.length > 0 ? (
                      ReportsData?.loading ? (
                        "loading..."
                      ) : (
                        ReportsData.paginatedReportsData.map((item, index) => {
                          const data = item.reports[0].reportType;

                          let date = new Date(item?.reports[0]?.createdAt);
                          const day = date.getUTCDate();
                          const monthIndex = date.getUTCMonth();
                          const year = date.getUTCFullYear();

                          const monthAbbreviations = [
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
                          ];

                          // Formatting the date
                          date = `${day < 10 ? "0" : ""}${day}-${
                            monthAbbreviations[monthIndex]
                          }-${year}`;

                          const reportid = item?.id;
                          return (
                            <tr>
                              <td className="fs-13 black_300  lh-xs bg_light">
                                {(ReportsData?.page - 1) *
                                  ReportsData?.pageSize +
                                  index +
                                  1}
                              </td>
                              <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.reports[0]?.reportName}
                              </td>
                              <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.reports[0]?.reportType}
                              </td>

                              <td className="fs-13 black_300  lh-xs bg_light">
                                {item?.reports[0]?.createdBy}
                              </td>
                              <td className="fs-13 black_300  lh-xs bg_light">
                                {date}
                              </td>

                              {permission?.permissions?.map((item) => {
                                if (item.module === "Reports") {
                                  return item?.submenus?.map((submenu) => {
                                    if (
                                      submenu?.module === "Report Data" &&
                                      (submenu?.canUpdate === true ||
                                        submenu?.canDelete === true)
                                    ) {
                                      return (
                                        <td className="fs-13 black_300  lh_xs bg_light ">
                                          <GateKeeper
                                            requiredModule="Reports"
                                            requiredPermission="all"
                                            submenumodule="Report Data"
                                            submenuReqiredPermission="canUpdate"
                                          >
                                            <Link
                                              to={`/reports/reportview/${reportid}`}
                                            >
                                              <AiFillEye
                                                className="me-3 eye_icon"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                title="view"
                                              />
                                            </Link>
                                          </GateKeeper>

                                          <GateKeeper
                                            requiredModule="Reports"
                                            requiredPermission="all"
                                            submenumodule="Report Data"
                                            submenuReqiredPermission="canDelete"
                                          >
                                            <MdDelete
                                              className="text-danger me-2"
                                              onClick={() =>
                                                handleDeleteReport(reportid)
                                              }
                                              data-bs-toggle="tooltip"
                                              data-bs-placement="top"
                                              title="Delete"
                                            />
                                          </GateKeeper>

                                          {/* <ExcelFormatDownload /> */}
                                          {/* <FaDownload className="ms-2 sidebar_color fs-s"

                                            onClick={() => getReportDataById(reportid)}  data-bs-toggle="tooltip" data-bs-placement="top" title="Download"

                                          /> */}

                                          {/* <CSVLink
                                            data={generateCSVDataRow(reportid)}
                                            filename={"Reportdata.csv"}
                                            target="_blank"
                                          >
                                            <FaDownload className="ms-2 sidebar_color fs-s" />
                                          </CSVLink>  */}

                                          {/* <ReportComponent/> */}
                                        </td>
                                      );
                                    }
                                    return null; // Return null when the conditions are not met
                                  });
                                }
                                return null;
                              })}

                              {/* <GateKeeper requiredModule="Reports" submenumodule="Report Data" submenuReqiredPermission="canDelete">
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  <Link to={`/reports/reportview/${reportid}`}>
                                    <RiEdit2Line className="edit_icon me-2" />
                                  </Link>
                                  <MdDelete
                                    className="text-danger" onClick={() => handleDeleteReport(reportid)}
                                  />
                                </td>
                              </GateKeeper> */}
                            </tr>
                          );
                        })
                      )
                    ) : (
                      <tr>
                        <td className="fs-13 black_300  lh_xs bg_light">
                          No Data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* pagination start */}

            <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
              <div className="col-sm">
                <PaginationInfo
                  data={{
                    length: ReportsData?.paginatedReportsData?.length,
                    start: ReportsData?.startReportsData,
                    end: ReportsData?.endReportsData,
                    total: ReportsData?.searchResultReportsData,
                  }}
                  loading={ReportsData?.loading}
                />
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
                    onChange={handlePerPage}
                    value={ReportsData?.perPage}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <div className="">
                  <Pagination
                    currentPage={ReportsData?.page}
                    totalPages={ReportsData?.totalPages}
                    loading={ReportsData?.loading}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsData;
