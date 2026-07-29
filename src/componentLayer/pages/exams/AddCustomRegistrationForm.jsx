import React, { useState, useRef, useEffect, useCallback } from "react"
import { useFetcher, useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import { toast } from "react-toastify";
import { json } from "react-router-dom";
import { debounce } from "../../../utils/Utils";
import BackButton from "../../components/backbutton/BackButton";
import { ERPApi } from "../../../serviceLayer/interceptor";
import PaginationInfo from "../../../utils/PaginationInfo";
import Pagination from "../../../utils/Pagination";

export const addCustomRegistrationFormLoader = async ({ request, params }) => {
    try {
        const customQuestions = await Promise.all([
            ERPApi.get(`/registrationform/getallquestions`)
        ]);
        return customQuestions;
    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
};

export const addCustomQuestionsAction = async ({ request }) => {
    try {
        const updatedData = await request.json();
        const response = await ERPApi.post(`/registrationform/extraquestions`, updatedData);
        if (response.status === 201) {
            toast.success("Custom field created successfully");
            return null;
        } else {
            return json({ error: "Error submitting Input" }, { status: 500 });
        }
    } catch (error) {
        console.error("API error:", error.status);
        if (error.status === 409) {
            toast.error("Field Name  already exists")
        }
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
};

function AddCustomRegistrationForm() {
    const [formData, setFormData] = useState({
        fieldName: "",
        fieldDescription: "",
        fieldType: "",
        isMandatory: "",
        isRegistrationform: 1
    });
    const [errors, setErrors] = useState({});
    const [activeDialogType, setActiveDialogType] = useState("new");
    const [option, setOption] = useState("");
    const fetcher = useFetcher();
    const newErrors = {};
    const data = useLoaderData()[0]?.data;
    const submit = useSubmit();
    const [Qparams, setQParams] = useState({
        page: 1,
        pageSize: 10,

    });

    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const validateForm = () => {
        if (!formData.fieldName?.trim()) {
            newErrors.fieldName = "Field Name is required";
        }

        if (!formData.fieldDescription?.trim()) {
            newErrors.fieldDescription = "Field Description is required";
        }

        if (!formData.fieldType) {
            newErrors.fieldType = "Please select a Field Type";
        }

        if (!formData.isMandatory) {
            newErrors.isMandatory = "Please select YES or NO";
        }

        if (
            (formData.fieldType === "select" ||
                formData.fieldType === "multiselect") &&
            (!formData.options || formData.options.length === 0)
        ) {
            newErrors.options = "Please add at least one option";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        const updatedField = {
            title: formData.fieldName,
            type: formData.fieldType,
            description: formData.fieldDescription,
            manderatory: formData.isMandatory,
            options: formData?.options,
            isRegistrationform: formData?.isRegistrationform
        };
        fetcher.submit(updatedField, {
            method: activeDialogType === "new" ? "POST" : "PATCH",
            encType: "application/json",
        }
        );
        setSubmissionSuccess(true);
    };
    const validateField = (id, value) => {
        let errorMsg = "";

        if (id === "fieldName" && !value.trim()) {
            errorMsg = "Field Name is required";
        }
        if (id === "fieldDescription" && !value.trim()) {
            errorMsg = "Field Description is required";
        }
        if (id === "fieldType" && !value) {
            errorMsg = "Please select a Field Type";
        }

        if (
            (formData.fieldType === "select" ||
                formData.fieldType === "multiselect") &&
            (!formData.options || formData.options.length === 0)
        ) {
        }
        setErrors((prev) => ({ ...prev, [id]: errorMsg }));
    };
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
        validateField(id, value);
    };
    const handleTypeSelection = (e) => {
        if (e.target.id === "fieldType") {
            const selectedValue = e.target.value;
            let errorMsg = "";

            setFormData((prev) => ({
                ...prev,
                fieldType: selectedValue,
                fieldTag: getFieldTag(selectedValue),
            }));

            if (selectedValue === "multiselect" || selectedValue === "select") {
                setFormData((prev) => ({
                    ...prev,
                    options: null,
                }));
            }
            if (!selectedValue) {
                errorMsg = "Please select a Field Type";
            }

            setErrors((prev) => ({ ...prev, fieldType: errorMsg }));
        } else {
            const selectedValue = e.target.value;
            let errorMsg = "";

            setFormData((prev) => ({
                ...prev,
                isMandatory: selectedValue,
            }));

            if (!selectedValue) {
                errorMsg = "Please select a Field Type";
            }

            setErrors((prev) => ({ ...prev, isMandatory: errorMsg }));
        }
    };

    const getFieldTag = (value) => {
        const inputTypes = [
            "text",
            "email",
            "password",
            "number",
            "checkbox",
            "tel",
            "radio",
            "file",
            "date",
            "time",
            "range",
        ];
        if (inputTypes.includes(value)) return "input";
        if (value === "textarea") return "textarea";
        if (value === "select" || value === "multiselect") return "select";
        return null;
    };

    const handleAddOption = (e) => {
        if (option.trim()) {
            if (!formData.options) {
                formData.options = [];
            }
            formData.options.push(option.trim());
            setFormData({ ...formData });
            setOption("");
            setErrors((prev) => ({ ...prev, options: "" }));
        }
    };

    const deleteOption = (index) => {
        if (formData?.options) {
            formData.options.splice(index, 1);
            setFormData({ ...formData });
        }
    };

    const handlePage = (page) => {
        setQParams({
            ...Qparams,
            page,
        });
    };

    const handlePerPageChange = (event) => {
        const selectedValue = parseInt(event.target.value, 10);
        setQParams({
            ...Qparams,
            page: 1,
            pageSize: selectedValue,
        });
    };

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        debouncedParams(Qparams);
    }, [Qparams]);

    const debouncedParams = useCallback(
        debounce((param) => {

            const searchParams = new URLSearchParams({
                page: param.page,
                pageSize: param.pageSize,

            }).toString();

            submit(`?${searchParams}`, { method: "get", action: "." });
        }, 500),
        []
    );
    useEffect(() => {
        if (submissionSuccess && fetcher.state === "idle" && !fetcher.error) {
            setFormData({
                fieldName: "",
                fieldDescription: "",
                fieldType: "",
                isMandatory: "",
                isRegistrationform: 1,
                options: []
            });
            setOption("");
            setErrors({});
            setSubmissionSuccess(false);
        } else if (fetcher.state === "error") {
            toast.error("Failed to create custom field.");
            setSubmissionSuccess(false);
        }
    }, [fetcher.state, fetcher.error, submissionSuccess]);


    return (
        <div>
            <BackButton heading="Add Custom Form" content="Back" />
            <div className="container-fluid">
                <div className="registration_form_section">
                    <div className="top">
                        <div className=" row mb-5">
                            <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                                {activeDialogType === "new"
                                    ? "Add New Custom Field"
                                    : "Edit Custom Field"}
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="fieldName"
                                                className="form-label fs-s fw-medium black_300"
                                            >
                                                Field Name<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={
                                                    errors && errors.fieldName
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color "
                                                }
                                                placeholder="Enter The Field Name"
                                                id="fieldName"
                                                name="fieldName"
                                                value={formData.fieldName}
                                                onChange={handleChange}
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.fieldName && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.fieldName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="fieldDescription"
                                                className="form-label fs-s fw-medium black_300"
                                            >
                                                Field Description<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={
                                                    errors && errors.fieldDescription
                                                        ? "form-control input_bg_color error-input"
                                                        : "form-control input_bg_color "
                                                }
                                                placeholder="Enter The Field Description"
                                                id="fieldDescription"
                                                name="fieldDescription"
                                                value={formData.fieldDescription}
                                                onChange={handleChange}
                                            />
                                            <div className="response" style={{ height: "8px" }}>
                                                {errors && errors.fieldDescription && (
                                                    <p className="text-danger m-0 fs-xs">
                                                        {errors.fieldDescription}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label
                                            className="form-label fs-s fw-medium black_300"
                                            htmlFor="fieldType"
                                        >
                                            Field Type<span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={
                                                errors && errors.fieldType
                                                    ? "form-control custom-select placeholder-gray error-input "
                                                    : "form-control custom-select placeholder-gray select form-select"
                                            }
                                            id="fieldType"
                                            name="fieldType"
                                            value={formData.fieldType}
                                            onChange={handleTypeSelection}
                                        >
                                            <option value="">Select a Type</option>
                                            {[
                                                "text",
                                                "email",
                                                "number",
                                                "textarea",
                                                "date",
                                                "time",
                                                "select",

                                            ].map((type) => (
                                                <option key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="response" style={{ height: "8px" }}>
                                            {errors && errors.fieldType && (
                                                <p className="text-danger m-0 fs-xs">
                                                    {errors.fieldType}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Select or Multi-Select Options */}
                                    {(formData?.fieldType === "select" ||
                                        formData?.fieldType === "multiselect") && (
                                            <div className="col-md-4">
                                                <label
                                                    htmlFor="options"
                                                    className="form-label fs-s fw-medium black_300"
                                                >
                                                    Add Options<span className="text-danger">*</span>
                                                </label>
                                                <div className="d-flex">
                                                    {" "}
                                                    <input
                                                        type="text"
                                                        className={
                                                            errors && errors.options
                                                                ? "form-control input_bg_color error-input "
                                                                : "form-control input_bg_color select form-select"
                                                        }
                                                        value={option}
                                                        onChange={(e) => setOption(e.target.value)}
                                                        placeholder="Add an option"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white mr-2"
                                                        onClick={handleAddOption}
                                                    >
                                                        Add
                                                    </button>
                                                </div>

                                                <div className="response" style={{ height: "8px" }}>
                                                    {errors.options && (
                                                        <p className="text-danger m-0 fs-xs">
                                                            {errors.options}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    <div className="col-md-4">
                                        <label
                                            className="form-label fs-s fw-medium black_300"
                                            htmlFor="isMandatory"
                                        >
                                            Is Mandatory<span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={
                                                errors && errors.isMandatory
                                                    ? "form-control custom-select placeholder-gray error-input "
                                                    : "form-control custom-select placeholder-gray select form-select"
                                            }
                                            id="isMandatory"
                                            name="isMandatory"
                                            value={formData.isMandatory}
                                            onChange={handleTypeSelection}
                                        >
                                            <option value="" disabled selected hidden className="text-muted-100">Select YES/NO</option>
                                            <option value="1">YES</option>
                                            <option value="0">NO</option>
                                        </select>
                                        <div className="response" style={{ height: "8px" }}>
                                            {errors && errors.isMandatory && (
                                                <p className="text-danger m-0 fs-xs">
                                                    {errors.isMandatory}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={
                                            formData?.fieldType === "select" ||
                                                formData?.fieldType === "multiselect"
                                                ? "col-md-4 d-flex  align-items-center mt-4 justify-content-end"
                                                : "col-md-8 d-flex  align-items-center mt-4 justify-content-end"
                                        }
                                    >
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white "
                                            disabled={formData?.fetcher?.state === "submitting"}
                                        >
                                            Save
                                        </button>
                                    </div>
                                    {(formData?.fieldType === "select" ||
                                        formData?.fieldType === "multiselect") && (
                                            <div className="col-md-12">
                                                <div
                                                    className={
                                                        formData?.options?.length > 0 &&
                                                        "d-inline-flex flex-wrap mt-2 "
                                                    }
                                                >
                                                    {formData?.options?.map((option, index) => (
                                                        <div
                                                            className="d-flex align-items-center deletebtnContainer fs-13 p-1"
                                                            key={index}
                                                        >
                                                            <span>{option}</span>

                                                            <button
                                                                type="button"
                                                                className="deletebtn text-danger"
                                                                onClick={() => deleteOption(index)}
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive table-card table-container table-scroll border-0">
                            <table className="table table-centered align-middle  table-nowrap equal-cell-table table-hover">
                                <thead>
                                    <tr className="">
                                        <th scope="col" className="fs-13 lh-xs fw-600 ">
                                            S.No
                                        </th>
                                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                            Label
                                        </th>
                                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                            Type
                                        </th>
                                        <th scope="col" className="fs-13 lh-xs  fw-600  ">
                                            Manderatory
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((applicant, index) => (
                                        <tr key={applicant.id}>
                                            <td className="fs-13 black_300 lh-xs bg_light">
                                                {index + 1}
                                            </td>
                                            <td
                                                className="fs-13 black_300 lh-xs bg_light text-truncate"
                                                style={{ maxWidth: "150px" }}
                                                title={applicant.title}
                                            >
                                                {applicant.title}
                                            </td>
                                            <td
                                                className="fs-13 black_300 lh-xs bg_light text-truncate"
                                                style={{ maxWidth: "150px" }}
                                                title={applicant.type}
                                            >
                                                {applicant.type}
                                            </td>
                                            <td
                                                className="fs-13 black_300 lh-xs bg_light text-truncate"
                                                style={{ maxWidth: "150px" }}
                                                title={applicant.type}
                                            >
                                                {applicant.manderatory === "1" ? "YES" : "NO"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* <div className=" mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
              <div className="col-sm">
                <PaginationInfo
                      data={{
                        length: data?.data
                        ?.length,
                        start: data?.startquestions,
                        end: data?.endquestions,
                        total: data?.searchResultquestions,
                      }}
                      loading={data?.loading}
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
                        currentPage={Qparams.page}
                        totalPages={data?.totalPages}
                        loading={navigation?.state === "loading"}
                        onPageChange={handlePage}
                      />
                </div>
              </div>
            </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCustomRegistrationForm;
