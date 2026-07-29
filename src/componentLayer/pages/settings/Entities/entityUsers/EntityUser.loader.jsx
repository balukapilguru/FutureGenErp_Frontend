import { ERPApi } from "../../../../../serviceLayer/interceptor";

export const EntityUserLoader = async ({ request, params }) => {
    const url = new URL(request.url);
    try {
        const [response, entityResponse] = await Promise.all([
            ERPApi.get(`users/getAllUsers${url?.search}`),
            ERPApi.get(`entity/getallentities`),
        ])
        const entities = entityResponse?.data?.data?.map((item) => (
            { label: item.name, value: item.id }
        ))
        const usersList = response?.data;
        return {
            usersList: usersList,
            entitiesOptions:entities
        }
    } catch (error) {
        return {
            usersList: {}
        }
        console.error(error)
    }
}


export const createEntityUserLoader = async ({ request, params }) => {
    try {
        const entityResponse = await ERPApi.get(`entity/getallentities?pageSize=100`)
        const entityList = entityResponse?.data?.data?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || [];

        return {
            entityList: entityList
        }
    } catch (error) {
        console.error(error)
        return {
            entityList: {}
        }
    }
}
export const updateEntityUserLoader = async ({ request, params }) => {
    const { userId } = params;
    try {
        const [entityResponse, entityBranchData] = await Promise.all([
            ERPApi.get(`entity/getallentities?pageSize=100`),
            ERPApi.get(`users/getUserById/${userId}`),
        ])
        const entityList = entityResponse?.data?.data?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || [];

        return {
            entityBranchData: entityBranchData?.data,
            entityList: entityList
        }
    } catch (error) {
        console.error(error)
        return {
            entityBranchData:{},
            entityList: {}
        }
    }
}
// export const createEntityUserAction = async ({ request, params }) => {
//     const formData = await request.formData();
//     const name = formData.get("name")
//     const email = formData.get("email")
//     const phone_number = formData.get("phone_number")
//     const entity_id = formData.get("entity_id")
//     const branch_id = formData.get("branch_id")

//     const payload = {
//         name: name,
//         emali: email,
//         phone_number: phone_number,
//         entity_id: entity_id,
//         branch_id: branch_id
//     }
// }