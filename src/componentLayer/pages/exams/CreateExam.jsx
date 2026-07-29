import React, { useState } from "react";
import BackButton from "../../components/backbutton/BackButton";
import { redirect, useFetcher, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { ERPApi } from "../../../serviceLayer/interceptor";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

export const addExamAction = async ({ request, params }) => {
    try {
        const data = await request.json();
        const { id } = params;
        const apiUrl = id ? `/exam/update/${id}` : `/exam/create`;
        const method = id ? "patch" : "post";

        const response = await toast.promise(
            ERPApi[method](apiUrl, data, {
                headers: { "Content-Type": "application/json" },
            }),
            {
                pending: id ? "Updating exam..." : "Creating exam...",
                success: id ? "Exam updated successfully!" : "Exam created successfully!",
                error: id ? "Failed to update exam." : "Failed to create exam.",
            }
        );
        return redirect("/exam/examDetails");
    } catch (error) {
        return null;
    }
};

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

const CreateExam = () => {
    const examData = useLoaderData();
    const { id } = useParams();
    const fetcher = useFetcher();

    const [examDetails, setExamDetails] = useState(() => {
        if (id && examData?.exam) {
            return {
                isTeksExam: examData.exam.isTeksExam !== null && examData.exam.isTeksExam !== undefined
                    ? String(examData.exam.isTeksExam)
                    : "",
                examPaperType: examData.exam.examPaperType || "",
                examType: examData.exam.examType || "",
                time: examData.exam.time || "",
                attempts: examData.exam.attempts || "",
                noOfQuestions: examData.exam.noOfQuestions || "",
                selectionCriteriaRules: examData.exam.scoreeligibilityrules || [],
                description: examData.exam.description || "",
                passingPercentage: examData.exam.passingPercentage || "",
                marks: examData.exam.marks || "",
                examDate: examData.exam.examDate || "",
            };
        }
        return {
            isTeksExam: "",
            examPaperType: "",
            examType: "",
            time: "",
            attempts: "",
            noOfQuestions: "",
            selectionCriteriaRules: [],
            description: "",
            passingPercentage: "",
            marks: "",
            examDate: "",
        };
    });
    const [criteria, setCriteria] = useState({ min: "", max: "", note: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
        setExamDetails({ ...examDetails, [name]: value });
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };
    const handleCriteriaChange = (e) => {
        const { name, value } = e.target;
        setCriteria({ ...criteria, [name]: value });
    };
    const addCriteria = () => {
        const min = Number(criteria.min);
        const max = Number(criteria.max);
        if (!criteria.min || !criteria.max) {
            setErrors({ ...errors, min: "Min and Max percent are required" });
            return;
        }
        if (min < 0 || max < 0) {
            setErrors({ ...errors, min: "Negative values are not allowed" });
            return;
        }
        if (min > 100 || max > 100) {
            setErrors({ ...errors, min: "Min and Max percent must not exceed 100" });
            return;
        }
        if (min >= max) {
            setErrors({ ...errors, min: "Min should be less than Max" });
            return;
        }
        const isOverlap = examDetails.selectionCriteriaRules.some((rule) => {
            const rMin = Number(rule.min);
            const rMax = Number(rule.max);
            return (
                min === rMin ||
                max === rMax ||
                min === rMax ||
                max === rMin ||
                (min > rMin && min < rMax) ||
                (max > rMin && max < rMax) ||
                (min < rMin && max > rMax)
            );
        });
        if (isOverlap) {
            setErrors({ ...errors, min: "Range overlap" });
            return;
        }
        setExamDetails({
            ...examDetails,
            selectionCriteriaRules: [...examDetails.selectionCriteriaRules, criteria],
        });
        setCriteria({ min: "", max: "", note: "" });
        setErrors({ ...errors, min: "" });
    };
    const deleteCriteria = (index) => {
        setExamDetails((prevDetails) => ({
            ...prevDetails,
            selectionCriteriaRules: prevDetails.selectionCriteriaRules.filter((_, i) => i !== index),
        }));
    };
    const validateForm = () => {
        const newErrors = {};
        if (!examDetails.isTeksExam) {
            newErrors.isTeksExam = "Exam Mode is required";
        }
        if (!id) {
            if (!examDetails.examPaperType.trim()) {
                newErrors.examPaperType = "Exam Type is required";
            }
        }
        if (!examDetails.examType.trim()) {
            newErrors.examType = "Exam Type is required";
        } else if (examDetails.examType.trim().length < 3) {
            newErrors.examType = "Exam Type must be at least 3 characters long";
        }
        if (!examDetails.attempts || examDetails.attempts <= 0) {
            newErrors.attempts = "Number of Attempts is required";
        } else if (examDetails.examPaperType === "Assessment" && parseInt(examDetails.attempts) > 1) {
            newErrors.attempts = "For Assessments, the number of attempts should not be more than 1";
        }

        if (!examDetails.description.trim()) {
            newErrors.description = "Description is required";
        } else if (examDetails.description.trim().length < 3) {
            newErrors.description = "Exam Type must be at least 3 characters long";
        }

        if (!id) {
            if (!examDetails.noOfQuestions || examDetails.noOfQuestions <= 0) {
                newErrors.noOfQuestions = "Number of questions is required";
            }

            if (!examDetails.marks || examDetails.marks <= 0) {
                newErrors.marks = "Marks is required";
            }
        }

        if (!examDetails.passingPercentage || examDetails.passingPercentage <= 0) {
            newErrors.passingPercentage = "Passing Percentage is required";
        }
        const covered = new Array(101).fill(false);
        for (let rule of examDetails.selectionCriteriaRules) {
            const min = parseInt(rule.min);
            const max = parseInt(rule.max);
            if (!isNaN(min) && !isNaN(max)) {
                for (let i = min; i <= max; i++) {
                    if (i >= 0 && i <= 100) {
                        covered[i] = true;
                    }
                }
            }
        }

        const missed = covered
            .map((isCovered, index) => (isCovered ? null : index))
            .filter((val) => val !== null);

        if (missed.length > 0) {
            toast.error("Your selection criteria must cover all values from 0 to 100.");
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && missed.length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const payload = {
            isTeksExam: examDetails.isTeksExam,
            examPaperType: examDetails.examPaperType,
            examType: examDetails.examType,
            attempts: parseInt(examDetails.attempts),
            noOfQuestions: parseInt(examDetails.noOfQuestions),
            marks: parseInt(examDetails.marks),
            passingPercentage: parseInt(examDetails.passingPercentage),
            selectionCriteriaRules: examDetails.selectionCriteriaRules,
            description: examDetails.description,
            time: examDetails.time ? parseInt(examDetails.time) : null,
        };
        setLoading(true)
        const method = id ? 'patch' : 'post';
        fetcher.submit(JSON.stringify(payload), {
            method: method,
            encType: "application/json",
        });

    };

    return (
        <div>
            <BackButton heading={id ? "Update Exam" : "Create Exam"} content="Back" />
            <div className="container-fluid">
                <div className="card border-0">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row d-flex">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label className="form-label fs-s fw-medium black_300">
                                            Select Exam<span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={
                                                errors && errors.isTeksExam
                                                    ? "form-control form-select fs-s custom-select placeholder-gray  bg-form   error-input "
                                                    : "form-control form-select fs-s bg-form  custom-select placeholder-gray  select form-select text-capitalize"
                                            }
                                            placeholder=""
                                            aria-label=""
                                            name="isTeksExam"
                                            value={examDetails.isTeksExam}
                                            onChange={handleChange}
                                            disabled={id ? true : false}
                                            style={{ cursor: id ? 'not-allowed' : 'pointer' }}
                                        >
                                            <option value="" disabled selected className="text-muted">
                                                {" "}
                                                Select Exam Mode{" "}
                                            </option>
                                            <option value="1">Internal Exam</option>
                                            <option value="0">External Exam</option>
                                        </select>
                                        <div style={{ height: "8px" }}>
                                            {errors && errors.isTeksExam && (
                                                <p className="text-danger m-0 fs-xs">
                                                    {errors.isTeksExam}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-s fw-medium text_color">
                                                Exam Type<span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={
                                                    errors && errors.examPaperType
                                                        ? "form-control form-select fs-s custom-select placeholder-gray  bg-form   error-input "
                                                        : "form-control form-select fs-s bg-form  custom-select placeholder-gray  select form-select text-capitalize"
                                                }
                                                name="examPaperType"
                                                value={examDetails.examPaperType}
                                                onChange={handleChange}
                                                disabled={id ? true : false}
                                                style={{ cursor: id ? 'not-allowed' : 'pointer' }}
                                            >
                                                <option className="form-select fs-s bg-form text_color input_bg_color" value="">Select Exam Type</option>
                                                <option value="Assessment">Assessment</option>
                                                <option value="Assignment">Assignment</option>
                                            </select>
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.examPaperType && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.examPaperType}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-s fw-medium text_color">
                                                Exam Title<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={
                                                    errors && errors.examType
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                        : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                }
                                                name="examType"
                                                placeholder="Enter Exam Type"
                                                value={examDetails.examType}
                                                onChange={handleChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.examType && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.examType}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {(examDetails.isTeksExam === "1" || (id && examData?.exam?.isTeksExam === 1)) && (
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label fs-s fw-medium text_color">
                                                    Duration (in minutes)
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control fs-s bg-form text_color input_bg_color"
                                                    name="time"
                                                    placeholder="Enter Exam Duration"
                                                    value={examDetails.time}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-s fw-medium text_color">
                                                Number of Attempts<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className={
                                                    errors && errors.attempts
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                        : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                }
                                                name="attempts"
                                                placeholder="Enter No. of attempts"
                                                min="1"
                                                value={examDetails.attempts}
                                                onChange={handleChange}
                                                disabled={id ? true : false}
                                                style={{ cursor: id ? 'not-allowed' : 'pointer' }}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.attempts && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.attempts}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-s fw-medium text_color">
                                                Description<span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                type="text"
                                                className={
                                                    errors && errors.description
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                        : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                }
                                                name="description"
                                                placeholder="Enter No. of description"
                                                min="1"
                                                value={examDetails.description}
                                                onChange={handleChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.description && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-s fw-medium text_color">
                                                Number of Questions<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className={
                                                    errors && errors.noOfQuestions
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                        : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                }
                                                name="noOfQuestions"
                                                placeholder="Enter No. of Questions"
                                                min="1"
                                                value={examDetails.noOfQuestions}
                                                onChange={handleChange}
                                                disabled={id ? true : false}
                                                style={{ cursor: id ? 'not-allowed' : 'pointer' }}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.noOfQuestions && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.noOfQuestions}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-s fw-medium text_color">
                                                Marks<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className={
                                                    errors && errors.marks
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                        : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                }
                                                name="marks"
                                                placeholder="Enter Marks"
                                                min="1"
                                                value={examDetails.marks}
                                                onChange={handleChange}
                                                disabled={id ? true : false}
                                                style={{ cursor: id ? 'not-allowed' : 'pointer' }}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.marks && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.marks}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-s fw-medium text_color">
                                                Passing Percentage<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className={
                                                    errors && errors.passingPercentage
                                                        ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                        : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                }
                                                name="passingPercentage"
                                                placeholder="Enter Passing Percent"
                                                min="1"
                                                value={examDetails.passingPercentage}
                                                onChange={handleChange}
                                            />
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.passingPercentage && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.passingPercentage}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label className="form-label fs-s fw-medium text_color">
                                                Min % - Max %<span className="text-danger">*</span>
                                            </label>
                                            <div className="d-flex">
                                                <input
                                                    type="number"
                                                    className={
                                                        errors && errors.min
                                                            ? "form-control fs-s bg-form text_color input_bg_color error-input "
                                                            : "form-control fs-s bg-form text_color input_bg_color text-capitalize"
                                                    }
                                                    name="min"
                                                    placeholder="Min Percent"
                                                    value={criteria.min}
                                                    onChange={handleCriteriaChange}
                                                />

                                                <input
                                                    type="number"
                                                    className="form-control fs-s bg-form text_color input_bg_color ms-2"
                                                    name="max"
                                                    placeholder="Max Percent"
                                                    value={criteria.max}
                                                    onChange={handleCriteriaChange}
                                                />

                                            </div>
                                            <div style={{ height: "8px" }}>
                                                {errors && errors.min && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.min}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 d-flex">
                                        <div className="mb-3 flex-grow-1 me-2">
                                            <label className="form-label fs-s fw-medium text_color">
                                                Custom Message
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control fs-s bg-form text_color input_bg_color"
                                                name="note"
                                                placeholder="Enter Message"
                                                value={criteria.note}
                                                onChange={handleCriteriaChange}
                                            />
                                        </div>
                                        <div className="mb-3 d-flex align-items-end">
                                            <button type="button" className="btn btn-sm btn_primary" onClick={addCriteria}>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-start mt-4">
                                    <div className="col-md-6">
                                        {examDetails.selectionCriteriaRules.length > 0 && (
                                            <div className="rounded shadow-sm" style={{ background: "#f8f9fa" }}>
                                                {examDetails.selectionCriteriaRules.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="d-flex justify-content-between align-items-md-start align-items-end mb-3 p-1 rounded" >
                                                        <div className="pe-2 d-flex align-items-center gap-3 flex-wrap">
                                                            <div className="fw-bold text-dark">{index + 1}</div>

                                                            <div className="text-muted small">
                                                                Min: <span className="fw-semibold">{item.min}</span>, Max:{" "}
                                                                <span className="fw-semibold">{item.max}</span>
                                                            </div>

                                                            <div className="fst-italic text-muted small">
                                                                Message: {item.note || "—"}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex sm-items-end">

                                                            <MdDelete className="text-danger" onClick={() => deleteCriteria(index)} size={18} />
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card-body d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        name="examDetails"
                                        className="btn btn-sm btn-md btn_primary fs-13"
                                        disabled={loading}
                                    >
                                        {id ? "Update" : "Create"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExam;
