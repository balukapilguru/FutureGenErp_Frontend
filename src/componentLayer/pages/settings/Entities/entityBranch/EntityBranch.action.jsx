import { toast } from "react-toastify";
import { ERPApi } from "../../../../../serviceLayer/interceptor";

export const createEntityBranch = async ({ request, params }) => {
    const formdata = await request.formData();
    const branch = formdata.get("branch")
    const entity_id = formdata.get("entity_id")

    const payload = {
        branch_name: branch,
        entity_id: entity_id
    }
    try {
        const response = await toast.promise(ERPApi.post('branch/create', payload),
            {
                pending: "Creating branch...",
                success: "Branch created successfully!",
                error: "Failed to create branch.",
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



export const updateEntityBranchAction = async ({ request, params }) => {
    const {branchId} = params;
    const formdata = await request.formData();
    const branch = formdata.get("branch")
    const entity_id = formdata.get("entity_id")
    const payload = {
        branch_name: branch,
        entity_id: entity_id
    }
    try {
        const response = await toast.promise(ERPApi.put(`branch/update/${branchId}`, payload),
            {
                pending: "Updating branch...",
                success: "Branch updated successfully!",
                error: "Failed to update branch.",
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