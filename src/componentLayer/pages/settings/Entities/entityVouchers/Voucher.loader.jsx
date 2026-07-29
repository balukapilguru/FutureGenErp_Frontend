import { ERPApi } from "../../../../../serviceLayer/interceptor";


export const VouchersDashboardLoader = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const tab = url.searchParams.get("filter");

        if (tab === "voucherLeads") {
            const [vouchersLeads, entityResponses] = await Promise.all([
                ERPApi.get(`voucherLeads/getall${url.search}`),
                ERPApi.get(`entity/getallentities`)
            ]);
            const entityList = entityResponses?.data?.data?.map(entity => ({
                label: entity.name, value: entity.id
            }))
            return {
                voucherdata: vouchersLeads?.data ?? [],
                entityList: entityList ?? []
            };
        }

        const [response, entityResponse, registrationFormResponse] = await Promise.all([
            ERPApi.get(`vouchers/getall${url.search}`),
            ERPApi.get(`entity/getallentities`),
            ERPApi.get(`/registrationform/all`)
        ]);

        const entityList = entityResponse?.data?.data?.map(entity => ({
            label: entity.name, value: entity.id
        }))
        const registrationFormData = registrationFormResponse?.data?.forms;
        return {
            voucherdata: response?.data ?? [],
            entityList: entityList ?? [],
            registrationFormData: registrationFormData ?? []
        };
    } catch (error) {
        console.error("VouchersDashboardLoader error:", error);
        return {
            voucherdata: {},
            entityList: {},
            registrationFormData: []
        };
    }
};
