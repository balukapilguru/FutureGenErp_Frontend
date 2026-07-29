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
        const id = formData.get("id")
        const { data, status } = await toast.promise(
            ERPApi.patch(
                `${import.meta.env.VITE_API_URL}/batch/assignStudent/${id
                }`,
                assignBatchData
            ),
            {
                success:"Batch Assigned Successfully",
                pending: "Assigning Student to Batch",
                error: "Error while assigning batch",
            }
        );
        return {
            data,
            status
        };
    }

    return { success: false, message: "Unknown or missing action type." };
};
