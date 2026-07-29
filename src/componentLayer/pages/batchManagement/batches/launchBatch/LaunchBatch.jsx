import { useState, useRef, useEffect } from "react";
// import Button from "../../../../components/button/Button";
import BackButton from "../../../../components/backbutton/BackButton";
import BatchOverview from "./BatchOverview";
import BatchCurriculum from "./BatchCurriculum";
// import CompletedTopics from "./CompletedTopics";
import BatchStudentsList from "./BatchStudentsList";
import BatchAttendance from "./BatchAttendance";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import BatchRecordings from "./BatchRecordings";
import Exam from "./Exam.jsx";
import Accordian from "../../../../components/accordian/Accordian.jsx";
import TillTodayAttendance from "./TillTodayAttendance.jsx";
const LaunchBatch = () => {
  const { batchId } = useParams();
  const location = useLocation();
  const path = location.pathname.split("/");
  const isSelfLearning = path.includes("selfLearning");
  const { batchType } = useParams();

  // S3 Base URL
  const BASE_S3_URL = "https://teksacademy.s3.ap-south-1.amazonaws.com/";

  const [activeButton, setActiveButton] = useState("toggle-button2");
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggleClick = (buttonId) => {
    setActiveButton(buttonId);
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [batchTypes, setBatchType] = useState(searchParams.get("batchType"));

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      event.target.id !== "searchInput"
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [activeModal, setActiveModal] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const handlePreviewMedia = (media) => {
    setActiveMedia(media);
    setActiveModal("preview");
  };

  const closeModals = () => {
    setActiveModal(null);
    setActiveMedia(null);
  };

  const [activeTabs, setActiveTabs] = useState({
    batchOverview: true,
    curriculum: false,
    attendances: false,
    studentsDetails: false,
    recordings: false,
    selfLearning: false,
  });

  const handleTabs = (tab) => {
    setActiveTabs({
      batchOverview: tab === "batchOverview",
      curriculum: tab === "curriculum",
      attendances: tab === "attendances",
      studentsDetails: tab === "studentsDetails",
      recordings: tab === "recordings",
      exam: tab === "exam",
      selfLearning: tab === "selfLearning",
    });
  };

  const [BatchState, setBatchState] = useState({});
  const [BatchState2, setBatchState2] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (batchId) {
        try {
          const { data, status } = await ERPApi.get(
            `${import.meta.env.VITE_API_URL}/batch/getbatch/${batchId}`,
          );
          if (status === 200) {
            setBatchState(data?.getById);
            setBatchState2(data);
          }
        } catch (error) {}
      }
    };
    fetchData();
  }, [batchId]);
  const [modules, setModules] = useState();
  useEffect(() => {
    const fetchData = async () => {
      if (activeTabs.selfLearning && BatchState?.curriculumId) {
        try {
          const { data, status } = await ERPApi.get(
            `${import.meta.env.VITE_API_URL}/batch/curriculum/${BatchState?.copyCurriculum?.id}/copy-media`,
            // `${import.meta.env.VITE_API_URL}/batch/curriculum/${81}/media`
          );
          if (status === 200) {
            setModules(data?.modules);
          }
        } catch (error) {}
      }
    };
    fetchData();
  }, [activeTabs]);

  return (
    <div>
      <BackButton heading="Launch" content="Back" to="/" />
      <div className="container-fluid mt-3">
        {/* tabs start */}
        <ul
          className="nav mb-3 nav-tabs d-flex justify-content-center"
          id="pills-tab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className={`card card_animate nav-link ms-3 ${
                activeTabs.batchOverview ? "active" : ""
              }`}
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected={activeTabs.batchOverview}
              onClick={() => handleTabs("batchOverview")}
            >
              Batch Overview
            </button>
          </li>
          {!isSelfLearning && (
            <li className="nav-item" role="presentation">
              <button
                className={`card card_animate nav-link ms-3 ${
                  activeTabs.curriculum ? "active" : ""
                }`}
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected={activeTabs.curriculum}
                onClick={() => handleTabs("curriculum")}
              >
                Curriculum
              </button>
            </li>
          )}

          {batchType !== "upcoming" && !isSelfLearning && (
            <li className="nav-item" role="presentation">
              <button
                className={`card card_animate nav-link ms-3 ${
                  activeTabs.attendances ? "active" : ""
                }`}
                id="pills-user-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-user"
                type="button"
                role="tab"
                aria-controls="pills-user"
                aria-selected={activeTabs.attendances}
                onClick={() => handleTabs("attendances")}
              >
                Attendance
              </button>
            </li>
          )}

          <li className="nav-item" role="presentation">
            <button
              className={`card card_animate nav-link ms-3 ${
                activeTabs.selfLearning ? "active" : ""
              }`}
              id="pills-user-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-user"
              type="button"
              role="tab"
              aria-controls="pills-user"
              aria-selected={activeTabs.selfLearning}
              onClick={() => handleTabs("selfLearning")}
            >
              {isSelfLearning ? "Self Learning" : "Course Materials"}
            </button>
          </li>

         {batchTypes !== "DEMO_BATCH" && <li className="nav-item" role="presentation">
            <button
              className={`card card_animate nav-link ms-3 ${
                activeTabs.studentsDetails ? "active" : ""
              }`}
              id="pills-launch-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-launch"
              type="button"
              role="tab"
              aria-controls="pills-launch"
              aria-selected={activeTabs.studentsDetails}
              onClick={() => handleTabs("studentsDetails")}
            >
              Student Details
            </button>
          </li>
          }

          {batchType !== "upcoming" && !isSelfLearning && (
            <li className="nav-item" role="presentation">
              <button
                className={`card card_animate nav-link ms-3 ${
                  activeTabs.recordings ? "active" : ""
                }`}
                id="pills-launch-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-launch"
                type="button"
                role="tab"
                aria-controls="pills-launch"
                aria-selected={activeTabs.recordings}
                onClick={() => handleTabs("recordings")}
              >
                Recordings
              </button>
            </li>
          )}
          {batchType !== "upcoming" && (
            <li className="nav-item" role="presentation">
              <button
                className={`card card_animate nav-link ms-3 ${
                  activeTabs.exam ? "active" : ""
                }`}
                id="pills-exam-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-exam"
                type="button"
                role="tab"
                aria-controls="pills-exam"
                aria-selected={activeTabs.exam}
                onClick={() => handleTabs("exam")}
              >
                Exam
              </button>
            </li>
          )}
        </ul>

        <div className="">
          <div className="">
            <div className="tab-content" id="pills-tabContent">
              {/* batch OverView */}
              {activeTabs?.batchOverview && (
                <div
                  className={`tab-pane fade ${
                    activeTabs.batchOverview ? "show active" : ""
                  }`}
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                  tabIndex="0"
                >
                  <div className="">
                    {BatchState && batchId && BatchState2 && (
                      <BatchOverview
                        batchId={batchId}
                        BatchState={BatchState}
                        setBatchState={setBatchState}
                        BatchState2={BatchState2}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* curriculum */}
              {activeTabs?.curriculum && (
                <div
                  className={`tab-pane fade ${
                    activeTabs.curriculum ? "show active" : ""
                  }`}
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    <BatchCurriculum
                      BatchState={BatchState}
                      batchId={batchId}
                      batchType={batchType}
                    />
                  </div>
                </div>
              )}

              {/* Attendance */}
              {activeTabs?.attendances && (
                <div
                  className={`tab-pane fade ${
                    activeTabs.attendances ? "show active" : ""
                  }`}
                  id="pills-user"
                  role="tabpanel"
                  aria-labelledby="pills-user-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    {batchTypes === "DEMO_BATCH" ? (
                      <TillTodayAttendance BatchState={BatchState} />
                    ) : (
                      <BatchAttendance />
                    )}
                  </div>
                </div>
              )}

              {/* student Details */}
              {activeTabs.studentsDetails && (
                <div
                  className={`tab-pane fade ${
                    activeTabs.studentsDetails ? "show active" : ""
                  }`}
                  id="pills-launch"
                  role="tabpanel"
                  aria-labelledby="pills-launch-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    <BatchStudentsList
                      batchId={batchId}
                      batchType={batchType}
                    />
                  </div>
                </div>
              )}

              {/* Exam */}
              {activeTabs.exam && (
                <div
                  className={`tab-pane fade ${
                    activeTabs.exam ? "show active" : ""
                  }`}
                  id="pills-exam"
                  role="tabpanel"
                  aria-labelledby="pills-exam-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    <Exam
                      BatchState={BatchState}
                      batchId={batchId}
                      batchType={batchType}
                    />
                  </div>
                </div>
              )}
              {activeTabs.recordings && (
                <div
                  className={`tab-pane fade ${
                    activeTabs.recordings ? "show active" : ""
                  }`}
                  id="pills-launch"
                  role="tabpanel"
                  aria-labelledby="pills-launch-tab"
                  tabIndex="0"
                >
                  <div className="div">
                    <BatchRecordings batchId={batchId} batchType={batchType} />
                  </div>
                </div>
              )}
              {activeTabs.selfLearning && (
                <div className="card pt-2">
                  <div className="row justify-content-center">
                    <div className="col-lg-10">
                      <Accordian
                        modules={modules || []}
                        // onAddMedia={handleAddMedia}
                        // onEditMedia={handleEditMedia}
                        // onDeleteMedia={handleDeleteMedia}
                        onPreviewMedia={handlePreviewMedia}
                        showMediaActions={true}
                        multiple={true}
                        defaultExpanded={false}
                        baseImageUrl={BASE_S3_URL}
                        isShowButtons={true}
                      />
                      {activeModal === "preview" && activeMedia && (
                        <div
                          className="modal fade show"
                          style={{
                            display: "block",
                            backgroundColor: "rgba(0,0,0,0.5)",
                          }}
                          tabIndex="-1"
                          role="dialog"
                          aria-modal="true"
                        >
                          <div className="modal-dialog modal-xl modal-dialog-centered">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">
                                  {activeMedia?.title || ""}
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  aria-label="Close"
                                  onClick={closeModals}
                                ></button>
                              </div>
                              <div
                                className="modal-body p-0"
                                style={{ height: "70vh" }}
                              >
                                {activeMedia.assetType?.toLowerCase() ===
                                "video" ? (
                                  <video
                                    controls
                                    className="w-100 h-100"
                                    src={`${BASE_S3_URL}${activeMedia.path}`}
                                    controlsList="nodownload"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                ) : activeMedia.assetType?.toLowerCase() ===
                                  "pdf" ? (
                                  <iframe
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(BASE_S3_URL + activeMedia.path)}&embedded=true`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    title={activeMedia.title}
                                  />
                                ) : (
                                  <iframe
                                    src={`${BASE_S3_URL}${activeMedia.path}`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    title={activeMedia.title}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchBatch;
