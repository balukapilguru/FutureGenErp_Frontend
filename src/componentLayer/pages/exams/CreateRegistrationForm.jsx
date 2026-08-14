import React, { useState } from "react";
import { redirect, useFetcher, useLoaderData, useParams } from "react-router-dom";
import BackButton from "../../components/backbutton/BackButton";
import { toast } from "react-toastify";
import { ERPApi } from "../../../serviceLayer/interceptor";

const fieldTypes = {
    "Date of Birth": "date",
    "WhatsApp Number": "text",
    "Highest Qualification": "select",
    "City": "text",
    "Stream": "text",
    "College Name": "text",
    "Passout Year": "number",
    "12th Percentage": "number",
    "10th Percentage": "number",
    "Education Gap": "number",
    "Working Professional": "select",
    "Experience": "number",
    "Company Name": "text"
};

const selectOptions = {
    "Gender": ["Select", "Male", "Female", "Other"],
    "Working Professional": ["Select", "Yes", "No"],
    "Are you a Teks Student?": ["Select", "Yes", "No"],
    "Highest Qualification": ["Select", "High School", "Bachelor's", "Master's", "PhD"], // Added based on API data
};

const defaultFields = [
    { label: "Registration Form Title", value: "", type: "text" },
    { label: "Description", value: "", type: "text" },
    { label: "Form Start Date", value: "", type: "date" },
    { label: "Form Closing Date", value: "", type: "date" },
    { label: "Exam Date", value: "", type: "date" },
    { label: "Exam End Date", value: "", type: "date" },
    { label: "Exam Time", value: "", type: "time" },
    { label: "Duration (in minutes)", value: "", type: "number" },
    { label: "Name", value: "", type: "text" },
    { label: "Email", value: "", type: "email" },
    { label: "Phone Number", value: "", type: "text" },
    // { label: "Voucher Code", value: "", type: "text" },
];

const convertTo24HourFormat = (time12h) => {
    if (!time12h.includes("AM") && !time12h.includes("PM")) return time12h;
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") hours = "00";
    if (modifier.toLowerCase() === "pm") hours = String(parseInt(hours, 10) + 12);

    return `${hours.padStart(2, '0')}:${minutes}`;
};

export const addRegistrationFormAction = async ({ request, params }) => {
    try {
        const data = await request.json();
        const { id } = params;
        const apiUrl = id ? `registrationform/edit/${id}` : `/registrationform/create`;
        const method = id ? "patch" : "post";
        await toast.promise(
            ERPApi[method](apiUrl, data, {
                headers: { "Content-Type": "application/json" },
            }),
            {
                pending: id ? "Updating registration form..." : "Creating registration form...",
                success: id ? "Registration form updated successfully!" : "Registration form created successfully!",
                error: id ? "Failed to update registration form." : "Failed to create registration form.",
            }
        );
        return redirect("/exam/registrationform");
    } catch (error) {
        console.error(error);
        return null;
    }
};


