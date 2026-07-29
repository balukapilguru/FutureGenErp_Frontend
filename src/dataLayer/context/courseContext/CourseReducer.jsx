const CourseReducer = (state, action) => {

    switch (action.type) {
        case "SET_COURSES":
            return {
                ...state,
                courses: action?.payload?.reversedCourses,
            };

        case "DELETE_COURSE":
            let id = action.payload.id;
            id = parseInt(id);
            return {
                ...state,
                courses: (state.courses || []).filter(course => course.id !== id)
            };

        case "SET_PAGINATED_COURSES_LIST":
            const reducerData = action?.payload;

            return {
                ...state,
                coursesList: {
                    ...state?.coursesList,
                    paginatedCoursesList: reducerData?.reversedCourses,
                    totalPages: reducerData?.totalPages,
                    searchResultCourses: reducerData?.searchResultCourses,
                    perPage: reducerData?.pageSize,
                    startCourse: reducerData?.startCourse,
                    endCourse: reducerData?.endCourse,
                    totalCourses: reducerData?.totalCourses,
                    currentPage: reducerData?.currentPage,
                }
            }
        case "SET_LOADING":
            return {
                ...state,
                coursesList: {
                    ...state.coursesList,
                    loading: !state.coursesList.loading,
                }
            }

        case "SET_SEARCH":
            return {
                ...state,
                coursesList: {
                    ...state.coursesList,
                    search: action?.payload?.data,
                    perPage: 10,
                    currentPage: 1,
                }
            }

        case "SET_PER_PAGE":
            return {
                ...state,
                coursesList: {
                    ...state.coursesList,
                    perPage: action?.payload?.data,
                    currentPage: 1,
                }
            }

        case "SET_CUSTOM_PAGE":
            return {
                ...state,
                coursesList: {
                    ...state.coursesList,
                    currentPage: action?.payload?.data,
                }
            }

        default:
            return state;
    }

}
export default CourseReducer;