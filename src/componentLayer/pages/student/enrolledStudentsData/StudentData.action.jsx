import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";

export const StudentDataAction = async ({ request, params }) => {
    const formData = await request.formData();
    const type = formData.get("type");

    if (type === "deactivation") {
        const reasonText = formData.get("reasonText");
        const selectedUserId = formData.get("selectedUserId");
        const status = formData.get("status");

        try {
            const { data, status: httpStatus } = await ERPApi.put(
                `/student/updateStudentsStatus/${selectedUserId}`,
                {
                    status: Number(status),
                    reasonText,
                }
            );
            return { success: true, data, status: httpStatus };
        } catch (error) {
            console.error("Deactivation error:", error);
            return { success: false, error: error.message || "Unknown error" };
        }
    } else if (type === "activation") {
        const selectedUserId = formData.get("selectedUserId");
        const status = formData.get("status");
        const description = formData.get("description");

        try {
            const { data, status: httpStatus } = await ERPApi.put(
                `/student/updateStudentsStatus/${selectedUserId}`,
                {
                    status: Number(status),
                    description: description,
                }
            );
            return { success: true, data, status: httpStatus };
        } catch (error) {
            console.error("Activation error:", error);
            return { success: false, error: error.message || "Unknown error" };
        }
    } else if (type === "assignBatch") {
        const assignBatchData = JSON.parse(formData.get("assignBatchData"));
        const id = formData.get("id");
        try {
            const response = await ERPApi.patch(
                `${import.meta.env.VITE_API_URL}/batch/assignStudent/${id}`,
                assignBatchData
            );
            if (response?.status === 200 || response?.status === 201) {
                toast.success("Batch Assigned Successfully");
                return {
                    data: response?.data,
                    status: response?.status,
                    success: true,
                };
            }
            return {
                data: response?.data,
                status: response?.status,
            };
        } catch (error) {
            console.error("Assign batch error:", error);
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Error while assigning batch";
            toast.error(errorMessage);
            return {
                success: false,
                status: error?.response?.status || 400,
                error: errorMessage,
            };
        }
    }

    return { success: false, message: "Unknown or missing action type." };
};
