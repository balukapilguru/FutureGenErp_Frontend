import React, { useContext, useState } from "react";
import "../../../../assets/css/Table.css";
import { Link, useFetcher, useLoaderData, useSearchParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { HiMiniPlus } from "react-icons/hi2";
import BackButton from "../../../components/backbutton/BackButton";

import { CoursePackageContext } from "../../../../dataLayer/context/coursePackageContext/CoursePackageContext";

import { useCoursePackage } from "../../../../dataLayer/hooks/useCoursePackage";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../../../components/button/Button";
import Swal from "sweetalert2";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider";
import GateKeeper from "../../../../rbac/GateKeeper";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import SearchInputField from "../../../../utils/SearchInputField.jsx";
import Pagination from "../../../../utils/Pagination.jsx";
import PaginationInfo from "../../../../utils/PaginationInfo.jsx";

const CoursePackage = () => {
  const { coursePackageState, getAllCoursePackages, DispatchCourseState } = useCoursePackage();
  const { permission } = usePermissionsProvider();
  const { coursePackage } = useLoaderData();
  const deleteFetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();



  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  // const handleDeleteCoursePackage = async (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this Course Package",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const { data, status } = await toast.promise(
  //           ERPApi.delete(`/settings/deletecoursepackage/${id}`),
  //           {
  //             pending: "Deleting The Course Package...",
  //           }
  //         );
  //         if (status === 200) {
  //           getAllCoursePackages();
  //           Swal.fire({
  //             title: "Deleted!",
  //             text: "Course Package Deleted Successfully.",
  //             icon: "success",
  //           });
  //         }
  //       } catch (error) {
  //         const errorMessage =
  //           error?.response?.data?.message ||
  //           "Course Package Deleted Failed. Please try again.";
  //         Swal.fire({
  //           title: "Error!",
  //           text: errorMessage,
  //           icon: "error",
  //         });
  //       }
  //     }
  //   });
  // };


  const handleDeleteCoursePackage = async (id) => {
    try {
      const formData = new FormData();
      formData.set("actionType", "delete");
      formData.set("id", id);

      deleteFetcher.submit(formData, {
        method: "delete",
      });
    } catch (error) {
      console.error("Error triggering delete fetcher:", error);
      // await Swal.fire({
      //   title: "Error!",
      //   text: "Failed to start delete action. Check console for details.",
      //   icon: "error",
      // });
    }
  };


  const handleToggleStatus = async (id, currentStatus, name, createdBy) => {
    const newStatus = currentStatus === 0 ? 1 : 0;

    const formData = new FormData();
    formData.set("actionType", "toggleUserStatus");
    formData.set("coursepackages_name", name);
    formData.set("createdby", createdBy);
    formData.set("isToggle", newStatus);
    formData.set("id", id);

    Swal.fire({
      title: "Are you sure?",
      text: `You want to ${currentStatus === 0 ? "Enable" : "Disable"}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes ${currentStatus === 0 ? "Enable" : "Disable"} it`,
    }).then(async (result) => {
      if (result.isConfirmed) {

        deleteFetcher.submit(formData, {
          method: "patch",
        });
      }
    })

    // try {
    //   const { data, status } = await toast.promise(
    //     ERPApi.patch(`/settings/updatecoursepackages/${id}`, {
    //       isToggle: newStatus,
    //       coursepackages_name: name,
    //       createdby: createdBy,
    //     }),
    //     {
    //       pending: "Updating Status...",
    //       success: "Status Updated!",
    //       error: "Failed to update status",
    //     }
    //   );

    //   return data;
    // } catch (error) {
    //   const errorMessage =
    //     error?.response?.data?.message || "Something went wrong.";
    //   toast.error(errorMessage);
    // }
  };


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

    // debouncesetPage({ context: "ENROLLED_STUDENTS", data: page });
  };

  return (
    <div>
      <BackButton heading="Course Package" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
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
                        requiredModule="Settings"
                        requiredPermission="all"
                        submenumodule="Course Package"
                        submenuReqiredPermission="canCreate"
                      >
                        <Button
                          type="button"
                          className="btn btn-sm btn_primary fs-13"
                        >
                          <Link
                            to="/settings/coursePackage/new"
                            className="button_color"
                          >
                            {<HiMiniPlus />} Create Course Package
                          </Link>
                        </Button>
                      </GateKeeper>
                    </div>
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
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Name
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600  ">
                            Created By
                          </th>
                          <th scope="col" className="fs-13 lh-xs  fw-600 ">
                            Created At
                          </th>
                          {permission?.permissions.map((item) => {
                            if (item.module === "Settings") {
                              return item?.submenus?.map((submenu) => {
                                if (
                                  submenu?.module === "Course Package" &&
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
                          <th scope="col" className="fs-13 lh-xs  fw-600 ">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {coursePackage &&
                          coursePackage?.coursePackageData?.length > 0 ? (
                          coursePackage?.coursePackageData.map(
                            (item, index) => {
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

                              const coursepackageid = item?.id;

                              return (
                                <tr key={index}>
                                  <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                                    {(coursePackage.currentPage - 1) * coursePackage.pageSize + index + 1}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "150px" }}
                                    title={item.coursepackages_name}
                                  >
                                    {item.coursepackages_name}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {item?.createdby}
                                  </td>
                                  <td className="fs-13 black_300  lh-xs bg_light">
                                    {date}
                                  </td>

                                  {permission?.permissions.map((item) => {
                                    if (item.module === "Settings") {
                                      return item?.submenus?.map((submenu) => {
                                        if (
                                          submenu?.module ===
                                          "Course Package" &&
                                          (submenu?.canUpdate === true ||
                                            submenu?.canDelete === true)
                                        ) {
                                          return (
                                            <td className="fs-13 black_300  lh-xs bg_light ">
                                              <GateKeeper
                                                requiredModule="Settings"
                                                requiredPermission="all"
                                                submenumodule="Course Package"
                                                submenuReqiredPermission="canUpdate"
                                              >
                                                <Link
                                                  to={`/settings/coursePackage/edit/${coursepackageid}`}
                                                >
                                                  <RiEdit2Line className="edit_icon table_icons me-3" />
                                                </Link>
                                              </GateKeeper>

                                              <GateKeeper
                                                requiredModule="Settings"
                                                requiredPermission="all"
                                                submenumodule="Course Package"
                                                submenuReqiredPermission="canDelete"
                                              >
                                                <MdDelete
                                                  className="delete_icon table_icons me-3"
                                                  onClick={() =>
                                                    handleDeleteCoursePackage(
                                                      coursepackageid
                                                    )
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
                                  <td className="fs-13 black_300 lh-xs bg_light">
                                    {(userData?.user.profile === "Admin" ||
                                      userData?.user.profile === "Support") && (
                                        <GateKeeper
                                          requiredModule="Settings"
                                          requiredPermission="all"
                                          submenumodule="Course Package"
                                          submenuReqiredPermission="canUpdate"
                                        >
                                          <span
                                            className="form-check form-switch form-switch-right form-switch-md"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="course package status"
                                          >
                                            <input
                                              style={{ cursor: "pointer" }}
                                              className="form-check-input code-switcher toggle_btn"
                                              type="checkbox"
                                              id="FormValidationDefault"
                                              checked={item.isToggle === 1}
                                              onChange={() =>
                                                handleToggleStatus(item.id, item.isToggle, item.coursepackages_name, item.createdby)
                                              }
                                              data-bs-toggle="modal"
                                              data-bs-target="#staticBackdrop"
                                            />
                                          </span>
                                        </GateKeeper>
                                      )}
                                  </td>
                                  {/* <td className="fs-13 black_300  lh-xs bg_light ">
                                  <GateKeeper requiredModule="Settings" requiredPermission="all" submenumodule="Course Package" submenuReqiredPermission="canUpdate">
                                  <Link
                                    to={`/settings/coursePackage/edit/${item.id}`}
                                  >
                                    <RiEdit2Line className="edit_icon table_icons me-3" />
                                  </Link>
                                  </GateKeeper>

                                  <GateKeeper requiredModule="Settings" requiredPermission="all" submenumodule="Course Package" submenuReqiredPermission="canDelete">
                                  <MdDelete
                                    className="delete_icon table_icons me-3"
                                    onClick={() =>
                                      handleDeleteCoursePackage(item.id)
                                    }
                                  />
                                  </GateKeeper>
                                </td> */}
                                </tr>
                              );
                            }
                          )
                        ) : (
                          <tr>
                            <td className="fs-13 black_300">No Data </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
                  <div className="col-sm">
                    <PaginationInfo
                      data={{
                        length: coursePackage?.data?.length,
                        start: coursePackage?.start,
                        end: coursePackage?.end,
                        total: coursePackage?.totalRecords,
                      }}
                    // loading={AttendancesList?.loading}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color pagination-select "
                        aria-label="Default select example"
                        required
                        onChange={(e) => handlePerPage(e)}
                        value={coursePackage.pageSize}
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
                        currentPage={coursePackage?.currentPage}
                        totalPages={coursePackage?.totalPages}
                        loading={coursePackage?.loading}
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
export default CoursePackage;
