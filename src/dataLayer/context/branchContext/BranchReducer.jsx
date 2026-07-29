
const BranchReducer = (state, action) => {
    switch (action.type) {
      case "SET_BRANCHES":
        return {
        ...state,
          branches:action?.payload
        };
      case "CREATE_BRANCH":
       
        return {
          branches: [...state.branches, action?.payload]
        };

      case "DELETE_BRANCH":

        let  id = action?.payload?.id;
        id = parseInt(id);
      return{
        ...state,
        branches: (state.branches || []).filter((branch)=> branch.id !== id)
      }
        


      default:
        return state;
    }
  };
export default BranchReducer;