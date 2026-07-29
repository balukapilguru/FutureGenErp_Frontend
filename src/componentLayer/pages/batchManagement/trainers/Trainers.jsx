import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";

import BackButton from "../../../components/backbutton/BackButton";
import { BsPersonCheck } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { PiStudent } from "react-icons/pi";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import CountUp from "../../../../utils/CountUp";
import TimeConverter from "../../../../utils/TimeConverter";
import FormattedDate from "../../../../utils/FormattedDate";
import { Link } from "react-router-dom";
import { MdLaunch } from "react-icons/md";

const Trainers = () => {
  const [BatchesList, setBatchesList] = useState([]);

  const [batchesandStudentCount, setBatchesandStudentCount] = useState({
    activeBatchesCount: 0,
    upcomingBatchesCount: 0,
    completedBatchesCount: 0,
    totalStudentCount: 0,
  });

  const [loading, setLoading] = useState({
    batchesList: false,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading((prev) => ({ ...prev, batchesList: true }));
      try {
        const [batchesCountResponse, batchesListResponse] = await Promise.all([
          ERPApi.get("/batch/dashboard/trainer/count"),
          ERPApi.get("/batch/dashboard/trainer/live"), // Replace with the second API endpoint
        ]);
        if (batchesCountResponse.status === 200) {
          const batchesCounts = batchesCountResponse?.data;
          setBatchesandStudentCount((prev) => ({
            ...prev,
            activeBatchesCount: batchesCounts?.activeBatchesCount,
            upcomingBatchesCount: batchesCounts?.upcomingBatchesCount,
            completedBatchesCount: batchesCounts?.closedBatchesCount,
            totalStudentCount: batchesCounts?.studentCount,
          }));
        }
        if (batchesListResponse.status === 200) {
          const batchesList = batchesListResponse?.data?.batches;
          setBatchesList(batchesList);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading((prev) => ({ ...prev, batchesList: false }));
      }
    };
    fetchInitialData();
  }, []);

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
      <BackButton heading=" Trainers" content="Back" />
      <div className="container-fluid">
        <div className="card-body">
          <ul
            className="row nav nav-justified nav-fill"
            id="pills-tab"
            role="tablist"
          >
            <li
              className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 nav-item"
              role="presentation"
            >
              <Link to="/batchmanagement/batches/activelist">
                <button
                  className="card card_animate nav-link active"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  <div className="d-flex align-items-center w-100 justify-content-between">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                        Active Batches
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
                    <div className="text-start">
                      <h4 className="fs-22 fw-semibold ff-secondary mb-3 display_no">
                        <span className="counter-value" data-target="559.25">
                          <CountUp
                            finalValue={
                              batchesandStudentCount?.activeBatchesCount
                            }
                            duration={500}
                          />
                        </span>{" "}
                      </h4>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                      <span className="avatar-title bg-success-subtle rounded fs-3">
                        <BsPersonCheck className="light-blue-color fs-20" />
                      </span>
                    </div>
                  </div>
                </button>
              </Link>
            </li>

            <li
              className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 nav-item"
              role="presentation"
            >
              <Link to="/batchmanagement/batches/upcominglist">
                <button
                  className="card nav-link card_animate"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                >
                  <div className="d-flex align-items-center w-100 justify-content-between">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                        Upcoming Batches
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-end">
                      <h5 className="text-success fs-14 mb-0">
                        <i className="ri-arrow-right-up-line fs-14 align-middle"></i>{" "}
                        {/* +29.08 % */}
                      </h5>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
                    <div className="text-start">
                      <h4 className="fs-22 fw-semibold ff-secondary mb-3 display_no">
                        <span className="counter-value" data-target="183.35">
                          <CountUp
                            finalValue={
                              batchesandStudentCount?.upcomingBatchesCount
                            }
                            duration={500}
                          />
                        </span>
                      </h4>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                      <span className="avatar-title bg-warning-subtle rounded fs-3">
                        <IoIosPeople className="text_yellow fs-20" />
                      </span>
                    </div>
                  </div>
                </button>
              </Link>
            </li>

            <li
              className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 nav-item"
              role="presentation"
            >
              <Link to="/batchmanagement/batches/completedlist">
                <button
                  className="card nav-link card_animate"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                >
                  <div className="d-flex align-items-center w-100 justify-content-between">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                        Completed Batches
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-end">
                      <h5 className="text-success fs-14 mb-0">
                        <i className="ri-arrow-right-up-line fs-14 align-middle"></i>{" "}
                        {/* +29.08 % */}
                      </h5>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-2 mb-2 w-100">
                    <div className="text-start">
                      <h4 className="fs-22 fw-semibold ff-secondary mb-3 display_no">
                        <span className="counter-value" data-target="183.35">
                          <CountUp
                            finalValue={
                              batchesandStudentCount?.completedBatchesCount
                            }
                            duration={500}
                          />
                        </span>
                      </h4>
                    </div>
                    <div className="avatar-sm flex-shrink-0">
                      <span className="avatar-title bg-warning-subtle rounded fs-3">
                        <IoIosPeople className="text_yellow fs-20" />
                      </span>
                    </div>
                  </div>
                </button>
              </Link>
            </li>

            <li
              className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 nav-item"
              role="presentation"
            >
              <button
                className="card nav-link card_animate"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                      Active Students
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-end">
                    <h5 className="text-danger fs-14 mb-0">
                      {/* <FiArrowDownRight className="text-danger" />
                    -3.57 % */}
                    </h5>
                  </div>
                </div>
                <div className="d-flex align-items-end mt-2 mb-2 justify-content-between w-100">
                  <div className="text-start">
                    <h4 className="fs-22 fw-semibold ff-secondary mb-3 display_no">
                      <span className="counter-value" data-target="36894">
                        <CountUp
                          finalValue={batchesandStudentCount?.totalStudentCount}
                          duration={500}
                        />
                      </span>
                    </h4>
                  </div>
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-info-subtle rounded fs-3">
                      <PiStudent className="text-success fs-20" />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-body">
              <div className="table-responsive table-scroll table-card border-0 dashboard-tables">
                <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                  <thead>
                    <tr>
                      <th scope="col" className="fs-13 lh-xs fw-600">
                        S.No
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600">
                        Batch Name
                      </th>
                      <th scope="col" className="fs-13 lh-xs fw-600">
                        Batch Time
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 text-truncate"
                      >
                        Curriculum
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 text-truncate"
                      >
                        Batch Status
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 text-truncate"
                      >
                        Start Date
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 text-truncate"
                      >
                        End Date
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 text-truncate"
                      >
                        Sessions
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 text-truncate"
                        title="Remaining Sessions"
                        style={{ maxWidth: "90px" }}
                      >
                        Remaining Sessions
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 text-truncate"
                      >
                        Students
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 text-truncate"
                        title="Completed Percentage"
                        style={{ maxWidth: "90px" }}
                      >
                        Completed Percentage
                      </th>
                      <th
                        scope="col"
                        className="fs-13 lh-xs fw-600 text-truncate"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading.batchesList === true ? (
                      <tr>
                        <td className="fs-13 black_300 lh-xs bg_light">
                          Loading...
                        </td>
                      </tr>
                    ) : BatchesList && BatchesList.length > 0 ? (
                      BatchesList?.map((batch, index) => {
                        return (
                          <tr key={`${index}`}>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                              {index + 1}
                            </td>
                            <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                              {batch?.batchName}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {TimeConverter(batch?.startTime, batch?.endTime)}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {batch?.copyCurriculum?.curriculumName}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {batch.batchStatus.charAt(0).toUpperCase() +
                                batch.batchStatus.slice(1)}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {FormattedDate(batch?.startDate)}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {FormattedDate(batch?.endDate)}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {batch?.totalSessions}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {batch?.totalSessions - batch?.actualSessionCount}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {batch?.totalStudentCount}
                            </td>
                            <td className="fs-13 black_300 lh-xs bg_light">
                              {batch?.copyCurriculum?.totalModuleCount
                                ? (
                                    (batch.copyCurriculum.completedModuleCount /
                                      batch.copyCurriculum.totalModuleCount) *
                                    100
                                  ).toFixed(2) + " %"
                                : "0.00 %"}
                            </td>

                            <td className="fs-13 black_300 lh-xs bg_light">
                              <span
                                style={{
                                  cursor: isWithinTimeAndDayRange(
                                    batch?.startTime,
                                    batch?.endTime,
                                    batch?.daysCollection
                                  )
                                    ? "pointer"
                                    : "not-allowed",
                                }}
                                className={`ms-3 fs-13 ${
                                  isWithinTimeAndDayRange(
                                    batch?.startTime,
                                    batch?.endTime,
                                    batch?.daysCollection
                                  )
                                    ? ""
                                    : "text-muted" // Optional styling for disabled state
                                }`}
                              >
                                {isWithinTimeAndDayRange(
                                  batch?.startTime,
                                  batch?.endTime,
                                  batch?.daysCollection
                                ) ? (
                                  <Link
                                    to={`/batchmanagement/activelist/launch/active/${batch?.id}`}
                                  >
                                    <MdLaunch />
                                  </Link>
                                ) : (
                                  <MdLaunch />
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="fs-13 black_300 lh-xs bg_light">
                          No Batches{" "}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainers;

{
  /* <tr key={`${trainerIndex}-${batchIndex}`} onClick={() => handleBatchClick(batch.batchId)} style={{ cursor: "pointer" }}>
<td className="fs-13 black_300 fw-500 lh-xs bg_light">{batchIndex + 1}</td>
<td className="fs-13 black_300 fw-500 lh-xs bg_light">{batch?.batchName}</td>

<td className="fs-13 black_300 lh-xs bg_light">

  {batch?.timeSlot && (() => {
    const handleTimeRange = (timeRange) => {
      const [start, end] = timeRange.split("-");
      return { start: start.trim(), end: end.trim() };
    };
    const { start, end } = handleTimeRange(batch?.timeSlot);
    return TimeConverter(start, end);
  })()}
</td>
<td className="fs-13 black_300 lh-xs bg_light">{batch?.trainingMode}</td>
<td className="fs-13 black_300 lh-xs bg_light">-</td>
<td className="fs-13 black_300 lh-xs bg_light">  {FormattedDate(batch?.batchStartDate)}</td>
<td className="fs-13 black_300 lh-xs bg_light">{batch?.batchDuration}</td>
<td className="fs-13 black_300 lh-xs bg_light">{batch?.currentDuration}</td>
<td className="fs-13 black_300 lh-xs bg_light">{batch?.studentCount}</td>
</tr> */
}
