import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiMiniPlus } from "react-icons/hi2";
import Swal from "sweetalert2";
import { debounce } from "../../../../utils/Utils";
import BackButton from "../../../components/backbutton/BackButton";
import PaginationInfo from "../../../../utils/PaginationInfo";
import CustomTable from "../../../../utils/CustomTable";
import GateKeeper from "../../../../rbac/GateKeeper";
import SearchInputField from "../../../../utils/SearchInputField";
import Pagination from "../../../../utils/Pagination";

// Note: Loader and Action are now imported from the separat e file
// They should be configured in your router setup

// ----------------------------------------------------------------------
// Component
const CustomFields = () => {
  const { customFieldsData } = useLoaderData();
  const createFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  const navigation = useNavigation();
  const submit = useSubmit();

  // Form state
  const [formData, setFormData] = useState({
    fieldName: "",
    fieldDescription: "",
    fieldType: "",
    isMandatory: "",
    options: [],
  });
  const [errors, setErrors] = useState({});
  const [activeDialogType] = useState("new");
  const [optionInput, setOptionInput] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Pagination state
  const [Qparams, setQParams] = useState({
    page: 1,
    pageSize: 10,
  });

  // ----------------------------------------------------------------------
  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fieldName?.trim())
      newErrors.fieldName = "Field Name is required";
    if (!formData.fieldDescription?.trim())
      newErrors.fieldDescription = "Field Description is required";
    if (!formData.fieldType) newErrors.fieldType = "Please select a Field Type";
    if (!formData.isMandatory)
      newErrors.isMandatory = "Please select YES or NO";
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

  const validateField = (id, value) => {
    let errorMsg = "";
    if (id === "fieldName" && !value.trim())
      errorMsg = "Field Name is required";
    if (id === "fieldDescription" && !value.trim())
      errorMsg = "Field Description is required";
    if (id === "fieldType" && !value) errorMsg = "Please select a Field Type";
    setErrors((prev) => ({ ...prev, [id]: errorMsg }));
  };

  // ----------------------------------------------------------------------
  // Form handlers
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    validateField(id, value);
  };

  const handleTypeSelection = (e) => {
    const { id, value } = e.target;
    if (id === "fieldType") {
      setFormData((prev) => ({
        ...prev,
        fieldType: value,
        options:
          value === "select" || value === "multiselect" ? [] : prev.options,
      }));
      validateField(id, value);
    } else if (id === "isMandatory") {
      setFormData((prev) => ({ ...prev, isMandatory: value }));
      validateField(id, value);
    }
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        options: [...(prev.options || []), optionInput.trim()],
      }));
      setOptionInput("");
      setErrors((prev) => ({ ...prev, options: "" }));
    }
  };

  const deleteOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // ----------------------------------------------------------------------
  // Submit creation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      title: formData.fieldName,
      type: formData.fieldType,
      description: formData.fieldDescription,
      filtered: false,
      mandatory: formData.isMandatory === "1",
      options: formData.options,
    };

    createFetcher.submit(JSON.stringify(payload), {
      method: "POST",
      encType: "application/json",
    });
  };
  // Reset form after successful creation
  useEffect(() => {
    if (!createFetcher.data) return;

    if (createFetcher.data.success) {
      // ✅ Reset form
      setFormData({
        fieldName: "",
        fieldDescription: "",
        fieldType: "",
        isMandatory: "",
        options: [],
      });
      setOptionInput("");
      setErrors({});

      // ✅ Toast only once
      toast.success("Custom field created successfully");
    }

    if (createFetcher.data.error) {
      toast.error(createFetcher.data.error);
    }
  }, [createFetcher.data]);
  // ----------------------------------------------------------------------
  // Delete handler
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this field!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFetcher.submit(JSON.stringify({ id, type: "delete" }), {
          method: "DELETE",
          encType: "application/json",
        });
      }
    });
  };

  // ----------------------------------------------------------------------
  // Pagination handling (debounced to avoid excessive submissions)
  const handlePage = (page) => setQParams((prev) => ({ ...prev, page }));
  const handlePerPageChange = (e) => {
    const pageSize = parseInt(e.target.value, 10) || 10;
    setQParams((prev) => ({ ...prev, page: 1, pageSize: pageSize }));
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
    debounce((params) => {
      if (!params) return; // 🧠 guard

      const searchParams = new URLSearchParams({
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      });

      submit(`?${searchParams.toString()}`, { method: "get", action: "." });
    }, 500),
    []
  );

  // Extract data and meta from loader
  const fields = Array.isArray(customFieldsData?.data)
    ? customFieldsData.data
    : [];
  const meta = customFieldsData?.meta || customFieldsData || {};
  console.log("Custom Fields Data:", meta, customFieldsData);

  // Define columns for CustomTable
  const columns = [
    {
      id: "sno",
      header: "S.No",
      accessor: (row, index) =>
        (meta.currentPage - 1) * meta.pageSize + index + 1,
    },
    {
      id: "title",
      header: "Title",
      accessor: "label",
    },
    {
      id: "type",
      header: "Type",
      accessor: "type",
    },
    {
      id: "mandatory",
      header: "Mandatory",
      accessor: (row) => row.mandatory ? "Yes" : "No",
    },
    {
      id: "description",
      header: "Description",
      accessor: "description",
    },
    {
      id: "options",
      header: "Options",
      accessor: (row) => (
        <span
          className="text-truncate d-inline-block"
          style={{ maxWidth: "150px" }}
          title={row.options?.join(", ")}
        >
          {row.options?.join(", ") || "-"}
        </span>
      ),
    },
  ];

  // Actions render function
  // const renderActions = (row) => (
  //     <div className="d-flex align-items-center gap-2">
  //         <Link to={`/placement-preparation/questions/edit/${row?.original?.uuid}`}>
  //             <MdEdit className="eye_icon fw-600 table_icons text-primary" title="Edit" />
  //         </Link>
  //         <MdDelete
  //             className="text-danger table_icons"
  //             title="Delete"
  //             style={{ cursor: "pointer" }}
  //             onClick={() => handleDelete(row?.original?.uuid)}
  //         />
  //     </div>
  // );

  return (
    <div>
      <BackButton heading="Custom Fields" content="Back" />
      <div className="container-fluid">
        <div className="registration_form_section">
          {/* Inline Creation Form */}

          <div className="top">
            <GateKeeper
              requiredModule="Demo batches"
              requiredPermission="all"
              submenumodule="Custom Fields"
              submenuReqiredPermission="canCreate"
            >
              <div className="row mb-5">
                <p className="text-start text-uppercase fw-medium text-mute text-truncate mt-1 fs-14">
                  {activeDialogType === "new"
                    ? "Add New Custom Field"
                    : "Edit Custom Field"}
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Field Name */}
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
                          className={`form-control input_bg_color ${errors.fieldName ? "error-input" : ""}`}
                          placeholder="Enter The Field Name"
                          id="fieldName"
                          value={formData.fieldName}
                          onChange={handleChange}
                        />
                        <div className="response" style={{ height: "8px" }}>
                          {errors.fieldName && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.fieldName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Field Description */}
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
                          className={`form-control input_bg_color ${errors.fieldDescription ? "error-input" : ""}`}
                          placeholder="Enter The Field Description"
                          id="fieldDescription"
                          value={formData.fieldDescription}
                          onChange={handleChange}
                        />
                        <div className="response" style={{ height: "8px" }}>
                          {errors.fieldDescription && (
                            <p className="text-danger m-0 fs-xs">
                              {errors.fieldDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Field Type */}
                    <div className="col-md-4">
                      <label
                        className="form-label fs-s fw-medium black_300"
                        htmlFor="fieldType"
                      >
                        Field Type<span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-control custom-select placeholder-gray select form-select ${errors.fieldType ? "error-input" : ""}`}
                        id="fieldType"
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
                          "multiselect",
                        ].map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                      <div className="response" style={{ height: "8px" }}>
                        {errors.fieldType && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.fieldType}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Options for select/multiselect */}
                    {(formData.fieldType === "select" ||
                      formData.fieldType === "multiselect") && (
                        <>
                          <div className="col-md-4">
                            <label
                              htmlFor="options"
                              className="form-label fs-s fw-medium black_300"
                            >
                              Add Options<span className="text-danger">*</span>
                            </label>
                            <div className="d-flex">
                              <input
                                type="text"
                                className={`form-control input_bg_color ${errors.options ? "error-input" : ""}`}
                                value={optionInput}
                                onChange={(e) => setOptionInput(e.target.value)}
                                placeholder="Add an option"
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white"
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

                          {/* Display added options as chips */}
                          <div className="col-md-12">
                            <div
                              className={
                                formData.options?.length > 0
                                  ? "d-inline-flex flex-wrap mt-2"
                                  : ""
                              }
                            >
                              {formData.options?.map((opt, idx) => (
                                <div
                                  className="d-flex align-items-center deletebtnContainer fs-13 p-1"
                                  key={idx}
                                >
                                  <span>{opt}</span>
                                  <button
                                    type="button"
                                    className="deletebtn text-danger"
                                    onClick={() => deleteOption(idx)}
                                  >
                                    X
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                    {/* Is Mandatory */}
                    <div className="col-md-4">
                      <label
                        className="form-label fs-s fw-medium black_300"
                        htmlFor="isMandatory"
                      >
                        Is Mandatory<span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-control custom-select placeholder-gray select form-select ${errors.isMandatory ? "error-input" : ""}`}
                        id="isMandatory"
                        value={formData.isMandatory}
                        onChange={handleTypeSelection}
                      >
                        <option value="" disabled hidden>
                          Select YES/NO
                        </option>
                        <option value="1">YES</option>
                        <option value="0">NO</option>
                      </select>
                      <div className="response" style={{ height: "8px" }}>
                        {errors.isMandatory && (
                          <p className="text-danger m-0 fs-xs">
                            {errors.isMandatory}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div
                      className={
                        formData.fieldType === "select" ||
                          formData.fieldType === "multiselect"
                          ? "col-md-4 d-flex align-items-center mt-4 justify-content-end"
                          : "col-md-8 d-flex align-items-center mt-4 justify-content-end"
                      }
                    >
                      <button
                        type="submit"
                        className="btn btn-sm btn-md btn_primary fs-13 me-2 text_white"
                        disabled={createFetcher.state === "submitting"}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </GateKeeper>
          </div>
          <div className="w-25">
            <SearchInputField />
          </div>
          {/* Table Section using CustomTable */}
          <div className="card-body">
            <CustomTable
              data={fields || []}
              columns={columns}
              // actions={renderActions}
              loading={navigation.state}
              tableClassName="table table-centered align-middle table-nowrap equal-cell-table table-hover"
            />

            {/* Pagination */}
            <div className="mt-3 align-items-center d-flex justify-content-between row text-center text-sm-start">
              <div className="col-sm">
                <PaginationInfo
                  data={{
                    length: fields.length,
                    start: meta.currentPage,
                    end: meta.pageSize,
                    total: meta.totalRecords,
                  }}
                  loading={navigation.state === "loading"}
                />
              </div>
              <div className="col-sm-auto mt-3 mt-sm-0 d-flex pagination-res">
                <div className="mt-2">
                  <select
                    className="form-select form-control me-3 input_bg_color pagination-select"
                    onChange={handlePerPageChange}
                    value={Qparams ? Qparams?.pageSize : 10}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div>
                  <Pagination
                    currentPage={Number(meta.currentPage)}
                    totalPages={Number(meta.totalPages)}
                    // loading={navigation.state === "loading"}
                    onPageChange={handlePage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomFields;
