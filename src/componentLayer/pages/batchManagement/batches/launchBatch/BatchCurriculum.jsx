import React, { useEffect, useState } from "react";

import { Modal } from "react-bootstrap";
import "../../../../../assets/css/Courses.css";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";

import { FaPlus } from "react-icons/fa6";
import { BiSave } from "react-icons/bi";
import { LuCalendarDays } from "react-icons/lu";
import Select from "react-select";

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { CiMenuBurger } from "react-icons/ci";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaDownload } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";
import MarkasCompletedModal from "./MarkasCompletedModal";
import Button from "../../../../components/button/Button";
import MarkAttendance from "./MarkAttendance";
import FormattedDate from "../../../../../utils/FormattedDate";
import GateKeeper from "../../../../../rbac/GateKeeper";
import {
  closeLoadingPopup,
  showLoadingPopup,
} from "../../../../../utils/LoadingPopUpSwal";

const DragHandle = SortableHandle(() => (
  <span className="drag-handle me-2 mb-1" style={{ cursor: "grab" }}>
    <CiMenuBurger className="hamburger-icon" size={18} />
  </span>
));

const BatchCurriculum = ({ BatchState, batchId, batchType }) => {
  const [userData, setUserData] = useState(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data || "";
  });

  const [showModals, setShowModals] = useState({
    uploadcurriculum: false,
    module: false,
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleAttendanceShow = () => {
    setShow(true);
  };

  const [curriculum, setCurriculum] = useState([]);
  const [Module, setModule] = useState({
    moduleName: "",
    moduleDuration: 0,
    topics: [],
  });
  const [sessionTakenDates, setSessionTakenDates] = useState();
  const [manuallySelectedDate, setmanuallySelectedDate] = useState();

  const fetchData = async () => {
    if (batchId) {
      setLoading((prev) => !prev);
      try {
        const [response, sessionTakenDates] = await Promise.all([
          ERPApi.get(
            `/batch/custom/module?curriculumId=${BatchState?.curriculumId}&batchId=${batchId}`
          ),
          ERPApi.get(`/batch/attendance/topics?batchId=${batchId}`),
        ]);
        let datesData = sessionTakenDates?.data?.result?.map((item) => ({
          label: item?.date,
          value: item?.date,
        }));

        setSessionTakenDates(datesData);
        let data = response?.data?.modules;

        // Directly modifying data instead of assigning to updated
        // data.forEach((module) => {
        //   module.batch_curriculum_trainers.forEach((trainer) => {
        //     trainer.topicDetailCollection.forEach((detail) => {
        //       detail.topics.forEach((topicId) => {
        //         const topic = module.topics.find((t) => t.id === topicId);
        //         if (topic) {
        //           topic.sessionTakenOn = detail.date;
        //         }
        //       });
        //     });
        //   });
        // });
        data.forEach((module) => {
          module.batch_curriculum_trainers.forEach((trainer) => {
            trainer.topicCollection.forEach((topicId) => {
              const topic = module.topics.find((t) => t.id === topicId);
              if (topic) {
                if (!topic.sessionTakenOn) {
                  topic.sessionTakenOn = [trainer.date];
                } else {
                  topic.sessionTakenOn.push(trainer.date);
                }
              }
            });
          });
        });

        // data.forEach(module => {

        //   module.batch_curriculum_trainers.forEach(trainer => {
        //     const { topicCollection, date } = trainer;

        //     topicCollection.forEach(topicId => {
        //       const topic = module.topics.find(t => t.id === topicId);
        //       if (topic) {

        //         topic.dates.push(date);
        //       }
        //     });
        //   });
        // });

        setCurriculum(data); // Set modified data to state
      } catch (error) {
        console.error("Error fetching module:", error);
      } finally {
        setLoading((prev) => !prev);
      }
    }
  };

  const handleManualDate = async (date, topicId, sectionId) => {
    try {
      const data = {
        batchId,
        trainerId: BatchState?.users[0]?.id,
        curriculumId: BatchState?.curriculumId,
        curriculumModuleId: sectionId,
        date,
        topicId,
      };

      const response = await ERPApi.patch(`/batch/productivity`, data);

      if (response?.status === 200) {
        setmanuallySelectedDate(null);
        fetchData();
        setShowManualSelect(null);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error updating productivity:", error);
    }
  };
  const [showManualSelect, setShowManualSelect] = useState(null);

  useEffect(() => {
    fetchData();
  }, [batchId, BatchState]);

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setModule({
      ...Module,
      [name]: value,
    });
  };

  const handleSectionEdit = (section) => {
    setNewTopic({
      topicName: "",
      isNewTopic: true,
    });
    setIsModuleEditing(true);
    setModule(section);
  };

  const handleSectionDelete = async (sectionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Module",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteResponse = await ERPApi.delete(
            `/batch/custom/module/${sectionId}`
          );
          if (deleteResponse?.status === 200) {
            const filteredCurriculum = curriculum.filter(
              (item) => item.id !== sectionId
            );
            // Create an array of section positions
            const PositionsArray = filteredCurriculum.map((section, index) => ({
              id: section.id,
              positionId: index,
            }));
            // Prepare data for updating positions
            const data = { positionCollection: PositionsArray };

            // Update the positions in the backend
            const updateResponse = await ERPApi.patch(
              `/batch/custom/module/position`,
              data
            );

            if (updateResponse.status === 200) {
              fetchData(); // Fetch updated data after successful update
            } else {
              throw new Error("Failed to update positions.");
            }

            Swal.fire({
              title: "Deleted!",
              text: "Module deleted Successfully.",
              icon: "success",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Module Deleting Failed, Please Try Again",
            icon: "error",
          });
        }
      }
    });
  };

  const handleSubmit = async () => {
    const updatedModule = {
      ...Module,
      curriculumId: parseInt(BatchState?.copyCurriculum?.id),
    };
    const resetModule = {
      moduleName: "",
      moduleDuration: 0,
      topics: [],
    };

    setIsUploading((prev) => ({
      ...prev,
      module: true,
    }));
    try {
      let response;
      if (!updatedModule.id) {
        updatedModule.modulePosition = curriculum.length;
        // response = await ERPApi.post(`/batch/section/addsection`, updatedModule);
        response = await toast.promise(
          ERPApi.post(`/batch/custom/module`, updatedModule),
          {
            pending: "Processing Module Data...",
          }
        );
      } else {
        response = await toast.promise(
          ERPApi.put(`/batch/custom/module/${updatedModule.id}`, updatedModule),
          {
            pending: "Processing Module Data...",
          }
        );
      }

      if (response.status === 200) {
        Swal.fire({
          title: !updatedModule?.id ? "Created!" : "Uploaded!",
          text: !updatedModule?.id
            ? "Module Created successfully!"
            : "Module Uploaded successfully!",
          icon: "success",
        });
        setShowModals((prev) => ({
          ...prev,
          module: false,
        }));
        fetchData();
        setModule(resetModule); // Reset form only on success
        setNewTopic({
          topicName: "",
          isNewTopic: true,
        });
        setIsModuleEditing(false);
        const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.click();
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || !updatedModule.id
          ? "Module Creation Failed. Please Try Again 🤯."
          : "Module Updating Failed. Please Try Again 🤯.";
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setIsUploading((prev) => ({
        ...prev,
        module: false,
      }));
    }
  };

  // Sortable Section Element with DragHandle (hamburger icon)
  const SortableSection = SortableElement(({ section, sectionIndex }) => (
    <div
      className="accordion pt-1"
      id={`accordionExample-${sectionIndex}`}
      key={section.id}
    >
      <div className="accordion-item mb-2">
        <h2 className="accordion-header" id={`heading-${sectionIndex}`}>
          <button
            // className="accordion-button collapsed fw-bold d-flex align-items-center"
            className={`accordion-button ${selectedModuleAndTopics?.moduleId === section?.id
              ? ""
              : "collapsed"
              } fw-bold d-flex align-items-center`}
            type="button"
            style={{ cursor: "default" }}
          // data-bs-toggle="collapse"
          // data-bs-target={`#collapse-${sectionIndex}`}
          // aria-expanded="false"
          // aria-controls={`collapse-${sectionIndex}`}
          >
            <div className="d-flex align-items-center flex-grow-1">
              <input
                style={{ cursor: "pointer" }}
                className="form-check-input me-2 mb-2"
                type="checkbox"
                checked={selectedModuleAndTopics?.moduleId === section?.id}
                onChange={(e) => {
                  if (selectedModuleAndTopics?.moduleId === section?.id) {
                    setSelectedModuleAndTopics({ moduleId: null, topics: [] });
                  } else {
                    setSelectedModuleAndTopics({
                      moduleId: section?.id,
                      topics: [],
                    });
                  }
                }}
                id="flexCheckDefault"
              />

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
                {batchType !== "completed" &&
                  (isupdatedPositionLoading ? (
                    <div className="spinner-border me-2 ms-1" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <DragHandle className="fs-13" />
                  ))}
              </GateKeeper>

              <span
                className={`${section?.isCompleted ? "green_box" : "orange_box"
                  } rounded p-1 fs-13 fw-300 text-white`}
              >
                {sectionIndex + 1}
              </span>
              <span className="fw-500 ms-2">{section.moduleName}</span>
            </div>
            {/* 
                        <span className="fw-500 me-3">Duration - {section.moduleDuration}/2</span> */}
            <span className="fw-500 me-3">
              Sessions : Assigned - {section?.moduleDuration}
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Taken -{" "}
              {section?.batch_curriculum_trainers?.length}
              {/* <span
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Tooltip on top"
              >
              Assigned  
              </span>
              /
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Tooltip on top"
              >
                Taken     
              </span> */}
            </span>
          </button>
        </h2>
        <div
          id={`collapse-${sectionIndex}`}
          // className="accordion-collapse collapse"

          className={`accordion-collapse collapse ${selectedModuleAndTopics?.moduleId === section?.id ? "show" : ""
            }`}
          aria-labelledby={`heading-${sectionIndex}`}
          data-bs-parent={`#accordionExample-${sectionIndex}`}
        >
          <div className="accordion-body">
            <div className="d-flex justify-content-end">
              {/* <button
                onClick={() => handleSectionEdit(section)}
                type="button"
                className="btn btn-sm btn btn-sm btn-md btn_primary fs-13"
                data-bs-toggle="modal"
                data-bs-target="#exampleTwoModal"
              >
                <CiEdit /> Edit
              </button> */}
              {/* <button
                className="btn btn-sm btn btn-sm btn-md bg-danger text-white fs-13 ms-2"
                onClick={() => handleSectionDelete(section.id)}
                type="button"
              >
                <MdDelete /> Delete
              </button> */}
            </div>
            <div className="border-0 mt-1 container">
              <div className="col">
                <div className="d-flex justify-content-end">
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
                    <MarkasCompletedModal
                      module={section}
                      fetchData={fetchData}
                      batchId={batchId}
                      batchType={batchType}
                    />
                  </GateKeeper>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="table-responsive .table-container table-card border-0 dashboard-tables mt-4">
                      <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover mt-2 mb-5">
                        <thead>
                          <tr>
                            <th scope="col" className="fs-13 lh-xs fw-600"></th>
                            <th scope="col" className="fs-13 lh-xs fw-600">
                              Topic Name
                            </th>
                            <th scope="col" className="fs-13 lh-xs fw-600">
                              Topic Taught On
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {section?.topics?.map((item, topicIndex) => {

                            
                            return (
                              <tr key={topicIndex}>
                                <td className="fs-13 black_300 lh-xs bg_light">
                                  {selectedModuleAndTopics?.moduleId ===
                                    section?.id && (
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
                                        {batchType === "active" && (
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              checked={selectedModuleAndTopics?.topics?.includes(
                                                item?.id
                                              )}
                                              id={`flexCheckDefault-${topicIndex}`}
                                              disabled={
                                                selectedModuleAndTopics.moduleId ===
                                                  section?.id
                                                  ? false
                                                  : true
                                              }
                                              onChange={(e) =>
                                                handleTopicsCheckboxChange(e, item?.id)
                                              }
                                            />
                                          </div>
                                        )}
                                      </GateKeeper>
                                    )}
                                </td>

                                <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "250px" }}
                                  title={item.topicName}>
                                  {item.topicName}
                                </td>
                                <td className="fs-13 black_300 lh-xs bg_light ">
                                  {Array.isArray(item?.sessionTakenOn) &&
                                    item?.sessionTakenOn.length > 0 ? (
                                    <div>
                                      {item?.sessionTakenOn.map((date, index) => (
                                        <span key={index}>
                                          ({FormattedDate(date)})
                                          {index + 1 != item?.sessionTakenOn.length && (
                                            <span>, </span>
                                          )}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <>
                                      <GateKeeper
                                        requiredModule="Batch Management"
                                        submenumodule="Active Batches"
                                        submenuReqiredPermission="canRead"
                                      >
                                        {showManualSelect !== item?.id ? (
                                          <LuCalendarDays
                                            className="fs-16"
                                            onClick={() =>
                                              setShowManualSelect(item?.id)
                                            }
                                          />
                                        ) : (
                                          <Select
                                            className="fs-s bg-form text_color input_bg_color"
                                            options={sessionTakenDates}
                                            classNamePrefix="Select the Batch Type"
                                            value={manuallySelectedDate}
                                            isDisabled={
                                              batchType === "completed" ||
                                              batchType === "upcoming"
                                            }
                                            onChange={(selectedOption) => {
                                              setmanuallySelectedDate(selectedOption);
                                              handleManualDate(
                                                selectedOption?.value,
                                                item?.id,
                                                section?.id
                                              );
                                            }}
                                          />
                                        )}
                                      </GateKeeper>
                                    </>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  // Sortable Container for the whole curriculum
  const SortableCurriculum = SortableContainer(({ curriculum }) => {
    return (
      <div>
        {loading === true ? (
          "Loading...."
        ) : curriculum && curriculum.length > 0 ? (
          curriculum?.map((section, index) => (
            <>
              <SortableSection
                key={`section-${section.id}`}
                index={index}
                section={section}
                sectionIndex={index}
              />
            </>
          ))
        ) : (
          <>
            <p>No modules are present.</p>
          </>
        )}
      </div>
    );
  });

  let [isupdatedPositionLoading, setisUpdatedPositionLoading] = useState(false);
  // let isupdatedPositionLoading = false;
  const onSortEnd = async ({ oldIndex, newIndex }) => {
    await setisUpdatedPositionLoading(true);
    let oldCurriculum = curriculum;
    let positionUpdatedCurriculum = arrayMoveImmutable(
      curriculum,
      oldIndex,
      newIndex
    );

    setCurriculum(positionUpdatedCurriculum);
    let PositionsArray = positionUpdatedCurriculum.map((section, index) => ({
      id: section.id,
      positionId: index,
    }));

    let data = {};
    data.positionCollection = PositionsArray;
    try {
      const response = await ERPApi.patch(
        `/batch/custom/module/position`,
        data
      );
      if (response.status === 200) {
        await setisUpdatedPositionLoading(false);
        toast.success("Positions updated successfully");

        // alert("Position updated successfully.");
        // fetchData();
      } else {
        await setisUpdatedPositionLoading(false);
        setCurriculum(oldCurriculum);
        toast.error("Failed to update positions");

        console.error("Failed to update position:", response);
        // alert("Failed to update position. Please try again.");
      }
    } catch (error) {
      await setisUpdatedPositionLoading(false);
      setCurriculum(oldCurriculum);
      toast.error("Failed to update positions");

      console.error("Error occurred while updating position:", error);
      // alert("An error occurred while updating the position.");
    }
  };
  let [newTopic, setNewTopic] = useState({
    topicName: "",

    isNewTopic: true,
  });
  const [editIndex, setEditIndex] = useState(null);
  const handleEditTopic = (index) => {
    setNewTopic(Module.topics[index]);
    setEditIndex(index);
  };

  const handleDeleteTopic = async (index, isNewTopic, id, ModuleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Topic",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let updatedTopics = Module?.topics.filter((_, i) => i !== index);
          updatedTopics = updatedTopics.map((topic, i) => ({
            ...topic,
            topicPosition: i,
          }));

          if (isNewTopic) {
            setModule((prev) => ({
              ...prev,
              topics: updatedTopics,
            }));
            Swal.fire({
              title: "Deleted!",
              text: "Topic deleted Successfully.",
              icon: "success",
            });
          } else {
            const PositionsArray = updatedTopics.map((topic, i) => ({
              id: topic.id,
              positionId: i,
            }));
            const data = { positionCollection: PositionsArray };
            const response = await ERPApi.delete(
              `/batch/custom/topic/${id}`,
              data
            );
            if (response?.status === 200) {
              setModule((prev) => ({
                ...prev,
                topics: updatedTopics,
              }));
              let updatedCurriculum = [...curriculum];
              let updated = updatedCurriculum.map((item) =>
                item.id === ModuleId ? { ...item, topics: updatedTopics } : item
              );
              setCurriculum(updated);
              Swal.fire({
                title: "Deleted!",
                text: "Topic deleted Successfully.",
                icon: "success",
              });
            }
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Topic Deleting Failed, Please Try Again",
            icon: "error",
          });
        }
      }
    });
  };

  const [moduleValidationErrors, setModuleValidationErrors] = useState({
    moduleName: "",
    moduleDuration: "",

    add: "",
  });
  const [topicValidationErrors, setTopicValidationErrors] = useState({
    topicName: "",
    // topicDuration: "",
  });
  const moduleValidateForm = () => {
    let errors = {};
    if (!Module.moduleName.trim()) {
      errors.moduleName = "Module Name is required.";
    } else if (Module.moduleName.trim().length <= 2) {
      errors.moduleName = "Mimimum 3 Charaters Required";
    }
    if (
      !Module.moduleDuration ||
      isNaN(Module.moduleDuration) ||
      Module.moduleDuration <= 0
    ) {
      errors.moduleDuration = "Module Duration is required.";
    }
    if (newTopic.topicName.trim()) {
      errors.add = "Please Add Topic to Module";
    }
    setModuleValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const topicValidateForm = () => {
    let errors = {};
    if (!newTopic.topicName.trim()) {
      errors.topicName = "Topic Name is required.";
    }

    setTopicValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleMoveDimension = (index, direction) => {
    const updatedTopics = [...Module?.topics];
    if (direction === "up" && index > 0) {
      [updatedTopics[index], updatedTopics[index - 1]] = [
        updatedTopics[index - 1],
        updatedTopics[index],
      ];
      [
        updatedTopics[index].topicPosition,
        updatedTopics[index - 1].topicPosition,
      ] = [
          updatedTopics[index - 1].topicPosition,
          updatedTopics[index].topicPosition,
        ];
    } else if (direction === "down" && index < updatedTopics.length - 1) {
      [updatedTopics[index], updatedTopics[index + 1]] = [
        updatedTopics[index + 1],
        updatedTopics[index],
      ];
      [
        updatedTopics[index].topicPosition,
        updatedTopics[index + 1].topicPosition,
      ] = [
          updatedTopics[index + 1].topicPosition,
          updatedTopics[index].topicPosition,
        ];
    }

    setModule((prev) => ({ ...prev, topics: updatedTopics }));
  };

  //////////upload csv file
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

    if (selectedFile) {
      if (selectedFile.type === "text/csv") {
        if (selectedFile.size <= maxFileSize) {
          setFile(selectedFile);
          setError(null);
        } else {
          setError("File size should not exceed 5MB.");
          setFile(null);
        }
      } else {
        setError("Please upload a valid CSV file.");
        setFile(null);
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("course", file);
    setIsUploading((prev) => ({
      ...prev,
      curriculum: true,
    }));

    if (BatchState?.copyCurriculum?.id) {
      try {
        const { data, status } = await toast.promise(
          ERPApi.post(
            `/batch/custom/module/upload?curriculumId=${BatchState?.copyCurriculum?.id}&override=${overRide}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          ),
          {
            pending: "Processing Curriculum Uploading...",
          }
        );

        if (status === 200) {
          setShowModals((prev) => ({
            ...prev,
            uploadcurriculum: false,
          }));
          setFile(null);
          setIsOverRide(false);
          Swal.fire({
            title: "Uploaded!",
            text: "Curriculum Uploaded successfully!",
            icon: "success",
          });
          fetchData();
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          "File Updating Failed. Please Try Again.";
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
        });
      } finally {
        setIsUploading((prev) => ({
          ...prev,
          curriculum: false,
        }));
      }
    }
  };

  // const [csvData, setCsvData] = useState('SectionID, Age, City\nJohn, 25, New York\nJane, 28, Los Angeles');
  const [csvData, setCsvData] = useState(
    "ModuleID,ModuleName,ModuleDuration,TopicID,TopicName\n1, Module 1 Name (ex:HTML), 2,1, Topic 1 Name (ex:Tags)\n1, Module 1 Name (ex:HTML),2, 2, Topic 2 Name (ex:Attributes)\n1, Module 1 Name (ex:HTML),2, 3, Topic 3 Name (ex:Elements)\n2, Module 2 Name (ex:CSS), 3,1, Topic 1 Name (ex:Class & ID)\n2, Module 2 Name (ex:CSS), 3,2, Topic 2 Name (ex:Selectors)\n3, Module 3 Name (ex:Javascript), 4, 1,Topic 1 Name (ex:Data Types)\n3, Module 3 Name (ex:Javascript), 4,2, Topic 2 Name (ex:Operators)\n3, Module 3 Name (ex:Javascript), 4,3, Topic 3 Name (ex:Arrays)"
  );

  const downloadCsv = () => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template.csv");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const [overRide, setIsOverRide] = useState(false);
  const [isUploading, setIsUploading] = useState({
    curriculum: false,
    module: false,
  });
  const [loading, setLoading] = useState(false);
  const [isModuleEditing, setIsModuleEditing] = useState(false);

  const [selectedModuleAndTopics, setSelectedModuleAndTopics] = useState({
    moduleId: null,
    topics: [],
  });




  const handleLaunch = async () => {
    // Prepare launch data
    const launchData = {
      batchId: BatchState?.id,
      trainerId: BatchState?.users[0]?.id,
      curriculumId: BatchState?.curriculumId,
      curriculumModuleId: selectedModuleAndTopics?.moduleId,
      topicIdCollection: selectedModuleAndTopics?.topics,
    };
    showLoadingPopup(
      "Setting Up Class For You",
      "Connecting to Teams, Please Wait!."
    );
    try {
      const response = await ERPApi.post(`/batch/productivity`, launchData);
      if (response?.status === 200) {
        window.open(`${BatchState?.meetingLink}`, "_blank");
        fetchData();
        closeLoadingPopup();
      }

      // Open a new tab on success
      // window.open(`${BatchState?.meetingLink}`, '_blank'); // '_blank' opens the URL in a new tab
    } catch (error) {
      console.error("Error launching batch:", error);
      closeLoadingPopup();
    }
  };

  const handleTopicsCheckboxChange = (event, item) => {
    if (event.target.checked) {
      setSelectedModuleAndTopics((prevSelected) => ({
        ...prevSelected,
        topics: [...prevSelected.topics, item],
      }));
    } else {
      setSelectedModuleAndTopics((prevSelected) => ({
        ...prevSelected,
        topics: prevSelected.topics.filter((topic) => topic !== item),
      }));
    }
  };

  const isWithinTimeAndDayRange = (startTime, endTime, daysCollection) => {
    const currentTime = new Date();
    const currentDay = currentTime
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    if (!daysCollection.includes(currentDay)) {
      return false;
    }
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(startHours, startMinutes - 15, 0);

    const end = new Date();
    end.setHours(endHours, endMinutes, 0);

    if (start.getMinutes() < 0) {
      start.setHours(start.getHours() - 1);
      start.setMinutes(start.getMinutes() + 60);
    }
    return currentTime >= start && currentTime <= end;
  };

  return (
    <div>
      <div className="container-fluid">
        {/* Mark Attendance and Launch */}
        {batchType === "active" && userData?.user?.profile === "Trainer" && (
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-12 text-end">
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
                    <Button
                      style={{ cursor: "pointer" }}
                      onClick={() => handleAttendanceShow()}
                      className="btn btn_primary fs-13  ms-3 me-2"
                    >
                      Mark Attendance
                    </Button>
                  </GateKeeper>

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
                    <Button
                      style={{ cursor: "pointer" }}
                      className="btn btn_primary ms-3"
                      onClick={handleLaunch}
                      disabled={
                        !(
                          selectedModuleAndTopics.topics.length > 0 &&
                          isWithinTimeAndDayRange(
                            BatchState?.startTime,
                            BatchState?.endTime,
                            BatchState?.daysCollection
                          )
                        )
                      }

                      
                    >
                      Launch
                    </Button>
                  </GateKeeper>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-end mt-3 mb-2">
                {/* Curriculum , Module, Templete */}

                {batchType !== "completed" && (
                  <>
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
                      <Button
                        style={{ cursor: "pointer" }}
                        className="btn btn_primary fs-13  ms-3 me-2"
                        onClick={() => {
                          setFile(null);
                          setIsOverRide(false);
                          setError(null);
                          setShowModals((prev) => ({
                            ...prev,
                            uploadcurriculum: true,
                          }));
                        }}
                      >
                        <FaCloudUploadAlt className="fs-13" /> Curriculum
                      </Button>
                    </GateKeeper>

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
                      <Button
                        style={{ cursor: "pointer" }}
                        className="btn btn_primary fs-13  ms-3 me-2"
                        onClick={() => {
                          setShowModals((prev) => ({
                            ...prev,
                            module: true,
                          }));
                          setIsModuleEditing(false);
                          setModule({
                            moduleName: "",
                            moduleDuration: 0,
                            topics: [],
                          });
                          setNewTopic({
                            topicName: "",

                            isNewTopic: true,
                          });
                          setModuleValidationErrors({
                            moduleName: "",
                            moduleDuration: null,
                            add: "",
                          });
                          setTopicValidationErrors({
                            topicName: "",
                          });
                          setEditIndex(null);
                        }}
                      >
                        <FaPlus className="fs-s" /> Module
                      </Button>
                    </GateKeeper>

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
                      <Button
                        className="btn btn_primary fs-13  ms-3 me-2"
                        title="Download Template"
                        onClick={downloadCsv}
                      >
                        <FaDownload /> Template
                      </Button>
                    </GateKeeper>
                  </>
                )}
              </div>

              <SortableCurriculum
                curriculum={curriculum}
                onSortEnd={onSortEnd}
                useDragHandle={true} // Enable use of drag handle
              />

              {/* Module Create/Edit Modal */}
              {showModals?.module === true && (
                <Modal
                  show={showModals?.module === true}
                  onHide={() => {
                    setShowModals((prev) => ({
                      ...prev,
                      module: false,
                    }));
                    setModuleValidationErrors({
                      moduleName: "",
                      moduleDuration: "",
                      add: "",
                    });
                  }}
                  backdrop="static"
                  size="lg"
                  dialogClassName="modal-dialog-centered"
                >
                  <Modal.Header closeButton={!isUploading?.module}>
                    <Modal.Title>
                      {!isModuleEditing ? "Add Module" : "Edit Module"}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor="moduleName"
                              className="form-label fs-s fw-medium black_300"
                            >
                              Module Name
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="moduleName"
                              value={Module.moduleName}
                              onChange={handleSectionChange}
                            />
                            {moduleValidationErrors.moduleName && (
                              <div className="text-danger fs-13">
                                {moduleValidationErrors.moduleName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor={`moduleDuration`}
                              className="form-label fs-s fw-medium black_300"
                            >
                              Module Duration
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              name="moduleDuration"
                              value={Module.moduleDuration}
                              onChange={handleSectionChange}
                              min={1}
                              max={24}
                            />

                            {moduleValidationErrors.moduleDuration && (
                              <div className="text-danger fs-13">
                                {moduleValidationErrors.moduleDuration}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor={`topicName`}
                              className="form-label fs-s fw-medium black_300"
                            >
                              Topic Name<span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="topicName"
                              value={newTopic.topicName}
                              onChange={(e) => {
                                setNewTopic((prev) => ({
                                  ...prev,
                                  topicName: e.target.value,
                                }));
                              }}
                            />
                            {topicValidationErrors.topicName && (
                              <div className="text-danger fs-13">
                                {topicValidationErrors.topicName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="col-lg-2 mt-1 text-end">
                            <div
                              className="mt-4 pt-1"
                              onClick={() => {
                                if (topicValidateForm()) {
                                  if (editIndex !== null) {
                                    setModule((prev) => {
                                      const updatedTopics = [...prev.topics];
                                      updatedTopics[editIndex] = newTopic;
                                      return {
                                        ...prev,
                                        topics: updatedTopics,
                                      };
                                    });
                                    setEditIndex(null);
                                  } else {
                                    let updatednewTopic = {
                                      ...newTopic,
                                      isNewTopic: true,
                                      topicPosition: Module?.topics?.length,
                                    };

                                    setModule((prev) => ({
                                      ...prev,
                                      topics: [...prev.topics, updatednewTopic],
                                    }));
                                  }
                                  setNewTopic({
                                    topicName: "",
                                    isNewTopic: true,
                                  });
                                }
                              }}
                            >
                              {editIndex !== null ? (
                                <button
                                  type="button"
                                  className="btn btn-sm btn btn-sm btn-md btn_primary fs-13"
                                >
                                  Update
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-sm btn btn-sm btn-md btn_primary fs-13"
                                >
                                  <FaPlus className="me-1 fs_12" />
                                  Add
                                </button>
                              )}
                            </div>
                            {moduleValidationErrors.add && (
                              <div className="text-danger fs-13">
                                {moduleValidationErrors.add}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {Module?.topics?.map((topic, index) => (
                        <div
                          key={index}
                          className="row bg_gray mb-2 mx-1 rounded-2"
                        >
                          <div className="col-6">
                            <label
                              htmlFor={`topicName_${index}`}
                              className="form-label mt-2 fs-s fw-500 black_300"
                            >
                              {index + 1}.&nbsp;{" "}
                            </label>
                            <span>{topic.topicName}</span>
                          </div>

                          <div className="col-2">
                            <label
                              htmlFor={`topicDuration_${index}`}
                              className="form-label fs-s fw-medium black_300"
                            ></label>
                            <span>{topic.topicDuration}</span>
                          </div>
                          <div className="col-2">
                            <FaArrowUp
                              aria-disabled="true"
                              className={`me-5 ${index === 0 ? "arrowicon" : ""
                                }`}
                              type="button"
                              onClick={() => handleMoveDimension(index, "up")}
                            />
                            <FaArrowDownLong
                              className={`me-2 ${index === Module.topics.length - 1
                                ? "arrowicon"
                                : ""
                                }`}
                              type="button"
                              onClick={() => handleMoveDimension(index, "down")}
                            />
                          </div>
                          <div
                            className="col-1"
                            type="button"
                            onClick={() => handleEditTopic(index)}
                          >
                            <CiEdit />
                          </div>
                          <div
                            className="col-1"
                            type="button"
                            onClick={() =>
                              handleDeleteTopic(
                                index,
                                topic?.isNewTopic,
                                topic?.id,
                                Module?.id
                              )
                            }
                          >
                            <MdDelete />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <div className="">
                      <Button
                        type="button"
                        className="btn btn_primary fs-13"
                        onClick={() => {
                          if (moduleValidateForm()) {
                            handleSubmit();
                          }
                        }}
                        disabled={isUploading?.module}
                      >
                        <BiSave className="fw-13 mb-1" /> Save
                      </Button>
                    </div>
                  </Modal.Footer>
                </Modal>
              )}

              {/* Upload File Modal */}
              {showModals?.uploadcurriculum === true && (
                <Modal
                  show={showModals?.uploadcurriculum === true}
                  onHide={() => {
                    setShowModals((prev) => ({
                      ...prev,
                      uploadcurriculum: false,
                    }));
                    setFile(null);
                    setIsOverRide(false);
                    setError(null);
                  }}
                  backdrop="static"
                  size="md"
                  dialogClassName="modal-dialog-centered"
                >
                  <Modal.Header closeButton={!isUploading?.curriculum}>
                    <Modal.Title>Upload Curriculum</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckChecked"
                          checked={overRide}
                          onChange={() => setIsOverRide(!overRide)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexSwitchCheckChecked"
                        >
                          Override old curriculum
                        </label>
                      </div>

                      <div className="input-group mt-2 mb-3 row w-100">
                        <div className="col-9">
                          <label
                            htmlFor="hiddenFileInput"
                            className="btn border fs-s text-start w-100"
                          >
                            {file ? file?.name : "Choose File (CSV only)"}
                          </label>
                          <input
                            type="file"
                            id="hiddenFileInput"
                            accept=".csv"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="text-danger fs-13 mt-0 mb-0">{error}</p>
                      )}
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      className={`btn btn_primary fs-13 `}
                      onClick={() => handleUpload()}
                      disabled={isUploading?.curriculum || !file}
                      style={{
                        cursor:
                          isUploading?.curriculum || !file
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {isUploading?.curriculum ? "Uploading.." : "Upload"}
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}

              {show === true && BatchState && (
                <MarkAttendance
                  show={show}
                  handleClose={handleClose}
                  BatchState={BatchState}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchCurriculum;
