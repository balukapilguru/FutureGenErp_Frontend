
const AuthReducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.payload
            }
        case "SET_TOKEN":
            return {
                ...state,
                token: action.payload
            }
        case "SET_ROLE":
            return {
                ...state,
                role: action?.payload,
            }
        case "SET_LOCK":
            return{
                ...state,
                password: action.payload
            }
        case "SET_PASSWORD_LOCALSTORAGE":{
            return{
              ...state,
                password: action.payload
            }
        }
        default:
            return state
    }
}


export default AuthReducer;