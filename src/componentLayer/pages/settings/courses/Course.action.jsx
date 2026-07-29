import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import Swal from "sweetalert2";

export const courseAction = async ({ request }) => {
    const formdata = await request.formData()
    const type = formdata.get("type");

    if (type === "delete") {
       try {
           const id = formdata.get("id");
           const { data, status } = await toast.promise(
               ERPApi.delete(`/batch/course/${id}`),
               {
                   pending: "Deleting the course...",
                   success: "Course deleted successfully",
                   // error: "Failed to delete course"
               }
           );
           return {
               data: data,
               success: status
           }
       } catch (e) {
           toast.error(e?.response?.data?.error)
           console.error(e,"Delete Error");
       }
    }

    return {
        data: {},
        success: false
    }
}

export const createCourseAction = async ({ request }) => {
    const formdata = await request.formData();
    const type = formdata.get("type")

    try {
        if (type === "createCourse") {
            const payload = formdata.get("payload");
            const response = await toast.promise(
                ERPApi.post(`/batch/course`, JSON.parse(payload)),
                {
                    pending: "Creating course...",
                    success: "Course created successfully!",
                    error: "Failed to create course.",
                }
            );

            return {
                response: response?.data,
                status: response.status
            };
        }
        if (type === "editCourse") {
            const payload = formdata.get("payload");
            const id = formdata.get("id");

            const response = await toast.promise(
                ERPApi.put(`/batch/course/${id}`, JSON.parse(payload)),
                {
                    pending: "Updating course...",
                    success: "Course updated successfully!",
                    error: "Failed to update course.",
                }
            );

            return {
                response: response?.data,
                status: response.status
            };
        }

    } catch (error) {
        console.error(error);
        return {
            name: "Vineeth"
        }
    }

}