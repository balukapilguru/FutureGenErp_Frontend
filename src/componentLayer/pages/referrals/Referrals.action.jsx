import { toast } from "react-toastify";
import { ERPApi } from "../../../serviceLayer/interceptor"

export const ReferralsAction = async ({ request }) => {
    const formData = await request.formData();
    const status = formData.get("status");
    const id = formData.get("id");
    try {
        const response = await toast.promise(
            ERPApi.put(`/referral/statusupdate/${id}`, { status }),
            {
                pending: "Updating status...",
                success: "Status updated successfully 🎉",
                error: {
                    render({ data }) {
                        // data = error object
                        return data?.response?.data?.message || "Failed to update status ❌";
                    }
                }
            }
        );
        return {
            referral : response?.data
        }

    } catch (error) {
        console.error(error)
        return {
            status: false,
        }
    }
} 