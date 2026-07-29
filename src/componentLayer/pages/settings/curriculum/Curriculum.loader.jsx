import { ERPApi } from "../../../../serviceLayer/interceptor";

export const curriculumLoader = async ({ request }) => {
    try {
        const url = new URL(request.url);
        // const response = await ERPApi.get(`/batch/curriculum${url.search}`);
        const response = await ERPApi.get(`/batch/curriculum/getpaginatedcurriculums${url.search}`);
        const data = response?.data;

        return { curriculumData: data };
    } catch (error) {
        console.error("Error loading curriculum:", error);

        // Optionally return a safe fallback
        return {
            curriculumData: null,
        };
    }
};


export const addCurriculum = async ({  params }) => {
    const id = params.id;
    try {
        const response = await ERPApi.get(`/batch/module?curriculumId=${id}`);
        const data = response?.data?.modules
        return {
            curriculums: data
        }
    } catch (error) {
        return {
            curriculums: [],
            error: error?.response?.data ?? "Failed to load curriculum",
        };
    }
}

// Loader function for topics
// Loader function for topics - FIXED
export const mediaLoader = async ({ params }) => {
   const { curriculumId } = params;
    try {
        const response = await ERPApi.get(`/batch/curriculum/${curriculumId}/media`);
        const data = response?.data;
        
        // The API returns an array directly, not an object with modules property
        return {
            modules: Array.isArray(data) ? data : [], // If it's an array, use it directly
            curriculumId: curriculumId,
            error: null
        };
    } catch (error) {
        console.error("Error loading topics:", error);
        return {
            modules: [],
            curriculumId: curriculumId
        };
    }
};