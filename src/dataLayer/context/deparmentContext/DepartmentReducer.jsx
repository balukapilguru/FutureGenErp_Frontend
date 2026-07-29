const DepartmentReducer = (state, action) => {
    switch(action.type) {
        case "SET_DEPARTMENTS":
            return {
                ...state,
                departments: action?.payload
            };
        case "CREATE_DEPARTMENT":
            return {
                ...state,
                departments: [...state.departments, action?.payload]
            };

        case "DELETE_DEPARTMENT":
            let id =action?.payload?.id;
            id = parseInt(id);

            return{
                ...state,
                 departments: (state.departments || []).filter(department => department.id  !== id)
                }
            
        default:
            return state;
    }
}

export default DepartmentReducer;