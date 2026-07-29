import React from "react";
import BackButton from "../../components/backbutton/BackButton";
import { useLoaderData } from "react-router-dom";
import { ERPApi } from "../../../serviceLayer/interceptor";
import { FiAward } from "react-icons/fi";
import { LuFileText } from "react-icons/lu";
import { FiAlertCircle } from "react-icons/fi";
import { FiXCircle } from "react-icons/fi";
import { FaRegCheckCircle } from "react-icons/fa";

export const ExamPaperViewLoader = async ({ request, params }) => {
  try {
    const { id } = params;
    const response = await ERPApi.get(`exam/getExamById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return null;
  }
};

const ExamPaperView = () => {
  const exam = useLoaderData()?.exam;
  const getMatchingAnswer = (question, leftOptionId) => {
    const pair = question.questionAnswerpairs.find(
      (p) => p.leftOptionId === leftOptionId
    );
    if (!pair) return null;
    return question.questionOptions.find(
      (opt) => opt.id === pair.RightOptionId
    );
  };

  return (
    <div>
      <BackButton heading="Question Paper" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className=" bg-light">
                  <div className="container py-2">
                    <div className="bg-white rounded shadow p-4 mb-4">
                      <div className="row g-4">
                        <div className="col-md-4">
                          <div className="info-box bg-danger-subtle text-success p-3 rounded d-flex align-items-center">
                            <FiAward size={30} />
                            <div className="ms-3">
                              <p className="mb-1 small">Total Marks</p>
                              <h5 className="mb-0">{exam.marks}</h5>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="info-box bg-warning-subtle text-warning p-3 rounded d-flex align-items-center">
                            <LuFileText size={30} />
                            <div className="ms-3">
                              <p className="mb-1 small">No Of Questions</p>
                              <h5 className="mb-0">{exam.noOfQuestions}</h5>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="info-box bg-success-subtle  text-danger p-3 rounded d-flex align-items-center">
                            <FiAlertCircle size={30} />
                            <div className="ms-3">
                              <p className="mb-1 small">Pass Percentage %</p>
                              <h5 className="mb-0">{exam.passingPercentage}%</h5>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Questions */}
                    <div className="mb-2">
                      {exam.examQuestions.map((question, index) => (
                        <div
                          key={question.id}
                          className="bg-white rounded shadow p-sm-4 p-2 mb-3"
                        >
                          <div className="d-flex flex-column flex-sm-row justify-content-between">
                            {" "}
                            <h4 className="fs-16">
                              Question {index + 1}: {question.questionText}
                            </h4>
                            <div>
                              <span className="badge bg-primary ms-2">
                                {question.rewardMark} marks
                              </span>
                            </div>
                          </div>

                          {question.questionType === "Multiple Choice" && (
                            <div className="mt-3">
                              <div className="row">
                                {question.questionOptions.map((option) => (
                                  <div
                                    key={option.id}
                                    className="col-md-6 mb-2"
                                  >
                                    <div
                                      className={`border p-2 rounded d-flex justify-content-between align-items-center ${option.isCorrect
                                        ? "border-success bg-light"
                                        : "border-secondary"
                                        }`}
                                    >
                                      <span>{option.optionText}</span>
                                      {option.isCorrect ? (
                                        <FaRegCheckCircle className="text-success" />
                                      ) : (
                                        <FiXCircle className="text-muted" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="alert alert-success mt-3">
                                Correct Answer:{" "}
                                {
                                  question.questionOptions.find(
                                    (opt) => opt.isCorrect
                                  )?.optionText
                                }
                              </div>
                            </div>
                          )}

                          {question.questionType === "Match the Following" && (
                            <div className="">
                              <div className="row ">
                                <div className="col-lg-6">
                                  <span className=" fw-semibold text-secondary mb-4">
                                    Column A
                                  </span>
                                  {question.questionOptions
                                    .filter((opt) => opt.side === "Left")
                                    .map((option) => {
                                      const matchingOption = getMatchingAnswer(
                                        question,
                                        option.id
                                      );
                                      return (
                                        <div
                                          key={option.id}
                                          className="p-sm-4 p-2 bg-white rounded border border-primary shadow-sm mb-3"
                                        >
                                          <div className="d-flex justify-content-between align-items-center  flex-sm-row flex-column">
                                            <span className="fw-medium">
                                              {option.optionText}
                                            </span>
                                            <div className="d-flex align-items-center">
                                              <span className="text-primary mx-2">
                                                ➜
                                              </span>
                                              <span className="fw-medium text-success">
                                                {matchingOption?.optionText}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>

                                {/* Right Options */}
                                <div className="col-lg-6">
                                  <span
                                    className=" fw-semibold text-secondary mb-4"
                                  >
                                    Column B
                                  </span>
                                  {question.questionOptions
                                    .filter((opt) => opt.side === "Right")
                                    .map((option) => (
                                      <div
                                        key={option.id}
                                        className="p-4 bg-white rounded border border-primary shadow-sm mb-3"
                                      >
                                        <span className="fw-medium">
                                          {option.optionText}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}
                          {question.questionType === "Descriptive" && (
                            <div className="mt-3">
                              <div className="alert alert-info">
                                Correct Answer:{" "}
                                {question.questionAnswers[0]?.answerText}
                              </div>
                            </div>
                          )}

                          {question.questionType === "Fill in the Blanks" && (
                            <div className="mt-3">
                              <div className="alert alert-info">
                                Correct Answer:{" "}
                                {question.questionAnswers[0]?.answerText}
                              </div>
                            </div>
                          )}
                          {/* Penalty */}
                          {question.Penality > 0 && (
                            <div className="alert alert-danger mt-3 ">
                              <FiAlertCircle className="me-2" />
                              Penalty: {question.Penality} marks
                            </div>
                          )}
                        </div>
                      ))}
                    </div>


                    <div className="bg-white rounded shadow p-4">
                      <p className="fw-bold  mb-3 fs-9">Custom Messages</p>
                      <ul className="list-group">
                        {exam.scoreeligibilityrules.map((rule) => (
                          <li
                            key={rule.id}
                            className="list-group-item d-flex flex-sm-row flex-column justify-content-between align-items-center"
                          >
                            <span>
                              {rule.min} - {rule.max} marks
                            </span>
                            <span className="badge bg-primary">
                              {rule.note}
                            </span>
                          </li>
                        ))}
                      </ul>
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

export default ExamPaperView;
