import { ERPApi } from "../../../../serviceLayer/interceptor";

export const StudentRegistrationFromLoader = async ({ request, params }) => {

    const url = new URL(request.url);
    const active = parseInt(url.searchParams.get("active"));
    const coursepackageIdparams = parseInt(url.searchParams.get("coursepackageId"))

    try {
        const [coursePackageData, BranchesData, leadSourceData, coursesResponse] =
            await Promise.all([
                ERPApi.get(`settings/getcoursespackages`),
                ERPApi.get(`/settings/getbranch`),
                ERPApi.get(`/settings/getleadsource`),
                coursepackageIdparams ? ERPApi.get(`batch/course/getcoursesfromcoursepackage/${coursepackageIdparams}`) : null
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
        const courseData = coursesResponse?.data

        return { coursePackageList, BranchsList, leadSourceList, active, courseData, coursepackageIdparams };
    } catch (error) {
        console.error(error);
        return {
            coursePackageList: [],
            BranchsList: [],
            leadSourceList: [],
            active: null,
            courseData: []
        }
    }
};