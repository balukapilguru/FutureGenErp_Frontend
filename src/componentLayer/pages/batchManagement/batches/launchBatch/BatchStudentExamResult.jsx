import React, { useState } from 'react';
import { useLoaderData, useFetcher, useLocation, useNavigate } from 'react-router-dom';
import { ERPApi } from '../../../../../serviceLayer/interceptor';
import { FiAlertCircle } from 'react-icons/fi';
import BackButton from '../../../../components/backbutton/BackButton';
import { toast } from 'react-toastify';

export const studentExamResultLoader = async ({ request, params }) => {
  try {
    const url = new URL(request.url);
    const examId = url.searchParams.get('examId');
    const response = await ERPApi.get(`/exam/showAnswerPaper/${params.id}?examId=${examId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student exam result:", error);
    return null;
  }
};

export const studenExamResultAction = async ({ request, params }) => {
  const formData = await request.formData();
  const payload = JSON.parse(formData.get('payload'));
  const examAssignMarksId = params.id;

  try {
    const response = await ERPApi.post(`/exam/assignMarks/${examAssignMarksId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success("Marks assigned successfully:");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error assigning marks:", error);
    return { success: false, error: error.message || 'Failed to assign marks' };
  }
};

const BatchStudentExamResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const examId = queryParams.get('examId');
  const loaderData = useLoaderData();
  const studentResponses = loaderData?.studentResponses || [];
  const [remarks, setRemarks] = useState({});
  const [marksAwarded, setMarksAwarded] = useState({});
  const [markErrors, setMarkErrors] = useState({});
  const [isCorrect, setIsCorrect] = useState({});
  const fetcher = useFetcher();

  const exam = {
    marks: studentResponses.reduce((sum, response) => sum + (response['questionDetail.rewardMark'] || 0), 0),
    noOfQuestions: studentResponses.length,
    passingPercentage: 0,
    examQuestions: studentResponses.map((response, index) => ({
      id: response.questionsId,
      questionText: response['questionDetail.questionText'],
      questionType: response['questionDetail.questionType']?.trim(),
      rewardMark: response['questionDetail.rewardMark'],
      Penality: response['questionDetail.Penality'],
      yourAnswer: response.answerText,
      correctAnswer: response['questionDetail.questionAnswers.answerText'] || '', 
      questionAnswers: response['questionDetail.questionAnswers'] ? [response['questionDetail.questionAnswers']] : [], // Access with string key
      questionOptions: [],
    })),
    scoreeligibilityrules: [],
  };


  const handleRemarkChange = (questionId, value) => {
    setRemarks({ ...remarks, [questionId]: value });
  };

  const handleMarkChange = (questionId, value) => {
    const rewardMark = exam.examQuestions.find(q => q.id === questionId)?.rewardMark || 0;
    const enteredMark = parseInt(value, 10) || 0;

    setMarksAwarded({ ...marksAwarded, [questionId]: enteredMark });

    if (enteredMark > rewardMark) {
      setMarkErrors({ ...markErrors, [questionId]: `Mark cannot exceed ${rewardMark}` });
    } else {
      setMarkErrors({ ...markErrors, [questionId]: '' });
    }
  };
  const handleIsCorrectChange = (questionId, checked) => {
    setIsCorrect({ ...isCorrect, [questionId]: checked ? 1 : 0 });
  };
  const handleSubmitMarks = () => {
    const responsesData = exam.examQuestions.map((question) => ({
      questionsId: question.id,
      rewardedMark: marksAwarded[question.id] !== undefined ? parseInt(marksAwarded[question.id], 10) : 0,
      isCorrect: isCorrect[question.id] !== undefined ? isCorrect[question.id] : 0, 
      remark: remarks[question.id] || '',
    }));

    const payload = {
      examId: examId,
      responses: responsesData,
    };

    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));

    fetcher.submit(formData, {
      method: 'POST',
      encType: 'application/x-www-form-urlencoded',
    });
  };


  React.useEffect(() => {
    if (fetcher.data?.success) {
    } else if (fetcher.error) {
      console.error("Submission error:", fetcher.error);
    }
  }, [fetcher.state, fetcher.data, fetcher.error, navigate]);

  return (
    <div>
      <BackButton heading="Exam Result" content="Back" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className=" bg-light">
                  <div className="container py-2">
                    <div className="mb-2">
                      {exam.examQuestions.map((question, index) => (
                        <div
                          key={question.id}
                          className="bg-white rounded shadow p-4 mb-3"
                        >
                          <div className="d-flex flex-row justify-content-between">
                            <h4 className="fs-16">
                              Question {index + 1}: {question.questionText}
                            </h4>
                            <div>
                              <span className="badge bg-primary ms-2">
                                {question.rewardMark} marks
                              </span>
                            </div>
                          </div>

                          <div className="mt-3">
                                <div className="alert alert-success">
                                Student Answer:: {question.yourAnswer}
                                </div>
                              </div>

                          {(question.questionType === "Descriptive" || question.questionType === "Fill in the Blanks") &&
                            question.correctAnswer && (
                              <div className="mt-3">
                                <div className="alert alert-info">
                                  Correct Answer:: {question.correctAnswer}
                                </div>
                              </div>
                            )}

                          <div className="mt-3">
                            <label htmlFor={`remark-${question.id}`} className="form-label fw-semibold">
                              Remark:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id={`remark-${question.id}`}
                              value={remarks[question.id] || ''}
                              onChange={(e) => handleRemarkChange(question.id, e.target.value)}
                            />
                          </div>

                          <div className="mt-2">
                            <label htmlFor={`mark-${question.id}`} className="form-label fw-semibold">
                              Mark Awarded:
                            </label>
                            <input
                              type="number"
                              className={`form-control ${markErrors[question.id] ? 'is-invalid' : ''}`}
                              id={`mark-${question.id}`}
                              value={marksAwarded[question.id] || ''}
                              onChange={(e) => handleMarkChange(question.id, e.target.value)}
                            />
                            {markErrors[question.id] && (
                              <div className="invalid-feedback">{markErrors[question.id]}</div>
                            )}
                          </div>

                          <div className="mt-2">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`correct-${question.id}`}
                                onChange={(e) => handleIsCorrectChange(question.id, e.target.checked)}
                                checked={isCorrect[question.id] === 1} 
                              />
                              <label className="form-check-label fw-semibold" htmlFor={`correct-${question.id}`}>
                                Correct
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>


                    <button
                      type="button"
                      className="btn btn_primary d-flex end"
                      onClick={handleSubmitMarks}
                      disabled={fetcher.state === 'submitting'}
                    >
                      {fetcher.state === 'submitting' ? 'Submitting...' : 'Submit Marks'}
                    </button>
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

export default BatchStudentExamResult;