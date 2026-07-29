import { ERPApi } from "../../../serviceLayer/interceptor";
 
export const WalletWithDrawlsRequestsLoader = async ({request,params}) => {
    const url = new URL(request.url);
    try {
        // Perform any data fetching or processing here
        // For example, fetching withdrawal requests from an API
        const response = await ERPApi.get(`wallet/get-admin-withdrawRequests${url.search}`);
        const data = response.data;
        return { withdrawalRequests: data };
    } catch (error) {
        console.error('Error in WalletWithDrawlsRequestsLoader:', error);
        throw error;
    }
}
 