// mediaAction.js
import { json } from "react-router-dom";
import { ERPApi } from "../../../../../serviceLayer/interceptor";

export const mediaAction = async ({ request }) => {

  const formData = await request.formData();
  const actionType = formData.get("actionType");


  try {
    // ================= ADD MEDIA =================
    if (actionType === "addMedia") {
      const payload = JSON.parse(formData.get("payload"));


      const { curriculumId, moduleId, topicId } = payload;

      const response = await ERPApi.post(
        `/batch/curriculum/${curriculumId}/modules/${moduleId}/topics/${topicId}/media`,
        payload,
      );


      return json({
        success: true,
        type: "addMedia",
        data: response.data,
      });
    }

    // ================= UPDATE MEDIA =================
    if (actionType === "updateMedia") {
      const curriculumId = formData.get("curriculumId");
      const mediaId = formData.get("mediaId");
      const payload = JSON.parse(formData.get("payload"));

      const response = await ERPApi.patch(
        `/batch/curriculum/${curriculumId}/media/${mediaId}`,
        payload,
      );


      return json({
        success: true,
        type: "updateMedia",
        data: response.data,
      });
    }

    // ================= DELETE MEDIA =================

    if (actionType === "deleteMedia") {
      const curriculumId = formData.get("curriculumId");
      const mediaId = formData.get("mediaId");


      const response = await ERPApi.delete(
        `/batch/curriculum/${curriculumId}/media/${mediaId}`,
      );


      return json({
        success: true,
        type: "deleteMedia",
        data: response.data,
      });
    }
    return json(
      { success: false, message: "Invalid actionType" },
      { status: 400 },
    );
  } catch (error) {
    console.error("MEDIA ACTION ERROR:", error);

    return json(
      {
        success: false,
        message: error.response?.data?.message || "Request failed",
      },
      { status: 500 },
    );
  }
};
