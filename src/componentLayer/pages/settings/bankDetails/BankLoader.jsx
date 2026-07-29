import { ERPApi } from "../../../../serviceLayer/interceptor";



//getting all bank data
export const bankDetailsLoader = async ({ request }) => {
    const url = new URL(request.url);
    const queryParams = url.search;
    try {
        const response = await ERPApi.get(`/bank/all${queryParams ? queryParams : `?page=1&pageSize=10&search=`}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

//getting bankDetails data by id
export const bankDetailsLoaderById = async ({ params }) => {
    try {
        const response = await ERPApi.get(`/bank/byId/${params.id}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching bank details:", error);
        throw new Response("Failed to load bank details", { status: 500 });
    }
};



