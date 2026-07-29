import { toast } from "react-toastify";
import { ERPApi } from "../../../serviceLayer/interceptor";

export const WalletWithDrawlsRequestsAction = async ({ request, params }) => {
    const url = new URL(request.url);
    const data = Object.fromEntries(await request.formData());

    try {
        const response = await toast.promise(
            ERPApi.post(`wallet/process-withdraw-request${url.search}`, data),
            {
                pending: "Processing your withdrawal request...",
                success: (response) => response?.data?.data?.message || 'Withdrawal request processed successfully.',
                error: (error) => {
                    const errorMessage = error?.response?.data?.message || 'Failed to process withdrawal request.';
                    return errorMessage;
                }
            }
        );
        if (response?.data?.data?.success) {
            return { successMessage: response?.data?.data?.message || 'Withdrawal request processed successfully.', response: response?.data };
        } else {
            return { errorMessage: 'Failed to process withdrawal request.' };
        }
    } catch (error) {
        console.error('Error in WalletWithDrawlsRequestsAction:', error);
        return { errorMessage: 'Failed to process withdrawal request.' };
    }
};
