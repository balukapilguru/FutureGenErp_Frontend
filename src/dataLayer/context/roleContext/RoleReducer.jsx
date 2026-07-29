const RoleReducer = (state, action) => {

  switch (action.type) {

    case "SET_PAGINATED_ROLES":
      const reducerData = action?.payload

      return {
        ...state,
        RolesData: {
          ...state.RolesData,
          paginatedRolesData: reducerData?.roles,
          searchResultRoles: reducerData?.searchResultStudents,
          startRole: reducerData?.startLead,
          endRole: reducerData?.endLead,
          totalRolesCount: reducerData?.totalRoles,
          totalPages: reducerData?.totalPages,
          AllRoles:reducerData?.roleNames
        }
      }

    case "CREATE_ROLE":

      return {
        roles: [...state?.roles, action?.payload]
      };

    case "DELETE_ROLE":
      let  id = action?.payload?.id;

     
      id = parseInt(id);
      return {
        ...state,
        RolesData:{
          ...state?.RolesData,
          paginatedRolesData: state?.RolesData?.paginatedRolesData.filter((role)=> role.id !== id)
        }
      }


    case "SET_LOADING":
      return {
        ...state,
        RolesData: {
          ...state.RolesData,
          loading: !state?.RolesData?.loading
        }
      }

    case "SET_SEARCH":
      if (action.payload.context === "SET_ROLES_DATA") {
        return {
          ...state,
          RolesData: {
            ...state.RolesData,
            search: action?.payload?.data,
            page: 1,
          }
        }
      }
      break;

    case "SET_PER_PAGE":
      if (action?.payload?.context === "SET_ROLES_DATA") {
        return {
          ...state,
          RolesData: {
            ...state.RolesData,
            pageSize: action?.payload?.data,
            page: 1
          }
        }
      }
      break;

    case "SET_CUSTOM_PAGE":
      if (action?.payload?.context === "SET_ROLES_DATA") {
        return {
          ...state,
          RolesData: {
            ...state.RolesData,
            page: action?.payload?.data,
          }
        }
      }
      break;

    default:
      return state;
  }
};

export default RoleReducer;