import { ERPApi } from "../../../serviceLayer/interceptor";

export const ReferralsLoader = async ({ request }) => {
    const url = new URL(request.url)
    try {
        const response = await ERPApi.get(`/referral/getstudentreferallbyinhouseusers${url?.search}`)
        return {
            referrals:response,
        };
    } catch (error) {
        console.error(error);
        return {
            referrals: []
        }
    }
}