import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";


export const leadSourceAction = async ({ request, params }) => {
    try {
        const formData = await request.formData();
        const id = formData.get("id");
        if (!id) {
            throw new Error("Lead source ID is required.");
        }

        const { data, status } = await toast.promise(
            ERPApi.delete(`${import.meta.env.VITE_API_URL}/settings/deleteleadsource/${id}`),
            {
                loading: "Deleting lead source...",
                success: "Lead source deleted successfully!",
                error: "Failed to delete lead source. Please try again.",
            }
        );

        return {
            status: status,
            data: data,
        };
    } catch (error) {
        console.error("Error in leadSourceAction:", error);
        return {
            status: "error",
            message: error.message || "An unexpected error occurred during the lead source deletion.",
        };
    }
};

export const LeadSourceCreateEditAction = async ({ request }) => {
    try {
        const formData = await request.formData();
        const type = formData.get("type");
        const id = formData.get("id");
        const user = JSON.parse(formData.get("user"));

        if (!type || !user) {
            throw new Error("Missing required form data: type or user");
        }

        // Determine API endpoint and method dynamically
        const isCreate = type === "create";
        const url = isCreate
            ? `${import.meta.env.VITE_API_URL}/settings/addleadsource`
            : `${import.meta.env.VITE_API_URL}/settings/updateleadsource/${id}`;
        const method = isCreate ? ERPApi.post : ERPApi.put;

        // Show toast while performing API request
        const { data, status } = await toast.promise(
            method(url, user),
            {
                pending: "Loading...",
                success: isCreate
                    ? "LeadSource created successfully"
                    : "LeadSource updated successfully",
                error: isCreate
                    ? "Failed to create LeadSource"
                    : "Failed to update LeadSource",
            }
        );

        return { data, status }; // Return API response if needed
    } catch (error) {
        console.error("LeadSourceCreateEditAction error:", error);
        toast.error(error?.message || "Something went wrong!");
        return { error: error?.message || "Unknown error" };
    }
};