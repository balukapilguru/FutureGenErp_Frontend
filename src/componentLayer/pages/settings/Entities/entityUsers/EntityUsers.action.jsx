import { toast } from "react-toastify";
import { ERPApi } from "../../../../../serviceLayer/interceptor";

export const createEntityUserAction = async ({ request, params }) => {
    const formdata = await request.formData();
    const name = formdata.get("name")
    const email = formdata.get("email")
    const phone_number = formdata.get("phone_number")
    const branch_id = formdata.get("branch_id")
    const entity_id = formdata.get("entity_id")

    const payload = {
        name: name,
        email: email,
        phone_number: phone_number,
        branch_id: Number(branch_id),
        entity_id: Number(entity_id)
    }
    try {
        const response = await toast.promise(ERPApi.post('users/createUser', payload),
            {
                pending: "Creating user...",
                success: "User created successfully!",
                error: "Failed to create user.",
            }
        )
        return {
            data: response.data,
            status: response.status
        }
    } catch (error) {
        console.error(error)

        toast.error(error?.response?.data?.message)
        return {
            data: {},
            status: 400
        }
    }
}
export const updateEntityUserAction = async ({ request, params }) => {
    const formdata = await request.formData();
    const name = formdata.get("name")
    const email = formdata.get("email")
    const phone_number = formdata.get("phone_number")
    const branch_id = formdata.get("branch_id")
    const entity_id = formdata.get("entity_id")

    const payload = {
        name: name,
        email: email,
        phone_number: phone_number,
        branch_id: Number(branch_id),
        entity_id: Number(entity_id)
    }
    try {
        const response = await toast.promise(ERPApi.put('users/update-user', payload),
            {
                pending: "Updating user...",
                success: "User updated successfully!",
                error: "Failed to update user.",
            }
        )
        return {
            data: response.data,
            status: response.status
        }
    } catch (error) {
        console.error(error)
        toast.error(error?.response?.data?.message)
        return {
            data: {},
            status: 400
        }
    }
}