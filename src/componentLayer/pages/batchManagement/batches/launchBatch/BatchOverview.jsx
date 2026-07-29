import { useState } from "react";
import FormattedDate from "../../../../../utils/FormattedDate";
import TimeConverter from "../../../../../utils/TimeConverter";
import { Modal } from "react-bootstrap";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";

const BatchOverview = ({ batchId, BatchState, setBatchState, BatchState2 }) => {


  
  const [showModals, setShowModals] = useState({
    perviousList: false,
  });
  const [loading, setLoading] = useState({
    perviousList: false,
  });


  const [perviousTrainersList, setPerviousTrainersList] = useState([]);

  const handlePerviousList = async () => {
    setShowModals((prev) => ({ ...prev, perviousList: true }));
    setLoading((prev) => ({ ...prev, perviousList: true }));
    try {
      const { data, status } = await ERPApi.get(
        `/batch/gettrainerhistory/${batchId}`
      );
      if (status === 200) {
        setPerviousTrainersList(data?.users);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading((prev) => ({ ...prev, perviousList: false }));
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <table className=" table table-centered align-middle  table-nowrap equal-cell-table table-hover">
            <tbody className="fs-13">
              <div className="row">
                <div className="col-lg-6">
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Batch Name
                    </td>
                    <td className="text-mute text-truncate">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.batchName
                        ? BatchState?.batchName
                        : "Batch Name Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Branch
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.branch?.branch_name
                        ? BatchState?.branch?.branch_name
                        : "Branch Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Curriculum
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.copyCurriculum?.curriculumName
                        ? BatchState?.copyCurriculum?.curriculumName
                        : "Curriculum Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Active Trainer Name
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.users && BatchState?.users[0]
                        ? BatchState?.users[0]?.fullname
                        : "Trainer Not Found"}
                    </td>
                  </tr>

                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Training Mode
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.trainingMode
                        ? BatchState.trainingMode.charAt(0).toUpperCase() +
                        BatchState.trainingMode.slice(1)
                        : "Training Mode Not found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Date (Start & End)
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState &&
                        BatchState?.startDate &&
                        BatchState?.endDate
                        ? FormattedDate(
                          BatchState?.startDate,
                          BatchState?.endDate
                        )
                        : "Dates Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Batch Duration
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.batchDuration
                        ? BatchState?.batchDuration
                        : "Batch Duration Not Found"}{" "}
                      {BatchState && BatchState?.batchDuration ? "Mins" : ""}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Time (start & End)
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState &&
                        BatchState?.startTime &&
                        BatchState?.endTime
                        ? TimeConverter(
                          BatchState?.startTime,
                          BatchState?.endTime
                        )
                        : "No Timings Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Total Students
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState2 && BatchState2?.totalStudentCount
                        ? BatchState2?.totalStudentCount
                        : BatchState2?.totalStudentCount === 0
                          ? 0
                          : "Total Students Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Batch Status
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.batchStatus
                        ? BatchState.batchStatus.charAt(0).toUpperCase() +
                        BatchState.batchStatus.slice(1)
                        : "Batch Status Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Days
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>

                      {BatchState && BatchState?.daysCollection
                        ? BatchState?.daysCollection
                          ?.map(
                            (item) =>
                              item.charAt(0).toUpperCase() +
                              item.slice(1).toLowerCase()
                          )
                          .join(", ")
                        : "Days Not Found"}
                    </td>
                  </tr>
                </div>
                <div className="col-lg-6">
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Total Sessions
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState2 && BatchState2?.totalSessions
                        ? BatchState2?.totalSessions
                        : BatchState2?.totalSessions === 0
                          ? 0
                          : "Total Sessions Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Completed Sessions
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState2 && BatchState2?.actualSessionsTaken
                        ? BatchState2?.actualSessionsTaken
                        : BatchState2?.actualSessionsTaken === 0
                          ? 0
                          : "Completed Sessions Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Total Modules
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState2 && BatchState2?.totalModuleCount
                        ? BatchState2?.totalModuleCount
                        : BatchState2?.totalModuleCount === 0
                          ? 0
                          : "Total Modules Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Completed Modules
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState2 && BatchState2?.completedModulesCount
                        ? BatchState2?.completedModulesCount
                        : BatchState2?.completedModulesCount === 0
                          ? 0
                          : "Completed Modules Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Total Topics
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState2 && BatchState2?.totalTopicCount
                        ? BatchState2?.totalTopicCount
                        : BatchState2?.totalTopicCount === 0
                          ? 0
                          : " Total Topics Not Found"}
                    </td>
                  </tr>

                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Batch Created On
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.createdAt
                        ? FormattedDate(BatchState?.createdAt)
                        : "Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Batch Updated On
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.updatedAt
                        ? FormattedDate(BatchState?.updatedAt)
                        : "Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Batch Created By
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.createdBy?.fullname
                        ? BatchState?.createdBy?.fullname
                        : "Not Found"}
                    </td>
                  </tr>
                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Batch Upated By
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      {BatchState && BatchState?.updatedBy?.fullname
                        ? BatchState?.updatedBy?.fullname
                        : "Not Found"}
                    </td>
                  </tr>

                  {BatchState && BatchState?.actualEndDate && (
                    <tr className="lh-400">
                      <td className="ps-0 black_300 fw-500" scope="row">
                        Batch Ended On
                      </td>
                      <td className="text-mute">
                        <span className="ms-5">: </span>
                        {BatchState && BatchState?.actualEndDate
                          ? FormattedDate(BatchState?.actualEndDate)
                          : "Not Found"}
                      </td>
                    </tr>
                  )}

                  {BatchState && BatchState?.remark && (
                    <tr className="lh-400">
                      <td className="ps-0 black_300 fw-500" scope="row">
                        Batch Closed Remarks
                      </td>
                      <td className="text-mute">
                        <span className="ms-5">: </span>
                        {BatchState && BatchState?.remark
                          ? BatchState?.remark
                          : "Not Found"}
                      </td>
                    </tr>
                  )}

                  <tr className="lh-400">
                    <td className="ps-0 black_300 fw-500" scope="row">
                      Previous Trainer's List
                    </td>
                    <td className="text-mute">
                      <span className="ms-5">: </span>
                      <span
                        className="fst-italic fw-bold main_color fs-13 cursor-pointer"
                        onClick={() => handlePerviousList()}
                      >
                        <u> show more</u>
                      </span>
                    </td>
                  </tr>
                </div>
              </div>
            </tbody>
          </table>
        </div>
      </div>

      {showModals.perviousList === true && (
        <Modal
          show={showModals.perviousList === true}
          onHide={() => {
            setShowModals((prev) => ({
              ...prev,
              perviousList: false,
            }));
          }}
          backdrop="static"
          size="md"
          dialogClassName="modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>Previous Trainer's List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="card-body">
              <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                  <thead>
                    <tr>
                      <th scope="col" className="fs-13 lh-xs fw-600 ">
                        S.No
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600 ">
                        Trainer Name
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600 ">
                        Assigned Date
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600 ">
                        Exited Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading?.perviousList === true ? (
                      <td className="fs-13 black_300  lh-xs bg_light">
                        Loading...
                      </td>
                    ) : perviousTrainersList &&
                      perviousTrainersList?.length > 0 ? (
                      perviousTrainersList?.map((item, index) => {
                        return (
                          <tr>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                              {index + 1}
                            </td>
                            <td
                              className="fs-13 black_300 lh-xs bg_light text-truncate"
                              style={{ maxWidth: "150px" }}
                              title={item?.fullname}
                            >
                              {item?.fullname}
                            </td>

                            <td className="fs-13 black_300 lh-xs bg_light ">
                              {FormattedDate(
                                item?.user_batch?.assignedOn.split("T")[0]
                              )}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light ">
                              {FormattedDate(
                                item?.user_batch?.exitedOn.split("T")[0]
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="fs-13 black_300  lh-xs bg_light">
                          No Pervious Trainer's
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default BatchOverview;
