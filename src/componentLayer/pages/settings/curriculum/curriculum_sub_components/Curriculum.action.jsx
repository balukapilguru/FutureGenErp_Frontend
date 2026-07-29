import { toast } from "react-toastify";
import { ERPApi } from "../../../../../serviceLayer/interceptor";

export const curriculumAction = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Safely read values
    const type = formData.get("type");
    const rawCurriculum = formData.get("postCurriculum");

    if (!rawCurriculum && type !== "delete") {
      toast.error("Invalid curriculum data.");
      return { success: false };
    }

    let postCurriculum;
    try {
      postCurriculum = JSON.parse(rawCurriculum);
    } catch (err) {
      toast.error("Failed to parse curriculum data.");
      return { success: false };
    }

    if (!type) {
      toast.error("Invalid request type.");
      return { success: false };
    }

    // --- CREATE ---
    if (type === "create") {
      const response = await toast.promise(
        ERPApi.post("/batch/curriculum", postCurriculum),
        {
          pending: "Creating the curriculum...",
          error: "Failed to create curriculum.",
        },
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    }

    // --- CLONE ---
    if (type === "clone") {
      const id = formData.get("id");
      const response = await toast.promise(
        ERPApi.post(`/batch/curriculum/${id}/clone`, postCurriculum),
        {
          pending: "Creating the curriculum...",
          error: "Failed to create curriculum.",
        },
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    }

    // --- EDIT ---
    if (type === "edit") {
      const id = formData.get("id");

      if (!id) {
        toast.error("Missing curriculum ID for update.");
        return { success: false };
      }

      const response = await toast.promise(
        ERPApi.patch(`/batch/curriculum/${id}`, postCurriculum),
        {
          pending: "Updating the curriculum...",
          error: "Failed to update curriculum.",
        },
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    }
    if (type === "delete") {
      const id = formData.get("id");
      const response = await toast.promise(
        ERPApi.delete(`/batch/curriculum/${id}`),
        {
          pending: "Deleting The Curriculum...",
        },
      );
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    }

    // Unknown type
    toast.error("Invalid operation type.");
    return { success: false };
  } catch (error) {
    console.error("Curriculum Action Error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred.";

    toast.error(errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
