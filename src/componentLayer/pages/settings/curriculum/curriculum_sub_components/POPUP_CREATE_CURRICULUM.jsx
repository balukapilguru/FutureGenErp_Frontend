import React, { useEffect, useState } from "react";
import axios from "axios";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";
import Button from "../../../../components/button/Button";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select";
import { useFetcher } from "react-router-dom";

const POPUP_CREATE_CURRICULUM = ({
  show,
  mode,
  selectedCurriculum,
  onSave,
  handleClose,
  handleSubmitClose,
}) => {
  const curriculumFetcherr = useFetcher();
  const [curriculumForm, setCurriculumForm] = useState({
    curriculumName: "",
    curriculumDescription: "",
    exam_collection: [], // Initialize as an empty array
  });
  const [examOptions, setExamOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    curriculumName: "",
    curriculumDescription: "",
  });

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await ERPApi.get(
          "/exam/allexams?filter[isTeksExam]=1",
        );
        setExamOptions(response.data?.exams || []);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      }
    };

    fetchExams();
  }, []);

  useEffect(() => {
    if (mode === "edit" && selectedCurriculum) {
      const initialExamCollection = Array.isArray(selectedCurriculum.exams)
        ? selectedCurriculum.exams.map((exam) => ({
            value: exam.id,
            label: exam.examName,
          }))
        : [];

      setCurriculumForm({
        curriculumName: selectedCurriculum.curriculumName || "",
        curriculumDescription: selectedCurriculum.curriculumDescription || "",
        exam_collection: initialExamCollection,
      });
    } else {
      setCurriculumForm({
        curriculumName: "",
        curriculumDescription: "",
        exam_collection: [],
      });
    }
  }, [mode, selectedCurriculum]); // Removed examOptions from dependency array as we are now using selectedCurriculum.exams

  const handleInputChange = (e) => {
    const { name, value, type, multiple, options } = e.target;

    let updatedValue;
    if (multiple) {
      updatedValue = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
    } else {
      updatedValue = value;
    }

    setCurriculumForm((prevForm) => ({
      ...prevForm,
      [name]: updatedValue,
    }));

    setError((prevError) => ({
      ...prevError,
      [name]: "", // Clear error
    }));
  };

  const validateForm = () => {
    let formIsValid = true;
    const newError = {};

    if (!curriculumForm.curriculumName?.trim()) {
      newError.curriculumName = "Curriculum Name is Required.";
      formIsValid = false;
    } else if (curriculumForm.curriculumName?.length <= 2) {
      newError.curriculumName = "Minimum 3 Characters Required";
      formIsValid = false;
    } else if (!curriculumForm?.curriculumDescription?.trim()) {
      newError.curriculumDescription = "Curriculum Description is Required.";
      formIsValid = false;
    } else if (curriculumForm?.curriculumDescription?.length <= 2) {
      newError.curriculumDescription = "Minimum 3 Characters Required";
      formIsValid = false;
    }

    setError(newError);
    return formIsValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const postCurriculum = {
        curriculumName: curriculumForm.curriculumName,
        curriculumDescription: curriculumForm.curriculumDescription,
        exam_collection: curriculumForm.exam_collection.map(
          (exam) => exam.value,
        ),
      };

      setLoading((prev) => !prev);
      try {
        if (mode === "create") {
          const formData = new FormData();
          formData.set("postCurriculum", JSON.stringify(postCurriculum));
          formData.set("type", "create");
          curriculumFetcherr.submit(formData, {
            method: "post",
          });
          // const { data, status } = await toast.promise(
          //   ERPApi.post("/batch/curriculum", postCurriculum),
          //   {
          //     pending: "Creating The Curriculum...",
          //   }
          // );
          // if (status === 200) {
          //   handleSubmitClose();
          //   Swal.fire({
          //     title: "Created!",
          //     text: "Curriculum Created successfully.",
          //     icon: "success",
          //   });
          //   setCurriculumForm({
          //     curriculumName: "",
          //     curriculumDescription: "",
          //     exam_collection: [],
          //   });
          //   onSave();
          // }
        } else if (mode === "edit" && selectedCurriculum) {
          const formData = new FormData();
          formData.set("postCurriculum", JSON.stringify(postCurriculum));
          formData.set("type", "edit");
          formData.set("id", selectedCurriculum.id);
          curriculumFetcherr.submit(formData, {
            method: "post",
          });
          // const { data, status } = await toast.promise(
          //   ERPApi.patch(
          //     `/batch/curriculum/${selectedCurriculum?.id}`,
          //     postCurriculum
          //   ),
          //   {
          //     pending: "Updating The Curriculum...",
          //   }
          // );
          // if (status === 200) {
          //   handleSubmitClose();
          //   setCurriculumForm({
          //     curriculumName: "",
          //     curriculumDescription: "",
          //     exam_collection: [],
          //   });

          //   Swal.fire({
          //     title: "Updated!",
          //     text: "Curriculum Updated successfully.",
          //     icon: "success",
          //   });
          //   onSave();
          // }
        } else if (mode === "clone" && selectedCurriculum) {
          const formData = new FormData();
          formData.set("postCurriculum", JSON.stringify(postCurriculum));
          formData.set("type", "clone");
          formData.set("id", selectedCurriculum?.id);
          curriculumFetcherr.submit(formData, {
            method: "post",
          });
          // const { data, status } = await toast.promise(
          //   ERPApi.patch(
          //     `/batch/curriculum/${selectedCurriculum?.id}`,
          //     postCurriculum
          //   ),
          //   {
          //     pending: "Updating The Curriculum...",
          //   }
          // );
          // if (status === 200) {
          //   handleSubmitClose();
          //   setCurriculumForm({
          //     curriculumName: "",
          //     curriculumDescription: "",
          //     exam_collection: [],
          //   });

          //   Swal.fire({
          //     title: "Updated!",
          //     text: "Curriculum Updated successfully.",
          //     icon: "success",
          //   });
          //   onSave();
          // }
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || mode === "create"
            ? "Create Curriculum Failed!. Please try again."
            : "Update Curriculum Failed!. Please try again.";
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
        });
      } finally {
        setLoading((prev) => !prev);
      }
    }
  };

  useEffect(() => {
    if (
      curriculumFetcherr.state === "idle" &&
      curriculumFetcherr?.data?.success
    ) {
      handleSubmitClose();
      // curriculumFetcherr.data = undefined;
    }
  }, [curriculumFetcherr]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="md"
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>
          {mode === "create"
            ? "Create Curriculum"
            : mode === "clone"
              ? "Clone Curriculum"
              : "Update Curriculum"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Curriculum Name */}
        <div className="mb-3">
          <label
            className="form-label fs-s fw-medium black_300"
            htmlFor="curriculumName"
          >
            Curriculum Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control input_bg_color ${
              error?.curriculumName ? "error-input" : ""
            }`}
            placeholder="Enter curriculum name"
            name="curriculumName"
            id="curriculumName"
            value={curriculumForm.curriculumName}
            onChange={handleInputChange}
          />
          {error?.curriculumName && (
            <div className="text-danger m-0 fs-xs">{error?.curriculumName}</div>
          )}
        </div>

        {/* Curriculum Description */}
        <div className="mb-3">
          <label
            className="form-label fs-s fw-medium black_300"
            htmlFor="curriculumDescription"
          >
            Description<span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control input_bg_color ${
              error?.curriculumDescription ? "error-input" : ""
            }`}
            placeholder="Enter description"
            rows="3"
            name="curriculumDescription"
            id="curriculumDescription"
            value={curriculumForm?.curriculumDescription}
            onChange={handleInputChange}
          ></textarea>
          {error?.curriculumDescription && (
            <div className="text-danger m-0 fs-xs">
              {error?.curriculumDescription}
            </div>
          )}
        </div>

        {/* Select Exam */}
        <div className="mb-3">
          <label
            className="form-label fs-s fw-medium black_300"
            htmlFor="exam_collection"
          >
            Select Exam
          </label>
          <Select
            id="exam_collection"
            name="exam_collection"
            isMulti
            options={examOptions.map((exam) => ({
              value: exam.id,
              label: `${exam.examType} (${exam.examName})`,
            }))}
            value={curriculumForm.exam_collection}
            onChange={(selectedOptions) => {
              setCurriculumForm((prev) => ({
                ...prev,
                exam_collection: selectedOptions,
              }));
              setError((prev) => ({
                ...prev,
                exam_collection: "",
              }));
            }}
            className={error?.exam_collection ? "error-select" : ""}
          />
          {error?.exam_collection && (
            <div className="text-danger m-0 fs-xs">{error.exam_collection}</div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn btn_primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {mode === "create"
            ? "Create Curriculum"
            : mode === "clone"
              ? "Clone Curriculum"
              : "Update Curriculum"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default POPUP_CREATE_CURRICULUM;
