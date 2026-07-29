import React, { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { ERPApi } from "../../../../../serviceLayer/interceptor.jsx";

const MarkasCompletedModal = ({ module, fetchData, batchId, batchType }) => {
  const [loading, setLoading] = useState(false);

  const handleToggleCompletion = () => {
    // Collect names of topics without sessionTakenOn dates
    const incompleteTopics = module.topics
      .filter((topic) => !topic.sessionTakenOn?.length)
      .map((topic) => topic.topicName);

    // If the module is not completed and there are incomplete topics, show warning
    if (!module.isCompleted && incompleteTopics.length > 0) {
      Swal.fire({
        title: "Incomplete Topics!",
        html: `${incompleteTopics.length} topics are left please complete them before marking the module as completed.`,
        icon: "warning",
      });
      return;
    }
    if (!module.isCompleted && incompleteTopics.length > 0) {
      Swal.fire({
        title: "Incomplete Topics!",
        html: `The following topics are incomplete:<br/><strong>${incompleteTopics.join(
          "<br/>"
        )}</strong><br/>Please complete them before marking the module as completed.`,
        icon: "warning",
      });
      return;
    }

    const action = module.isCompleted ? "incomplete" : "complete";
    const apiEndpoint = `/batch/custom/module/mark/${module.id}`;
    const confirmationText = module.isCompleted
      ? "Do you want to mark this module as incomplete?"
      : "Do you want to mark this module as completed?";
    const successMessage = module.isCompleted
      ? "Module marked as incomplete successfully!"
      : "Module marked as completed successfully!";
    const pendingMessage = module.isCompleted
      ? "Marking module as incomplete..."
      : "Marking module as completed...";

    Swal.fire({
      title: "Are you sure?",
      text: confirmationText,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, mark it as ${action}!`,
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const { data, status } = await toast.promise(
            ERPApi.patch(apiEndpoint, { isCompleted: !module.isCompleted }),
            { pending: pendingMessage }
          );

          if (status === 200) {
            Swal.fire({
              title: module.isCompleted
                ? "Marked as Incomplete!"
                : "Marked as Completed!",
              text: successMessage,
              icon: "success",
            });
            fetchData();
            // Toggle the local isCompleted state
            module.isCompleted = !module.isCompleted;
          }
        } catch (error) {
          console.error(error);
          const errorMessage =
            error?.response?.data?.message ||
            `Failed to mark as ${action}. Please try again.`;
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="form-check form-switch">
      <label className="form-check-label fw-500">
        {module.isCompleted ? "Mark As Incomplete" : "Mark As Completed"}
      </label>
      <input
        className="form-check-input"
        type="checkbox"
        checked={module.isCompleted}
        disabled={
          loading || batchType === "upcoming" || batchType === "completed"
        }
        style={{
          cursor:
            loading || batchType === "upcoming" || batchType === "completed"
              ? "not-allowed"
              : "pointer",
        }}
        onClick={handleToggleCompletion}
      />
    </div>
  );
};

export default MarkasCompletedModal;
