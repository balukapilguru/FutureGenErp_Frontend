import React, { useState } from "react";
import Usedebounce from "../../../../../dataLayer/hooks/useDebounce/Usedebounce";
import BatchStudentsListProvider from "./BatchStudentsListProvider";
import PaginationInfo from "../../../../../utils/PaginationInfo";
import Pagination from "../../../../../utils/Pagination";
import FormattedDate from "../../../../../utils/FormattedDate";
import Swal from "sweetalert2";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import { MdDelete } from "react-icons/md";
import { FaCopy } from "react-icons/fa6";
import { BiTransferAlt } from "react-icons/bi";
import TransferStudentsToAnotherBatch from "./TransferStudentsToAnotherBatch";
import { toast } from "react-toastify";
import Button from "../../../../components/button/Button";
import { Modal } from "react-bootstrap";
import GateKeeper from "../../../../../rbac/GateKeeper";

const BatchStudentsList = ({ batchId, batchType }) => {
  const {
    singleBatchStudentsState: { singleBatchStudentsList },
    DispatchSingleBatchStudentsState,
    getPaginatedSingleBatchStudents,
  } = BatchStudentsListProvider({ batchId });
  const { debouncesetSearch, debouncesetPage } = Usedebounce(
    DispatchSingleBatchStudentsState
  );


  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

 


  const [show, setShow] = useState(false);
  const [type, setType] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = (type) => {
    setShow(true);
    setType(type);
  };

  const handleSearch = (e) => {
    debouncesetSearch({ data: e.target.value });
  };

  const handlePerPage = (e) => {
    const selectedvalue = parseInt(e.target.value, 10);
    DispatchSingleBatchStudentsState({
      type: "SET_PER_PAGE",
      payload: {
        data: selectedvalue,
      },
    });
  };

  const handlePageChange = (page) => {
    debouncesetPage({ data: page });
  };

  const [checkAll, setCheckAll] = useState(false);
  const [checkStudentid, setCheckStudentId] = useState([]);

  const handleCheckBox = (e) => {
    const { name, value, checked } = e.target;
    setCheckStudentId((prev) => {
      if (name === "selectAll") {
        if (checked) {
          const updatedSelectedCheckboxes =
            singleBatchStudentsList?.paginatedSingleBatchStudents?.map(
              (item) => item.id
            );
          setCheckAll(true);
          return updatedSelectedCheckboxes;
        } else {
          setCheckAll(false);
          return [];
        }
      } else {
        if (checked) {
          return [...prev, Number(value)];
        } else {
          const updatedState = prev.filter((id) => id !== Number(value));
          setCheckAll(false);
          return updatedState;
        }
      }
    });
  };

  const handleRemoveStudent = async () => {
    if (batchId && checkStudentid?.length > 0) {
      Swal.fire({
        title: "Are you sure?",
        text:
          checkStudentid?.length === 1
            ? "You won't be able to revert this Student"
            : "You won't be able to revert this Students",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Remove!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const updatedData = {
            studentCollection: checkStudentid,
          };

          try {
            const { data, status } = await toast.promise(
              ERPApi.patch(`/batch/removestudents/${batchId}`, updatedData),
              {
                pending:
                  "Processing request: Removing students from the batch...",
              }
            );
            if (status === 200) {
              getPaginatedSingleBatchStudents();

              Swal.fire({
                title: "Removed!",
                text:
                  checkStudentid?.length === 1
                    ? "Student successfully removed from the batch!"
                    : "Students successfully removed from the batch!",
                icon: "success",
              });
            }
          } catch (error) {
            const errorMessage =
              error?.response?.data?.message ||
              "Failed to remove students from the batch. Please try again.";
            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
            });
          }
        }
      });
    }
  };

  const [error, setError] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [studentStatus, setStudentStatus] = useState({
    active: false,
    remarks: null,
    studentId: null,
  });

  const handleStudentStatus = (id, status) => {
    setOpenModal(true);
    setStudentStatus((prev) => ({
      ...prev,
      studentId: id,
      active: status,
      remarks: null,
    }));
    setError((prev) => ({ ...prev, remarks: "" }));
  };

  const handleInActivateAndActivate = async (statusType) => {
    if (!studentStatus.remarks || studentStatus.remarks.trim() === "") {
      setError((prev) => ({ ...prev, remarks: "Remarks is required" }));
      return;
    }

    const updateStudentStatus = {
      studentStatus: statusType === "active" ? true : false,
      studentId: studentStatus?.studentId,
      remark: studentStatus.remarks,
    };

    if (studentStatus?.studentId && batchId) {
      Swal.fire({
        title: "Are you sure?",
        text: "This will Change the Student Status . Proceed?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${statusType === "active" ? "Activate " : "Deactivate "
          } it!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading((prev) => !prev);
          try {
            const { data, status } = await toast.promise(
              ERPApi.patch(
                `batch/togglestudent/${batchId}`,
                updateStudentStatus
              ),
              {
                pending: "Verifying Student data...",
              }
            );
            if (status === 200) {
              setOpenModal(false);
              getPaginatedSingleBatchStudents();
              const successMessage =
                statusType === "active"
                  ? "Student Status Activated Successfully!"
                  : "Student Status Deactivated successfully!";
              Swal.fire({
                title: "Created!",
                text: successMessage,
                icon: "success",
              });
            }
          } catch (error) {
            console.error(error);
            const errorMessage = error?.response?.data?.message
              ? error?.response?.data?.message
              : statusType === "active"
                ? "Student Status Activating Failed. Please Try Again."
                : "Student Status Deactivating Failed. Please try Again.";

            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
            });
          } finally {
            setLoading((prev) => !prev);
          }
        }
      });
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="row ">
            <div className="col-sm-4">
              <div className="search-box">
                <input
                  type="text"
                  className="form-control search input_bg_color text_color"
                  placeholder="Search for..."
                  name="search"
                  required
                  onChange={(e) => handleSearch(e)}
                />
              </div>
            </div>
            <div className="col-lg-4"></div>
            <div className="col-lg-4 text-end">
              {/* <GateKeeper
                                requiredModule="Batch Management"
                                submenumodule={batchType === "active" ? "Active Batches" : batchType === "upcoming" ? "Upcoming Batches" : batchType === "completed" ? "Completed Batches" : ""}
                                submenuReqiredPermission="canUpdate"
                            >
                                {
                                    checkStudentid && checkStudentid?.length > 0 && (
                                        <button type="button" style={{ cursor: "pointer" }} onClick={() => handleShow("copy")} className="btn btn_primary fs-13 me-2" >
                                            <FaCopy className="table_icons  fs-13 text-white" /> Copy
                                        </button>
                                    )
                                }
                            </GateKeeper> */}

              {batchType !== "completed" &&
                checkStudentid &&
                checkStudentid.length > 0 && (
                  <>
                    {/* <GateKeeper
                                        requiredModule="Batch Management"
                                        submenumodule={batchType === "active" ? "Active Batches" : batchType === "upcoming" ? "Upcoming Batches" : batchType === "completed" ? "Completed Batches" : ""}
                                        submenuReqiredPermission="canUpdate"
                                    >
                                        <button
                                            type="button"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleShow("move")}
                                            className="btn btn_primary fs-13 me-2"
                                        >
                                            <BiTransferAlt className="table_icons fs-13 text-white" /> Move
                                        </button>
                                    </GateKeeper> */}

                    <GateKeeper
                      requiredModule="Batch Management"
                      submenumodule={
                        batchType === "active"
                          ? "Active Batches"
                          : batchType === "upcoming"
                            ? "Upcoming Batches"
                            : batchType === "completed"
                              ? "Completed Batches"
                              : ""
                      }
                      submenuReqiredPermission="canDelete"
                    >
                      <button
                        type="button"
                        className="btn bg-danger text-white fs-13"
                        onClick={handleRemoveStudent}
                      >
                        <MdDelete className="delete_icon table_icons me-1 fs-13 text-white" />{" "}
                        Remove
                      </button>
                    </GateKeeper>
                  </>
                )}
            </div>
          </div>
          <div className="table-responsive table-card table-container table-scroll border-0 mt-3">
            <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
              <thead>
                <tr className="">
                  <GateKeeper
                    requiredModule="Batch Management"
                    submenumodule={
                      batchType === "active"
                        ? "Active Batches"
                        : batchType === "upcoming"
                          ? "Upcoming Batches"
                          : batchType === "completed"
                            ? "Completed Batches"
                            : ""
                    }
                    submenuReqiredPermission="canUpdate"
                  >
                    {singleBatchStudentsList?.paginatedSingleBatchStudents &&
                      singleBatchStudentsList?.paginatedSingleBatchStudents
                        .length > 0 && (
                        <th>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="selectAll"
                            checked={checkAll}
                            onChange={handleCheckBox}
                          />
                        </th>
                      )}
                  </GateKeeper>

                  <th scope="col" className="fs-13 lh-xs fw-600  ">
                    S.No
                  </th>
                  <th scope="col" className="fs-13 lh-xs  fw-600  ">
                    Student&nbsp;Name
                  </th>
                  <th
                    scope="col"
                    className="fs-13 lh-xs  fw-600  text-truncate"
                    title="Registration Number"
                    style={{ maxWidth: "120px" }}
                  >
                    Registration&nbsp;Number
                  </th>
                  <th scope="col" className="fs-13 lh-xs  fw-600  ">
                    Branch
                  </th>
                  <th scope="col" className="fs-13 lh-xs fw-600  ">
                    Course
                  </th>
                  <th scope="col" className="fs-13 lh-xs fw-600 ">
                    Counsellor
                  </th>

                  {
                    userData?.user.profile !== "Trainer" && (
                      <>
                        <th scope="col" className="fs-13 lh-xs  fw-600 ">
                          Mobile
                        </th>
                        <th scope="col" className="fs-13 lh-xs  fw-600 ">
                          Email
                        </th>
                      </>
                    )
                  }

                  <th
                    scope="col"
                    className="fs-13 lh-xs  fw-600 text-truncate"
                    title=" Training Mode"
                    style={{ maxWidth: "70px" }}
                  >
                    Joining&nbsp;Date
                  </th>
                  <th
                    scope="col"
                    className="fs-13 lh-xs  fw-600 text-truncate"
                    title=" Training Mode"
                    style={{ maxWidth: "70px" }}
                  >
                    Training&nbsp;Mode
                  </th>

                  <GateKeeper
                    requiredModule="Batch Management"
                    submenumodule={
                      batchType === "active"
                        ? "Active Batches"
                        : batchType === "upcoming"
                          ? "Upcoming Batches"
                          : batchType === "completed"
                            ? "Completed Batches"
                            : ""
                    }
                    submenuReqiredPermission="canRead"
                  >
                    <th
                      scope="col"
                      className="fs-13 lh-xs  fw-600 action-column"
                    >
                      Actions
                    </th>
                  </GateKeeper>
                </tr>
              </thead>
              <tbody className="">
                {singleBatchStudentsList?.paginatedSingleBatchStudents &&
                  singleBatchStudentsList?.paginatedSingleBatchStudents.length >
                  0 ? (
                  singleBatchStudentsList?.loading ? (
                    <tr>
                      <td className="fs-13 black_300  lh-xs bg_light">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    singleBatchStudentsList?.paginatedSingleBatchStudents.map(
                      (item, index) => {
                        return (
                          <tr key={item.id}>
                            <GateKeeper
                              requiredModule="Batch Management"
                              submenumodule={
                                batchType === "active"
                                  ? "Active Batches"
                                  : batchType === "upcoming"
                                    ? "Upcoming Batches"
                                    : batchType === "completed"
                                      ? "Completed Batches"
                                      : ""
                              }
                              submenuReqiredPermission="canUpdate"
                            >
                              <td>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={index + 1}
                                  value={item.id}
                                  checked={checkStudentid?.includes(item?.id)}
                                  onChange={handleCheckBox}
                                />
                              </td>
                            </GateKeeper>

                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {(singleBatchStudentsList?.currentPage - 1) *
                                singleBatchStudentsList.perPage +
                                index +
                                1}
                            </td>
                            <td
                              className="fs-13 black_300  lh-xs bg_light text-truncate"
                              style={{ maxWidth: "150px" }}
                              title={item?.name}
                            >
                              {item?.name}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.registrationnumber}
                            </td>
                            <td className="fs-13 black_300  lh-xs bg_light">
                              {item?.branch}
                            </td>
                            <td
                              className="fs-13 black_300  lh-xs bg_light text-truncate"
                              style={{ maxWidth: "120px" }}
                              title={item.courses}
                            >
                              {item?.courses}
                            </td>
                            <td
                              className="fs-13 black_300  lh-xs bg_light text-truncate"
                              style={{ maxWidth: "120px" }}
                              title={item.enquirytakenby}
                            >
                              {item?.enquirytakenby}
                            </td>

                            {
                              userData?.user.profile !== "Trainer" && (
                                <>
                                  <td className="fs-13 black_300  lh-xs bg_light ">
                                    {item?.mobilenumber}
                                  </td>
                                  <td
                                    className="fs-13 black_300  lh-xs bg_light text-truncate"
                                    style={{ maxWidth: "150px" }}
                                    title={item?.email}
                                  >
                                    {item?.email}
                                  </td>
                                </>
                              )
                            }
                            <td
                              className="fs-13 black_300 lh-xs bg_light text-truncate"
                              title={item.date}
                              style={{ maxWidth: "100px" }}
                            >
                              {FormattedDate(item?.admissiondate)}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {item?.modeoftraining}
                            </td>
                            <GateKeeper
                              requiredModule="Batch Management"
                              submenumodule={
                                batchType === "active"
                                  ? "Active Batches"
                                  : batchType === "upcoming"
                                    ? "Upcoming Batches"
                                    : batchType === "completed"
                                      ? "Completed Batches"
                                      : ""
                              }
                              submenuReqiredPermission="canRead"
                            >
                              <td className="fs-14 text_mute bg_light lh-xs">
                                <div className="d-flex">
                                  {
                                    <div
                                      className="form-check form-switch form-switch-right form-switch-md"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title="Student Status"
                                    >
                                      <input
                                        style={{
                                          cursor:
                                            batchType === "completed"
                                              ? "not-allowed"
                                              : "pointer",
                                        }}
                                        className="form-check-input code-switcher toggle_btn"
                                        type="checkbox"
                                        checked={
                                          item?.batches[0]?.batch_student
                                            ?.studentStatus
                                        }
                                        onChange={(e) =>
                                          handleStudentStatus(
                                            item?.id,
                                            item?.batches[0]?.batch_student
                                              ?.studentStatus
                                          )
                                        }
                                        disabled={batchType === "completed"}

                                      />
                                    </div>
                                  }
                                </div>
                              </td>
                            </GateKeeper>
                          </tr>
                        );
                      }
                    )
                  )
                ) : (
                  <tr>
                    <td className="fs-13 black_300  lh-xs bg_light">no data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className=" mt-4 align-items-center d-flex justify-content-between row text-center text-sm-start">
            <div className="col-sm">
              <PaginationInfo
                data={{
                  length:
                    singleBatchStudentsList?.paginatedSingleBatchStudents
                      ?.length,
                  start: singleBatchStudentsList?.startStudent,
                  end: singleBatchStudentsList?.endStudent,
                  total: singleBatchStudentsList?.searchResultStudents,
                }}
                loading={singleBatchStudentsList?.loading}
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
                  currentPage={singleBatchStudentsList?.currentPage}
                  totalPages={singleBatchStudentsList?.totalPages}
                  loading={singleBatchStudentsList?.loading}
                  onPageChange={handlePageChange}
                />
              </div>

              {show === true && checkStudentid?.length > 0 && type && (
                <TransferStudentsToAnotherBatch
                  show={show}
                  handleClose={handleClose}
                  students={checkStudentid}
                  batchId={batchId}
                  type={type}
                />
              )}

              {/* Modal for activating inactivating  */}

              {openModal === true && (
                <Modal
                  show={openModal === true}
                  onHide={() => {
                    setOpenModal(false);
                  }}
                  backdrop="static"
                  size="md"
                  dialogClassName="modal-dialog-centered"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Student Status</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div class="">
                      <div className="d-flex justify-content-between">
                        <label className="form-label fs-s fw-medium black_300">
                          Enter the Student Remarks* :
                        </label>
                      </div>
                      <textarea
                        rows="4"
                        cols="10"
                        name="text"
                        form="remarks"
                        className={
                          error && error?.remarks
                            ? "form-control fs-s bg-form text_color input_bg_color error-input"
                            : "form-control fs-s bg-form text_color input_bg_color"
                        }
                        placeholder="Enter the Remarks"
                        onChange={(e) =>
                          setStudentStatus((prev) => ({
                            ...prev,
                            remarks: e.target.value,
                          }))
                        }
                        value={
                          studentStatus?.remarks ? studentStatus?.remarks : ""
                        }
                      ></textarea>
                      <div style={{ height: "8px" }}>
                        {error && error?.remarks && (
                          <p className="text-danger m-0 fs-xs">
                            {error?.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <div class="p-2 d-flex justify-content-end bg_white">
                      {studentStatus?.active === 0 ||
                        studentStatus?.active === false ? (
                        <Button
                          className="btn btn_primary fs-13 btn-sm"
                          onClick={() => handleInActivateAndActivate("active")}
                          disabled={loading}
                        >
                          Activate
                        </Button>
                      ) : null}

                      {studentStatus?.active === 0 ||
                        studentStatus?.active === true ? (
                        <Button
                          className="btn btn_primary fs-13 btn-sm"
                          onClick={() =>
                            handleInActivateAndActivate("InActive")
                          }
                          disabled={loading}
                        >
                          Deactivate
                        </Button>
                      ) : null}
                    </div>
                  </Modal.Footer>
                </Modal>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchStudentsList;
