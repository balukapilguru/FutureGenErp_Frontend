import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import Button from "../../../components/button/Button";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { debounce } from "../../../../utils/Utils.jsx";

const AssignStudents = ({ show, handleClose, handleSubmitClose }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const batchID = queryParams.get("batchID");
  const batchName = queryParams.get("batchName");
  const trainingMode = queryParams.get("trainingMode");
  const [assignedSuccessfull, setassignedSuccessfull] = useState(false);
  const navigate = useNavigate();
  const [studentsList, setStudentList] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAvailableStudents = async (searchTerm) => {
    if (batchID) {
      if (trainingMode == "placement-preparation") {
        try {
          const response = await ERPApi.get(
            `placement-preparation/getAllAssignableStudentsForPlacementBatch/${batchID}?search=${searchTerm || ""}`,
          );

          setStudentList(
            response?.data?.students.map((item) => ({
              label: item.name,
              value: item.studentId,
            })),
          );
        } catch (error) {
          console.error("Error fetching available students: ", error);
          toast.error("Failed to load students. Please try again later.");
        }
      } else {
        try {
          const response = await ERPApi.get(
            `batch/getavailablestudents/${batchID}?search=${searchTerm || ""}`,
          );
          setStudentList(
            response?.data?.studentCollection.map((item) => ({
              label: item.name,
              value: item.id,
            })),
          );
        } catch (error) {
          console.error("Error fetching available students: ", error);
          toast.error("Failed to load students. Please try again later.");
        }
      }
    }
  };

  useEffect(() => {
    fetchAvailableStudents("");
    setAssignedStudents([]);
  }, [batchID, assignedSuccessfull]);

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      fetchAvailableStudents(searchTerm);
    }, 1000),
    [],
  );

  useEffect(() => {
    if (search !== "") {
      debouncedSearch(search);
    }
  }, [search, debouncedSearch]);

  const handleSubmit = () => {
    if (assignedStudents.length <= 0) {
      toast.error("No students selected to assign.");
      return;
    }
    const assignBatchData = {
      studentId: assignedStudents?.map((item) => item.value),
    };

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to assign students to this batch?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Assign Students!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading((prev) => !prev);
        try {
          const { data, status } = await toast.promise(
            ERPApi.patch(`/batch/assignStudent/${batchID}`, assignBatchData),
            {
              pending: "Assigning Students to Batch...",
            },
          );

          if (status === 200) {
            handleSubmitClose();
            setassignedSuccessfull(!assignedSuccessfull);
            setStudentList([]); // Reset student list
            setAssignedStudents([]); // Clear selected students
            Swal.fire({
              title: "Assigned!",
              text: "Students assigned to batch successfully.",
              icon: "success",
            });
          }
        } catch (error) {
          console.error(error);
          const errorMessage =
            error?.response?.data?.message ||
            "An unknown error occurred. Please try again.";
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
        } finally {
          setLoading((prev) => !prev);
        }
      }
    });
  };

  const handleCloseModal = () => {
    handleClose();
    setStudentList([]);
    setAssignedStudents([]);
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      backdrop="static"
      size="md"
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>Assign Students to {batchName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-8">
            <label className="form-label fs-s fw-medium black_300">
              Add Students<span className="text-danger">*</span>
            </label>
            <Select
              className="fs-s bg-form text_color input_bg_color"
              isMulti
              options={studentsList}
              classNamePrefix="select"
              value={assignedStudents}
              onChange={(selectedOption) => setAssignedStudents(selectedOption)}
              onInputChange={(inputValue) => setSearch(inputValue)} // Update search state
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="text-end mt-3">
          <Button
            className="btn btn_primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            Submit
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignStudents;
