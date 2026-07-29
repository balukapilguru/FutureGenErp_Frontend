import { Modal } from "react-bootstrap";
import Button from "../../../components/button/Button";
import { useEffect, useState } from "react";
import { ERPApi } from "../../../../serviceLayer/interceptor.jsx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const BatchCloseButton = ({ batch, show, handleClose, handleSubmitClose }) => {
  const [error, setError] = useState({});
  const [singleBatchState, setSingleBatchState] = useState({
    remarks: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCloseBatchButton = async () => {
    if (
      !singleBatchState.remarks ||
      singleBatchState.remarks.trim() === "" ||
      singleBatchState.remarks.trim().length <= 2
    ) {
      setError((prev) => ({
        ...prev,
        remarks: "Remarks is required (Minimum 3 Characters)",
      }));
      return;
    }
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    const updateBatchData = {
      remark: singleBatchState?.remarks,
      date: formattedDate,
    };

    if (singleBatchState?.remarks && batch?.batchId) {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this Batch-${batch.batchName}, Onces Closed`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, Close it!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setLoading((prev) => !prev);
          try {
            const { data, status } = await toast.promise(
              ERPApi.patch(
                `/batch/closebatch/${batch?.batchId}`,
                updateBatchData
              ),
              {
                pending: "",
              }
            );
            if (status === 200) {
              handleSubmitClose();
              const successMessage = "Batch Closed Successfully!";
              Swal.fire({
                title: "Closed!",
                text: successMessage,
                icon: "success",
              });
            }
          } catch (error) {
            console.error(error);
            const errorMessage =
              error?.response?.data?.message ||
              "Batch Closed Failed. Please Try Again.";
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
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      size="md"
      dialogClassName="modal-dialog-centered"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Close the Batch-{batch?.batchName ? batch?.batchName : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div class="">
          <div className="d-flex justify-content-between">
            <label className="form-label fs-s fw-medium black_300">
              Enter the Student Remarks* :
            </label>
          </div>
          <textarea
            rows="4"
            cols="10"
            name="text"
            form="remarks"
            className={
              error && error?.remarks
                ? "form-control fs-s bg-form text_color input_bg_color error-input"
                : "form-control fs-s bg-form text_color input_bg_color"
            }
            placeholder="Enter the Remarks"
            onChange={(e) =>
              setSingleBatchState((prev) => ({
                ...prev,
                remarks: e.target.value,
              }))
            }
            value={singleBatchState.remarks ? singleBatchState?.remarks : ""}
          ></textarea>
          <div style={{ height: "8px" }}>
            {error && error?.remarks && (
              <p className="text-danger m-0 fs-xs">{error?.remarks}</p>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn btn_primary fs-13 btn-sm"
          onClick={() => handleCloseBatchButton()}
          disabled={loading}
        >
          {loading ? "Closing..." : "Close Batch"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BatchCloseButton;
