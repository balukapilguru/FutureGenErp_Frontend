import { ERPApi } from "../../../../serviceLayer/interceptor";

export const createCertificateLoader = async ({ params }) => {
    const { id } = params;

    try {
        const [branchResponse, courseResponse, userData] = await Promise.all([
            ERPApi.get(`/settings/getbranch`,{
                params: { pageSize: 100 }
            }).catch(() => ({ data: [] })),
            ERPApi.get(`/batch/course`).catch(() => ({ data: [] })),
            id
                ? ERPApi.get(`/sc/getstudentcertificate/${id}`).catch(() => ({ data: null }))
                : Promise.resolve({ data: null })
        ]);

        return {
            branch: branchResponse.data,
            courses: courseResponse.data,
            userInfo: userData.data
        };
    } catch (e) {
        return {
            branch: [],
            courses: [],
            userInfo: null
        };
    }
};
