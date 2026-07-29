import React, { useContext } from "react";
import { Link, useFetcher, useLoaderData, useSearchParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { HiMiniPlus } from "react-icons/hi2";

import { LeadSourceContext } from "../../../../dataLayer/context/leadSourceContext/LeadSourceContext";
import { useLeadSourceContext } from "../../../../dataLayer/hooks/useLeadSourceContext";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import Swal from "sweetalert2";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider";
import GateKeeper from "../../../../rbac/GateKeeper";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import SearchInputField from "../../../../utils/SearchInputField.jsx";
import PaginationInfo from "../../../../utils/PaginationInfo.jsx";
import Pagination from "../../../../utils/Pagination.jsx";

const LeadSource = () => {
  // const { leadSourceState, DispatchLeadSource, getAllLeadSource } =
  //   useLeadSourceContext();
  const { leadSource } = useLoaderData();
  const fetcher = useFetcher();
  const { permission } = usePermissionsProvider();


  const [searchParams, setSearchParams] = useSearchParams();
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
  };

  const handleDeleteLead = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Lead Source!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let leadId = { id: id };
        const formdata = new FormData();
        formdata.set("id", id)
        fetcher.submit(formdata, {
          method: "delete",
          encType: "application/form-data"
        })
        // try {
        //   const { data, status } = await ERPApi.delete(
        //     `${import.meta.env.VITE_API_URL}/settings/deleteleadsource/${id}`,
        //     id
        //   );
        //   if (status === 200) {
        //     DispatchLeadSource({
        //       type: "DELETE_LEAD_SOURCE",
        //       payload: leadId,
        //     });
        //     Swal.fire({
        //       title: "Deleted!",
        //       text: "Lead deleted Successfully.",
        //       icon: "success",
        //     });
        //   }
        // } catch (error) {}
      }
    });
  };


  return (
    <div>
      <BackButton heading="Lead Source" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    <SearchInputField />
                  </div>
                  <div>
                    {/* <button
                      type="button"
                      className="btn btn_primary add-btn fs-13 "
                    >
                      <Link to="/settings/lead/new" className="button_color">
                        <HiMiniPlus /> Add Lead Source
                      </Link>
                    </button> */}
                    <GateKeeper
                      requiredModule="Settings"
                      requiredPermission="all"
                      submenumodule="Lead Sources"
                      submenuReqiredPermission="canCreate"
                    >
                      <Button
                        type="button"
                        className="btn btn-sm btn_primary fs-13"
                      >
                        <Link to="/settings/lead/new" className="button_color">
                          {<HiMiniPlus />} Create Leads Source
                        </Link>
                      </Button>
                    </GateKeeper>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive table-card  border-0">
                  <div className="table-container table-scroll">
                    <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                      <thead>
                        <tr className="">
                          <th scope="col" className="fs-13 lh-xs fw-600  ">
                            S.No
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600  ">
                            Name
                          </th>
                          <th scope="col" className="fs-13 lh-xs fw-600  ">
                            Created By
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600 ">
                            Created At
                          </th>
                          {/* <th scope="col" className="fs-13 lh-xs  fw-600 ">
                            Actions
                          </th> */}

                          {permission?.permissions.map((item) => {
                            if (item.module === "Settings") {
                              return item?.submenus?.map((submenu) => {
                                if (
                                  submenu?.module === "Lead Sources" &&
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
                                return null; // Return null when the conditions are not met
                              });
                            }
                            return null;
                          })}
                        </tr>
                      </thead>
                      <tbody className="">
                        {leadSource.leadSourceData &&
                          leadSource.leadSourceData.length > 0 ? (
                          leadSource.leadSourceData.map((item, index) => {
                            let date = new Date(item.date);
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
                            date = `${day < 10 ? "0" : ""}${day}-${monthAbbreviations[monthIndex]
                              }-${year}`;

                            const leadId = item?.id;

                            return (
                              <tr key={index}>
                                <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                  {(leadSource.currentPage-1)* leadSource.pageSize + index+1}
                                </td>
                                <td
                                  className="fs-13 black_300  lh-xs bg_light text-truncate"
                                  style={{ maxWidth: "150px" }}
                                  title={item.leadsource}
                                >
                                  {item.leadsource}
                                </td>

                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {item.createdby}
                                </td>
                                <td className="fs-13 black_300  lh-xs bg_light">
                                  {date}
                                </td>

                                {permission?.permissions.map((item) => {
                                  if (item.module === "Settings") {
                                    return item?.submenus?.map((submenu) => {
                                      if (
                                        submenu?.module === "Lead Sources" &&
                                        (submenu?.canUpdate === true ||
                                          submenu?.canDelete === true)
                                      ) {
                                        return (
                                          <td className="fs-13 black_300  lh-xs bg_light ">
                                            <GateKeeper
                                              requiredModule="Settings"
                                              requiredPermission="all"
                                              submenumodule="Lead Sources"
                                              submenuReqiredPermission="canUpdate"
                                            >
                                              <Link
                                                to={`/settings/lead/edit/${leadId}`}
                                              >
                                                <RiEdit2Line className="edit_icon table_icons me-3" />
                                              </Link>
                                            </GateKeeper>
                                            <GateKeeper
                                              requiredModule="Settings"
                                              requiredPermission="all"
                                              submenumodule="Lead Sources"
                                              submenuReqiredPermission="canDelete"
                                            >
                                              <MdDelete
                                                className="delete_icon table_icons me-3"
                                                onClick={() =>
                                                  handleDeleteLead(leadId)
                                                }
                                              />
                                            </GateKeeper>
                                          </td>
                                        );
                                      }
                                      return null; // Return null when the conditions are not met
                                    });
                                  }
                                  return null;
                                })}

                                {/* <td className="fs-13 black_300  lh-xs bg_light ">
                                  <GateKeeper requiredModule="Settings" requiredPermission="all" submenumodule="Lead Sources" submenuReqiredPermission="canUpdate">
                                    <Link to={`/settings/lead/edit/${item.id}`}>
                                      <RiEdit2Line className="edit_icon table_icons me-3" />
                                    </Link>
                                  </GateKeeper>
                                  <GateKeeper requiredModule="Settings" requiredPermission="all" submenumodule="Lead Sources" submenuReqiredPermission="canDelete">
                                    <MdDelete
                                      className="delete_icon table_icons me-3"
                                      onClick={() => handleDeleteLead(item.id)}
                                    />
                                  </GateKeeper>
                                </td> */}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="fs-13 black_300">No Data </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: leadSource?.leadSourceData?.length,
                        start: leadSource?.start,
                        end: leadSource?.end,
                        total: leadSource?.totalLeadSource,
                      }}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex justify-content-center pagination-res">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color pagination-select"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                        value={leadSource.pageSize}
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
                        currentPage={leadSource?.currentPage}
                        totalPages={leadSource?.totalPages}
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

export default LeadSource;
