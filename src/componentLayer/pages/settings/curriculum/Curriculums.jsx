import React, { useState } from "react";
import {
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import GateKeeper from "../../../../rbac/GateKeeper";
import { HiMiniPlus } from "react-icons/hi2";
import Button from "../../../components/button/Button";
import SearchInputField from "../../../../utils/SearchInputField";
import BackButton from "../../../components/backbutton/BackButton";
import CustomTable from "../../../../utils/CustomTable";
import PaginationInfo from "../../../../utils/PaginationInfo";
import Pagination from "../../../../utils/Pagination";
import { usePermissionsProvider } from "../../../../dataLayer/hooks/usePermissionsProvider";
import { MdDelete, MdOutlinePermMedia } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import POPUP_CREATE_CURRICULUM from "./curriculum_sub_components/POPUP_CREATE_CURRICULUM";
import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import Swal from "sweetalert2";
import { FaRegCopy } from "react-icons/fa6";

const Curriculums = () => {
  const { curriculumData } = useLoaderData();
  const { permission } = usePermissionsProvider();
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [mode, setMode] = useState("create"); // Mode: 'create' or 'edit'
  const [showModal, setShowModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const curriculumFetcher = useFetcher();

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
        const formData = new FormData();
        formData.set("id", id);
        formData.set("type", "delete");
        curriculumFetcher.submit(formData, {
          method: "delete",
        });
        // try {
        //     const { data, status } = await toast.promise(
        //         ERPApi.delete(`/batch/curriculum/${id}`),
        //         {
        //             pending: "Deleting The Curriculum...",
        //         }
        //     );
        //     if (status === 200) {
        //         getPaginatedCurriculums();
        //         Swal.fire({
        //             title: "Deleted!",
        //             text: "Curriculum Deleted Successfully.",
        //             icon: "success",
        //         });
        //     }
        // } catch (error) {
        //     const errorMessage =
        //         error?.response?.data?.message ||
        //         "Curriculum Deleted Failed. Please try again.";
        //     Swal.fire({
        //         title: "Error!",
        //         text: errorMessage,
        //         icon: "error",
        //     });
        // }
      }
    });
  };

  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (curriculumData?.currentPage - 1) * curriculumData?.pageSize +
        index +
        1,
    },
    { id: "curriculumName", header: "Curriculum", accessor: "curriculumName" },
    {
      id: "curriculumDescription",
      header: "Description",
      accessor: "curriculumDescription",
    },
  ];

  const actions = (item) => {
    return (
      <>
        {permission?.permissions.map((subitem) => {
          if (subitem.module === "Reports") {
            return subitem?.submenus?.map((submenu) => {
              if (
                submenu?.module === "Report Data" &&
                (submenu?.canUpdate === true || submenu?.canDelete === true)
              ) {
                return (
                  <td className="fs-13 black_300 lh-xs ">
                    {/* ➕ ADD (Replace with whatever "Add" action reports use) */}
                    <GateKeeper
                      requiredModule="Reports"
                      requiredPermission="all"
                      submenumodule="Report Data"
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
                          title="Add Data"
                        />
                      </Link>
                    </GateKeeper>
                    <GateKeeper
                      requiredModule="Settings"
                      requiredPermission="all"
                      submenumodule="Curriculum"
                      submenuReqiredPermission="canUpdate"
                    >
                      <Link
                        to={`/settings/curriculum/${item.id}/AddMediaForTopic`}
                        className="button_color"
                      >
                        <MdOutlinePermMedia
                          className="rupee_icon table_icons me-3"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Curriculum"
                        />
                      </Link>
                    </GateKeeper>

                    {/* ✏ EDIT */}
                    <GateKeeper
                      requiredModule="Reports"
                      requiredPermission="all"
                      submenumodule="Report Data"
                      submenuReqiredPermission="canUpdate"
                    >
                      <RiEdit2Line
                        className="edit_icon table_icons me-3"
                        onClick={() => handleEditClick(item)}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Edit"
                        style={{ cursor: "pointer" }}
                      />
                    </GateKeeper>

                    {/* ✏ Clone */}
                    <GateKeeper
                      requiredModule="Reports"
                      requiredPermission="all"
                      submenumodule="Report Data"
                      submenuReqiredPermission="canUpdate"
                    >
                      <FaRegCopy
                        className="edit_icon table_icons me-3"
                        onClick={() => handleCloneClick(item)}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Clone"
                        style={{ cursor: "pointer" }}
                      />
                    </GateKeeper>

                    {/* 🗑 DELETE */}
                    <GateKeeper
                      requiredModule="Reports"
                      requiredPermission="all"
                      submenumodule="Report Data"
                      submenuReqiredPermission="canDelete"
                    >
                      <MdDelete
                        className="delete_icon table_icons me-3 text-danger"
                        onClick={() => handleDelete(item.id)}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Delete"
                        style={{ cursor: "pointer" }}
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
      </>
    );
  };

  const data =
    curriculumData?.reversedCurriculums?.map((item) => {
      return {
        id: item.id,
        curriculumName: item?.curriculumName || "N/A",
        curriculumDescription: item?.curriculumDescription || "N/A",
      };
    }) || [];

  const handlePerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("pageSize", selectedvalue.toString());
    newSearchParams.set("page", 1);
    setSearchParams(newSearchParams);
  };
  const handleSave = () => {
    // getPaginatedCurriculums();
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitCloseModal = () => {
    // getPaginatedCurriculums();
    setShowModal(false);
  };

  const handleCreateClick = () => {
    setShowModal(true);
    setMode("create");
    setSelectedCurriculum(null); // Reset selected curriculum for creation
  };

  const handleCloneClick = async (curriculum) => {
    try {
      const response = await ERPApi.get(
        `/batch/curriculum/${curriculum.id}?include=exam_collection`,
      ); // Adjust the API endpoint and parameters as needed
      setSelectedCurriculum(response.data);
      setShowModal(true);
      setMode("clone");
    } catch (error) {
      console.error("Error fetching curriculum details for edit:", error);
      toast.error("Failed to fetch curriculum details for edit.");
    } finally {
    }
  };

  const handleEditClick = async (curriculum) => {
    try {
      const response = await ERPApi.get(
        `/batch/curriculum/${curriculum.id}?include=exam_collection`,
      ); // Adjust the API endpoint and parameters as needed
      setSelectedCurriculum(response.data);
      setShowModal(true);
      setMode("edit");
    } catch (error) {
      console.error("Error fetching curriculum details for edit:", error);
      toast.error("Failed to fetch curriculum details for edit.");
    } finally {
    }
  };

  const handlePageChange = (page) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);

    debouncesetPage({ context: "ENROLLED_STUDENTS", data: page });
  };

  return (
    <div>
      <BackButton heading="Curriculum" content="Back" to="/" />
      <div className="container-fluid mt-3">
        <div className="card">
          <div className="card-header">
            <div className=" row d-flex justify-content-between">
              <div className="col-sm-4">
                <div className="search-box">
                  <SearchInputField />
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
              <div className="table-container table-scroll">
                <CustomTable data={data} columns={columns} actions={actions} />
              </div>
            </div>
            <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start   ">
              <div className="col-sm">
                <PaginationInfo
                  data={{
                    length: curriculumData?.paginatedCurriculum?.length,
                    start: curriculumData?.startCurriculum,
                    end: curriculumData?.endCurriculum,
                    total: curriculumData?.totalCurriculums,
                  }}
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
                    currentPage={curriculumData?.currentPage}
                    totalPages={curriculumData?.totalPages}
                    loading={curriculumData?.loading}
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
          curriculumFetcher={curriculumFetcher}
        />
      )}
    </div>
  );
};

export default Curriculums;
