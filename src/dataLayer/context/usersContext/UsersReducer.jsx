import * as ActionTypes from "./utils/UsersActionTypes"

const UsersReducer = (state, action) => {

    switch (action?.type) {
        
        case ActionTypes.UPDATE_USER_REMARKS_HISTORY:
            const checkUser = (state?.EnrolledUsers?.PaginatedUsers || []).filter((user) => user.id === action.payload.id);
            const userindex = (state?.EnrolledUsers?.PaginatedUsers || []).findIndex((user) => user.id === action.payload.id)
            if (checkUser) {
                let updatedUsers = [...state?.EnrolledUsers?.PaginatedUsers]
                updatedUsers[userindex].user_status = action?.payload?.user_status;
                updatedUsers[userindex].user_remarks_history = action?.payload?.user_remarks_history;

                return {
                    ...state,
                    EnrolledUsers: {
                        ...state.EnrolledUsers,
                        PaginatedUsers: updatedUsers
                    }
                }
            }
            else {
                return state?.EnrolledUsers?.PaginatedUsers
            }
            break;


        case ActionTypes.GET_SINGLE_USER:
            return {
                ...state,
                SingleUser: action?.payload?.data?.user
            }

        case ActionTypes.SET_ALL_USERS:
            return {
                ...state,
                TotalUsers: action?.payload
            }
            break;

        case ActionTypes.SET_ALL_COUNCELLERS:
            return {
                ...state,
                TotalUsersWithCountellers: action?.payload?.userswithcounselor
            }
            break;


        case ActionTypes.SET_ALL_USERS_WITHOUT_COUNCELLERS:
            return {
                ...state,
                TotalUsersWithOutCountellers: action?.payload?.userswithoutcounselor
            }


        case ActionTypes.CREATE_USER:
            return {
                ...state,
                TotalUsers: [...state.TotalUsers, action.payload]
            }

        case ActionTypes.SET_LOADING:
            return action.payload.context === "ENROLLED_USERS" ? {
                ...state,
                EnrolledUsers: {
                    ...state.EnrolledUsers,
                    loading: !state.EnrolledUsers.loading
                }
            } : null;


        case ActionTypes.SET_PAGINATED_USERS:
            const reducerData = action?.payload?.data
            return action?.payload?.context === "ENROLLED_USERS" ? {
                ...state,
                EnrolledUsers: {
                    ...state?.EnrolledUsers,
                    PaginatedUsers: reducerData?.reversedusers,
                    perPage: reducerData?.pageSize,
                    startUser: reducerData?.startUser,
                    endUser: reducerData?.endUser,
                    totalUsers: reducerData?.totalUsers,
                    totalPages: reducerData?.totalPages,
                    currentPage: reducerData?.currentPage,
                    searchResultUsers: reducerData?.searchResultUsers
                }
            } : null;

        case ActionTypes.SET_SEARCH:
            return action.payload.context === "ENROLLED_USERS" ? {
                ...state,
                EnrolledUsers: {
                    ...state.EnrolledUsers,
                    search: action.payload.data,
                    currentPage: 1
                }
            } : null;


        case ActionTypes.SET_PER_PAGE:
            return action.payload.context === "ENROLLED_USERS" ? {
                ...state,
                EnrolledUsers: {
                    ...state.EnrolledUsers,
                    perPage: action?.payload?.data,
                    currentPage: 1
                }
            } : null;


        case ActionTypes.SET_CUSTOM_PAGE:
            return action.payload.context === "ENROLLED_USERS" ? {
                ...state,
                EnrolledUsers: {
                    ...state.EnrolledUsers,
                    currentPage: action?.payload?.data
                }

            } : null;



        case ActionTypes.SET_FILTERS:
            return action.payload.context === "ENROLLED_USERS" ? {
                ...state,
                EnrolledUsers: {
                    ...state.EnrolledUsers,
                    filters: action.payload.data,
                    currentPage: 1,
                    perPage: 10,
                }
            } : null


        default:
            return state;
    }
}

export default UsersReducer;