import { ERPApi } from "../../../../serviceLayer/interceptor";

export const coursePackageLoader = async ({request}) => {
    const url = new URL(request.url);
    try {
        const coursePackageResponse = await Promise.all([
            ERPApi.get(`/settings/getallpaginatedcoursepackages${url.search}`)
            // ERPApi.get(`/settings/getcoursespackages${url.search}`)
        ])
        return {
            coursePackage: coursePackageResponse?.[0]?.data
        }
    } catch (error) {
        console.error(error)
        return {
        coursePackage: {}
    }
    }
}

export const coursePackageByidLoader = async ({params}) => {    
    const id = params.id;
      try {
        const coursePackageData = await Promise.all([
            ERPApi.get(`/settings/getcoursepackages/${id}`)
        ])
        return {
            coursePackage: coursePackageData
        }
    } catch (error) {
        console.error(error)
        return {
        coursePackage: {}
    }
    }
}