export const registerFormGetLoader = async ({ request, params }) => {
    const { id } = params;
    try {
        let formDataResponse = null;
        if (id) {
            formDataResponse = await ERPApi.get(`/registrationform/getbyId/${id}`);
        }
        const allQuestionsResponse = await ERPApi.get(`/registrationform/getallquestions`);
        return {
            registrationFormData: formDataResponse ? formDataResponse.data : null,
            allQuestionsData: allQuestionsResponse.data.data,
        };
    } catch (error) {
        console.error("Error fetching registration form data or all questions:", error);
        return { error: error.message || "An error occurred" };
    }
};
const CreateRegistrationForm = () => {
    const loaderData = useLoaderData();
    const { registrationFormData, allQuestionsData } = loaderData || {};
    const fetcher = useFetcher();
    const { id } = useParams();
    const isEditMode = !!registrationFormData;
    const [fields, setFields] = useState(isEditMode ? registrationFormData?.fieldsList || defaultFields : defaultFields);

    const handleDropdownChange = (e) => {
        const newFieldTitle = e.target.value;
        if (newFieldTitle && !fields.find((field) => field.label === newFieldTitle)) {
            const selectedQuestion = allQuestionsData.find(q => q.title === newFieldTitle);
            if (selectedQuestion) {
                setFields([...fields, {
                    label: newFieldTitle,
                    value: "",
                    type: selectedQuestion.type,
                    options: selectedQuestion.options || [],
                    manderatory: selectedQuestion.manderatory === "yes",
                    description: selectedQuestion.description,
                    filtered: selectedQuestion.filtered,
                    isRegistrationform: selectedQuestion.isRegistrationform === 1,
                }]);
            } else {
                setFields([...fields, { label: newFieldTitle, value: "", type: fieldTypes[newFieldTitle] || "text" }]);
            }
        }
    };

    const handleInputChange = (label, e) => {
        const newValue = e.target.value;
        setFields(fields.map((field) => field.label === label ? { ...field, value: newValue } : field));
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[label];
            return newErrors;
        });
    };
    const [errors, setErrors] = useState({});
    const examEndDateValue = fields.find(f => f.label === "Exam End Date")?.value;
    const examTimeValue = fields.find(f => f.label === "Exam Time")?.value;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        const requiredFields = [
            "Registration Form Title",
            "Description",
            "Form Start Date",
            "Form Closing Date",
            "Exam Date",
            "Duration (in minutes)",
        ];
        const fieldMap = {};
        fields.forEach(field => {
            fieldMap[field.label] = field.value;
        });

        requiredFields.forEach(label => {
            if (!fieldMap[label] || fieldMap[label].toString().trim() === "") {
                newErrors[label] = `${label} is required`;
            }
        });

        const duration = parseInt(fieldMap["Duration (in minutes)"], 10);
        if (!newErrors["Duration (in minutes)"] && (isNaN(duration) || duration <= 0)) {
            newErrors["Duration (in minutes)"] = "Duration must be a positive number";
        }

        const startDate = new Date(fieldMap["Form Start Date"]);
        const closingDate = new Date(fieldMap["Form Closing Date"]);
        const examDate = new Date(fieldMap["Exam Date"]);
        const examEndDate = new Date(fieldMap["Exam End Date"])
        if (!newErrors["Form Start Date"] && !newErrors["Form Closing Date"] && closingDate < startDate) {
            newErrors["Form Closing Date"] = "Form Closing Date must be same or after Form Start Date";
        }
        if (!newErrors["Exam Date"] && !newErrors["Exam End Date"] && examDate > examEndDate) {
            newErrors["Exam End Date"] = "Exam End Date must be same or after Exam Date";
        }
        if (!newErrors["Exam Date"] && !newErrors["Form Start Date"] && examDate < startDate) {
            newErrors["Exam Date"] = "Exam Date must be same or after Form Start Date";
        }
        if (
            (!fieldMap["Exam Time"] || fieldMap["Exam Time"].toString().trim() === "") &&
            (!fieldMap["Exam End Date"] || fieldMap["Exam End Date"].toString().trim() === "")
        ) {
            newErrors["Exam Time"] = "Either Exam Time or Exam End Date is required";
            newErrors["Exam End Date"] = "Either Exam Time or Exam End Date is required";
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        const formDataToSend = {
            fieldsList: fields.map((field) => ({
                label: field.label,
                type: field.type,
                value: field.value,
                options: field.options,
                manderatory: field.manderatory,
                description: field.description,
                filtered: field.filtered,
                isRegistrationform: field.isRegistrationform,
            })),
            customQuestionIds: fields
                .filter(field => allQuestionsData && allQuestionsData.some(q => q.title === field.label))
                .map(field => allQuestionsData.find(q => q.title === field.label)?.id)
                .filter(id => id !== undefined),
        };

        const fieldMappings = {
            "Name": "name",
            "Email": "email",
            "Registration Form Title": "registrationformname",
            "Description": "description",
            "Exam Date": "examDate",
            "Exam Time": "examTime",
            "Duration (in minutes)": "time",
            "Form Start Date": "activeFrom",
            "Form Closing Date": "activeTo",
            "Exam End Date": "examEndDate",
            // "Voucher Code": "voucherCode",
        };

        fields.forEach((field) => {
            let key = fieldMappings[field.label] || field.label.toLowerCase().replace(/\s+/g, "");
            let value = field.value;

            if (key === "examTime") {
                formDataToSend[key] = value ? convertTo24HourFormat(value) : null;
            } else if (key === "examEndDate") {
                formDataToSend[key] = value ? value : null;
            } else {
                formDataToSend[key] = value;
            }
        });

        const method = id ? "patch" : "post";
        fetcher.submit(formDataToSend, {
            method: method,
            encType: "application/json",
        });
    };
    return (
        <div>
            <BackButton heading="Registration Form" content="Back" />
            <div className="p-4">
                <div className="card shadow ">
                    <div className="card-header bg_primary text-white">
                        <h3 className="mb-0">Registration Form</h3>
                    </div>
                    <div className="card-body">
                        <form className="row" onSubmit={handleSubmit}>
                            {fields.map((field, index) => {
                                const isEditable = [
                                    "Description",
                                    "Registration Form Title",
                                    "Exam Date",
                                    "Exam Time",
                                    "Exam End Date",
                                    "Duration (in minutes)",
                                    "Form Start Date",
                                    "Form Closing Date",
                                    // "Voucher Code",
                                ].includes(field.label);

                                let disabled = !isEditable;

                                if (field.label === "Exam Time" && examEndDateValue) {
                                    disabled = true;
                                }
                                if (field.label === "Exam End Date" && examTimeValue) {
                                    disabled = true;
                                }


                                return (
                                    <div className="mb-3 col-lg-6 col-md-12 col-sm-12" key={index}>
                                        <label className="form-label fs-s fw-medium text_color">{field.label}{field.label == "Voucher Code" ? null : <span className="text-danger">*</span>}</label>

                                        {field.type === "select" && selectOptions[field.label] ? (
                                            <select
                                                className={`form-select ${errors[field.label] ? "is-invalid" : ""}`}
                                                value={field.value}
                                                onChange={(e) => handleInputChange(field.label, e)}
                                                disabled={disabled}
                                            >
                                                {selectOptions[field.label].map((option, idx) => (
                                                    <option key={idx} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={field.type}
                                                className={`form-control custom-input ${errors[field.label] ? "is-invalid" : ""}`}
                                                value={field.value}
                                                onChange={(e) => handleInputChange(field.label, e)}
                                                disabled={disabled}
                                                onWheel={field.type === "number" ? (e) => e.target.blur() : undefined}
                                            />
                                        )}

                                        {errors[field.label] && (
                                            <div className="invalid-feedback d-block text-danger m-0 fs-xs">{errors[field.label]}</div>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="mb-4">
                                        <label className="form-label fs-s fw-medium text_color">Add More Fields</label>
                                        <select
                                            className="form-select fs-s fw-medium text_color"
                                            value=""
                                            onChange={handleDropdownChange}
                                        >
                                            <option value="">Select a field...</option>
                                            {allQuestionsData && allQuestionsData.map((question, idx) => (
                                                <option
                                                    className=" fs-s fw-medium text_color"
                                                    key={question.id}
                                                    value={question.title}
                                                >
                                                    {question.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-end mt-2">
                                <div className="col-lg-2">
                                    <button type="submit" className="btn btn_primary w-100">{id ? "Update" : "Submit"}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRegistrationForm;