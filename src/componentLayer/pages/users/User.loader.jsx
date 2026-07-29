import { getAllUsersWithOutCouncellers } from "../../../dataLayer/context/usersContext/utils/UsersAPIs"
import { ERPApi } from "../../../serviceLayer/interceptor"
import { getAllBranches } from "../newDashboard/utils/DataUtilities"

const fetchUserBaseData = async () => {
    try {
        const [branchData, allUsersWithoutCounsellors, departmentData, coursesData, rolesResponse] =
            await Promise.allSettled([
                getAllBranches(),
                getAllUsersWithOutCouncellers(),
                ERPApi.get(`/settings/getdepartment`),
                ERPApi.get(`/batch/course`),
                ERPApi.post(`/roles/getroles`, {
                    pageSize: 30,
                    search: "",
                    page: 1,
                }),
            ]);
        return {
            branches: branchData.status === "fulfilled" ? branchData.value?.data || [] : [],
            users:
                allUsersWithoutCounsellors.status === "fulfilled"
                    ? allUsersWithoutCounsellors.value?.data?.userswithoutcounselor || []
                    : [],
            departments: departmentData.status === "fulfilled" ? departmentData.value?.data || [] : [],
            courses:
                coursesData.status === "fulfilled"
                    ? coursesData.value?.data?.reversedCourses || []
                    : [],
            roles: rolesResponse.status === "fulfilled" ? rolesResponse.value?.data?.roles || [] : [],
            AllRoles: rolesResponse.status === "fulfilled" ? rolesResponse.value?.data?.roleNames || [] : [],
        };
    } catch (err) {
        console.error("Unexpected error while fetching base data:", err);
        return {
            branches: [],
            users: [],
            departments: [],
            courses: [],
            roles: [],
            AllRoles: []
        };
    }
};

export const createUserLoader = async ({ request, params }) => {
    try {
        const baseData = await fetchUserBaseData();

        return {
            branches: baseData.branches,
            users: baseData.users,
            departments: baseData.departments,
            courses: baseData.courses,
            roles: baseData.roles,
            AllRoles: baseData.AllRoles
        };
    } catch (err) {
        console.error("Error in createUserLoader:", err);
        return {
            branches: [],
            users: [],
            departments: [],
            courses: [],
            roles: [],
            AllRoles: []
        };
    }
};



export const editUserLoader = async ({ request, params }) => {
    try {
        if (!params.id) throw new Error("User ID is required for editUserLoader");
        const [baseData, userResponse] = await Promise.allSettled([
            fetchUserBaseData(),
            ERPApi.get(`/user/viewuser/${params.id}`),
        ]);

        return {
            branches: baseData.status === "fulfilled" ? baseData.value.branches : [],
            users: baseData.status === "fulfilled" ? baseData.value.users : [],
            departments: baseData.status === "fulfilled" ? baseData.value.departments : [],
            courses: baseData.status === "fulfilled" ? baseData.value.courses : [],
            roles: baseData.status === "fulfilled" ? baseData.value.roles : [],
            AllRoles: baseData.status === "fulfilled" ? baseData.value.AllRoles : [],
            user: userResponse.status === "fulfilled" ? userResponse.value?.data || null : null,
        };
    } catch (err) {
        console.error("Error in editUserLoader:", err);
        return {
            branches: [],
            users: [],
            departments: [],
            courses: [],
            roles: [],
            AllRoles: [],
            user: null,
        };
    }
};
