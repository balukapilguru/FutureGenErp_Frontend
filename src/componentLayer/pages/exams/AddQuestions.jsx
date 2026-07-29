import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../components/backbutton/BackButton";
import { HiMiniPlus } from "react-icons/hi2";
import { AiOutlineMinus } from "react-icons/ai";
import { ERPApi } from "../../../serviceLayer/interceptor";
import Swal from "sweetalert2";
import { redirect, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import { toast } from "react-toastify";

export const examDataByIdLoader = async ({ request, params }) => {
  try {
    const { id } = params;
    const response = await ERPApi.get(`exam/getExamById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return null;
  }
};

export const addQuestionsAction = async ({ request }) => {
  try {
    const data = await request.json();

    const response = await ERPApi.post("/exam/addquestionsToExam", data, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 201) {
      return redirect("/exam/examDetails")
    } else {
      return { success: false, message: "Failed to add questions." };
    }
  } catch (error) {
    console.error("Error submitting questions:", error);
    return {
      success: false,
      message: "An error occurred while submitting questions.",
    };
  }
};


const AddQuestions = () => {
  const fetcher = useFetcher();
  const examData = useLoaderData();
  const navigate = useNavigate()
  const [validationErrors, setValidationErrors] = useState({});
  const [sections, setSections] = useState([
    {
      id: 1,
      questions: [
        {
          id: 1,
          examType: "",
          question: "",
          options: [""],
          level: "",
          marks: "",
          penalty: "",
          answerText: "",
          matchPairs: [],
        },
      ],
    },
  ]);

  const addSection = () => {
    const newSection = {
      id: sections.length + 1,
      sectionName: "",
      questions: [
        {
          id: 1,
          examType: "",
          question: "",
          options: [""],
          level: "",
          marks: "",
          penalty: "",
          answerText: "",
          matchPairs: [],
        },
      ],
    };
    setSections([...sections, newSection]);
  };
  const handleChange = (sectionId, questionId, field, value) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? { ...question, [field]: value }
                : question
            ),
          }
          : section
      )
    );
  };
  const addQuestion = (sectionId) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          const maxQuestions = examData?.exam?.noOfQuestions || 0;
          let isValid = true;

          const updatedQuestions = section.questions.map((question) => {
            const errors = {};

            if (!question.examType) {
              errors.examType = "Please select a question type";
              isValid = false;
            }

            if (question.marks === "" || isNaN(question.marks) || Number(question.marks) < 0) {
              errors.marks = "Marks is required";
              isValid = false;
            }

            if (question.penalty === "" || isNaN(question.penalty) || Number(question.penalty) < 0) {
              errors.penalty = "Penalty is required";
              isValid = false;
            }

            return { ...question, errors };
          });

          if (!isValid) {
            return {
              ...section,
              questions: updatedQuestions,
            };
          }

          if (section.questions.length >= maxQuestions) {
            return { ...section, limitReached: true };
          }

          return {
            ...section,
            limitReached: false,
            questions: [
              ...updatedQuestions,
              {
                id: section.questions.length + 1,
                examType: "",
                question: "",
                options: [""],
                matchPairs: [],
                level: "",
                marks: "",
                penalty: "",
                answerText: "",
                errors: {}
              },
            ],
          };
        }
        return section;
      })
    );
  };
  const handleExamTypeChange = (sectionId, questionId, value) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? {
                  ...question,
                  examType: value,
                  question: "",
                  options: [""],
                }
                : question
            ),
          }
          : section
      )
    );
  };
  const handleQuestionChange = (sectionId, questionId, value) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? { ...question, question: value }
                : question
            ),
          }
          : section
      )
    );
  };
  const handleOptionChange = (sectionId, questionId, index, value) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? {
                  ...question,
                  options: question.options.map((opt, i) =>
                    i === index ? value : opt
                  ),
                }
                : question
            ),
          }
          : section
      )
    );
  };
  const addOption = (sectionId, questionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? { ...question, options: [...question.options, ""] }
                : question
            ),
          }
          : section
      )
    );
  };
  const removeOption = (sectionId, questionId, index) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? {
                  ...question,
                  options:
                    question.options.length > 1
                      ? question.options.filter((_, i) => i !== index)
                      : question.options,
                }
                : question
            ),
          }
          : section
      )
    );
  };
  const handleMatchPairChange = (
    sectionId,
    questionId,
    index,
    field,
    value
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? {
                  ...question,
                  matchPairs: question.matchPairs.map((pair, i) =>
                    i === index ? { ...pair, [field]: value } : pair
                  ),
                }
                : question
            ),
          }
          : section
      )
    );
  };
  const addMatchPair = (sectionId, questionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? {
                  ...question,
                  matchPairs: [
                    ...(question.matchPairs || []),
                    { left: "", right: "" },
                  ],
                }
                : question
            ),
          }
          : section
      )
    );
  };
  const removeMatchPair = (sectionId, questionId, index) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? {
                  ...question,
                  matchPairs: question.matchPairs.filter(
                    (_, i) => i !== index
                  ),
                }
                : question
            ),
          }
          : section
      )
    );
  };
  const handleCorrectOptionChange = (sectionId, questionId, selectedIndex) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? { ...question, correctOption: selectedIndex }
                : question
            ),
          }
          : section
      )
    );
  };
  const deleteQuestion = (sectionId, questionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the question!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setSections((prevSections) =>
          prevSections.map((section) =>
            section.id === sectionId
              ? {
                ...section,
                questions: section.questions.filter(
                  (question) => question.id !== questionId
                ),
              }
              : section
          )
        );
        Swal.fire("Deleted!", "The question has been removed.", "success");
      }
    });
  };
  const deleteSection = (sectionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the section and all its questions!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeSection(sectionId);

        Swal.fire("Deleted!", "The section has been removed.", "success");
      }
    });
  };
  const removeSection = (sectionId) => {
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== sectionId)
    );
  };
  useEffect(() => {
    const examId = examData?.exam?.id;
    const saved = localStorage.getItem(`savedQuestions_${examId}`);
    if (saved) {
      setSections(JSON.parse(saved));
    } else {
      setSections([
        {
          id: 1,
          questions: [
            {
              id: 1,
              examType: "",
              question: "",
              options: [""],
              level: "",
              marks: "",
              penalty: "",
              answerText: "",
              matchPairs: [],
            },
          ],
        },
      ]);
    }
  }, []);
  const saveQuestion = (sectionId, questionId) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.map((q) => {
            if (q.id === questionId) {
              return { ...q };
            }
            return q;
          }),
        };
      }
      return section;
    });
    const examId = examData?.exam?.id;
    localStorage.setItem(`savedQuestions_${examId}`, JSON.stringify(updatedSections));
    setSections(updatedSections);

    Swal.fire("Success", "Question saved successfully!", "success");
  };

  const handleSubmit = () => {
    const examTotalMarks = examData?.exam?.marks || 0;
    const expectedNoOfQuestions = examData?.exam?.noOfQuestions || 0;
    const examId = examData?.exam?.id;
    let calculatedTotalMarks = 0;
    let questionCount = 0;
    let newValidationErrors = {};

    const formattedData = {
      examId,
      questions: sections.flatMap((section) =>
        section.questions.map((question) => {
          questionCount++;

          const questionMarks = parseInt(question.marks, 10) || 0;
          calculatedTotalMarks += questionMarks;

          const formattedQuestion = {
            questionText: question.question,
            questionType: question.examType,
            sectionId: section.id,
            sectionName: section.sectionName,
            rewardMark: questionMarks,
            Penality: parseInt(question.penalty, 10) || 0,
            level: question.level,
          };
          if (!question.question || question.question.trim() === "") {
            newValidationErrors[`${section.id}_${question.id}_question`] = "Question text is required.";
          }

          if (question.examType === "Multiple Choice") {
            if (!Array.isArray(question.options) || question.options.length < 2) {
              newValidationErrors[`${section.id}_${question.id}_options`] = "At least 2 options are required.";
            }

            if (typeof question.correctOption !== "number") {
              newValidationErrors[`${section.id}_${question.id}_correctOption`] = "Please select a correct option.";
            }
          }

          if (question.examType === "Match the Following") {
            question.matchPairs.forEach((pair, index) => {
              if (!pair.left || !pair.right || !pair.correctAnswer) {
                newValidationErrors[`${section.id}_${question.id}_match_${index}`] = "All match fields are required.";
              }
            });
          }
          if (question.examType === "Multiple Choice") {
            formattedQuestion.options = question.options.map((option, index) => ({
              optionText: option,
              isCorrect: question.correctOption === index,
            }));
          } else if (
            question.examType === "Fill in the Blanks" ||
            question.examType === "Descriptive"
          ) {
            formattedQuestion.answerText = question.answerText || "";
          } else if (question.examType === "Match the Following") {
            formattedQuestion.leftOptions = question.matchPairs.map(pair => pair.left);
            formattedQuestion.rightOptions = question.matchPairs.map(pair => pair.right);
            formattedQuestion.questionPairs = question.matchPairs.map(pair => ({
              leftOptionText: pair.left,
              rightOptionText: pair.correctAnswer || "",
            }));
          }

          return formattedQuestion;
        })
      ),
    };
    sections.forEach((section) => {
      if (!section.sectionName || section.sectionName.trim() === "") {
        newValidationErrors[`${section.id}_sectionName`] = "Section name is required.";
      }
    });
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    } else {
      setValidationErrors({});
    }
    if (calculatedTotalMarks !== examTotalMarks) {
      Swal.fire({
        icon: "error",
        title: "Marks Mismatch",
        text: `Total marks of all questions (${calculatedTotalMarks}) does not match the exam's total marks (${examTotalMarks}). Please adjust marks before submitting.`,
      });
      return;
    }

    if (questionCount !== expectedNoOfQuestions) {
      Swal.fire({
        icon: "error",
        title: "Question Count Mismatch",
        text: `Total number of questions (${questionCount}) does not match the exam's expected number (${expectedNoOfQuestions}). Please add or remove questions accordingly.`,
      });
      return;
    }

    if (examId) {
      localStorage.removeItem(`savedQuestions_${examId}`);
    }

    fetcher.submit(formattedData, {
      method: "post",
      encType: "application/json",
    });
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && examData?.exam?.id) {
      const examId = examData.exam.id;
      const key = `savedQuestions_${examId}`;

      if (fetcher.data.success) {
        localStorage.removeItem(key);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: fetcher.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: fetcher.data.message,
        });
      }
    }
  }, [fetcher.state, fetcher.data, examData]);


  const examTotalMarks = examData?.exam?.marks || 0;
  const assignedMarks = sections.reduce(
    (total, section) =>
      total +
      section.questions.reduce(
        (subTotal, question) => subTotal + (parseInt(question.marks, 10) || 0),
        0
      ),
    0
  );
  const remainingMarks = examTotalMarks - assignedMarks;
  const maxQuestions = examData?.exam?.noOfQuestions || 0;
  const assignedQuestions = sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );

  const remainingQuestions = maxQuestions - assignedQuestions;
  const handleDownloadSample = () => {
    const headers = [
      "sno",
      "questionText",
      "questionType",
      "sectionName",
      "sectionId",
      "rewardMark",
      "Penality",
      "level",
      "option1",
      "option2",
      "option3",
      "option4",
      "correctAnswer",
      "leftOptions",
      "rightOptions",
      "answerpair"

    ];

    const sampleData = [
      {
        sno: 1,
        questionText: "What is the capital of France?",
        questionType: "Multiple Choice",
        sectionName: "aptitude",
        sectionId: 1,
        rewardMark: 10,
        Penality: 1,
        level: "Easy",
        option1: "a",
        option2: "b",
        option3: "c",
        option4: "d",
        correctAnswer: "a"
      },
      {
        sno: 2,
        questionText: "Match the following source \nto their animals.",
        questionType: "Match the Following",
        sectionName: "reasoning",
        sectionId: 2,
        rewardMark: 10,
        Penality: 0,
        level: "Medium",
        leftOptions: "lion,fish,kite,monkey",
        rightOptions: "water,meat,mango,air",
        answerpair: "lion:meat;fish:water;kite:air;monkey:mango"
      },
      {
        sno: 3,
        questionText: "my full name is",
        questionType: "Fill in the Blanks",
        sectionName: "aptitude",
        sectionId: 3,
        rewardMark: 10,
        Penality: 2,
        level: "Medium",
        correctAnswer: "sowmya sri"
      },
      {
        sno: 4,
        questionText: "explain few lines about\n hyderabad",
        questionType: "Descriptive",
        sectionName: "reasoning",
        sectionId: 4,
        rewardMark: 10,
        Penality: 2,
        level: "Easy",
        correctAnswer: "Hyderabad is evergreen"
      }
    ];

    const csvRows = [headers.join(",")];

    sampleData.forEach(item => {

      const row = headers.map(header => {

        const value = item[header] ?? "";

        return `"${String(value).replace(/"/g, '""')}"`; // handle quotes and empty values

      });

      csvRows.push(row.join(","));

    });

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", "sample_questions.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleUpload = async () => {
    const examId = examData?.exam?.id;
    const expectedTotalMarks = examData?.exam?.marks || 0;
    const expectedQuestionCount = examData?.exam?.noOfQuestions || 0;

    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const fileContent = e.target.result;
        const workbook = XLSX.read(fileContent, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        let calculatedTotalMarks = 0;
        let questionCount = 0;

        jsonData.forEach((question) => {
          const marks = parseInt(question.rewardMark, 10) || 0;
          calculatedTotalMarks += marks;
          questionCount += 1;
        });

        if (calculatedTotalMarks !== expectedTotalMarks) {
          Swal.fire({
            icon: 'error',
            title: 'Marks Mismatch',
            text: `Total marks in the file (${calculatedTotalMarks}) do not match the expected total marks (${expectedTotalMarks}).`,
          });
          return;
        }

        if (questionCount !== expectedQuestionCount) {
          Swal.fire({
            icon: 'error',
            title: 'Question Count Mismatch',
            text: `Number of questions in the file (${questionCount}) does not match the expected count (${expectedQuestionCount}).`,
          });
          return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('examId', examId);

        try {
          const { data, status } = await ERPApi.post(`exam/uploadQuestions?examId=${examId}`, formData);

          if (status === 200) {
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }

            Swal.fire({
              title: 'Uploaded!',
              text: 'Exam uploaded successfully!',
              icon: 'success',
            });
            navigate('/exam/examDetails');
          }
        } catch (error) {
          console.error('Error during file upload:', error);
          const errorMessage = error?.response?.data?.error || 'An unexpected error occurred.';
          toast.error(errorMessage);
        }


      } catch (error) {
        console.error('Error during file validation or upload:', error);
        const errorMessage = error?.error || 'An unexpected error occurred.';
        toast.error(errorMessage); // show error
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div>
      <BackButton heading="Questions" content="Back" />
      <div className="container-fluid min-h-screen bg-gradient-to-br from-indigo-200 to-purple-300 p-6">
        <div className="row">
          <div className="col-xl-12">
            <div className="card border-0">
              <div className="card-header">
                <div className="row d-flex justify-content-end">
                  <div className="col-md-6 text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn_primary fs-13 me-2"
                      onClick={addSection}
                    >
                      <HiMiniPlus /> Add Section
                    </button>

                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="ps-3 fw-bold">Total Marks: {examTotalMarks}</div>
                <div
                  className={`pe-3 fw-bold ${remainingMarks < 0 ? "text-danger" : "text-success"
                    }`}
                >
                  Remaining Marks: {remainingMarks}
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="ps-3 fw-bold">Total Questions: {maxQuestions}</div>
                <div
                  className={`pe-3 fw-bold ${remainingQuestions < 0 ? "text-danger" : "text-success"
                    }`}
                >
                  Remaining Questions: {remainingQuestions}
                </div>
              </div>
            </div>
            <div className="card-header">
              <div className="row d-flex justify-content-end">
                <div className="col-md-6 text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary fs-13 me-2"
                    onClick={handleDownloadSample}
                  >
                    Download Sample
                  </button>
                </div>
                <div
                  className={`dropzone ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: isDragging ? '#f0f8ff' : '#fff',
                    marginTop: "15px"
                  }}
                >
                  <p>Drag and drop a file here, or click to select one</p>
                  {selectedFile && (
                    <p className="text-success fw-bold">{selectedFile.name}</p>
                  )}
                  <button
                    className="btn btn_primary"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Select File
                  </button>
                  <button
                    className="btn btn_primary ms-4"
                    disabled={!selectedFile}
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                </div>
              </div>
            </div>
            {sections.map((section, index) => (
              <div
                className="card border-0 mt-3"
                key={section.id}
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="card-body">

                  <div className="d-flex gap-2 mb-3">
                    {/* <h5 className="" style={{ marginLeft: "10PX" }}>Section {section.id}</h5> */}
                    <input
                      type="text"
                      placeholder="Enter Section Name"
                      value={section.sectionName}
                      className="rounded outline-none border-0 p-3 shadow"
                      style={{
                        height: "30px"
                      }}
                      onChange={(e) => {
                        const updatedSections = [...sections];
                        updatedSections[index].sectionName = e.target.value;
                        setSections(updatedSections);
                        setValidationErrors((prevErrors) => {
                          const newErrors = { ...prevErrors };
                          delete newErrors[`${section.id}_sectionName`];
                          return newErrors;
                        });
                      }} />
                    {validationErrors[`${section.id}_sectionName`] && (
                      <div className="text-danger small mt-1">
                        {validationErrors[`${section.id}_sectionName`]}
                      </div>
                    )}
                  </div>
                  <span>
                  </span>
                  {section.questions.map((question, questionIndex) => (
                    <div
                      key={question.id}
                      className="mb-3 p-3 border rounded"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      <h6 className="text-primary font-weight-bold">
                        Question {question.id}
                      </h6>

                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="fw-bold">Select Exam Type</h6>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`examType_${section.id}_${question.id}`}
                              id="Multiple Choice"
                              checked={question.examType === "Multiple Choice"}
                              onChange={(e) =>
                                handleExamTypeChange(section.id, question.id, e.target.id)
                              }
                            />

                            <label
                              className="form-check-label fs-30 text-secondary"
                              htmlFor="Multiple Choice"
                            >
                              Multiple Choice
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`examType_${section.id}_${question.id}`}
                              id="Match the Following"
                              checked={
                                question.examType === "Match the Following"
                              }
                              onChange={(e) =>
                                handleExamTypeChange(
                                  section.id,
                                  question.id,
                                  e.target.id
                                )
                              }
                            />
                            <label
                              className="form-check-label fs-30 text-secondary"
                              htmlFor="Match the Following"
                            >
                              Match the following
                            </label>
                          </div>
                          {question.errors?.examType && (
                            <div className="text-danger small mt-1">{question.errors.examType}</div>
                          )}
                          {examData?.exam?.examPaperType === 'Assessment' && (
                            <>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`examType_${section.id}_${question.id}`}
                                  id="Fill in the Blanks"
                                  checked={
                                    question.examType === "Fill in the Blanks"
                                  }
                                  onChange={(e) =>
                                    handleExamTypeChange(
                                      section.id,
                                      question.id,
                                      e.target.id
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label fs-30 text-secondary"
                                  htmlFor="Fill in the Blanks"
                                >
                                  Fill in the blanks
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`examType_${section.id}_${question.id}`}
                                  id="Descriptive"
                                  checked={question.examType === "Descriptive"}
                                  onChange={(e) =>
                                    handleExamTypeChange(
                                      section.id,
                                      question.id,
                                      e.target.id
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label fs-30 text-secondary"
                                  htmlFor="Descriptive"
                                >
                                  Descriptive
                                </label>
                              </div></>
                          )}

                          {question.examType === "Multiple Choice" && (
                            <>
                              <h6 className="mt-3 fw-bold">Question</h6>
                              <div className="d-flex flex-column">
                                <input style={{ width: "100%" }}
                                  type="text"
                                  className="custom-question-field "
                                  placeholder="Enter Question"
                                  value={question.question}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      section.id,
                                      question.id,
                                      e.target.value
                                    )
                                  }
                                />
                                {validationErrors[`${section.id}_${question.id}_question`] && (
                                  <small className="text-danger">
                                    {validationErrors[`${section.id}_${question.id}_question`]}
                                  </small>
                                )}
                                <div className="col">
                                  {question.options.map((option, index) => (
                                    <div
                                      className="col-md-12 mb-2 d-flex align-items-center mt-3"
                                      key={index}
                                    >
                                      <input
                                        type="checkbox"
                                        className="me-2"
                                        checked={
                                          question.correctOption === index
                                        }
                                        onChange={() =>
                                          handleCorrectOptionChange(
                                            section.id,
                                            question.id,
                                            index
                                          )
                                        }
                                      />
                                      <input
                                        type="text"
                                        className="form-control me-2"
                                        value={option}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            section.id,
                                            question.id,
                                            index,
                                            e.target.value
                                          )
                                        }
                                        placeholder={`Option ${index + 1}`}
                                      />
                                      {question.options.length > 1 && (
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-danger"
                                          onClick={() =>
                                            removeOption(
                                              section.id,
                                              question.id,
                                              index
                                            )
                                          }
                                        >
                                          <AiOutlineMinus />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {validationErrors[`${section.id}_${question.id}_options`] && (
                                  <small className="text-danger">
                                    {validationErrors[`${section.id}_${question.id}_options`]}
                                  </small>
                                )}
                                {validationErrors[`${section.id}_${question.id}_correctOption`] && (
                                  <small className="text-danger">
                                    {validationErrors[`${section.id}_${question.id}_correctOption`]}
                                  </small>
                                )}

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary mt-2 add-custom-options-btn "
                                  onClick={() =>
                                    addOption(section.id, question.id)
                                  }
                                >
                                  <HiMiniPlus /> Add Option
                                </button>
                              </div>
                            </>
                          )}
                          {question.examType === "Match the Following" && (
                            <div>
                              <div className="mb-3">
                                <label className="form-label fw-bold">Question</label>
                                <div className="d-flex flex-column">
                                  <input
                                    style={{ width: "100%" }}
                                    type="text"
                                    className="custom-question-field mb-2"
                                    value={question.question}
                                    onChange={(e) =>
                                      handleQuestionChange(section.id, question.id, e.target.value)
                                    }
                                    placeholder="Enter Question"
                                  />
                                  {validationErrors[`${section.id}_${question.id}_question`] && (
                                    <small className="text-danger">
                                      {validationErrors[`${section.id}_${question.id}_question`]}
                                    </small>
                                  )}
                                </div>
                              </div>

                              {question.matchPairs && (
                                <>
                                  <div className="row mb-2">
                                    <div className="col-md-4">
                                      <label className="form-label">Column A</label>
                                    </div>
                                    <div className="col-md-4">
                                      <label className="form-label">Column B</label>
                                    </div>
                                    <div className="col-md-4">
                                      <label className="form-label">Correct Answer</label>
                                    </div>
                                    <div className="col-md-2">
                                      {/* Space for the remove button */}
                                    </div>
                                  </div>
                                  {question.matchPairs.map((pair, index) => (
                                    <div className="row mb-3 mt-1" key={index}>
                                      <div className="col-md-4">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Column A"
                                          value={pair.left}
                                          onChange={(e) =>
                                            handleMatchPairChange(
                                              section.id,
                                              question.id,
                                              index,
                                              "left",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <div className="col-md-4">
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Column B"
                                          value={pair.right}
                                          onChange={(e) =>
                                            handleMatchPairChange(
                                              section.id,
                                              question.id,
                                              index,
                                              "right",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      <div className="col-md-4 d-flex gap-2">
                                        <div>
                                          <select
                                            className="form-select"
                                            value={pair.correctAnswer || ""}
                                            onChange={(e) =>
                                              handleMatchPairChange(
                                                section.id,
                                                question.id,
                                                index,
                                                "correctAnswer",
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">Select Answer</option>
                                            {question.matchPairs.map((option, optionIndex) => (
                                              <option key={optionIndex} value={option.right}>
                                                {option.right}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        <div className="col-md-2 d-flex align-items-center">
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                              removeMatchPair(section.id, question.id, index)
                                            }
                                          >
                                            <AiOutlineMinus />
                                          </button>
                                        </div>
                                      </div>

                                      {validationErrors[`${section.id}_${question.id}_match_${index}`] && (
                                        <small className="text-danger mt-1">
                                          {
                                            validationErrors[
                                            `${section.id}_${question.id}_match_${index}`
                                            ]
                                          }
                                        </small>
                                      )}
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary mt-2"
                                    onClick={() => addMatchPair(section.id, question.id)}
                                  >
                                    <HiMiniPlus /> Add Options
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                          {question.examType === "Fill in the Blanks" && (
                            <div>
                              <div className="mb-3">
                                <label className="form-label">
                                  Fill in the Blank
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter question with a blank space"
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      section.id,
                                      question.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <div className="mb-3 mt-2">
                                  <label className="form-label">Answer</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter the correct answer"
                                    value={question.answerText || ""}
                                    onChange={(e) =>
                                      handleChange(
                                        section.id,
                                        question.id,
                                        "answerText",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          {question.examType === "Descriptive" && (
                            <div>
                              <div className="mb-3">
                                <label className="form-label">
                                  Descriptive
                                </label>
                                <textarea
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter question with a blank space"
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      section.id,
                                      question.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <div className="mb-3 mt-2">
                                  <label className="form-label">Answer</label>
                                  <textarea
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter the correct answer"
                                    value={question.answerText || ""}
                                    onChange={(e) =>
                                      handleChange(
                                        section.id,
                                        question.id,
                                        "answerText",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-md-6"   >
                          <h6 className="fw-bold">Marks</h6>
                          <input
                            key={questionIndex}
                            type="number"
                            className="custom-question-field  mb-2"
                            placeholder="Enter Marks"
                            value={question.marks}
                            onChange={(e) =>
                              handleChange(
                                section.id,
                                question.id,
                                "marks",
                                e.target.value
                              )
                            }
                            onWheel={(e) => {
                              e.preventDefault();
                            }}
                          />
                          {question.errors?.marks && (
                            <div className="text-danger small mb-2">{question.errors.marks}</div>
                          )}
                          <h6 className="fw-bold">Penalty</h6>
                          <input
                            type="number"
                            className="custom-question-field "
                            placeholder="Enter Penalty"
                            value={question.penalty}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              const marks = parseInt(question.marks, 10); // Get the marks for this question

                              if (!isNaN(value) && value >= 0 && (isNaN(marks) || value <= marks)) {
                                handleChange(
                                  section.id,
                                  question.id,
                                  "penalty",
                                  value
                                );
                                // Clear any penalty error when valid input is entered
                                // Assuming you have a way to manage question-specific errors
                                if (question.errors && question.errors.penalty) {
                                  // You'll need to update your state to clear this error
                                  // For example, using a setQuestions or similar function
                                  // setQuestions(prevQuestions => prevQuestions.map(q =>
                                  //   q.id === question.id ? { ...q, errors: { ...q.errors, penalty: null } } : q
                                  // ));
                                  console.error("Clear penalty error"); // Replace with your actual state update
                                }
                              } else if (e.target.value === "") {
                                handleChange(
                                  section.id,
                                  question.id,
                                  "penalty",
                                  ""
                                );
                                if (question.errors && question.errors.penalty) {
                                }
                              } else if (!isNaN(value) && value > marks) {
                                console.error("Penalty greater than marks error");
                              } else if (!isNaN(value) && value < 0) {
                                console.error("Negative penalty error");
                              }
                            }}
                          />
                          {question.errors?.penalty && (
                            <div className="text-danger small">{question.errors.penalty}</div>
                          )}
                          <div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end gap-2 mt-2 mx-2">
                        <button
                          type="button"
                          className="btn btn-sm btn_primary"
                          onClick={() => saveQuestion(section.id, question.id)}
                        >
                          Save
                        </button>

                        {section.questions.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteQuestion(section.id, question.id)}
                          >
                            Delete Question
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary mt-2"
                    onClick={() => addQuestion(section.id)}
                  >
                    <HiMiniPlus /> Add Question
                  </button>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger mt-2 ms-3"
                      onClick={() => deleteSection(section.id)}
                    >
                      Delete Section
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="d-flex  justify-content-end pe-2">
        <button
          type="button"
          className="mb-3 btn btn_primary"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddQuestions;
