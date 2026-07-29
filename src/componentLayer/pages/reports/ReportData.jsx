import React from 'react'
import { HiMiniPlus } from 'react-icons/hi2'
import { Link, NavLink, useFetcher, useLoaderData, useSearchParams } from 'react-router-dom'
import BackButton from '../../components/backbutton/BackButton'
import GateKeeper from '../../../rbac/GateKeeper'
import SearchInputField from '../../../utils/SearchInputField'
import { usePermissionsProvider } from '../../../dataLayer/hooks/usePermissionsProvider'
import CustomTable from '../../../utils/CustomTable'
import { MdDelete } from 'react-icons/md'
import { FaDownload } from 'react-icons/fa'
import { AiFillEye } from 'react-icons/ai'
import Swal from 'sweetalert2'
import PaginationInfo from '../../../utils/PaginationInfo'
import Pagination from '../../../utils/Pagination'

const ReportData = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { permission } = usePermissionsProvider();
    const deleteReportFetcher = useFetcher();
    const { reportsData } = useLoaderData();


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
                const formData = new FormData();
                formData.set("id", id);
                deleteReportFetcher.submit(formData, { method: "delete" });
            }
        });
    };


    const columns = [
        {
            id: 'sno', header: 'S.No', accessor: (row, index) => (reportsData?.currentPage - 1) *
                reportsData?.pageSize +
                index +
                1
        },
        { id: 'reportName', header: 'Report Name', accessor: 'reportName', sortable: true, hideable: true },
        { id: 'reportType', header: 'Report Type', accessor: 'reportType', sortable: true, hideable: true },
        { id: 'createdBy', header: 'Created By', accessor: 'createdBy', sortable: true, hideable: true },
        {
            id: 'createdAt',
            header: 'Created At',
            accessor: (row) =>
                row.createdAt ? (
                    new Date(row.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })
                ) : (
                    'N/A'
                ),
            sortable: true,
            hideable: true,
        },
    ];


    const actions = (item) => {
        // find "Reports" module permissions
        const reportModule = permission?.permissions?.find(
            (p) => p.module === "Reports"
        );

        // find submenu for "Report Data"
        const reportDataSubmenu = reportModule?.submenus?.find(
            (s) => s.module === "Report Data"
        );

        // if no permissions found, don’t render anything
        if (!reportDataSubmenu) return null;

        return (
            <div className="d-flex align-items-center">
                {/* 👁️ VIEW — show if canUpdate is true */}
                {reportDataSubmenu?.canUpdate && (
                    <GateKeeper
                        requiredModule="Reports"
                        submenumodule="Report Data"
                        submenuReqiredPermission="canUpdate"
                    >
                        <Link to={`/reports/reportview/${item.id}`}>
                            <AiFillEye
                                className="me-3 eye_icon"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="View"
                            />
                        </Link>
                    </GateKeeper>
                )}

                {/* 🗑️ DELETE — show if canDelete is true */}
                {reportDataSubmenu?.canDelete && (
                    <GateKeeper
                        requiredModule="Reports"
                        submenumodule="Report Data"
                        submenuReqiredPermission="canDelete"
                    >
                        <MdDelete
                            className="text-danger me-2"
                            onClick={() => handleDeleteReport(item.id)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Delete"
                            style={{ cursor: "pointer" }}
                        />
                    </GateKeeper>
                )}

                {/* ⬇️ OPTIONAL: Download button for users with canRead */}
                {/* {reportDataSubmenu?.canRead && (
                    <GateKeeper
                        requiredModule="Reports"
                        submenumodule="Report Data"
                        submenuReqiredPermission="canRead"
                    >
                        <FaDownload
                            className="ms-2 sidebar_color fs-s"
                            // onClick={() => getReportDataById(item.id)}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Download"
                        />
                    </GateKeeper>
                )} */}
            </div>
        );
    };


    // const data = reportsData?.reports || []

    const data = reportsData?.reports?.map((item) => {
        const report = item?.reports?.[0] || {};
        const createdDate = new Date(report?.createdAt);

        const monthAbbreviations = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const formattedDate = !isNaN(createdDate)
            ? `${createdDate.getUTCDate().toString().padStart(2, "0")}-${monthAbbreviations[createdDate.getUTCMonth()]
            }-${createdDate.getUTCFullYear()}`
            : "N/A";

        return {
            id: item.id,
            reportName: report?.reportName || "N/A",
            reportType: report?.reportType || "N/A",
            createdBy: report?.createdBy || "N/A",
            createdAt: formattedDate,
        };
    }) || [];


    // const getReportDataById = async (id) => {
    //     try {
    //         const { data, status } = await ERPApi.get(
    //             `${import.meta.env.VITE_API_URL}/reports/getreport/${id}`
    //         );
    //         if (status === 200) {
    //             setReportData(data?.report);
    //             const ReportData = data?.report?.reportsdata;
    //             const Dimensions = data?.report?.reports[0]?.dimensions;
    //             const metrics = data?.report?.reports[0]?.metrics;
    //             downloadExcel(ReportData, Dimensions, metrics);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const handlePerPage = (e) => {
        const selectedvalue = parseInt(e.target.value, 10);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("pageSize", selectedvalue.toString());
        newSearchParams.set("page", 1);
        setSearchParams(newSearchParams);
    };

    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("page", page.toString());
        setSearchParams(newSearchParams);

        debouncesetPage({ context: "ENROLLED_STUDENTS", data: page });
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
                                    <SearchInputField />
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
                                <CustomTable
                                    data={data}
                                    columns={columns}
                                    actions={actions}
                                />
                            </div>
                        </div>
                        {/* pagination start */}

                        <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                            <div className="col-sm">
                                <PaginationInfo
                                    data={{
                                        length: reportsData?.totalReports?.length,
                                        start: reportsData?.startReport,
                                        end: reportsData?.endReport,
                                        total: reportsData?.totalReports,
                                    }}
                                    loading={false}
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
                                        value={reportsData?.perPage}
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
                                        currentPage={reportsData?.currentPage}
                                        totalPages={reportsData?.totalPages}
                                        loading={reportsData?.loading}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportData
