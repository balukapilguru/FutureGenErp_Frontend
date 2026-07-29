import { ERPApi } from "../../../../serviceLayer/interceptor";

export const PreOnboardingLoader = async ({ request, params }) => {
    const { studentId } = params;
    const url = new URL(request.url);
    const coursepackageId = url.searchParams.get("coursepackage");

    try {
        const [response, coursePackageData, BranchesData, leadSourceData, coursesResponse] =
            await Promise.all([
                ERPApi.get(`/preadmission/get/${studentId}`),
                ERPApi.get(`settings/getcoursespackages`),
                ERPApi.get(`/settings/getbranch`),
                ERPApi.get(`/settings/getleadsource`),
                coursepackageId ? ERPApi.get(`batch/course/getcoursesfromcoursepackage/${coursepackageId}`) : null
            ]);

        const coursePackageList = coursePackageData?.data?.coursePackageData?.map((item) => ({
            label: item?.coursepackages_name,
            value: item.id,
            createdby: item.createdby,
            isToggle: item.isToggle
        }));

        const BranchsList = BranchesData?.data?.branchData?.map((item) => ({
            label: item?.branch_name,
            value: item.id,
        }));

        const leadSourceList = leadSourceData?.data?.leadSourceData?.map((item) => ({
            label: item?.leadsource,
            value: item.id,
        }));
        const courseData = coursesResponse?.data;

        return {
            preOnBoardStudentData: response.data,
            coursePackageList: coursePackageList,
            BranchsList: BranchsList,
            leadSourceList: leadSourceList,
            courseData: courseData
        };

    } catch (error) {
        console.error(error);
        return { preOnBoardStudentData: {} };
    }
};
