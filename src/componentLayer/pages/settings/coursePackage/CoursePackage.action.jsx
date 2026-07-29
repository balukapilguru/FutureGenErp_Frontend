import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { redirect } from "react-router-dom";
import { ERPApi } from "../../../../serviceLayer/interceptor";

export const coursePackageAction = async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get("actionType");
    const id = formData.get("id");

    // Only proceed if actionType is delete
    if (actionType === "delete") {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this Course Package",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                // show pending toast during delete request
                const { status } = await toast.promise(
                    ERPApi.delete(`/settings/deletecoursepackage/${id}`),
                    { pending: "Deleting The Course Package..." }
                );

                if (status === 200) {
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Course Package Deleted Successfully.",
                        icon: "success",
                    });

                    // after successful deletion, you can redirect or refresh data
                    //return  // adjust the route as needed
                }
            } catch (error) {
                const errorMessage =
                    error?.response?.data?.message ||
                    "Course Package Delete Failed. Please try again.";

                await Swal.fire({
                    title: "Error!",
                    text: errorMessage,
                    icon: "error",
                });
            }
        }
    }
    if (actionType === "toggleUserStatus") {
        const name = formData.get("coursepackages_name");
        const createdBy = formData.get("createdby");
        const newStatus = formData.get("isToggle");
        const id = formData.get("id");
        try {
            const { data, status } = await toast.promise(
                ERPApi.patch(`/settings/updatecoursepackages/${id}`, {
                    isToggle: Number(newStatus),
                    coursepackages_name: name,
                    createdby: createdBy,
                }),
                {
                    pending: "Updating Status...",
                    success: "Status Updated!",
                    error: "Failed to update status",
                }
            )
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Something went wrong.";
            toast.error(errorMessage);
            return {
                success: false,
                message: error?.message
            }
        }
    }

    return null; // default return if nothing happens
};

export const createCoursePackageAction = async ({ request, params }) => {
    const formData = await request.formData();
    const actionType = formData.get("actionType");
    const id = formData.get("id");
    const data = JSON.parse(formData.get("data"));

    try {
        if (actionType === "create") {
            const { status } = await toast.promise(
                ERPApi.post("/settings/addcoursespackages", data),
                {
                    pending: "Creating Course Package...",
                    success: "Course Package Created Successfully!",
                    error: "Failed to create Course Package!",
                }
            );

            if (status === 201) {
                await Swal.fire({
                    title: "Created!",
                    text: "Course Package Created Successfully.",
                    icon: "success",
                });
                return {status}
            }
        } else if (actionType === "update" && id) {
            const { status } = await toast.promise(
                ERPApi.patch(`/settings/updatecoursepackages/${id}`, data),
                {
                    pending: "Updating Course Package...",
                    success: "Course Package Updated Successfully!",
                    error: "Failed to update Course Package!",
                }
            );

            if (status === 200) {
                await Swal.fire({
                    title: "Updated!",
                    text: "Course Package Updated Successfully.",
                    icon: "success",
                });
                return {status};
            }
        }
    } catch (error) {
        console.error("Course Package Action Error:", error);
        const errorMessage =
            error?.response?.data?.message ||
            "Something went wrong. Please try again.";
        await Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
        });
    }

    return null;
};
