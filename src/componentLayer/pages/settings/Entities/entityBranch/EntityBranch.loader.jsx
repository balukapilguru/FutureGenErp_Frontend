import { ERPApi } from "../../../../../serviceLayer/interceptor";


export const updateEntityBranchLoader = async ({ params }) => {
    const { branchId } = params;
    try {
        const [response, entityResponse] = await Promise.all([
            ERPApi.get(`branch/branchgetbyid/${branchId}`),
            ERPApi.get(`entity/getallentities?pageSize=100`)
        ])
        const entityBranchData = response?.data;
        const entityList = entityResponse?.data?.data?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || [];

        return {
            entityBranchData: entityBranchData,
            entityList: entityList
        }
    } catch (error) {
        console.error(error)
        return {
            entityBranchData: {}
        }
    }
}

export const createEntityBranchLoader = async ({ request }) => {
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


export const EntityBranchLoader = async ({ request, params }) => {
    const url = new URL(request.url);
    try {
        const [response,entityResponse] = await Promise.all([
            ERPApi.get(`branch/getallBranches${url?.search}`),
            ERPApi.get(`entity/getallentities`)
        ])
        const entities = entityResponse?.data?.data?.map((item)=> (
            {label:item.name,value:item.id}
        ))
        const branchList = response?.data;
        return {
            branchList: branchList,
            entitiesOptions:entities
        }
    } catch (error) {
        return {
            branchList: {}
        }
        console.error(error)
    }
}