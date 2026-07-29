import { toast } from "react-toastify";
import { ERPApi } from "../../../../../serviceLayer/interceptor";

export const VouchersDashboardAction = async ({ request }) => {
    const formdata = await request.formData();
    const razorpayLink = formdata.get("razorpayLink");
    const registrationFormId = formdata.get("registrationFormId");
    const voucherCodeId = formdata.get("voucherCodeId");
    const baseUrl = formdata.get("baseUrl");
    const voucherClaimType = formdata.get("voucherClaimType");
    const payload = { razorpayLink:razorpayLink, registrationformId:registrationFormId, voucherId:voucherCodeId, baseUrl:baseUrl, voucherClaimType:voucherClaimType };


    try {
        const response = await toast.promise(
            ERPApi.patch("vouchers/updateLinks", payload),
            {
                pending: "Updating voucher links...",
                success: "Voucher links updated successfully 🎉",
            }
        );

        const responseData = response.data;
        return {
            voucherDataResponse: responseData,
            status: response?.status || ""
        };
    } catch (error) {
        console.error(error)
        console.error(error, error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
        return {
            voucherDataResponse: {},
        };
    }
} 