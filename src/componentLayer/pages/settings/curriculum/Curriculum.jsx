import React, { useState } from "react";
import BackButton from "../../../components/backbutton/BackButton";
import { HiMiniPlus } from "react-icons/hi2";
import POPUP_CREATE_CURRICULUM from "../curriculum/curriculum_sub_components/POPUP_CREATE_CURRICULUM";
import { RiEdit2Line } from "react-icons/ri";
import GateKeeper from "../../../../rbac/GateKeeper";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider";
import CurriculumListProvider from "./CurriculumListProvider";
import Usedebounce from "../../../../dataLayer/hooks/useDebounce/Usedebounce";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Pagination from "../../../../utils/Pagination";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import Button from "../../../components/button/Button";
import { toast } from "react-toastify";

const Curriculum = () => {
  const {
    CurriculumState: { curriculumsList },
    DispatchCurriculumState,
    getPaginatedCurriculums,
  } = CurriculumListProvider();
  const { permission } = usePermissionsProvider();

  
  const { debouncesetSearch, debouncesetPage } = Usedebounce(
    DispatchCurriculumState
  );

  const handleSearch = (e) => {
    debouncesetSearch({ data: e.target.value });
  };

  const handlePerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);
    DispatchCurriculumState({
      type: "SET_PER_PAGE",
      payload: {
        data: selectedvalue,
      },
    });
  };

  const handlePageChange = (page) => {
    debouncesetPage({ data: page });
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);

  const [mode, setMode] = useState("create"); // Mode: 'create' or 'edit'

  const handleCreateClick = () => {
    setShowModal(true);
    setMode("create");
    setSelectedCurriculum(null); // Reset selected curriculum for creation
  };
  const handleEditClick = async (curriculum) => {
    try {
      const response = await ERPApi.get(`/batch/curriculum/${curriculum.id}?include=exam_collection`); // Adjust the API endpoint and parameters as needed
      setSelectedCurriculum(response.data);
      setShowModal(true);
      setMode("edit");
    } catch (error) {
      console.error("Error fetching curriculum details for edit:", error);
      toast.error("Failed to fetch curriculum details for edit.");
    } finally {
      
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitCloseModal = () => {
    getPaginatedCurriculums();
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Curriculum",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data, status } = await toast.promise(
            ERPApi.delete(`/batch/curriculum/${id}`),
            {
              pending: "Deleting The Curriculum...",
            }
          );
          if (status === 200) {
            getPaginatedCurriculums();
            Swal.fire({
              title: "Deleted!",
              text: "Curriculum Deleted Successfully.",
              icon: "success",
            });
          }
        } catch (error) {
          const errorMessage =
            error?.response?.data?.message ||
            "Curriculum Deleted Failed. Please try again.";
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
        }
      }
    });
  };

  const handleSave = () => {
    getPaginatedCurriculums();
  };

  return (
    <div>
      <BackButton heading="Curriculum" content="Back" to="/" />
      <Link to='curriculums'>Link</Link>
      <div className="container-fluid mt-3">
        <div className="card">
          <div className="card-header">
            <div className=" row d-flex justify-content-between">
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
              <div className="col-sm-6 text-end">
                <GateKeeper
                  requiredModule="Settings"
                  requiredPermission="all"
                  submenumodule="Curriculum"
                  submenuReqiredPermission="canCreate"
                >
                  <Button
                    className="btn btn_primary"
                    onClick={handleCreateClick}
                  >
                    {<HiMiniPlus />}Create Curriculum
                  </Button>
                </GateKeeper>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive table-card table-container table-scroll border-0">
              <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                <thead>
                  <tr className="">
                    <th scope="col" className="fs-13 lh-xs fw-600 ">
                      S.No
                    </th>
                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                      Curriculum
                    </th>
                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                      Description
                    </th>
                    {permission?.permissions.map((item) => {
                      if (item.module === "Settings") {
                        return item?.submenus?.map((submenu) => {
                          if (
                            submenu?.module === "Curriculum" &&
                            (submenu?.canUpdate === true ||
                              submenu?.canDelete === true)
                          ) {
                            return (
                              <th scope="col" className="fs-13 lh_xs 0 fw-600">
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
                  {curriculumsList?.paginatedCurriculum &&
                  curriculumsList?.paginatedCurriculum?.length > 0 ? (
                    curriculumsList?.paginatedCurriculum?.map((item, index) => {
                      return (
                        <tr>
                          <td className="fs-13 black_300 fw_500 lh-xs bg_light ">
                            {(curriculumsList?.currentPage - 1) *
                              curriculumsList?.perPage +
                              index +
                              1}
                          </td>
                          <td
                            className="fs-13 black_300  lh-xs bg_light  text-truncate"
                            style={{ maxWidth: "150px" }}
                            title={item.course_name}
                          >
                            {item?.curriculumName}
                          </td>
                          <td
                            className="fs-13 black_300  lh-xs bg_light text-truncate"
                            style={{ maxWidth: "150px" }}
                            title={item.course_package}
                          >
                            {item?.curriculumDescription}
                          </td>
                          {permission?.permissions.map((subitem) => {
                            if (subitem.module === "Settings") {
                              return subitem?.submenus?.map((submenu) => {
                                if (
                                  submenu?.module === "Curriculum" &&
                                  (submenu?.canUpdate === true ||
                                    submenu?.canDelete === true)
                                ) {
                                  return (
                                    <td className="fs-13 black_300  lh-xs bg_light ">
                                      <GateKeeper
                                        requiredModule="Settings"
                                        requiredPermission="all"
                                        submenumodule="Curriculum"
                                        submenuReqiredPermission="canUpdate"
                                      >
                                        <Link
                                          to={`/settings/curriculum/addmodules/${item.id}`}
                                          className="button_color"
                                        >
                                          <HiMiniPlus
                                            className="rupee_icon table_icons me-3"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            title="Curriculum"
                                          />
                                        </Link>
                                      </GateKeeper>

                                      <GateKeeper
                                        requiredModule="Settings"
                                        requiredPermission="all"
                                        submenumodule="Curriculum"
                                        submenuReqiredPermission="canUpdate"
                                      >
                                        <RiEdit2Line
                                          className="edit_icon table_icons me-3"
                                          onClick={() => handleEditClick(item)}
                                        />
                                      </GateKeeper>

                                      <GateKeeper
                                        requiredModule="Settings"
                                        requiredPermission="all"
                                        submenumodule="Curriculum"
                                        submenuReqiredPermission="canDelete"
                                      >
                                        <MdDelete
                                          className="delete_icon table_icons me-3"
                                          onClick={() => handleDelete(item.id)}
                                        />
                                      </GateKeeper>
                                    </td>
                                  );
                                }
                                return null;
                              });
                            }
                            return null;
                          })}
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
            <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
              <div className="col-sm">
                <PaginationInfo
                  data={{
                    length: curriculumsList?.paginatedCurriculum?.length,
                    start: curriculumsList?.startCurriculum,
                    end: curriculumsList?.endCurriculum,
                    total: curriculumsList?.searchResultCurriculums,
                  }}
                  loading={curriculumsList?.loading}
                />
              </div>
              <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                <div className="mt-2">
                  <select
                    className="form-select form-control me-3 input_bg_color pagination-select"
                    aria-label="Default select example"
                    placeholder="Branch*"
                    name="branch"
                    id="branch"
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
                    currentPage={curriculumsList?.currentPage}
                    totalPages={curriculumsList?.totalPages}
                    loading={curriculumsList?.loading}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal === true && (
        <POPUP_CREATE_CURRICULUM
          show={showModal}
          mode={mode}
          selectedCurriculum={selectedCurriculum}
          onSave={handleSave}
          handleClose={handleCloseModal}
          handleSubmitClose={handleSubmitCloseModal}
        />
      )}
    </div>
  );
};
export default Curriculum;
