import { ERPApi } from "../../../../serviceLayer/interceptor";

import { toast } from "react-toastify";

export const departmentAction = async ({ request, params }) => {
    const formdata = await request.formData();
    const departmentId = formdata.get("departmentId");

    try {
        const response = await toast.promise(
            ERPApi.delete(`/settings/deletedepartment/${departmentId}`, { id: departmentId }),
            {
                pending: "Deleting department...",
                success: "Department deleted successfully!",
                error: "Failed to delete department.",
            }
        );
        return response.data;
    } catch (error) {
        console.error("Delete department error:", error);
        throw error;
    }
};

export const departmentCreateEditAction = async ({ request, params }) => {
    try {
        const formData = await request.formData();
        const type = formData.get("type");
        const user = formData.get("user");
        const id = formData.get("id");

        if (!user) throw new Error("User data is required");

        const parsedUser = JSON.parse(user);

        let response;

        if (type === "create") {
            response = await toast.promise(
                ERPApi.post(`/settings/adddepartment`, parsedUser),
                {
                    pending: "Creating department...",
                    success: "Department created successfully",
                    error: "Failed to create department",
                }
            );
        } else if (type === "edit") {
            if (!id) throw new Error("Department ID is required for edit");

            response = await toast.promise(
                ERPApi.put(`/settings/updatedepartment/${id}`, parsedUser),
                {
                    pending: "Updating department...",
                    success: "Department updated successfully",
                    error: "Failed to update department",
                }
            );
        } else {
            throw new Error("Invalid operation type");
        }

        // Return both status and data for better handling
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Department action error:", error);
        return { status: "error", message: error.message };
    }
};