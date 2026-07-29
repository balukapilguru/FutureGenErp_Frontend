import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useBranchContext } from "../../../../dataLayer/hooks/useBranchContext";
import { useCourseContext } from "../../../../dataLayer/hooks/useCourseContext";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useStudentsContext } from "../../../../dataLayer/hooks/useStudentsContext";
import FormattedDate from "../../../../utils/FormattedDate";
import TimeConverter from "../../../../utils/TimeConverter";
import { useFetcher } from "react-router-dom";

import Select from "react-select";
import { debounce } from "../../../../utils/Utils.jsx";
const AssignBatch = ({ show, handleClose, student, branch }) => {
  // const { getPaginatedStudentsData } = useStudentsContext();
  const fetcher = useFetcher();

  const [studentActiveBatchesList, setStudentActiveBatchesList] = useState();
  const [studentInActiveBatchesList, setStudentInActiveBatchesList] = useState();






  useEffect(() => {
    const fetchData = async () => {
      if (show && student) {
        try {
          const [curriculumResponse, studentBatchesResponse] = await Promise.all([
            ERPApi.get(`/student/${student?.id}/curriculum`),
            ERPApi.get(`/student/${student?.id}/batches/separate`)
          ]);

          if (curriculumResponse.status === 200 && studentBatchesResponse.status === 200) {
            const curriculumData = curriculumResponse?.data;
            setCurriculumList(curriculumData?.curriculumList);
            setAssignBatchState((prev) => ({
              ...prev,
              // branch: student?.branches?.branch_name,
              // branchId: student?.branches?.id,
              studentId: student?.id,
            }));
            const ActiveBatchesList = studentBatchesResponse?.data?.activeBatches;
            const InActiveBatchesList = studentBatchesResponse?.data?.inactiveBatches;
            setStudentActiveBatchesList(ActiveBatchesList);
            setStudentInActiveBatchesList(InActiveBatchesList)
          }

        } catch (error) {
          console.error(error)
        }
      }
    };
    fetchData();
  }, [show, student]);




  const [fetchErrors, setFetchErrors] = useState({
    trainersList: false,
    trainer: false,
  });

  const [errors, setErrors] = useState({});
  const [trainerBatchesList, setTrainerBatchesList] = useState([]);
  const [trainersList, setTrainersList] = useState([]);
  const [curriculumList, setCurriculumList] = useState([]);



  const [loading, setLoading] = useState(false);

  const [assignBatchState, setAssignBatchState] = useState({
    branch: "",
    branchId: null,
    curriculumName: "",
    curriculumId: null,
    trainer: "",
    trainerId: null,
    trainingMode: "",
    batchType: "",
    batchId: null,
    studentId: null,
  });

  const handleChange = async (e, type) => {
    const value = e?.target?.value;
    const selectedText = e?.target?.options
      ? e?.target?.options[e?.target?.selectedIndex]?.text
      : "";

    let updatedState = {};

    switch (type) {
      case "branch": {
        const branchId = parseInt(value);
        updatedState = {
          branch: selectedText, // Set branch name here
          branchId: branchId,
          curriculumName: "",
          curriculumId: null,
          trainer: "",
          trainerId: null,
          trainingMode: "",
          batchType: "",
          batchId: null,
        };
        break;
      }
      case "curriculum": {
        const curriculumId = parseInt(value);
        updatedState = {
          curriculumName: selectedText,
          curriculumId: curriculumId,
          trainerDetails: [],
          trainer: "",
          trainerId: null,
          trainingMode: "",
          batchType: "",
          batchId: null,
        };
        await fetchTrainersList(assignBatchState?.branchId, curriculumId);
        break;
      }
      case "trainer": {
        const trainerId = parseInt(value);
        updatedState = {
          trainer: selectedText,
          trainerId: trainerId,
          trainingMode: "",
          batchType: "",
          batchId: null,
        };
        break;
      }
      case "trainingMode": {
        updatedState = {
          trainingMode: value,
          batchType: "",
          batchId: null,
        };
        break;
      }
      case "batchType": {
        updatedState = {
          batchType: value,
          batchId: null,
        };
        await fetchSingleTrainer(
          assignBatchState?.trainerId,
          assignBatchState?.trainingMode,
          value,
          assignBatchState?.curriculumId
        );
        break;
      }
      case "batchId": {
        updatedState = {
          batchId: parseInt(value),
        };
        break;
      }
      default:
        break;
    }

    setAssignBatchState((prev) => ({
      ...prev,
      ...updatedState,
    }));
  };

  const fetchTrainersList = async (branchId, curriculumId) => {
    if (branchId && curriculumId) {
      try {
        const { data, status } = await ERPApi.get(
          `${import.meta.env.VITE_API_URL
          }/batch/gettrainerdetails?branchId=${branchId}&curriculumId=${curriculumId}`
        );
        if (status === 200) {
          setTrainersList(data?.trainerDetails);
        }
      } catch (error) {
        console.error(error);
        setTrainersList([]);
        setFetchErrors((prev) => ({
          ...prev,
          trainersList: true,
        }));
      }
    }
  };

  const fetchSingleTrainer = async (trainerId, trainingMode, batchType, curriculumId) => {
    if (trainerId && trainingMode && batchType) {
      try {
        const { data, status } = await ERPApi.get(
          `/batch/gettrainerdetails?trainerId=${trainerId}&trainingMode=${trainingMode}&batchStatus=${batchType}&curriculumId=${curriculumId}`
        );
        if (status === 200) {
          setTrainerBatchesList(data);
        }
      } catch (error) {
        setTrainerBatchesList([]);
        setFetchErrors({
          trainer: true,
        });
      }
    }
  };

  const handleAssignBatch = async (e) => {
    e.preventDefault();
    if (!assignBatchState?.branchId) {
      setErrors((prev) => ({
        ...prev,
        branch: "Branch Name is required",
      }));
      return;
    } else if (!assignBatchState?.curriculumId) {
      setErrors((prev) => ({
        ...prev,
        curriculumName: "curriculum is required",
      }));
      return;
    } else if (!assignBatchState?.trainerId) {
      setErrors((prev) => ({
        ...prev,
        trainer: "Trainer Name is required",
      }));
      return;
    } else if (
      !assignBatchState?.trainingMode ||
      assignBatchState?.trainingMode.trim() === ""
    ) {
      setErrors((prev) => ({
        ...prev,
        trainingMode: "Training Mode is required",
      }));
      return;
    } else if (
      !assignBatchState?.batchType ||
      assignBatchState?.batchType.trim() === ""
    ) {
      setErrors((prev) => ({
        ...prev,
        batchType: "Batch Type  is required",
      }));
      return;
    } else if (!assignBatchState?.batchId) {
      setErrors((prev) => ({
        ...prev,
        batchId: "Batch is required",
      }));
      return;
    }

    const assignBatchData = {
      // branch: assignBatchState?.branch,
      // branchId: assignBatchState?.branchId,
      // course: assignBatchState?.course,
      // courseId: assignBatchState?.courseId,
      // trainer: assignBatchState?.trainer,
      // trainerId: assignBatchState?.branchId,
      // trainingMode: assignBatchState?.trainingMode,
      // batchType: assignBatchState?.batchType,
      // batchId: assignBatchState?.batchId,
      studentId: [assignBatchState?.studentId],
    };

    if (assignBatchState?.batchId) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to Assign this batch?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Assign Student!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const formdata = new FormData();
          formdata.set("assignBatchData", JSON.stringify(assignBatchData))
          formdata.set("type", "assignBatch");
          formdata.set("id", assignBatchState?.batchId)
          setLoading((prev) => !prev);
          fetcher.submit(formdata, {
            method: "patch",
            encType: "application/form-data"
          })
          return;
          // try {
          //   const { data, status } = await toast.promise(
          //     ERPApi.patch(
          //       `${import.meta.env.VITE_API_URL}/batch/assignStudent/${assignBatchState?.batchId
          //       }`,
          //       assignBatchData
          //     ),
          //     {
          //       pending: "Assigning Student to Batch",
          //     }
          //   );

          //   if (status === 200) {
          //     Swal.fire({
          //       title: "Assigned!",
          //       text: "Student Assigned to Batch successfully.",
          //       icon: "success",
          //     });
          //     getPaginatedStudentsData();
          //     handleClose();
          //   }
          // } catch (error) {
          //   console.error(error);
          //   const errorMessage =
          //     error?.response?.data?.message ||
          //     "An unknown error occurred. Please try again.";
          //   Swal.fire({
          //     title: "Error!",
          //     text: errorMessage,
          //     icon: "error",
          //   });
          // } finally {
          //   setLoading((prev) => !prev);
          // }
        }
      });
    }
  };
  useEffect(() => {
    if (fetcher?.data?.status == 200) {
      handleClose()
      setLoading((prev) => !prev)
    }
  }, [fetcher])


  const [branchList, setBranchList] = useState();
  useEffect(() => {
    const branches = branch?.branchData?.map((item) => ({
      label: item.branch_name,
      value: item.id
    })) || [];

    setBranchList(branches);

  }, [branch])



  // Branch Search function
  const searchBranch = async (search) => {
    try {
      // setLoading(true); // Set loading to true while fetching data
      const { status, data } = await ERPApi.get(
        `${import.meta.env.VITE_API_URL}/settings/getbranch?search=${search}`
      );

      const branchData = data?.branchData?.map((item) => ({
        label: item.branch_name,
        value: item.id,
      }));

      setBranchList(branchData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false once data fetching is done
    }
  };


  const debouncedSearch = debounce((search) => {
    searchBranch(search); // Call the searchBranch function after the debounce delay
  }, 1500);
  let timeoutId; // Store the timeout ID globally

  // const trigersearch = (search) => {
  //   // Clear any previously set timeout
  //   clearTimeout(timeoutId);

  //   // Set a new timeout to delay the search
  //   timeoutId = setTimeout(() => {
  //     searchBranch(search);
  //   }, 1500); // Adjust the delay as needed
  // };

  const trigersearch = (search) => {
    debouncedSearch(search)
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header closeButton={!loading}>
        <Modal.Title>Assign Batch to Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="assign-border">

          <div className="p-3 " >
            <h6>Active Batches List</h6>
            <div className="mt-2 table-responsive table-card  table-assign  table-scroll border-0 ">
              <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                <thead>
                  <tr className="">
                    <th scope="col" className="fs-13 lh-xs fw-600  ">
                      S.No
                    </th>
                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                      Batch Name
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600  ">
                      Curriculum
                    </th>
                    <th
                      scope="col"
                      className="fs-13 lh-xs  fw-600  text-truncate"
                      title="Registration Number"
                      style={{ maxWidth: "120px" }}
                    >
                      Timing&apos;s
                    </th>
                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                      Start Date- End Date
                    </th>

                    <th scope="col" className="fs-13 lh-xs fw-600  ">
                      Trainer
                    </th>
                  </tr>
                </thead>
                <tbody className="">


                  {

                    studentActiveBatchesList && studentActiveBatchesList.length > 0 ?
                      studentActiveBatchesList.map((item, index) => {

                        return (
                          <tr key={index + 1}>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {index + 1}
                            </td>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {item?.batchName}
                            </td>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {item?.copyCurriculum?.curriculumName}
                            </td>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {TimeConverter(
                                item?.startTime,
                                item?.endTime
                              )}
                            </td>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {FormattedDate(item?.startDate)} -{" "}
                              {FormattedDate(item?.endDate)}
                            </td>

                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {item?.users[0]?.fullName}
                            </td>
                          </tr>
                        )
                      })

                      :
                      <tr className="fs-13 black_300 fw-500 lh-xs bg_light">
                        No Active Batches List
                      </tr>
                  }


                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3">
            <h6 className="mt-3" >In-Active Batches List</h6>
            <div className="mt-2 table-responsive table-card  table-assign  table-scroll border-0 ">
              <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                <thead>
                  <tr className="">
                    <th scope="col" className="fs-13 lh-xs fw-600  ">
                      S.No
                    </th>
                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                      Batch Name
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600  ">
                      Curriculum
                    </th>
                    <th
                      scope="col"
                      className="fs-13 lh-xs  fw-600  text-truncate"
                      title="Registration Number"
                      style={{ maxWidth: "120px" }}
                    >
                      Timing&apos;s
                    </th>
                    <th scope="col" className="fs-13 lh-xs  fw-600  ">
                      Start Date- End Date
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600  ">
                      Trainer
                    </th>
                  </tr>
                </thead>
                <tbody className="">

                  {

                    studentInActiveBatchesList && studentInActiveBatchesList.length > 0 ?
                      studentInActiveBatchesList.map((item, index) => {

                        return (
                          <tr key={index + 1}>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {index + 1}
                            </td>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {item?.batchName}
                            </td>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {item?.copyCurriculum?.curriculumName}
                            </td>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {TimeConverter(
                                item?.startTime,
                                item?.endTime
                              )}
                            </td>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {FormattedDate(item?.startDate)} -{" "}
                              {FormattedDate(item?.endDate)}
                            </td>

                            <td className="fs-13 black_300 fw-500 lh-xs bg_light ">
                              {item?.users[0]?.fullName}
                            </td>
                          </tr>
                        )
                      })
                      : <tr className="fs-13 black_300 fw-500 lh-xs bg_light">

                        No In-Active Batches List

                      </tr>
                  }



                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-lg-6">
            <div className="mb-3">
              <label
                htmlFor="studentName"
                className="form-label fs-s fw-medium black_300"
              >
                Student Name<span className="text-danger">*</span>
              </label>
              <input
                className="form-control fs-s bg-form text_color"
                type="text"
                placeholder="Enter Student Name"
                id="studentName"
                name="studentName"
                value={student && student?.name}
                disabled
                style={{ cursor: "not-allowed", backgroundColor: "#e2e2e2" }}
                required
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label
                htmlFor="registrationNumber"
                className="form-label fs-s fw-medium black_300"
              >
                Registration Number<span className="text-danger">*</span>
              </label>
              <input
                className="form-control fs-s bg-form text_color"
                type="text"
                placeholder="Enter Registration Name"
                id="registrationNumber"
                name="registrationNumber"
                value={student && student?.registrationnumber}
                disabled
                style={{ cursor: "not-allowed", backgroundColor: "#e2e2e2" }}
                required
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label
                htmlFor="branchId"
                className="form-label fs-s fw-medium black_300"
              >
                Branch Name<span className="text-danger">*</span>
              </label>
              {/* <select
                className={`form-control form-select fs-s bg-form text_color input_bg_color ${errors.branch ? `error-input` : ``
                  } `}
                aria-label="Select the Branch"
                name="branchId"
                id="branchId"
                onChange={(e) => handleChange(e, "branch")}
                value={assignBatchState?.branchId || ""}
                // disabled
                // style={{ cursor: "not-allowed" }}
                required
              >
                {branch?.branchData && branch?.branchData?.length > 0 ? (
                  <>
                    <option value="" selected disabled>
                      Select the Branch
                    </option>
                    {branch?.branchData?.map((item, index) => (
                      <option key={index} value={item?.id}>
                        {item?.branch_name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="" selected disabled>
                    {" "}
                    No Branches Found
                  </option>
                )}
              </select> */}
              <Select
                id="branchId"
                name="branchId"
                placeholder="Search Branch"
                classNamePrefix="Search"
                className="fs-s bg-form text_color input_bg_color"
                options={branchList || []}  // Branch options from API
                onInputChange={(inputValue) => {
                  trigersearch(inputValue);  // Fetch new branches based on search input
                }}
                onChange={async (selectedOption) => {
                  if (selectedOption) {
                    const branchId = selectedOption?.value; // This will be the branch id
                    await handleChange({ target: { name: "branchId", value: branchId } }, "branch");
                  }
                }}
                isClearable
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
              />
              <div className="response" style={{ height: "8px" }}>
                {errors?.branch && (
                  <p className="text-danger m-0 fs-xs">{errors?.branch}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label
                htmlFor="curriculumId"
                className="form-label fs-s fw-medium black_300"
              >
                curriculum<span className="text-danger">*</span>
              </label>

              <select
                className={`form-control form-select fs-s bg-form text_color input_bg_color ${errors.curriculumName ? `error-input` : ``
                  } `}
                aria-label="Select Trainer"
                name="curriculumId"
                id="curriculumId"
                onChange={(e) => handleChange(e, "curriculum")}
                value={assignBatchState?.curriculumId || ""}
                disabled={!assignBatchState?.branchId}
                style={{
                  cursor: !assignBatchState?.branchId
                    ? "not-allowed"
                    : "pointer",
                }}
                required
              >
                {curriculumList?.length > 0 ? (
                  <>
                    <option value="" disabled selected>
                      Select the Curriculum
                    </option>
                    {curriculumList?.map((item, index) => (
                      <option key={index} value={item?.id}>
                        {item?.curriculumName}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="" disabled selected>
                    No Curriculums Found
                  </option>
                )}
              </select>

              <div className="response" style={{ height: "8px" }}>
                {errors?.curriculumName && (
                  <p className="text-danger m-0 fs-xs">
                    {errors?.curriculumName}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label
                htmlFor="trainerId"
                className="form-label fs-s fw-medium black_300"
              >
                Trainer Name<span className="text-danger">*</span>
              </label>
              <select
                className={`form-control form-select fs-s bg-form text_color input_bg_color ${errors.trainer ? `error-input` : ``
                  } `}
                aria-label="Select the Trainer"
                name="trainerId"
                id="trainerId"
                onChange={(e) => handleChange(e, "trainer")}
                value={assignBatchState?.trainerId || ""}
                disabled={!assignBatchState?.curriculumId}
                style={{
                  cursor: !assignBatchState?.curriculumId
                    ? "not-allowed"
                    : "pointer",
                }}
                required
              >
                {fetchErrors.trainersList === true ? (
                  <option value="" disabled selected>
                    Unable to Get data
                  </option>
                ) : trainersList && trainersList?.length > 0 ? (
                  <>
                    <option value="" selected disabled>
                      Select the Trainer
                    </option>
                    {trainersList?.map((item, index) => (
                      <option key={index} value={item?.id}>
                        {item?.fullname}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="" disabled selected>
                    No Trainers are Found
                  </option>
                )}
              </select>

              <div className="response" style={{ height: "8px" }}>
                {errors.trainer && (
                  <p className="text-danger m-0 fs-xs">{errors.trainer}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label
                htmlFor="trainingMode"
                className="form-label fs-s fw-medium black_300"
              >
                Training Mode<span className="text-danger">*</span>
              </label>
              <select
                className={`form-control form-select fs-s bg-form text_color input_bg_color ${errors.trainingMode ? `error-input` : ``
                  } `}
                name="trainingMode"
                id="trainingMode"
                onChange={(e) => handleChange(e, "trainingMode")}
                value={assignBatchState?.trainingMode || ""}
                disabled={!assignBatchState?.trainerId}
                style={{
                  cursor: !assignBatchState?.trainerId
                    ? "not-allowed"
                    : "pointer",
                }}
                required
              >
                <option value="" disabled>
                  Select the Training Mode{" "}
                </option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
                <option value="self-learning">Self Learning</option>
              </select>
              <div className="response" style={{ height: "8px" }}>
                {errors.trainingMode && (
                  <p className="text-danger m-0 fs-xs">{errors.trainingMode}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label
                htmlFor="batchType"
                className="form-label fs-s fw-medium black_300"
              >
                Batch's Type<span className="text-danger">*</span>
              </label>
              <select
                className={`form-control form-select fs-s bg-form text_color input_bg_color ${errors.batchType ? `error-input` : ``
                  } `}
                name="batchType"
                id="batchType"
                onChange={(e) => handleChange(e, "batchType")}
                value={assignBatchState?.batchType || ""}
                disabled={!assignBatchState?.trainingMode}
                style={{
                  cursor: !assignBatchState?.trainingMode
                    ? "not-allowed"
                    : "pointer",
                }}
                required
              >
                <option value="" disabled>
                  Select the Batch Type
                </option>
                <option value="active">Active Batches</option>
                <option value="upcoming">Upcoming Batches</option>
              </select>
              <div className="response" style={{ height: "8px" }}>
                {errors.batchType && (
                  <p className="text-danger m-0 fs-xs">{errors.batchType}</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label
                htmlFor="batchId"
                className="form-label fs-s fw-medium black_300"
              >
                Available Batches<span className="text-danger">*</span>
              </label>
              <select
                className={`form-control form-select fs-s bg-form text_color input_bg_color ${errors.batchId ? `error-input` : ``
                  } `}
                name="batchId"
                id="batchId"
                onChange={(e) => handleChange(e, "batchId")}
                value={assignBatchState?.batchId || ""}
                disabled={!assignBatchState?.batchType}
                style={{
                  cursor: !assignBatchState?.batchType
                    ? "not-allowed"
                    : "pointer",
                }}
                required
              >
                {fetchErrors.trainer === true ? (
                  <option value="" disabled selected>
                    Unable to Get data
                  </option>
                ) : trainerBatchesList && trainerBatchesList?.length > 0 ? (
                  <>
                    <option value="" selected disabled>
                      Select the Batch
                    </option>
                    {trainerBatchesList?.map((item, index) => (
                      <option key={index} value={item?.id}>
                        {"StartDate: "}
                        {FormattedDate(item?.startDate)}
                        {", Timings: ["}
                        <span>
                          {TimeConverter(item?.startTime, item?.endTime)}
                        </span>
                        {"]"}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="" disabled selected>
                    No Batchs are Found
                  </option>
                )}
              </select>
              <div className="response" style={{ height: "8px" }}>
                {errors.batchId && (
                  <p className="text-danger m-0 fs-xs">{errors.batchId}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-end">
          <Button
            type="button"
            className="btn btn-sm btn btn-sm btn-md btn_primary fs-13"
            onClick={(e) => handleClose(e)}
            disabled={loading}
          >
            Close
          </Button>
          <Button
            type="button"
            className="btn btn-sm btn btn-sm btn-md btn_primary fs-13"
            onClick={(e) => handleAssignBatch(e)}
            disabled={loading}
          >
            Assign Batch
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AssignBatch;

// import React, { useEffect, useState } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import { useBranchContext } from '../../../../dataLayer/hooks/useBranchContext';
// import { useCourseContext } from '../../../../dataLayer/hooks/useCourseContext';
// import { ERPApi } from '../../../../serviceLayer/interceptor.jsx';
// import Swal from 'sweetalert2';
// import { toast } from 'react-toastify';
// import { useStudentsContext } from '../../../../dataLayer/hooks/useStudentsContext';
// import FormattedDate from '../../../../utils/FormattedDate';
// import Select from 'react-select';
// import TimeConverter from '../../../../utils/TimeConverter';
// import CurriculumListProvider from '../../settings/curriculum/CurriculumListProvider';

// const AssignBatch = ({ show, handleClose, student }) => {
//     const { getPaginatedStudentsData } = useStudentsContext();
//     const { BranchState, } = useBranchContext();
//     const { courseState } = useCourseContext();
//     const {CurriculumState } = CurriculumListProvider();

//     useEffect(() => {
//         if (show && student) {
//             setAssignBatchState((prev) => ({
//                 ...prev,
//                 branch:[{label:student?.branch, value:student?.branchId}],
//                 studentId: student?.id,
//             }))
//         }
//     }, [show, student]);

//     const curriculumList=CurriculumState?.curriculums?.map((item,index)=>({
//         label: item.curriculumName, value: item.id
//     }))

//     const branchList = BranchState?.branches?.map((branch, index)=>({
//         label: branch.branch_name, value: branch.id
//     }));

//     const [fetchErrors, setFetchErrors] = useState({
//         trainersList: false,
//         trainer: false,
//     });

//     const [errors, setErrors] = useState({})
//     const [trainerBatchesList, setTrainerBatchesList] = useState([]);
//     const [trainersList, setTrainersList] = useState([]);

//     const [assignBatchState, setAssignBatchState] = useState({
//         branch: [],
//         curriculum: [],
//         trainer: [],
//         trainingMode: "",
//         batchType: "",
//         batchId: null,
//         studentId: null,
//     });

//     const handleChange = async (e, type) => {
//         const value = e?.target?.value;
//         const selectedobj = e;
//         let updatedState = {};

//         switch (type) {
//             case "branch": {
//                 updatedState = {
//                     branch:selectedobj,
//                     curriculum: [],
//                     trainer: [],
//                     trainingMode: "",
//                     batchType: "",
//                     batchId: null,
//                 };
//                 break;
//             }
//             case "curriculum": {
//                 updatedState = {
//                     curriculum: selectedobj,
//                     trainer: [],
//                     trainerId: null,
//                     trainingMode: "",
//                     batchType: "",
//                     batchId: null,
//                 };
//                 await fetchTrainersList(assignBatchState?.branch[0].value, selectedobj?.value);
//                 break;

//             }
//             case "trainer": {
//                 updatedState = {
//                     trainer: selectedobj,
//                     trainingMode: "",
//                     batchType: "",
//                     batchId: null,
//                 };
//                 break;
//             }
//             case "trainingMode": {
//                 updatedState = {
//                     trainingMode: value,
//                     batchType: "",
//                     batchId: null,
//                 };
//                 break;
//             }
//             case "batchType": {
//                 updatedState = {
//                     batchType: value,
//                     batchId: null,
//                 };
//                 await fetchSingleTrainer(assignBatchState?.trainerId, assignBatchState?.trainingMode, value);
//                 break;
//             }
//             case "batchId": {
//                 updatedState = {
//                     batchId: parseInt(value),
//                 };
//                 break;
//             }
//             default:
//                 break;
//         }

//         setAssignBatchState((prev) => ({
//             ...prev,
//             ...updatedState,
//         }));
//     };

//     const fetchTrainersList = async (branchId, curriculumId) => {
//         if (branchId && curriculumId) {
//             try {
//                 const { data, status } = await ERPApi.get(`${import.meta.env.VITE_API_URL}/batch/gettrainerdetails?branchId=${branchId}&courseId=${curriculumId}`);
//                 if (status === 200) {
//                     setTrainersList(data?.trainerDetails?.map((item, index) => ({
//                         label: item?.fullname, value: item?.id
//                     })))
//                 }
//             }
//             catch (error) {
//                 setTrainersList([])
//                 setFetchErrors((prev) => ({
//                     ...prev,
//                     trainersList: true,
//                 }))
//             }
//         }
//     }

//     const fetchSingleTrainer = async (trainerId, trainingMode, batchType) => {
//         if (trainerId && trainingMode && batchType) {
//             try {
//                 const { data, status } = await ERPApi.get(`${import.meta.env.VITE_API_URL}/batch/gettrainerdetails?trainerId=${trainerId}&trainingMode=${trainingMode}&batchStatus=${batchType}`);
//                 if (status === 200) {
//                     setTrainerBatchesList(data)
//                 }
//             }
//             catch (error) {
//                 setTrainerBatchesList([]);
//                 setFetchErrors({
//                     trainer: true
//                 });
//             }
//         }
//     }

//     const handleAssignBatch = async (e) => {
//         e.preventDefault();
//         if (!assignBatchState?.branch || assignBatchState?.branch.length ===0) {
//             setErrors((prev) => ({
//                 ...prev,
//                 branch: "Branch Name is required",
//             }));
//             return;
//         }
//         else if (!assignBatchState?.curriculum ||assignBatchState?.curriculum?.length ===0 ) {
//             setErrors((prev) => ({
//                 ...prev,
//                 curriculum: "curriculum is required",
//             }));
//             return;
//         }
//         else if (!assignBatchState?.trainer || assignBatchState?.trainer.length ===0) {
//             setErrors((prev) => ({
//                 ...prev,
//                 trainer: "Trainer Name is required",
//             }));
//             return;
//         }

//         else if (!assignBatchState?.trainingMode || assignBatchState?.trainingMode.trim() === "") {
//             setErrors((prev) => ({
//                 ...prev,
//                 trainingMode: "Training Mode is required",
//             }));
//             return;
//         }

//         else if (!assignBatchState?.batchType || assignBatchState?.batchType.trim() === "") {
//             setErrors((prev) => ({
//                 ...prev,
//                 batchType: "Batch Type  is required",
//             }));
//             return;
//         }

//         else if (!assignBatchState?.batchId) {
//             setErrors((prev) => ({
//                 ...prev,
//                 batchId: "Batch is required",
//             }));
//             return;
//         }

//         const assignBatchData = {
//             studentId: assignBatchState?.studentId,
//         }

//         if (assignBatchState.batchId) {
//             Swal.fire({
//                 title: "Are you sure?",
//                 text: "Do you want to Assign this batch?",
//                 icon: "question",
//                 showCancelButton: true,
//                 confirmButtonColor: "#3085d6",
//                 cancelButtonColor: "#d33",
//                 confirmButtonText: "Yes, Assign Student!"
//             }).then(async (result) => {
//                 if (result.isConfirmed) {
//                     try {
//                         const { data, status } = await toast.promise(
//                             ERPApi.patch(`${import.meta.env.VITE_API_URL}/batch/assignStudent/${assignBatchState?.batchId}`, assignBatchData),
//                             {
//                                 pending: "Assigning Student to Batch",
//                             }
//                         );

//                         if (status === 200) {

//                             Swal.fire({
//                                 title: "Assigned!",
//                                 text: "Assigned student to Batch successfully.",
//                                 icon: "success",
//                             });
//                             getPaginatedStudentsData();
//                             handleClose();
//                         }

//                     } catch (error) {
//                         console.error(error);
//                         const errorMessage = error?.response?.data?.message || "An unknown error occurred. Please try again.";
//                         Swal.fire({
//                             title: "Error!",
//                             text: errorMessage,
//                             icon: "error",
//                         });

//                     }
//                 }
//             });
//         }

//     }

//     return (
//         <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
//             <Modal.Header closeButton>
//                 <Modal.Title>Assign Batch</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div className="row">
//                     <div className="col-lg-6">
//                         <div className="mb-3">
//                             <label htmlFor="branchId" className="form-label fs-s fw-medium black_300">
//                                 Branch Name<span className="text-danger">*</span>
//                             </label>

//                             <Select
//                                 className={` fs-s bg-form text_color input_bg_color ${errors && errors.branch ? 'error-input border border-red-500' : ''
//                                     }`}
//                                 placeholder="Select the Branch"
//                                 isDisabled
//                                 options={branchList}
//                                 styles={{
//                                     control: (base, state) => ({
//                                         ...base,
//                                         cursor:'not-allowed' ,
//                                         backgroundColor:base.backgroundColor,
//                                     }),
//                                 }}
//                                 value={assignBatchState?.branch || []}
//                                 onChange={(e) => {
//                                     handleChange(e, "branch");
//                                 }}
//                             />

//                             <div className="response" style={{ height: "8px" }}>
//                                 {errors?.branch && (
//                                     <p className="text-danger m-0 fs-xs">
//                                         {errors?.branch}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-6">
//                         <div className="mb-3">
//                             <label htmlFor='courseId' className="form-label fs-s fw-medium black_300">
//                             Curriculum <span className="text-danger">*</span>
//                             </label>
//                             <Select
//                                 className={` fs-s bg-form text_color input_bg_color ${errors && errors.curriculum ? 'error-input border border-red-500' : ''
//                                     }`}

//                                 options={curriculumList}
//                                 classNamePrefix="select"
//                                 value={assignBatchState?.curriculum}
//                                 isDisabled={assignBatchState?.branch.length === 0}
//                                 style={{ cursor: assignBatchState?.branch?.length ===0  ? "not-allowed" : "pointer" }}
//                                 onChange={(e) => {
//                                     handleChange(e, "curriculum");
//                                 }}

//                                 placeholder="Select the Curriculum"
//                             />
//                             <div className="response" style={{ height: "8px" }}>
//                                 {errors?.curriculum && (
//                                     <p className="text-danger m-0 fs-xs">
//                                         {errors?.curriculum}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-6">
//                         <div className="mb-3">
//                             <label htmlFor='trainerId' className="form-label fs-s fw-medium black_300">
//                                 Trainer Name<span className="text-danger">*</span>
//                             </label>

//                             <Select
//                                 className={`fs-s bg-form text_color input_bg_color ${errors && errors.trainer ? 'error-input border border-red-500' : ''
//                                     }`}
//                                 options={trainersList}
//                                 placeholder="Select the Trainer"
//                                 classNamePrefix="select"
//                                 value={assignBatchState?.trainer}
//                                 isDisabled={assignBatchState?.curriculum.length === 0}
//                                 styles={{
//                                     control: (base, state) => ({
//                                         ...base,
//                                         cursor: assignBatchState?.curriculum?.length===0 ? 'not-allowed' : 'pointer',
//                                         backgroundColor:base.backgroundColor,
//                                     }),
//                                 }}
//                                 onChange={(e) => handleChange(e, 'trainer')}
//                             />
//                             <div className="response" style={{ height: "8px" }}>
//                                 {errors.trainer && (
//                                     <p className="text-danger m-0 fs-xs">
//                                         {errors.trainer}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-6">
//                         <div className="mb-3">
//                             <label htmlFor='trainingMode' className="form-label fs-s fw-medium black_300">
//                                 Training Mode<span className="text-danger">*</span>
//                             </label>
//                             <select
//                                 className={`form-control fs-s bg-form text_color input_bg_color ${errors.trainingMode ? `error-input` : ``} `}
//                                 name="trainingMode"
//                                 id="trainingMode"
//                                 onChange={(e) => handleChange(e, "trainingMode")}
//                                 value={assignBatchState?.trainingMode || ""}
//                                 disabled={assignBatchState?.trainer.length ===0}
//                                 style={{ cursor: assignBatchState?.trainer.length ===0 ? "not-allowed" : "pointer" ,
//                                     backgroundColor: assignBatchState?.trainer?.length===0 ? '#f0f0f0' : '',
//                                 }}
//                                 required
//                             >
//                                 <option value="" disabled>Select the Training Mode </option>
//                                 <option value="online">Online</option>
//                                 <option value="offline">Offline</option>
//                                 <option value="hybrid">Hybrid</option>

//                             </select>
//                             <div className="response" style={{ height: "8px" }}>
//                                 {errors.trainingMode && (
//                                     <p className="text-danger m-0 fs-xs">
//                                         {errors.trainingMode}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-6">
//                         <div className="mb-3">
//                             <label htmlFor='batchType' className="form-label fs-s fw-medium black_300">
//                                 Batch's Type<span className="text-danger">*</span>
//                             </label>
//                             <select
//                                 className={`form-control fs-s bg-form text_color input_bg_color ${errors.batchType ? `error-input` : ``} `}
//                                 name="batchType"
//                                 id="batchType"
//                                 onChange={(e) => handleChange(e, "batchType")}
//                                 value={assignBatchState?.batchType || ""}
//                                 disabled={!assignBatchState?.trainingMode}
//                                 style={{ cursor: !assignBatchState?.trainingMode ? "not-allowed" : "pointer" }}
//                                 required
//                             >
//                                 <option value="" disabled>Select the Training Mode</option>
//                                 <option value="active">Active Batches</option>
//                                 <option value="upcoming">Upcoming Batches</option>
//                             </select>
//                             <div className="response" style={{ height: "8px" }}>
//                                 {errors.batchType && (
//                                     <p className="text-danger m-0 fs-xs">
//                                         {errors.batchType}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-lg-6">
//                         <div className="mb-3">
//                             <label htmlFor="batchId" className="form-label fs-s fw-medium black_300">
//                                 Available Batches<span className="text-danger">*</span>
//                             </label>
//                             <select
//                                 className={`form-control fs-s bg-form text_color input_bg_color ${errors.batchId ? `error-input` : ``} `}
//                                 name="batchId"
//                                 id="batchId"
//                                 onChange={(e) => handleChange(e, "batchId")}
//                                 value={assignBatchState?.batchId || ""}
//                                 disabled={!assignBatchState?.batchType}
//                                 style={{ cursor: !assignBatchState?.batchType ? "not-allowed" : "pointer" }}
//                                 required
//                             >

//                                 {fetchErrors.trainer === true ? (
//                                     <option value="" disabled selected>Unable to Get data</option>
//                                 ) : trainerBatchesList && trainerBatchesList?.length > 0 ? (
//                                     <>
//                                         <option value="" selected disabled>Select the Batch</option>
//                                         {trainerBatchesList?.map((item, index) => (

//                                             <option key={index} value={item?.id}>
//                                                 {"StartDate: "}
//                                                 {FormattedDate(item?.startDate)}
//                                                 {", Timings: ["}
//                                                 <span>
//                                                     {TimeConverter(item?.startTime, item?.endTime)}
//                                                 </span>
//                                                 {"]"}
//                                             </option>
//                                         ))}
//                                     </>
//                                 ) : (
//                                     <option value="" disabled selected>No Batchs are Found</option>
//                                 )}
//                             </select>
//                             <div className="response" style={{ height: "8px" }}>
//                                 {errors.batchId && (
//                                     <p className="text-danger m-0 fs-xs">
//                                         {errors.batchId}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="mt-2 text-end">
//                     <Button type="button" className="btn btn-sm btn btn-sm btn-md btn_primary fs-13" onClick={(e) => handleAssignBatch(e)}>
//                         Assign Batch
//                     </Button>
//                 </div>
//             </Modal.Body>
//         </Modal >
//     );
// };

// export default AssignBatch;
