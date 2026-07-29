import React, { useContext, useEffect } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import "../../../../assets/css/Table.css";
import { MdDelete } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { HiMiniPlus } from "react-icons/hi2";
import { useRoleContext } from "../../../../dataLayer/hooks/useRoleContext";
import Button from "../../../components/button/Button";
import BackButton from "../../../components/backbutton/BackButton";
import Usedebounce from "../../../../dataLayer/hooks/useDebounce/Usedebounce";
import Swal from "sweetalert2";

import GateKeeper from "../../../../rbac/GateKeeper";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Pagination from "../../../../utils/Pagination";
import SearchInputField from "../../../../utils/SearchInputField";
import PaginationInfo from "../../../../utils/PaginationInfo";
import { toast } from "react-toastify";

const Roles = () => {
  // const {
  //   DispatchRoleState,
  //   RoleState: { RolesData },
  // } = useRoleContext();
  const { permission } = usePermissionsProvider();
  // const { debouncesetSearch, debouncesetPage } = Usedebounce(DispatchRoleState);
  const { rolesList } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e) => {
    // debouncesetSearch({ context: "SET_ROLES_DATA", data: e.target.value });
  };

  // const handlePerPage = (e) => {
  //   const selectedvalue = parseInt(e.target.value, 10);

  //   DispatchRoleState({
  //     type: "SET_PER_PAGE",
  //     payload: {
  //       context: "SET_ROLES_DATA",
  //       data: selectedvalue,
  //     },
  //   });
  // };

  // const handlePageChange = (page) => {
  //   debouncesetPage({ context: "SET_ROLES_DATA", data: page });
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

    // debouncesetPage({ context: "ENROLLED_STUDENTS", data: page });
  };

  // useEffect(() => {
  //   debouncesetSearch({ context: "SET_ROLES_DATA", data: "" });
  //   debouncesetPage({ context: "SET_ROLES_DATA", data: 1 });
  //   DispatchRoleState({
  //     type: "SET_PER_PAGE",
  //     payload: {
  //       context: "SET_ROLES_DATA",
  //       data: 10,
  //     },
  //   });
  // }, []);

  // const handleDeleteRole = async (id) => {
  //   // Display Swal confirmation dialog
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this Role",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       let roleID = { id: id };
  //       try {
  //         const { data, status } = await toast.promise(
  //           ERPApi.delete(`/roles/deleteRole/${id}`),
  //           {
  //             pending: "Deleting the Role...",
  //           }
  //         );
  //         Swal.fire({
  //           title: "Deleted!",
  //           text: "Role deleted Successfully.",
  //           icon: "success",
  //         });
  //         if (status === 200) {
  //           DispatchRoleState({
  //             type: "DELETE_ROLE",
  //             payload: roleID,
  //           });
  //         }
  //       } catch (error) {
  //         const errorMessage =
  //           error?.response?.data?.message ||
  //           "An unknown error occurred. Please try again.";
  //         Swal.fire({
  //           title: "Error!",
  //           text: errorMessage,
  //           icon: "error",
  //         });
  //       }
  //     }
  //   });
  // };


  const handleDeleteRole = async (id) => {
    // Display Swal confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Role",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proceed with deleting the role
        try {
          const { data, status } = await toast.promise(
            ERPApi.delete(`/roles/deleteRole/${id}`),
            {
              pending: "Deleting the Role...",
            }
          );

          // Handle success case
          if (status === 200) {
            Swal.fire({
              title: "Deleted!",
              text: "Role deleted Successfully.",
              icon: "success",
            });

            // Optionally return or handle successful deletion here
            return { success: true, deletedRoleID: id };
          } else {
            throw new Error('Failed to delete the role');
          }
        } catch (error) {
          // Handle error case
          const errorMessage =
            error?.response?.data?.message ||
            "An unknown error occurred. Please try again.";

          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });

          // Optionally return error handling result
          return { success: false, error: errorMessage };
        }
      }
    });
  };


  return (
    <div>
      <BackButton heading=" Roles" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row justify-content-between">
                  <div className="col-sm-4">
                    <div className="search-box">
                      {/* <input
                        type="text"
                        className="form-control search input_bg_color text_color"
                        placeholder="Search for..."
                        name="search"
                        required
                        onChange={handleSearch}
                      /> */}
                      <SearchInputField />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="buttons_alignment">
                      <div className="fs-13 me-3 "></div>

                      {/* <button
                        className="btn btn-sm btn_primary fs-13 me-1 mt-2 margin_top_12"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <MdFilterList className="me-1 mb-1" />
                        Filters
                      </button> */}
                      <GateKeeper
                        requiredModule="Settings"
                        requiredPermission="all"
                        submenumodule="Roles"
                        submenuReqiredPermission="canCreate"
                      >
                        <Button
                          type="button"
                          className="btn btn-sm btn_primary fs-13 mt-2 margin_top_12"
                        >
                          <Link
                            to="/settings/roles/new"
                            className="button_color"
                          >
                            {<HiMiniPlus />} Add Role
                          </Link>
                        </Button>
                      </GateKeeper>
                    </div>
                  </div>
                </div>

                {/* <div
                  className="offcanvas offcanvas-end bg_light "
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
                   
                    <div className="">
                      <label className="form-label fs-s fw-medium text_color">
                        Profile
                      </label>
                      <select
                      
                        className="form-select form-control bg_input input_bg_color black_300 select"
                        aria-label="Default select example"
                        placeholder="profile*"
                        id="profile"
                        required
                        name="profile"
                        value=""
                        onChange=""
                      >
                        <option value="" disabled selected>
                         Select the  Role
                        </option>
                       
                      </select>
                    </div>
                   
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium txt-color text_color">
                        Branch
                      </label>
                      <select
                        className="form-select form-control bg_input input_bg_color black_300 select"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        id="branch"
                        required
                        name="branch"
                        value=""
                        onChange=""
                      >
                        <option value="" disabled selected>
                          {" "}
                          Select the Branch{" "}
                        </option>
                       
                      </select>
                    </div>
                    
                    <div className="mt-2">
                      <label className="form-label fs-s fw-medium txt-color text_color">
                        Department
                      </label>
                      <select
                        className="form-select form-control bg_input input_bg_color black_300 select"
                        aria-label="Default select example"
                        placeholder="department*"
                        id="department"
                        required
                        name="department"
                        value=""
                        onChange=""
                      >
                        <option value="" disabled selected>
                          {" "}
                          Select the Department{" "}
                        </option>
                        
                      </select>
                    </div>
                    <div>
                      <div className="position-absolute bottom-0 start-0 ms-2 mb-2">
                        <Button
                          className="btn btn_primary "
                          onClick=""
                        >
                          Clear
                        </Button>
                      </div>
                      <div className="position-absolute bottom-0 end-0 me-2 mb-2">
                        <Button
                          className="btn btn_primary"
                          onClick=""
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="card-body">
                <div className="table-responsive table-card border-0">
                  <div className="table-container table-scroll">
                    <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                      <thead>
                        <tr className="">
                          <th scope="col" className="fs-13 lh_xs fw-600 ">
                            S.No
                          </th>
                          <th scope="col" className="fs-13 lh_xs  fw-600  ">
                            Name
                          </th>
                          <th scope="col" className="fs-13 lh_xs  fw-600  ">
                            Description
                          </th>
                          <th scope="col" className="fs-13 lh_xs  fw-600  ">
                            Created By
                          </th>
                          <th scope="col" className="fs-13 lh_xs  fw-600 ">
                            Created At
                          </th>

                          {permission?.permissions?.map((item) => {
                            if (item.module === "Settings") {
                              return item?.submenus?.map((submenu) => {
                                if (
                                  submenu?.module === "Roles" &&
                                  (submenu?.canUpdate === true ||
                                    submenu?.canDelete === true)
                                ) {
                                  return (
                                    <th
                                      key={1}
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
                      <tbody className="">
                        {rolesList?.roles &&
                          rolesList?.roles?.length > 0 ? (
                          rolesList?.loading ? ( // need to comment this part later
                            <tr>
                              <td className="fs-13 black_300 fw_500 lh_xs bg_light ">
                                loading...
                              </td>
                            </tr>
                          ) : (
                            rolesList?.roles?.map(
                              (item, index) => {
                                let date = new Date(item.createdAt);
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
                                const roleid = item?.id;

                                const disabledRoles = [
                                  133, 132, 131, 125, 118, 117, 116, 115, 114,
                                  113, 12, 11, 10, 9, 8, 7, 4, 3, 2, 1,
                                ];
                                const isDisabled =
                                  disabledRoles.includes(roleid);
                                return (
                                  <tr key={index + 1}>
                                    <td className="fs-13 black_300 fw_500 lh_xs bg_light ">
                                      {(rolesList?.currentPage - 1) *
                                        rolesList?.pageSize +
                                        index +
                                        1}
                                    </td>
                                    <td className="fs-13 black_300  lh_xs bg_light">
                                      {item?.name}
                                    </td>
                                    <td className="fs-13 black_300  lh_xs bg_light">
                                      {item?.description}
                                    </td>
                                    <td className="fs-13 black_300  lh_xs bg_light">
                                      {item?.createdBy}
                                    </td>
                                    <td className="fs-13 black_300  lh_xs bg_light">
                                      {date}
                                    </td>

                                    {permission?.permissions.map((item) => {
                                      if (item.module === "Settings") {
                                        return item?.submenus?.map(
                                          (submenu) => {
                                            if (
                                              submenu?.module === "Roles" &&
                                              (submenu?.canUpdate === true ||
                                                submenu?.canDelete === true)
                                            ) {
                                              return (

                                                <td className="fs-13 black_300  lh_xs bg_light " key={1}>
                                                  <GateKeeper
                                                    requiredModule="Settings"
                                                    requiredPermission="all"
                                                    submenumodule="Roles"
                                                    submenuReqiredPermission="canUpdate"
                                                  >
                                                    <Link
                                                      to={`/settings/roles/edit/${roleid}`}
                                                    >
                                                      <RiEdit2Line className=" edit_icon me-3" />
                                                    </Link>
                                                  </GateKeeper>
                                                  <span
                                                    style={{
                                                      cursor: isDisabled
                                                        ? "not-allowed"
                                                        : "pointer",
                                                    }}
                                                  >
                                                    <GateKeeper
                                                      requiredModule="Settings"
                                                      requiredPermission="all"
                                                      submenumodule="Roles"
                                                      submenuReqiredPermission="canDelete"
                                                    >
                                                      <MdDelete
                                                        className="delete_icon table_icons me-3"
                                                        onClick={() =>
                                                          !isDisabled &&
                                                          handleDeleteRole(
                                                            roleid
                                                          )
                                                        }
                                                        style={{
                                                          pointerEvents:
                                                            isDisabled
                                                              ? "none"
                                                              : "auto",
                                                          opacity: isDisabled
                                                            ? 0.5
                                                            : 1,
                                                        }}
                                                      />
                                                    </GateKeeper>
                                                  </span>
                                                </td>
                                              );
                                            }
                                            return null;
                                          }
                                        );
                                      }
                                      return null;
                                    })}
                                  </tr>
                                );
                              }
                            )
                          )
                        ) : (
                          <tr>
                            <td className="fs-13 black_300 fw_500 lh_xs bg_light ">
                              No data
                            </td>
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
                        length: rolesList?.roles?.length,
                        start: rolesList?.startLead,
                        end: rolesList?.endLead,
                        total: rolesList?.searchResultStudents,
                      }}
                    />
                  </div>
                  <div className="col-sm-auto mt-3 mt-sm-0 d-flex justify-content-center">
                    <div className="mt-2">
                      <select
                        className="form-select form-control me-3 input_bg_color text_color pagination-select"
                        aria-label="Default select example"
                        placeholder="Branch*"
                        name="branch"
                        id="branch"
                        required
                        onChange={handlePerPage}
                        value={rolesList?.pageSize}
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
                        currentPage={rolesList?.currentPage}
                        totalPages={rolesList?.totalPages}
                        loading={rolesList?.loading}
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

export default Roles;




export const RoleAction = async ({ request }) => {
  const formdata = await request.formData();
  const id = formdata.get("id");
  let roleID = { id }; // Set up the ID to delete

  try {
    const { data, status } = await toast.promise(
      ERPApi.delete(`/roles/deleteRole/${id}`),
      {
        pending: "Deleting the Role...",
      }
    );

    // If the deletion is successful
    if (status === 200) {
      // You can return the deleted role's ID or any other necessary response
      return { success: true, deletedRoleID: roleID };
    } else {
      // In case of failure, throw an error or handle it as per your need
      throw new Error('Failed to delete the role');
    }
  } catch (error) {
    console.error("Error deleting role:", error);
    return { success: false, error: error.message };
  }
};
