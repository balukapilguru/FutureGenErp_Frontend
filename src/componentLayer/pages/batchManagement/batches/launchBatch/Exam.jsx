import React, { useEffect, useRef, useState } from "react";
import { ERPApi } from "../../../../../serviceLayer/interceptor";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { PiStudent } from "react-icons/pi";

const Exam = ({ BatchState, batchId, batchType }) => {
  const [examData, setExamData] = useState([]);
  useEffect(() => {
    const fetchExams = async () => {
      if (!batchId) return;
      try {
        const response = await ERPApi.get(`/batch/getbatch/${batchId}`);
        const exams = response.data?.getById?.exams || [];
        setExamData(exams);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
        toast.error("Failed to fetch exams.");
      }
    };

    fetchExams();
  }, []);
  const handleToggleExamStatus = async (examId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const payload = {
        examIds: [examId],
        isActive: newStatus,
      };
      await ERPApi.patch(`/exam/activateExam/${batchId}`, payload);
      setExamData((prev) =>
        prev.map((exam) =>
          exam.id === examId ? { ...exam, batchExamDetails: { ...exam.batchExamDetails, isActive: newStatus } } : exam
        )
      );
      toast.success(`Exam ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating exam status:", error);
      toast.error("Failed to update exam status.");
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="card-body">
          <div className="table-responsive table-card border-0">
            <div className="table-container table-scroll">
              <table className="table table-centered align-middle table-nowrap equal-cell-table table-hover">
                <thead>
                  <tr>
                    <th scope="col" className="fs-13 lh-xs fw-600">
                      S.No
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600">
                      Exam Title
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600">
                      Exam Name
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600">
                      No of Attempts
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600">
                      No of Questions
                    </th>
                    <th scope="col" className="fs-13 lh-xs fw-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {examData?.length > 0 ? (
                    examData.map((exam, index) => (
                      <tr key={exam.id}>
                        <td className="fs-13 black_300 fw-500 lh-xs bg_light">
                          {index + 1}
                        </td>
                        <td className="fs-13 black_300 lh-xs bg_light text-truncate" style={{ maxWidth: "150px" }}>
                          {exam.examType}
                        </td>
                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                          {exam.examName}
                        </td>
                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                          {exam.attempts}
                        </td>
                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                          {exam.noOfQuestions}
                        </td>
                        <td className="fs-13 black_300 lh-xs bg_light text-truncate">
                          <div className="d-flex align-items-center">
                            <Link to={`/exam/view/${exam.id}`}>
                              <AiFillEye
                                className="eye_icon table_icons me-3"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="view"
                              />
                            </Link>
                            <Link to={`/batchmanagement/batchStudentExam/${batchId}/${exam.id}`}>
                              <PiStudent
                                className="eye_icon table_icons me-3"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title=" Student"
                              />
                            </Link>
                            <div className="form-check form-switch d-inline-block me-3">
                              <input
                                className="form-check-input "
                                type="checkbox"
                                role="switch"
                                id={`examToggle-${exam.id}`}
                                checked={exam?.batchExamDetails?.isActive === 1}
                                onChange={() => handleToggleExamStatus(exam.id, exam?.batchExamDetails?.isActive)}
                              />
                            </div>

                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No exams found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
            <div className="col-sm">
              <PaginationInfo
                data={{
                  length: examData?.length,
                  start: examData?.startData,
                  end: examData?.endData,
                  total: examData?.totalRecords,
                }}
                loading={navigation?.state === "loading"}
              />
            </div>
            <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
              <div className="mt-2">
                <select
                  className="form-select form-control me-3 input_bg_color pagination-select "
                  aria-label="Default select example"
                  required
                  onChange={(e) => handlePerPageChange(e)}
                  value={Qparams?.pageSize}
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
                  currentPage={Number(examData?.currentPage) || 1}
                  totalPages={Number(examData?.totalPages) || 1}
                  loading={navigation.state === 'loading'}
                  onPageChange={handlePage}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Exam;
