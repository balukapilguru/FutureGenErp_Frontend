import { ERPApi } from "../../../../serviceLayer/interceptor"

export const LeadSourceLoader = async ({ request }) => {
    const url = new URL(request.url)
    try {
        const response = await ERPApi.get(`/settings/getleadsource${url.search}`);
        return {
            leadSource: response?.data || []
        };
    } catch (error) {
        return {
            leadSource: [],
            error: error.message || "An error occurred while fetching lead source data.",
        };
    }
};

export const LeadSourceCreateEditLoader = async ({ request,params }) => {
    const {id} = params
    try {
        const response = await ERPApi.get(`/settings/getleadsource/${id}`);
        return {
            leadSource: response?.data || []
        };
    } catch (error) {
        return {
            leadSource: [],
            error: error.message || "An error occurred while fetching lead source data.",
        };
    }
};


