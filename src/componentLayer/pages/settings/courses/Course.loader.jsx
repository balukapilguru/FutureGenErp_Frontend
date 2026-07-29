import { ERPApi } from "../../../../serviceLayer/interceptor";

export const CourseLoader = async ({request}) => {
    const url = new URL(request.url);
    try {
        const response = await ERPApi.get(`/batch/course${url.search}`)
        return{
            courseList:response?.data
        }
    } catch (error) {
        console.error(error);
        return {
            courseList:[]
        }
    }
}
export const createCourseLoader = async ({request,params}) => {
    const url = new URL(request.url);
    const id = params?.id
    try {
        const [coursePackageResponse,curriculumResponse,courseByIdResponse] = await Promise.all([
            ERPApi.get(`/settings/getcoursespackages${url.search}`),
            ERPApi.get(`/batch/curriculum${url.search}`),
            id? ERPApi.get(`/batch/course/${id}`) : null
        ])
        return{
            coursePackage:coursePackageResponse?.data,
            curriculum: curriculumResponse?.data,
            courseByIdResponse:courseByIdResponse?.data
        }
    } catch (error) {
        console.error(error);
        return {
            coursePackage:[]
        }
    }
}