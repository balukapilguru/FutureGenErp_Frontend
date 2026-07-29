import { ERPApi } from "../../../../serviceLayer/interceptor";

export const updateEntityLoader = async ({ params }) => {
    const entityId = params.entityId;
    try {
        const response = await ERPApi.get(`entity/entitygetbyid/${entityId}`)
        const entityData = response?.data;
        return {
            entityData: entityData
        }
    } catch (error) {
        return {
            entityData: {}
        }
        console.error(error)
    }
}


export const EntityLoader = async ({ request, params }) => {
    const url = new URL(request.url);
    try {
        const response = await ERPApi.get(`entity/getallentities${url?.search}`)
        const entityList = response?.data;
        return {
            entityList: entityList,
        }
    } catch (error) {
        console.error(error)
        return {
            entityList: {},
        }
    }
}