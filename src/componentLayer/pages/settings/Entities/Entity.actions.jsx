import { toast } from "react-toastify";
import { ERPApi } from "../../../../serviceLayer/interceptor";

export const updateEntityAction = async ({ request, params }) => {
    const formdata = await request.formData();
    const name = formdata.get("name");
    const email = formdata.get("email");
    const phone_number = formdata.get("phone_number");
    const entityImage = formdata.get("entityImage");
    const entityId = params.entityId;
    const payload = { name, email, phone_number };

    try {
        const response = await toast.promise(ERPApi.put(`/entity/update/${entityId}`, formdata),
            {
                pending: "Updating entity...",
                success: "Entity updated successfully!",
                error: "Failed to update entity.",
            }
        );
        const responseData = response.data;
        return {
            entityData: responseData,
            status: 201
        };
    } catch (error) {
        console.error(error, error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
        return {
            entityData: {},
        };
    }
}
export const createEntityAction = async ({ request }) => {
    const formdata = await request.formData();
    const name = formdata.get("name");
    const email = formdata.get("email");
    const phone_number = formdata.get("phone_number");
    const entityImage = formdata.get("entityImage");
    const payload = { name, email, phone_number };

    try {
        const response = await toast.promise(ERPApi.post(`/entity/create`, formdata),
            {
                pending: "Creating entity...",
                success: "Entity created successfully!",
                error: "Failed to create entity.",
            }
        );
        const responseData = response.data;
        return {
            entityData: responseData,
            status: response?.status || ""
        };
    } catch (error) {
        console.error(error)
        console.error(error, error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
        return {
            entityData: {},
        };
    }
} 